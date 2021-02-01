<script lang="ts">
    import {Pages} from "./Pages";
    export let changePage: (page: Pages)=>void;
</script>

<main style="display: flex; flex-direction: column; min-height: 100vh">

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
        font-size: 4em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }

</style>