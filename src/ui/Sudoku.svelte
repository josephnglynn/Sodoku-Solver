<script lang="ts">
    export let length: number = 3
    export let state: Array<Array<number>> = []
    for (let i = 0; i < length * length; i++) {
        state.push([])
        for (let k = 0; k < length * length; k++) {
            state[i].push(null)
        }
    }
</script>


<table>
    {#each state as sub, x}
        {#if (x + 1) % length === 0}
            <tr style="border-bottom: solid">
                {#each sub as s, i}
                    {#if (i + 1) % length === 0}
                        <td style="border-right: solid">
                            <input type="number" id={i.toString()+"1"} required bind:value={state[x][i]} >
                            <label class="hidden-label" for={i.toString()+"1"}></label>
                        </td>
                    {:else}
                        <td>
                            <input type="number" id={i.toString()+"2"} required bind:value={state[x][i]}>
                            <label class="hidden-label" for={i.toString()+"2"}></label>
                        </td>
                    {/if}
                {/each}
            </tr>
        {:else}
            <tr>
                {#each sub as s, i}
                    {#if (i + 1) % length === 0}
                        <td style="border-right: solid">
                            <input type="number" id={i.toString()+"3"} required bind:value={state[x][i]}>
                            <label class="hidden-label" for={i.toString()+"3"}></label>
                        </td>
                    {:else}
                        <td>
                            <input type="number" id={i.toString()+"4"} required bind:value={state[x][i]}>
                            <label class="hidden-label" for={i.toString()+"4"}></label>
                        </td>
                    {/if}
                {/each}
            </tr>
        {/if}
    {/each}
</table>



<style>

    input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    table {
        margin: 0;
    }

    td {
        height: 30px;
        width: 30px;
        border: 1px solid;
        text-align: center !important;
    }

    td:first-child {
        border-left: solid;
    }


    tr:first-child {
        border-top: solid;
    }

    input {
        margin: 0;
        border: 0;
        width: 35px;
        text-align: center;
    }
</style>