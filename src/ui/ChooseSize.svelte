<script lang="ts">
    import {Pages} from "../api/Pages";
    import StockSudoku from "./StockSudoku.svelte";
    import {slide} from "svelte/transition"

    export let changePage: (page: Pages, length: number) => void;
    let size: number;
    let error: boolean = false;
    const verify = () => {
        if (size > 1) {
            changePage(Pages.SetSudoku, size);
        } else {
            error = true;
        }
    }
</script>

<main style="display: flex; flex-direction: column; min-height: 100vh">

    <div style="height: 10vh"></div>

    <div>
        <h1>Please Enter Sudoku Size</h1>
    </div>

    <div style="flex: 1; display: flex; justify-content: center; align-items: center; flex-direction: column">
        <StockSudoku/>
        <h6>Example Of Size Of 3</h6>
        <label>
            <input type="number" bind:value={size}>
        </label>
        {#if error}
            <div transition:slide>
                <h6 class="is-danger" style="color: red">Error: Must Be Greater Than 1</h6>
            </div>
        {/if}
    </div>

    <footer>
        <button on:click={()=>verify()} class="is-primary button">Continue</button>
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