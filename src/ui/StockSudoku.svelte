<script lang="ts">
    import {MakeSudoku} from "../api/MakeSudoku"
    export let state: Array<Array<number>> = MakeSudoku(3)
    let l: number = Math.sqrt(state.length)
</script>


<table>
    {#each state as sub, x}
        {#if (x + 1) % l === 0}
            <tr style="border-bottom: solid">
                {#each sub as s, i}
                    {#if (i + 1) % l=== 0}
                        <td style="border-right: solid">{s}</td>
                        {:else }
                        <td>{s}</td>
                        {/if}

                {/each}
            </tr>
        {:else}
            <tr>
                {#each sub as s, i}
                    {#if (i + 1) % l=== 0}
                        <td style="border-right: solid">{s}</td>
                    {:else }
                        <td>{s}</td>
                    {/if}
                {/each}
            </tr>
        {/if}
    {/each}
</table>








<style>
    table {
        margin:1em auto;
    }
    td {
        height:30px;
        width:30px;
        border:1px solid;
        text-align:center;
    }
    td:first-child {
        border-left:solid;
    }

    tr:first-child {
        border-top:solid;
    }

</style>