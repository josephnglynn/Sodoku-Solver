<script lang="ts">
    import {Pages} from "../api/Pages";
    import Sudoku from "./Sudoku.svelte";
    export let length: number = 3;
    let state: Array<Array<number>> = [];
    export let changePage: (page: Pages, State: Array<Array<number>>, allInOne: boolean) => void;
    let onContinue = (allInOne: boolean) => {
        changePage(Pages.Solver, state, allInOne);
    }

</script>

<main style="display: flex; flex-direction: column; min-height: 100vh">

    <div style="height: 10vh"></div>

    <div>
        <h1>Please Enter Known Sudoku Numbers</h1>
    </div>

    <div style="flex: 1; display: flex; justify-content: center; align-items: center; flex-direction: column">
        <Sudoku length={length} bind:state={state}  />
    </div>

    <footer>
        <button on:click={()=>onContinue(false)} class="is-primary button" style="margin-right: 20px">Calculate Step By Step</button>
        <button on:click={()=>onContinue(true)} class="is-primary button" style="margin-left: 20px">Calculate All In One Go</button>
        <p style="position: absolute; right: 5px; bottom: 1px;">Written By Joseph Glynn</p>
    </footer>

</main>


<style>
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
