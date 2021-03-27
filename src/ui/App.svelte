<script lang="ts">
    import Welcome from "./Welcome.svelte"
    import {Pages} from "../api/Pages"
    import ChooseSize from "./ChooseSize.svelte"
    import {slide} from "svelte/transition"
    import InputSudoku from "./InputSudoku.svelte"
    import Solver from "./Solver.svelte"
    import Message from "./Message.svelte"

    let l: number = 0
    let state: Array<Array<number>> = []
    let allAtOnce: boolean = false

    let currentPage: Pages = Pages.Welcome;
    let changePage = (page: Pages) => {
        currentPage = page
    };

    let setToInputSudoku = (page: Pages, length: number) => {
        l = length;
        currentPage = page;
    };

    let setToSolve = (page: Pages, State: Array<Array<number>>, allInOne: boolean) => {
        state = State;
        allAtOnce = allInOne;
        currentPage = page;
    };

    let message_text = null;
    let message_onAccept = null;
    let message_onCancel = null;

    const showMessage = (text: String, onAccept: Function, onCancel: Function) => {
        console.log(`DISPLAYING MESSAGE: ${text}`)
        message_text = text;
        message_onAccept = onAccept;
        message_onCancel = onCancel;
    }

    const clearMessage = () => {
        message_text = null;
        message_onAccept = null;
        message_onCancel = null;
        console.log("CLEARED MESSAGES")
    }
</script>


<div>
    {#if currentPage === Pages.Welcome}
        <div transition:slide>
            <Welcome changePage={changePage}/>
        </div>

    {:else if currentPage === Pages.ChooseSize}
        <div transition:slide>
            <ChooseSize changePage={setToInputSudoku}/>
        </div>
    {:else if currentPage === Pages.SetSudoku}
        <div transition:slide>
            <InputSudoku length={l} changePage={setToSolve}/>
        </div>
    {:else if currentPage === Pages.Solver}
        <div transition:slide>
            <Solver allInOneGo={allAtOnce} changePage={changePage} state={state} showMessage={showMessage}/>
        </div>
    {/if}
</div>

{#if message_text != null && message_onAccept != null && message_onCancel != null}
    <div style="position: absolute; top: 0; left: 0; width: 100vw; height: 100vh">
        <Message text={message_text} onAccept={message_onAccept} onCancel={message_onCancel} clearMessage={clearMessage}/>
    </div>
{/if}
