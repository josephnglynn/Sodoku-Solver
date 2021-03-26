<script lang="ts">
    import StockSudoku from "./StockSudoku.svelte";
    import {fly} from "svelte/transition"
    import {solvePartOfSudoku} from "../api/solveSudoku";
    import {Pages} from "../api/Pages";
    import {onMount} from "svelte";

    export let state: Array<Array<number>> = [];
    export let allInOneGo: Boolean = true;
    export let changePage: (page: Pages) => void;

    let complete: boolean = false

    for(let i = 0; i < state.length; i++) {
        for (let k = 0; k < state[i].length; k++) {
            if (state[i][k] == null) {
                state[i][k] = 0;
            }
        }
    }

    let n: number = Math.sqrt(state.length)

    onMount(async ()=>{
        await setTimeout(()=>{}, 1000);
        if (allInOneGo) {
            [state, complete] = solvePartOfSudoku(state, n);
            while (!complete) {
                [state, complete] = solvePartOfSudoku(state, n);
            }
        } else {
            [state, complete] = solvePartOfSudoku(state, n);
        }
    })


</script>

<main  style="display: flex; flex-direction: column; min-height: 100vh">


    <div style="height: 10vh"></div>

    <div>
        {#if complete}
            <h1 transition:fly>Finished!</h1>
        {:else }
            <h1>{"Calculating . . ."}</h1>
        {/if}
    </div>

    <div style="flex: 1; display: flex; justify-content: center; align-items: center; flex-direction: column">
        <StockSudoku state={state}/>
    </div>
    <footer>
    {#if allInOneGo}
            {#if complete}
                <button transition:fly on:click={()=>changePage(Pages.Welcome)} class="is-primary button">Start Again
                </button>
            {/if}

    {:else }
            {#if complete}
                <button transition:fly on:click={()=>changePage(Pages.Welcome)} class="is-primary button">Start Again</button>
            {:else}
                <button transition:fly on:click={()=>[state, complete] = solvePartOfSudoku(state, n)} class="is-primary button">Next Step</button>
            {/if}
    {/if}
        <p style="position: absolute; right: 5px; bottom: 1px;">Written By Joseph Glynn</p>
    </footer>
</main>


<style>
    h1 {
        white-space: pre;
    }

    button {
        margin-bottom: 1em;
    }

    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 3em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>