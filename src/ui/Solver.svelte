<script lang="ts">
    import StockSudoku from "./StockSudoku.svelte";
    import {fly, blur} from "svelte/transition"
    import {solvePartOfSudoku} from "../api/solveSudoku";
    import {Pages} from "../api/Pages";
    import {onMount} from "svelte";

    export let state: Array<Array<number>> = [];
    export let allInOneGo: Boolean = true;
    export let changePage: (page: Pages) => void;
    export let showMessage: (message: String, onAccept: Function, onCancel: Function) => void;


    let complete: boolean = false

    for(let i = 0; i < state.length; i++) {
        for (let k = 0; k < state[i].length; k++) {
            if (state[i][k] == null) {
                state[i][k] = 0;
            }
        }
    }

    const setStateOfSudoku = (s: Array<Array<number>>) => {
        state = s;
        complete = true; //WE KNOW IT IS COMPLETE AS THIS FUNCTION IS ONLY CALLED WHEN THE BRUTE FORCE HAS ENDED
    }

    let n: number = Math.sqrt(state.length) //GET LENGTH

    onMount(async ()=>{
        if (allInOneGo) {
                [state, complete] = solvePartOfSudoku(state, n, setStateOfSudoku, null);
            while (!complete) {
                [state, complete] = solvePartOfSudoku(state, n, setStateOfSudoku, null);
            }
        } else {
            [state, complete] = solvePartOfSudoku(state, n, setStateOfSudoku, showMessage);
        }
    })


</script>

<main  style="display: flex; flex-direction: column; min-height: 100vh; min-width: 100vw">


    <div>
        {#if complete}
            <h1 transition:blur>Finished!</h1>
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
                <button transition:fly on:click={()=>[state, complete] = solvePartOfSudoku(state, n, setStateOfSudoku, showMessage)} class="is-primary button">Next Step</button>
            {/if}
    {/if}
        <div style="display: flex; justify-content: flex-end">
            <p>Written By Joseph Glynn</p>
        </div>
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

    @media (max-width: 480px) {
        button {
            width: 80vw
        }
    }
</style>