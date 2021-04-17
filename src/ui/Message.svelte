<script lang="ts">
    export let text: String
    export let onAccept: Function
    export let onCancel: Function
    export let clearMessage: Function
</script>


<div style="width: 100vw; height: 100vh; position:relative; display: flex; justify-content: center">
    <div class="holder"
         style="align-self: center; background-color: black; padding: 20px; border-radius: 10px; margin: 20px">
        <h1 style="text-align: center; padding: 20px;">{text}</h1>
        <div style="display: flex; justify-content: space-around; flex-direction: row;">
            <button class="is-danger button" style="display: inline" on:click={()=>{onCancel(); clearMessage();}}>
                CANCEL
            </button>
            <button class="is-primary-dark button" style="display: inline" on:click={()=>{onAccept(); clearMessage();}}>OK
            </button>
        </div>
    </div>
</div>

<style>

    @media (max-width: 480px) {
        .holder {
            width: 80vw;
        }

        button {
            width: 30vw;
        }
    }

    @media (min-width: 500px) {
        .holder {
            width: 480px;
        }

        button {
            width: 200px;
        }
    }

    h1 {
        color: #ffffff;
    }
</style>