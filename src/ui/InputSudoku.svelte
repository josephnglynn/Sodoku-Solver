<script lang="ts">
    import {Pages} from "../api/Pages";
    import Sudoku from "./Sudoku.svelte";

    export let length: number = 3;
    export let changePage: (page: Pages, State: Array<Array<number>>, allInOne: boolean) => void;

    let state: Array<Array<number>> = [];
    let onContinue = (allInOne: boolean) => {
        changePage(Pages.Solver, state, allInOne);
    }



</script>

<main style="display: flex; flex-direction: column; min-height: 100vh; min-width: 100vw">

    <div style="height: 10vh"></div>

    <div>
        <h1>Please Enter Known Sudoku Numbers</h1>
    </div>

    <div style="flex: 1; display: flex; justify-content: center; align-items: center; flex-direction: column">
        <Sudoku length={length} bind:state={state}  />
    </div>

    <footer style="margin-top: 40px">
        <div style="display: flex; flex-direction: unset; justify-content: center; flex-wrap: wrap">
            <button on:click={()=>onContinue(false)} style="margin: 15px" class="is-primary button">Calculate Step By Step</button>
            <button on:click={()=>onContinue(true)} style="margin: 15px" class="is-primary button" >Calculate All In One Go</button>
        </div>
        <div style="display: flex; justify-content: flex-end">
            <p>Written By Joseph Glynn</p>
        </div>
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
