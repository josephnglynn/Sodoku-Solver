<script lang="ts">
    export let text: String;
    export let onAccept: Function;
    export let onCancel: Function;
    export let clearMessage: Function;
</script>


<div style="width: 100vw; height: 100vh; position:relative; display: flex; justify-content: center">
    <div style="align-self: center; background-color: black; padding: 20px; border-radius: 10px; margin: 20px">
        <h1 style="text-align: center; padding: 20px;" class="is-text has-text-white">{text}</h1>
        <div style="display: flex; justify-content: space-around; flex-direction: row; min-width: 150px">
            <button class="is-danger button" style="padding: 10px" on:click={()=>{onCancel; clearMessage();}}>CANCEL</button>
            <button class="is-primary button" style="padding: 10px" on:click={()=>{onAccept(); clearMessage();}}>OK</button>
        </div>
    </div>
</div>