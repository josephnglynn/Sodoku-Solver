<script lang="ts">
    import StockSudoku from "./StockSudoku.svelte";
    import {fly} from "svelte/transition"
    import {solvePartOfSudoku, bruteForce} from "./solveSudoku";
    import {Pages} from "./Pages";

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
        complete = bruteForce(state, n)
    }


</script>

<main style="display: flex; flex-direction: column; min-height: 100vh">

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

    {#if allInOneGo}
        <footer>
            {#if complete}
                <button transition:fly on:click={()=>changePage(Pages.Welcome)} class="is-primary button">Start Again
                </button>
            {/if}
        </footer>
    {:else }
        <footer>
            {#if complete}
                <button transition:fly on:click={()=>changePage(Pages.Welcome)} class="is-primary button">Start Again</button>
            {:else}
                <button transition:fly on:click={()=>console.log("not implemented")} class="is-primary button">Next Step</button>
            {/if}
        </footer>
    {/if}
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
        font-size: 4em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>