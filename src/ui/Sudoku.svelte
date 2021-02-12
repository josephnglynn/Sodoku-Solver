<script lang="ts">
    export let length: number = 3;
    export let state: Array<Array<number>> = [];
    for (let i = 0; i < length * length; i++) {
        state.push([])
        for (let k = 0; k < length * length; k++) {
            state[i].push(null);
        }
    }
</script>


<table>
    {#each state as sub, x}
        {#if (x + 1) % length === 0}
            <tr style="border-bottom: solid">
                {#each sub as s, i}
                    {#if (i + 1) % length === 0}
                        <td style="border-right: solid"><input type="number" bind:value={state[x][i]} style="width: 35px"></td>
                    {:else}
                        <td><input type="number" bind:value={state[x][i]} style="width: 35px"></td>
                    {/if}
                {/each}
            </tr>
        {:else}
            <tr>
                {#each sub as s, i}
                    {#if (i + 1) % length === 0}
                        <td style="border-right: solid"><input type="number" bind:value={state[x][i]} style="width: 35px"></td>
                    {:else}
                        <td><input type="number" bind:value={state[x][i]} style="width: 35px"></td>
                    {/if}
                {/each}
            </tr>
        {/if}
    {/each}
</table>



<style>




    :root {
        --test: 4
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    table {
        margin: 1em auto;
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

</style>