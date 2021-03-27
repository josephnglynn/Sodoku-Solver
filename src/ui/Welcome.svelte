<script lang="ts">
    import {Pages} from "../api/Pages";
    export let changePage: (page: Pages)=>void;
</script>

<main style="display: flex; flex-direction: column; min-height: 100vh; min-width: 100vw">

    <div style="height: 10vh"></div>

    <div>
        <h1>Welcome To Sudoku Solver</h1>
        <br>
        <p>
            A Simple Way To Solve Sudokus
        </p>
    </div>

    <div style="flex: 1"></div>

    <footer>
        <button on:click={()=>changePage(Pages.ChooseSize)} class="is-primary button"  >Continue</button>
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
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 3.5em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }

</style>