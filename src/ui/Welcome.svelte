<script lang="ts">
    import {Pages} from "../api/Pages"
    import {writable} from "svelte/store"
    import {onMount} from "svelte"

    export let changePage: (page: Pages) => void

    const savedTheme = localStorage.getItem("theme")
    const theme = writable(savedTheme)
    theme.subscribe(value => {
        localStorage.setItem("theme", value === "dark-mode" ? "dark-mode" : "")
    })

    let toggled: Boolean = false
    let buttonToggle: Boolean = false

    onMount(() => {
        if (savedTheme != null && savedTheme == "dark-mode") {
            toggleDarkTheme()
            buttonToggle = true //Needed So Animation Still Shows
        }
    })

    const toggleDarkTheme = () => {
        toggled = !toggled;
        if (toggled) {
            document.body.classList.add("dark-mode")
            theme.set("dark-mode")
        } else {
            document.body.classList.remove("dark-mode")
            theme.set("");
        }
    }


</script>

<main style="display: flex; flex-direction: column; min-height: 100vh; min-width: 100vw">


    <div style="padding-bottom: 20px">
        <h1>Welcome To Sudoku <br/> Solver</h1>
        <br>
        <p>
            A Simple Way To Solve Sudokus
        </p>
    </div>

    <div style="flex: 1"></div>

    <footer>
        <button on:click={()=>changePage(Pages.ChooseSize)} class="is-primary button">Continue</button>
        <div style="display: flex; justify-content: space-between">
            {#if buttonToggle}
                <label class="switch">
                    <label class="hidden-label" for="darkModeToggle">Dark Mode Toggle</label>
                    <input id="darkModeToggle" on:click={toggleDarkTheme} checked="checked" type="checkbox">
                    <span class="slider"></span>
                </label>
            {:else }
                <label class="switch">
                    <label class="hidden-label" for="darkModeToggle">Dark Mode Toggle</label>
                    <input id="darkModeToggle" on:click={toggleDarkTheme} type="checkbox">
                    <span class="slider"></span>
                </label>
            {/if}

            <p>Written By Joseph Glynn</p>
        </div>
    </footer>

</main>


<style>



    .switch {
        align-self: center;
        width: 60px;
        height: 30px;
        position: relative;
        display: inline-block;
    }

    .slider {
        border-radius: 34px;
    }

    .slider:before {
        border-radius: 34px;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
        border-radius: 20px;
    }

    .slider {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #aaaaaa;
        -webkit-transition: .4s;
        transition: .4s;
    }

    .slider:before {
        padding-top: 2px;
        position: absolute;
        content: "🌞";
        align-content: center;
        vertical-align: center;
        color: white;
        height: 26px;
        width: 26px;
        left: 4px;
        top: 2px;
        background-color: #008469;
        -webkit-transition: .4s;
        transition: .4s;
        text-align: center;
    }

    input:checked + .slider {
        background-color: #00ffd4;
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        background-color: #000000;
        content: '🌙';
        align-content: center;
        vertical-align: center;
        color: white;
        text-align: center;
        padding-top: 2px;
    }


    main {
        text-align: center;
        padding: 1em;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 3.5em;
        font-weight: 100;
    }


</style>
