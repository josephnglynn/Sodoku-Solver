
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.32.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var Pages;
    (function (Pages) {
        Pages[Pages["Welcome"] = 0] = "Welcome";
        Pages[Pages["ChooseSize"] = 1] = "ChooseSize";
        Pages[Pages["SetSudoku"] = 2] = "SetSudoku";
        Pages[Pages["Solver"] = 3] = "Solver";
    })(Pages || (Pages = {}));

    /* src/ui/Welcome.svelte generated by Svelte v3.32.1 */
    const file = "src/ui/Welcome.svelte";

    function create_fragment(ctx) {
    	let main;
    	let div0;
    	let t0;
    	let div1;
    	let h1;
    	let t2;
    	let br;
    	let t3;
    	let p0;
    	let t5;
    	let div2;
    	let t6;
    	let footer;
    	let button;
    	let t8;
    	let p1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Welcome To Sudoku Solver";
    			t2 = space();
    			br = element("br");
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "A Simple Way To Solve Sudokus";
    			t5 = space();
    			div2 = element("div");
    			t6 = space();
    			footer = element("footer");
    			button = element("button");
    			button.textContent = "Continue";
    			t8 = space();
    			p1 = element("p");
    			p1.textContent = "Written By Joseph Glynn";
    			set_style(div0, "height", "10vh");
    			add_location(div0, file, 6, 4, 163);
    			attr_dev(h1, "class", "svelte-1mxhdm2");
    			add_location(h1, file, 9, 8, 215);
    			add_location(br, file, 10, 8, 257);
    			add_location(p0, file, 11, 8, 270);
    			add_location(div1, file, 8, 4, 201);
    			set_style(div2, "flex", "1");
    			add_location(div2, file, 16, 4, 345);
    			attr_dev(button, "class", "is-primary button svelte-1mxhdm2");
    			add_location(button, file, 19, 8, 395);
    			set_style(p1, "position", "absolute");
    			set_style(p1, "right", "0");
    			set_style(p1, "bottom", "1px");
    			add_location(p1, file, 20, 8, 501);
    			add_location(footer, file, 18, 4, 378);
    			set_style(main, "display", "flex");
    			set_style(main, "flex-direction", "column");
    			set_style(main, "min-height", "100vh");
    			attr_dev(main, "class", "svelte-1mxhdm2");
    			add_location(main, file, 4, 0, 86);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(main, t0);
    			append_dev(main, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t2);
    			append_dev(div1, br);
    			append_dev(div1, t3);
    			append_dev(div1, p0);
    			append_dev(main, t5);
    			append_dev(main, div2);
    			append_dev(main, t6);
    			append_dev(main, footer);
    			append_dev(footer, button);
    			append_dev(footer, t8);
    			append_dev(footer, p1);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Welcome", slots, []);
    	let { changePage } = $$props;
    	const writable_props = ["changePage"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Welcome> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => changePage(Pages.ChooseSize);

    	$$self.$$set = $$props => {
    		if ("changePage" in $$props) $$invalidate(0, changePage = $$props.changePage);
    	};

    	$$self.$capture_state = () => ({ Pages, changePage });

    	$$self.$inject_state = $$props => {
    		if ("changePage" in $$props) $$invalidate(0, changePage = $$props.changePage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [changePage, click_handler];
    }

    class Welcome extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { changePage: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Welcome",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*changePage*/ ctx[0] === undefined && !("changePage" in props)) {
    			console.warn("<Welcome> was created without expected prop 'changePage'");
    		}
    	}

    	get changePage() {
    		throw new Error("<Welcome>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set changePage(value) {
    		throw new Error("<Welcome>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const MakeSudoku = (n) => {
        const actualLength = n * n;
        //setup of arrays to hold values
        const sudoku = [];
        //setup of random numbers for first grid
        let options = [];
        //looping through providing values
        for (let i = 0; i < actualLength; i++) {
            let temp = [];
            for (let k = 0; k < actualLength; k++) {
                temp.push(0);
            }
            sudoku.push(temp);
            options.push(i + 1);
        }
        for (let i = 0; i < actualLength; i++) {
            const rando = Math.floor(Math.random() * (actualLength - 1)) + 1;
            [options[i], options[rando]] = [options[rando], options[i]];
        }
        sudoku[0] = options;
        for (let i = 1; i < actualLength; i++) {
            if (i % n == 0) {
                sudoku[i] = pushArrayToTheLeft(1, sudoku[i - 1]);
            }
            else {
                sudoku[i] = pushArrayToTheLeft(n, sudoku[i - 1]);
            }
        }
        return mixBlocksUp(sudoku, n);
    };
    const mixBlocksUp = (sudoku, n) => {
        const col = [];
        for (let i = 0; i < n; i++) {
            col.push([]);
        }
        for (let p = 0; p < sudoku.length; p++) {
            for (let i = 0; i < n; i++) {
                col[i].push(sudoku[p].slice(n * i, (n * i) + n));
            }
        }
        const temp = col[0];
        col[0] = col[1];
        col[1] = temp;
        return sudoku;
    };
    const pushArrayToTheLeft = (amount, array) => {
        const pushedArray = [];
        for (let i = amount; i < array.length; i++) {
            pushedArray.push(array[i]);
        }
        for (let i = 0; i < amount; i++) {
            pushedArray.push(array[i]);
        }
        return pushedArray;
    };

    /* src/ui/StockSudoku.svelte generated by Svelte v3.32.1 */
    const file$1 = "src/ui/StockSudoku.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (20:8) {:else}
    function create_else_block_1(ctx) {
    	let tr;
    	let t;
    	let each_value_2 = /*sub*/ ctx[2];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(tr, "class", "svelte-1cp22h7");
    			add_location(tr, file$1, 20, 12, 570);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*state, l*/ 3) {
    				each_value_2 = /*sub*/ ctx[2];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(20:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (9:8) {#if (x + 1) % l === 0}
    function create_if_block(ctx) {
    	let tr;
    	let t;
    	let each_value_1 = /*sub*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			set_style(tr, "border-bottom", "solid");
    			attr_dev(tr, "class", "svelte-1cp22h7");
    			add_location(tr, file$1, 9, 12, 221);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*state, l*/ 3) {
    				each_value_1 = /*sub*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(9:8) {#if (x + 1) % l === 0}",
    		ctx
    	});

    	return block;
    }

    // (25:20) {:else }
    function create_else_block_2(ctx) {
    	let td;
    	let t_value = /*s*/ ctx[5] + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "svelte-1cp22h7");
    			add_location(td, file$1, 25, 24, 772);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*state*/ 1 && t_value !== (t_value = /*s*/ ctx[5] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(25:20) {:else }",
    		ctx
    	});

    	return block;
    }

    // (23:20) {#if (i + 1) % l=== 0}
    function create_if_block_2(ctx) {
    	let td;
    	let t_value = /*s*/ ctx[5] + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			set_style(td, "border-right", "solid");
    			attr_dev(td, "class", "svelte-1cp22h7");
    			add_location(td, file$1, 23, 24, 678);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*state*/ 1 && t_value !== (t_value = /*s*/ ctx[5] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(23:20) {#if (i + 1) % l=== 0}",
    		ctx
    	});

    	return block;
    }

    // (22:16) {#each sub as s, i}
    function create_each_block_2(ctx) {
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if ((/*i*/ ctx[7] + 1) % /*l*/ ctx[1] === 0) return create_if_block_2;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(22:16) {#each sub as s, i}",
    		ctx
    	});

    	return block;
    }

    // (14:24) {:else }
    function create_else_block(ctx) {
    	let td;
    	let t_value = /*s*/ ctx[5] + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "svelte-1cp22h7");
    			add_location(td, file$1, 14, 24, 456);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*state*/ 1 && t_value !== (t_value = /*s*/ ctx[5] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(14:24) {:else }",
    		ctx
    	});

    	return block;
    }

    // (12:20) {#if (i + 1) % l=== 0}
    function create_if_block_1(ctx) {
    	let td;
    	let t_value = /*s*/ ctx[5] + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			set_style(td, "border-right", "solid");
    			attr_dev(td, "class", "svelte-1cp22h7");
    			add_location(td, file$1, 12, 24, 358);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*state*/ 1 && t_value !== (t_value = /*s*/ ctx[5] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(12:20) {#if (i + 1) % l=== 0}",
    		ctx
    	});

    	return block;
    }

    // (11:16) {#each sub as s, i}
    function create_each_block_1(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if ((/*i*/ ctx[7] + 1) % /*l*/ ctx[1] === 0) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(11:16) {#each sub as s, i}",
    		ctx
    	});

    	return block;
    }

    // (8:4) {#each state as sub, x}
    function create_each_block(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if ((/*x*/ ctx[4] + 1) % /*l*/ ctx[1] === 0) return create_if_block;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(8:4) {#each state as sub, x}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let table;
    	let each_value = /*state*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			table = element("table");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(table, "class", "svelte-1cp22h7");
    			add_location(table, file$1, 6, 0, 141);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*state, l*/ 3) {
    				each_value = /*state*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("StockSudoku", slots, []);
    	let { state = MakeSudoku(3) } = $$props;
    	let l = Math.sqrt(state.length);
    	const writable_props = ["state"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<StockSudoku> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("state" in $$props) $$invalidate(0, state = $$props.state);
    	};

    	$$self.$capture_state = () => ({ MakeSudoku, state, l });

    	$$self.$inject_state = $$props => {
    		if ("state" in $$props) $$invalidate(0, state = $$props.state);
    		if ("l" in $$props) $$invalidate(1, l = $$props.l);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [state, l];
    }

    class StockSudoku extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { state: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StockSudoku",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get state() {
    		throw new Error("<StockSudoku>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<StockSudoku>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    /* src/ui/ChooseSize.svelte generated by Svelte v3.32.1 */
    const file$2 = "src/ui/ChooseSize.svelte";

    // (31:8) {#if error}
    function create_if_block$1(ctx) {
    	let div;
    	let h6;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h6 = element("h6");
    			h6.textContent = "Error: Must Be Greater Than 1";
    			attr_dev(h6, "class", "is-danger");
    			set_style(h6, "color", "red");
    			add_location(h6, file$2, 32, 16, 843);
    			add_location(div, file$2, 31, 12, 804);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h6);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(31:8) {#if error}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let div0;
    	let t0;
    	let div1;
    	let h1;
    	let t2;
    	let div2;
    	let stocksudoku;
    	let t3;
    	let h6;
    	let t5;
    	let label;
    	let input;
    	let t6;
    	let t7;
    	let footer;
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	stocksudoku = new StockSudoku({ $$inline: true });
    	let if_block = /*error*/ ctx[1] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Please Enter Sudoku Size";
    			t2 = space();
    			div2 = element("div");
    			create_component(stocksudoku.$$.fragment);
    			t3 = space();
    			h6 = element("h6");
    			h6.textContent = "Example Of Size Of 3";
    			t5 = space();
    			label = element("label");
    			input = element("input");
    			t6 = space();
    			if (if_block) if_block.c();
    			t7 = space();
    			footer = element("footer");
    			button = element("button");
    			button.textContent = "Continue";
    			set_style(div0, "height", "10vh");
    			add_location(div0, file$2, 18, 4, 417);
    			attr_dev(h1, "class", "svelte-15qey8f");
    			add_location(h1, file$2, 21, 8, 469);
    			add_location(div1, file$2, 20, 4, 455);
    			add_location(h6, file$2, 26, 8, 657);
    			attr_dev(input, "type", "number");
    			add_location(input, file$2, 28, 12, 715);
    			add_location(label, file$2, 27, 8, 695);
    			set_style(div2, "flex", "1");
    			set_style(div2, "display", "flex");
    			set_style(div2, "justify-content", "center");
    			set_style(div2, "align-items", "center");
    			set_style(div2, "flex-direction", "column");
    			add_location(div2, file$2, 24, 4, 519);
    			attr_dev(button, "class", "is-primary button svelte-15qey8f");
    			add_location(button, file$2, 38, 8, 985);
    			add_location(footer, file$2, 37, 4, 968);
    			set_style(main, "display", "flex");
    			set_style(main, "flex-direction", "column");
    			set_style(main, "min-height", "100vh");
    			attr_dev(main, "class", "svelte-15qey8f");
    			add_location(main, file$2, 16, 0, 340);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(main, t0);
    			append_dev(main, div1);
    			append_dev(div1, h1);
    			append_dev(main, t2);
    			append_dev(main, div2);
    			mount_component(stocksudoku, div2, null);
    			append_dev(div2, t3);
    			append_dev(div2, h6);
    			append_dev(div2, t5);
    			append_dev(div2, label);
    			append_dev(label, input);
    			set_input_value(input, /*size*/ ctx[0]);
    			append_dev(div2, t6);
    			if (if_block) if_block.m(div2, null);
    			append_dev(main, t7);
    			append_dev(main, footer);
    			append_dev(footer, button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[4]),
    					listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 1 && to_number(input.value) !== /*size*/ ctx[0]) {
    				set_input_value(input, /*size*/ ctx[0]);
    			}

    			if (/*error*/ ctx[1]) {
    				if (if_block) {
    					if (dirty & /*error*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div2, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stocksudoku.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stocksudoku.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(stocksudoku);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ChooseSize", slots, []);
    	let { changePage } = $$props;
    	let size;
    	let error = false;

    	const verify = () => {
    		if (size > 1) {
    			changePage(Pages.SetSudoku, size);
    		} else {
    			$$invalidate(1, error = true);
    		}
    	};

    	const writable_props = ["changePage"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ChooseSize> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		size = to_number(this.value);
    		$$invalidate(0, size);
    	}

    	const click_handler = () => verify();

    	$$self.$$set = $$props => {
    		if ("changePage" in $$props) $$invalidate(3, changePage = $$props.changePage);
    	};

    	$$self.$capture_state = () => ({
    		Pages,
    		StockSudoku,
    		slide,
    		changePage,
    		size,
    		error,
    		verify
    	});

    	$$self.$inject_state = $$props => {
    		if ("changePage" in $$props) $$invalidate(3, changePage = $$props.changePage);
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("error" in $$props) $$invalidate(1, error = $$props.error);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, error, verify, changePage, input_input_handler, click_handler];
    }

    class ChooseSize extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { changePage: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChooseSize",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*changePage*/ ctx[3] === undefined && !("changePage" in props)) {
    			console.warn("<ChooseSize> was created without expected prop 'changePage'");
    		}
    	}

    	get changePage() {
    		throw new Error("<ChooseSize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set changePage(value) {
    		throw new Error("<ChooseSize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ui/Sudoku.svelte generated by Svelte v3.32.1 */

    const file$3 = "src/ui/Sudoku.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[7] = list;
    	child_ctx[8] = i;
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[12] = list;
    	child_ctx[11] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[10] = list;
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (24:8) {:else}
    function create_else_block_1$1(ctx) {
    	let tr;
    	let t;
    	let each_value_2 = /*sub*/ ctx[6];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(tr, "class", "svelte-gxxt7z");
    			add_location(tr, file$3, 24, 12, 781);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*state, length*/ 3) {
    				each_value_2 = /*sub*/ ctx[6];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(24:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (14:8) {#if (x + 1) % length === 0}
    function create_if_block$2(ctx) {
    	let tr;
    	let t;
    	let each_value_1 = /*sub*/ ctx[6];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			set_style(tr, "border-bottom", "solid");
    			attr_dev(tr, "class", "svelte-gxxt7z");
    			add_location(tr, file$3, 14, 12, 310);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*state, length*/ 3) {
    				each_value_1 = /*sub*/ ctx[6];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(14:8) {#if (x + 1) % length === 0}",
    		ctx
    	});

    	return block;
    }

    // (29:20) {:else}
    function create_else_block_2$1(ctx) {
    	let td;
    	let input;
    	let mounted;
    	let dispose;

    	function input_input_handler_3() {
    		/*input_input_handler_3*/ ctx[5].call(input, /*x*/ ctx[8], /*i*/ ctx[11]);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			input = element("input");
    			attr_dev(input, "type", "number");
    			set_style(input, "width", "35px");
    			attr_dev(input, "class", "svelte-gxxt7z");
    			add_location(input, file$3, 29, 28, 1055);
    			attr_dev(td, "class", "svelte-gxxt7z");
    			add_location(td, file$3, 29, 24, 1051);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, input);
    			set_input_value(input, /*state*/ ctx[0][/*x*/ ctx[8]][/*i*/ ctx[11]]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", input_input_handler_3);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*state*/ 1 && to_number(input.value) !== /*state*/ ctx[0][/*x*/ ctx[8]][/*i*/ ctx[11]]) {
    				set_input_value(input, /*state*/ ctx[0][/*x*/ ctx[8]][/*i*/ ctx[11]]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2$1.name,
    		type: "else",
    		source: "(29:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (27:20) {#if (i + 1) % length === 0}
    function create_if_block_2$1(ctx) {
    	let td;
    	let input;
    	let mounted;
    	let dispose;

    	function input_input_handler_2() {
    		/*input_input_handler_2*/ ctx[4].call(input, /*x*/ ctx[8], /*i*/ ctx[11]);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			input = element("input");
    			attr_dev(input, "type", "number");
    			set_style(input, "width", "35px");
    			attr_dev(input, "class", "svelte-gxxt7z");
    			add_location(input, file$3, 27, 56, 927);
    			set_style(td, "border-right", "solid");
    			attr_dev(td, "class", "svelte-gxxt7z");
    			add_location(td, file$3, 27, 24, 895);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, input);
    			set_input_value(input, /*state*/ ctx[0][/*x*/ ctx[8]][/*i*/ ctx[11]]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", input_input_handler_2);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*state*/ 1 && to_number(input.value) !== /*state*/ ctx[0][/*x*/ ctx[8]][/*i*/ ctx[11]]) {
    				set_input_value(input, /*state*/ ctx[0][/*x*/ ctx[8]][/*i*/ ctx[11]]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(27:20) {#if (i + 1) % length === 0}",
    		ctx
    	});

    	return block;
    }

    // (26:16) {#each sub as s, i}
    function create_each_block_2$1(ctx) {
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if ((/*i*/ ctx[11] + 1) % /*length*/ ctx[1] === 0) return create_if_block_2$1;
    		return create_else_block_2$1;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(26:16) {#each sub as s, i}",
    		ctx
    	});

    	return block;
    }

    // (19:20) {:else}
    function create_else_block$1(ctx) {
    	let td;
    	let input;
    	let mounted;
    	let dispose;

    	function input_input_handler_1() {
    		/*input_input_handler_1*/ ctx[3].call(input, /*x*/ ctx[8], /*i*/ ctx[11]);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			input = element("input");
    			attr_dev(input, "type", "number");
    			set_style(input, "width", "35px");
    			attr_dev(input, "class", "svelte-gxxt7z");
    			add_location(input, file$3, 19, 28, 613);
    			attr_dev(td, "class", "svelte-gxxt7z");
    			add_location(td, file$3, 19, 24, 609);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, input);
    			set_input_value(input, /*state*/ ctx[0][/*x*/ ctx[8]][/*i*/ ctx[11]]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", input_input_handler_1);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*state*/ 1 && to_number(input.value) !== /*state*/ ctx[0][/*x*/ ctx[8]][/*i*/ ctx[11]]) {
    				set_input_value(input, /*state*/ ctx[0][/*x*/ ctx[8]][/*i*/ ctx[11]]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(19:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (17:20) {#if (i + 1) % length === 0}
    function create_if_block_1$1(ctx) {
    	let td;
    	let input;
    	let mounted;
    	let dispose;

    	function input_input_handler() {
    		/*input_input_handler*/ ctx[2].call(input, /*x*/ ctx[8], /*i*/ ctx[11]);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			input = element("input");
    			attr_dev(input, "type", "number");
    			set_style(input, "width", "35px");
    			attr_dev(input, "class", "svelte-gxxt7z");
    			add_location(input, file$3, 17, 56, 485);
    			set_style(td, "border-right", "solid");
    			attr_dev(td, "class", "svelte-gxxt7z");
    			add_location(td, file$3, 17, 24, 453);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, input);
    			set_input_value(input, /*state*/ ctx[0][/*x*/ ctx[8]][/*i*/ ctx[11]]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", input_input_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*state*/ 1 && to_number(input.value) !== /*state*/ ctx[0][/*x*/ ctx[8]][/*i*/ ctx[11]]) {
    				set_input_value(input, /*state*/ ctx[0][/*x*/ ctx[8]][/*i*/ ctx[11]]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(17:20) {#if (i + 1) % length === 0}",
    		ctx
    	});

    	return block;
    }

    // (16:16) {#each sub as s, i}
    function create_each_block_1$1(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if ((/*i*/ ctx[11] + 1) % /*length*/ ctx[1] === 0) return create_if_block_1$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(16:16) {#each sub as s, i}",
    		ctx
    	});

    	return block;
    }

    // (13:4) {#each state as sub, x}
    function create_each_block$1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if ((/*x*/ ctx[8] + 1) % /*length*/ ctx[1] === 0) return create_if_block$2;
    		return create_else_block_1$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(13:4) {#each state as sub, x}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let table;
    	let each_value = /*state*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			table = element("table");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(table, "class", "svelte-gxxt7z");
    			add_location(table, file$3, 11, 0, 225);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*state, length*/ 3) {
    				each_value = /*state*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Sudoku", slots, []);
    	let { length = 3 } = $$props;
    	let { state = [] } = $$props;

    	for (let i = 0; i < length * length; i++) {
    		state.push([]);

    		for (let k = 0; k < length * length; k++) {
    			state[i].push(null);
    		}
    	}

    	const writable_props = ["length", "state"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Sudoku> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler(x, i) {
    		state[x][i] = to_number(this.value);
    		$$invalidate(0, state);
    	}

    	function input_input_handler_1(x, i) {
    		state[x][i] = to_number(this.value);
    		$$invalidate(0, state);
    	}

    	function input_input_handler_2(x, i) {
    		state[x][i] = to_number(this.value);
    		$$invalidate(0, state);
    	}

    	function input_input_handler_3(x, i) {
    		state[x][i] = to_number(this.value);
    		$$invalidate(0, state);
    	}

    	$$self.$$set = $$props => {
    		if ("length" in $$props) $$invalidate(1, length = $$props.length);
    		if ("state" in $$props) $$invalidate(0, state = $$props.state);
    	};

    	$$self.$capture_state = () => ({ length, state });

    	$$self.$inject_state = $$props => {
    		if ("length" in $$props) $$invalidate(1, length = $$props.length);
    		if ("state" in $$props) $$invalidate(0, state = $$props.state);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		state,
    		length,
    		input_input_handler,
    		input_input_handler_1,
    		input_input_handler_2,
    		input_input_handler_3
    	];
    }

    class Sudoku extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { length: 1, state: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sudoku",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get length() {
    		throw new Error("<Sudoku>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set length(value) {
    		throw new Error("<Sudoku>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Sudoku>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Sudoku>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ui/InputSudoku.svelte generated by Svelte v3.32.1 */
    const file$4 = "src/ui/InputSudoku.svelte";

    function create_fragment$4(ctx) {
    	let main;
    	let div0;
    	let t0;
    	let div1;
    	let h1;
    	let t2;
    	let div2;
    	let sudoku;
    	let updating_state;
    	let t3;
    	let footer;
    	let button0;
    	let t5;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;

    	function sudoku_state_binding(value) {
    		/*sudoku_state_binding*/ ctx[4].call(null, value);
    	}

    	let sudoku_props = { length: /*length*/ ctx[0] };

    	if (/*state*/ ctx[1] !== void 0) {
    		sudoku_props.state = /*state*/ ctx[1];
    	}

    	sudoku = new Sudoku({ props: sudoku_props, $$inline: true });
    	binding_callbacks.push(() => bind(sudoku, "state", sudoku_state_binding));

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Please Enter Known Sudoku Numbers";
    			t2 = space();
    			div2 = element("div");
    			create_component(sudoku.$$.fragment);
    			t3 = space();
    			footer = element("footer");
    			button0 = element("button");
    			button0.textContent = "Calculate Step By Step";
    			t5 = space();
    			button1 = element("button");
    			button1.textContent = "Calculate All In One Go";
    			set_style(div0, "height", "10vh");
    			add_location(div0, file$4, 12, 4, 323);
    			attr_dev(h1, "class", "svelte-15qey8f");
    			add_location(h1, file$4, 15, 8, 375);
    			add_location(div1, file$4, 14, 4, 361);
    			set_style(div2, "flex", "1");
    			set_style(div2, "display", "flex");
    			set_style(div2, "justify-content", "center");
    			set_style(div2, "align-items", "center");
    			set_style(div2, "flex-direction", "column");
    			add_location(div2, file$4, 18, 4, 434);
    			attr_dev(button0, "class", "is-primary button svelte-15qey8f");
    			set_style(button0, "margin-right", "20px");
    			add_location(button0, file$4, 23, 8, 629);
    			attr_dev(button1, "class", "is-primary button svelte-15qey8f");
    			set_style(button1, "margin-left", "20px");
    			add_location(button1, file$4, 24, 8, 811);
    			add_location(footer, file$4, 22, 4, 612);
    			set_style(main, "display", "flex");
    			set_style(main, "flex-direction", "column");
    			set_style(main, "min-height", "100vh");
    			attr_dev(main, "class", "svelte-15qey8f");
    			add_location(main, file$4, 10, 0, 246);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(main, t0);
    			append_dev(main, div1);
    			append_dev(div1, h1);
    			append_dev(main, t2);
    			append_dev(main, div2);
    			mount_component(sudoku, div2, null);
    			append_dev(main, t3);
    			append_dev(main, footer);
    			append_dev(footer, button0);
    			append_dev(footer, t5);
    			append_dev(footer, button1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[5], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const sudoku_changes = {};
    			if (dirty & /*length*/ 1) sudoku_changes.length = /*length*/ ctx[0];

    			if (!updating_state && dirty & /*state*/ 2) {
    				updating_state = true;
    				sudoku_changes.state = /*state*/ ctx[1];
    				add_flush_callback(() => updating_state = false);
    			}

    			sudoku.$set(sudoku_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sudoku.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sudoku.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(sudoku);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("InputSudoku", slots, []);
    	let { length = 3 } = $$props;
    	let state = [];
    	let { changePage } = $$props;

    	let onContinue = allInOne => {
    		changePage(Pages.Solver, state, allInOne);
    	};

    	const writable_props = ["length", "changePage"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<InputSudoku> was created with unknown prop '${key}'`);
    	});

    	function sudoku_state_binding(value) {
    		state = value;
    		$$invalidate(1, state);
    	}

    	const click_handler = () => alert("Sorry Not Implemented Yet\nPlease Try: \"All In One Go\"");
    	const click_handler_1 = () => onContinue(true);

    	$$self.$$set = $$props => {
    		if ("length" in $$props) $$invalidate(0, length = $$props.length);
    		if ("changePage" in $$props) $$invalidate(3, changePage = $$props.changePage);
    	};

    	$$self.$capture_state = () => ({
    		Pages,
    		Sudoku,
    		length,
    		state,
    		changePage,
    		onContinue
    	});

    	$$self.$inject_state = $$props => {
    		if ("length" in $$props) $$invalidate(0, length = $$props.length);
    		if ("state" in $$props) $$invalidate(1, state = $$props.state);
    		if ("changePage" in $$props) $$invalidate(3, changePage = $$props.changePage);
    		if ("onContinue" in $$props) $$invalidate(2, onContinue = $$props.onContinue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		length,
    		state,
    		onContinue,
    		changePage,
    		sudoku_state_binding,
    		click_handler,
    		click_handler_1
    	];
    }

    class InputSudoku extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { length: 0, changePage: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputSudoku",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*changePage*/ ctx[3] === undefined && !("changePage" in props)) {
    			console.warn("<InputSudoku> was created without expected prop 'changePage'");
    		}
    	}

    	get length() {
    		throw new Error("<InputSudoku>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set length(value) {
    		throw new Error("<InputSudoku>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get changePage() {
    		throw new Error("<InputSudoku>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set changePage(value) {
    		throw new Error("<InputSudoku>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function isValid(state, row, col, k, n) {
        for (let i = 0; i < n * n; i++) {
            const q = n * Math.floor(row / n) + Math.floor(i / n);
            const p = n * Math.floor(col / n) + i % n;
            if (state[row][i] == k || state[i][col] == k || state[q][p] == k) {
                return false;
            }
        }
        return true;
    }
    const bruteForce = (state, n) => {
        for (let i = 0; i < n * n; i++) {
            for (let j = 0; j < n * n; j++) {
                if (state[i][j] == 0) {
                    for (let k = 1; k <= n * n; k++) {
                        if (isValid(state, i, j, k, n)) {
                            state[i][j] = k;
                            if (bruteForce(state, n)) {
                                return true;
                            }
                            else {
                                state[i][j] = 0;
                            }
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    };
    const checkSudoku = (state, n) => {
        for (let row = 0; row < state.length; row++) {
            for (let col = 0; col < state.length; col++) {
                if (state[row][col] == 0) {
                    return false;
                }
            }
        }
        return true;
    };
    const solvePartOfSudoku = (state, n) => {
        return [state, checkSudoku(state)];
    };

    /* src/ui/Solver.svelte generated by Svelte v3.32.1 */

    const { console: console_1 } = globals;
    const file$5 = "src/ui/Solver.svelte";

    // (56:8) {:else }
    function create_else_block_2$2(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = `${"Calculating . . ."}`;
    			attr_dev(h1, "class", "svelte-1688j5u");
    			add_location(h1, file$5, 56, 12, 1503);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2$2.name,
    		type: "else",
    		source: "(56:8) {:else }",
    		ctx
    	});

    	return block;
    }

    // (54:8) {#if complete}
    function create_if_block_3(ctx) {
    	let h1;
    	let h1_transition;
    	let current;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Finished!";
    			attr_dev(h1, "class", "svelte-1688j5u");
    			add_location(h1, file$5, 54, 12, 1440);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!h1_transition) h1_transition = create_bidirectional_transition(h1, fly, {}, true);
    				h1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!h1_transition) h1_transition = create_bidirectional_transition(h1, fly, {}, false);
    			h1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching && h1_transition) h1_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(54:8) {#if complete}",
    		ctx
    	});

    	return block;
    }

    // (72:4) {:else }
    function create_else_block$2(ctx) {
    	let footer;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block_2$2, create_else_block_1$2];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*complete*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			if_block.c();
    			add_location(footer, file$5, 72, 8, 1986);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			if_blocks[current_block_type_index].m(footer, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(footer, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(72:4) {:else }",
    		ctx
    	});

    	return block;
    }

    // (65:4) {#if allInOneGo}
    function create_if_block$3(ctx) {
    	let footer;
    	let current;
    	let if_block = /*complete*/ ctx[3] && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			if (if_block) if_block.c();
    			add_location(footer, file$5, 65, 8, 1749);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			if (if_block) if_block.m(footer, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*complete*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*complete*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(footer, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(65:4) {#if allInOneGo}",
    		ctx
    	});

    	return block;
    }

    // (76:12) {:else}
    function create_else_block_1$2(ctx) {
    	let button;
    	let button_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Next Step";
    			attr_dev(button, "class", "is-primary button svelte-1688j5u");
    			add_location(button, file$5, 76, 16, 2185);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!button_transition) button_transition = create_bidirectional_transition(button, fly, {}, true);
    				button_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!button_transition) button_transition = create_bidirectional_transition(button, fly, {}, false);
    			button_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching && button_transition) button_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$2.name,
    		type: "else",
    		source: "(76:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (74:12) {#if complete}
    function create_if_block_2$2(ctx) {
    	let button;
    	let button_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Start Again";
    			attr_dev(button, "class", "is-primary button svelte-1688j5u");
    			add_location(button, file$5, 74, 16, 2038);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!button_transition) button_transition = create_bidirectional_transition(button, fly, {}, true);
    				button_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!button_transition) button_transition = create_bidirectional_transition(button, fly, {}, false);
    			button_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching && button_transition) button_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(74:12) {#if complete}",
    		ctx
    	});

    	return block;
    }

    // (67:12) {#if complete}
    function create_if_block_1$2(ctx) {
    	let button;
    	let button_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Start Again";
    			attr_dev(button, "class", "is-primary button svelte-1688j5u");
    			add_location(button, file$5, 67, 16, 1801);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!button_transition) button_transition = create_bidirectional_transition(button, fly, {}, true);
    				button_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!button_transition) button_transition = create_bidirectional_transition(button, fly, {}, false);
    			button_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching && button_transition) button_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(67:12) {#if complete}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let main;
    	let div0;
    	let t0;
    	let div1;
    	let current_block_type_index;
    	let if_block0;
    	let t1;
    	let div2;
    	let stocksudoku;
    	let t2;
    	let current_block_type_index_1;
    	let if_block1;
    	let current;
    	const if_block_creators = [create_if_block_3, create_else_block_2$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*complete*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	stocksudoku = new StockSudoku({
    			props: { state: /*state*/ ctx[0] },
    			$$inline: true
    		});

    	const if_block_creators_1 = [create_if_block$3, create_else_block$2];
    	const if_blocks_1 = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*allInOneGo*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index_1 = select_block_type_1(ctx);
    	if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			if_block0.c();
    			t1 = space();
    			div2 = element("div");
    			create_component(stocksudoku.$$.fragment);
    			t2 = space();
    			if_block1.c();
    			set_style(div0, "height", "10vh");
    			add_location(div0, file$5, 50, 4, 1361);
    			add_location(div1, file$5, 52, 4, 1399);
    			set_style(div2, "flex", "1");
    			set_style(div2, "display", "flex");
    			set_style(div2, "justify-content", "center");
    			set_style(div2, "align-items", "center");
    			set_style(div2, "flex-direction", "column");
    			add_location(div2, file$5, 60, 4, 1564);
    			set_style(main, "display", "flex");
    			set_style(main, "flex-direction", "column");
    			set_style(main, "min-height", "100vh");
    			attr_dev(main, "class", "svelte-1688j5u");
    			add_location(main, file$5, 48, 0, 1284);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(main, t0);
    			append_dev(main, div1);
    			if_blocks[current_block_type_index].m(div1, null);
    			append_dev(main, t1);
    			append_dev(main, div2);
    			mount_component(stocksudoku, div2, null);
    			append_dev(main, t2);
    			if_blocks_1[current_block_type_index_1].m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div1, null);
    			}

    			const stocksudoku_changes = {};
    			if (dirty & /*state*/ 1) stocksudoku_changes.state = /*state*/ ctx[0];
    			stocksudoku.$set(stocksudoku_changes);
    			let previous_block_index_1 = current_block_type_index_1;
    			current_block_type_index_1 = select_block_type_1(ctx);

    			if (current_block_type_index_1 === previous_block_index_1) {
    				if_blocks_1[current_block_type_index_1].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
    					if_blocks_1[previous_block_index_1] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks_1[current_block_type_index_1];

    				if (!if_block1) {
    					if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(stocksudoku.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(stocksudoku.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    			destroy_component(stocksudoku);
    			if_blocks_1[current_block_type_index_1].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Solver", slots, []);
    	let { state = [] } = $$props;
    	let { allInOneGo = true } = $$props;
    	let { changePage } = $$props;
    	let complete = false;

    	for (let i = 0; i < state.length; i++) {
    		for (let k = 0; k < state[i].length; k++) {
    			if (state[i][k] == null) {
    				state[i][k] = 0;
    			}
    		}
    	}

    	let n = Math.sqrt(state.length);

    	/*let dots: number = 0;
    let Calculating: string = "Calculating";

    let startTime: number;
    const updateBoard = (t) => {
        if (startTime === undefined) {
            startTime = t;
        }
        [state, complete] = solvePartOfSudoku(state, n);
        const frameTime = (t - startTime) / 400;
        if (dots < 1) {
            Calculating = "Calculating .    ";
            dots += frameTime;
        } else if (dots < 2) {
            Calculating = "Calculating . .  ";
            dots += frameTime;
        } else if (dots < 3) {
            Calculating = "Calculating . . .";
            dots += frameTime;
        } else {
            dots = 0;
        }
        startTime = t;
        if (allInOneGo && !complete) {
            requestAnimationFrame(updateBoard);
        }
    }*/
    	if (allInOneGo) {
    		complete = bruteForce(state, n);
    	}

    	const writable_props = ["state", "allInOneGo", "changePage"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Solver> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => changePage(Pages.Welcome);
    	const click_handler_1 = () => changePage(Pages.Welcome);
    	const click_handler_2 = () => console.log("not implemented");

    	$$self.$$set = $$props => {
    		if ("state" in $$props) $$invalidate(0, state = $$props.state);
    		if ("allInOneGo" in $$props) $$invalidate(1, allInOneGo = $$props.allInOneGo);
    		if ("changePage" in $$props) $$invalidate(2, changePage = $$props.changePage);
    	};

    	$$self.$capture_state = () => ({
    		StockSudoku,
    		fly,
    		solvePartOfSudoku,
    		bruteForce,
    		Pages,
    		state,
    		allInOneGo,
    		changePage,
    		complete,
    		n
    	});

    	$$self.$inject_state = $$props => {
    		if ("state" in $$props) $$invalidate(0, state = $$props.state);
    		if ("allInOneGo" in $$props) $$invalidate(1, allInOneGo = $$props.allInOneGo);
    		if ("changePage" in $$props) $$invalidate(2, changePage = $$props.changePage);
    		if ("complete" in $$props) $$invalidate(3, complete = $$props.complete);
    		if ("n" in $$props) n = $$props.n;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		state,
    		allInOneGo,
    		changePage,
    		complete,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Solver extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { state: 0, allInOneGo: 1, changePage: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Solver",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*changePage*/ ctx[2] === undefined && !("changePage" in props)) {
    			console_1.warn("<Solver> was created without expected prop 'changePage'");
    		}
    	}

    	get state() {
    		throw new Error("<Solver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Solver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get allInOneGo() {
    		throw new Error("<Solver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set allInOneGo(value) {
    		throw new Error("<Solver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get changePage() {
    		throw new Error("<Solver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set changePage(value) {
    		throw new Error("<Solver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ui/App.svelte generated by Svelte v3.32.1 */
    const file$6 = "src/ui/App.svelte";

    // (42:41) 
    function create_if_block_3$1(ctx) {
    	let div;
    	let solver;
    	let div_transition;
    	let current;

    	solver = new Solver({
    			props: {
    				allInOneGo: /*allAtOnce*/ ctx[2],
    				changePage: /*changePage*/ ctx[4],
    				state: /*state*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(solver.$$.fragment);
    			add_location(div, file$6, 42, 2, 1041);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(solver, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const solver_changes = {};
    			if (dirty & /*allAtOnce*/ 4) solver_changes.allInOneGo = /*allAtOnce*/ ctx[2];
    			if (dirty & /*state*/ 2) solver_changes.state = /*state*/ ctx[1];
    			solver.$set(solver_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(solver.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(solver.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(solver);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(42:41) ",
    		ctx
    	});

    	return block;
    }

    // (38:43) 
    function create_if_block_2$3(ctx) {
    	let div;
    	let inputsudoku;
    	let div_transition;
    	let current;

    	inputsudoku = new InputSudoku({
    			props: {
    				length: /*l*/ ctx[0],
    				changePage: /*setToSolve*/ ctx[6]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(inputsudoku.$$.fragment);
    			add_location(div, file$6, 38, 2, 912);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(inputsudoku, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const inputsudoku_changes = {};
    			if (dirty & /*l*/ 1) inputsudoku_changes.length = /*l*/ ctx[0];
    			inputsudoku.$set(inputsudoku_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputsudoku.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputsudoku.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(inputsudoku);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(38:43) ",
    		ctx
    	});

    	return block;
    }

    // (34:44) 
    function create_if_block_1$3(ctx) {
    	let div;
    	let choosesize;
    	let div_transition;
    	let current;

    	choosesize = new ChooseSize({
    			props: { changePage: /*setToInputSudoku*/ ctx[5] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(choosesize.$$.fragment);
    			add_location(div, file$6, 34, 2, 787);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(choosesize, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(choosesize.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(choosesize.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(choosesize);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(34:44) ",
    		ctx
    	});

    	return block;
    }

    // (29:1) {#if currentPage === Pages.Welcome}
    function create_if_block$4(ctx) {
    	let div;
    	let welcome;
    	let div_transition;
    	let current;

    	welcome = new Welcome({
    			props: { changePage: /*changePage*/ ctx[4] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(welcome.$$.fragment);
    			add_location(div, file$6, 29, 2, 669);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(welcome, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(welcome.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(welcome.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(welcome);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(29:1) {#if currentPage === Pages.Welcome}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$4, create_if_block_1$3, create_if_block_2$3, create_if_block_3$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*currentPage*/ ctx[3] === Pages.Welcome) return 0;
    		if (/*currentPage*/ ctx[3] === Pages.ChooseSize) return 1;
    		if (/*currentPage*/ ctx[3] === Pages.SetSudoku) return 2;
    		if (/*currentPage*/ ctx[3] === Pages.Solver) return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			add_location(div, file$6, 27, 0, 624);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let l = 3;
    	let state = [];
    	let allAtOnce = false;
    	let currentPage = Pages.Welcome;

    	let changePage = page => {
    		$$invalidate(3, currentPage = page);
    	};

    	let setToInputSudoku = (page, length) => {
    		$$invalidate(0, l = length);
    		$$invalidate(3, currentPage = page);
    	};

    	let setToSolve = (page, State, allInOne) => {
    		$$invalidate(1, state = State);
    		$$invalidate(2, allAtOnce = allInOne);
    		$$invalidate(3, currentPage = page);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Welcome,
    		Pages,
    		ChooseSize,
    		slide,
    		InputSudoku,
    		Solver,
    		l,
    		state,
    		allAtOnce,
    		currentPage,
    		changePage,
    		setToInputSudoku,
    		setToSolve
    	});

    	$$self.$inject_state = $$props => {
    		if ("l" in $$props) $$invalidate(0, l = $$props.l);
    		if ("state" in $$props) $$invalidate(1, state = $$props.state);
    		if ("allAtOnce" in $$props) $$invalidate(2, allAtOnce = $$props.allAtOnce);
    		if ("currentPage" in $$props) $$invalidate(3, currentPage = $$props.currentPage);
    		if ("changePage" in $$props) $$invalidate(4, changePage = $$props.changePage);
    		if ("setToInputSudoku" in $$props) $$invalidate(5, setToInputSudoku = $$props.setToInputSudoku);
    		if ("setToSolve" in $$props) $$invalidate(6, setToSolve = $$props.setToSolve);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [l, state, allAtOnce, currentPage, changePage, setToInputSudoku, setToSolve];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
