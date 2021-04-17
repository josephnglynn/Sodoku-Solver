<script lang="ts">
    import {Pages} from "../api/Pages"
    import StockSudoku from "./StockSudoku.svelte"
    import {slide} from "svelte/transition"

    export let changePage: (page: Pages, length: number) => void
    let size: number = null

    enum Problem {
        TO_BIG,
        TO_SMALL,
        NULL
    }

    let error: Problem = null;
    const verify = () => {
        document.getElementById("sudokuSizeInput").focus()
        if (size == null) {
            error = Problem.NULL
        } else if (size >= 5 && error != Problem.TO_BIG) {
            error = Problem.TO_BIG
        } else if (size <= 1) {
            error = Problem.TO_SMALL
        } else {
            changePage(Pages.SetSudoku, size)
        }
    }
</script>

<main style="display: flex; flex-direction: column; min-height: 100vh; min-width: 100vw">

    <div>
        <h1>Please Enter Sudoku Size</h1>
    </div>

    <div style="flex: 1; display: flex; justify-content: center; align-items: center; flex-direction: column; margin-bottom: 20px">
        <StockSudoku/>
        <h4>Example Of Size Of 3</h4>
        <label class="hidden-label" for="sudokuSizeInput">Input Size Of Sudoku</label>
        <input id="sudokuSizeInput" type="number" bind:value={size}>

        {#if error === Problem.TO_SMALL}
            <div transition:slide>
                <h6 class="is-danger" style="color: red">Error: Must Be Greater Than 1</h6>
            </div>
        {:else if error === Problem.TO_BIG}
            <div transition:slide>
                <h6 class="is-warning" style="color: red">Warning: Are You Sure You Want It To Be This Size. If So Press
                    Continue Button Again</h6>
            </div>
        {:else if error === Problem.NULL}
            <div transition:slide>
                <h6 class="is-warning" style="color: red">Warning: This Field Can't Be Empty</h6>
            </div>
        {/if}
    </div>

    <footer>
        <button on:click={()=>verify()} class="is-primary button">Continue</button>
        <div style="display: flex; justify-content: flex-end">
            <p>Written By Joseph Glynn</p>
        </div>
    </footer>

</main>


<style>
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

</style>