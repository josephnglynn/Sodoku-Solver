<script lang="ts">
    import {Pages} from "../api/Pages"
    import Sudoku from "./Sudoku.svelte"

    export let length: number = 3
    export let changePage: (page: Pages, State: Array<Array<number>>, allInOne: boolean) => void
    export let showMessage: (message: String, onAccept: Function, onCancel: Function) => void

    let state: Array<Array<number>> = []

    const checkIfSudokuIsValid = (): Boolean => {
        //Check for wrong Numbers
        for (let i = 0; i < state.length; ++i) {
            for (let k = 0; k < state.length; ++k) {
                if (state[i][k] != null) {
                    if (state[i][k] <= 0 || state[i][k] > state.length) {
                        return false
                    }

                }
            }
        }

        //We don't do anything else as they will soon now if its wrong

        return true
    }

    const onContinue = (allInOne: boolean) => {
        if (!checkIfSudokuIsValid()) {
            showMessage("The sudoku is invalid", () => {
            }, () => {
            })
            return
        }
        changePage(Pages.Solver, state, allInOne)
    }


</script>

<main style="display: flex; flex-direction: column; min-height: 100vh; min-width: 100vw">

    <div>
        <h1>Please Enter Known Sudoku Numbers</h1>
    </div>

    <div style="flex: 1; display: flex; justify-content: center; align-items: center; flex-direction: column">
        <Sudoku length={length} bind:state={state}/>
    </div>

    <footer style="margin-top: 40px">
        <div style="display: flex; flex-direction: unset; justify-content: center; flex-wrap: wrap">
            <button on:click={()=>onContinue(false)} style="margin: 15px" class="is-primary button">Calculate Step By
                Step
            </button>
            <button on:click={()=>onContinue(true)} style="margin: 15px" class="is-primary button">Calculate All In One
                Go
            </button>
        </div>
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
