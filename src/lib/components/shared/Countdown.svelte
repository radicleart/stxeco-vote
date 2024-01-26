<script lang="ts">
import { DateTime, Duration } from 'luxon'

export let endBlock = 0;

const dayInMillis = 1000 * 60 * 60 * 24;
let now: any = DateTime.local();
let end= DateTime.local().plus({ minutes: endBlock * 10 });
//let end= DateTime.local().plus({ days: 900 });
let moreThanDay = (end.toMillis() - now.toMillis()) > dayInMillis;
const myInt =  setInterval(() => {
    now = DateTime.local();
}, 1000)

$: display = Duration.fromObject(end.diff(now).toObject()); //.toFormat('dd hh:mm:ss');
</script>

{#if endBlock > 0}
<div>
    {#if moreThanDay}
    ~ {display.toFormat("d ' days' h ' hrs' m ' mins' ss ' secs'")}
    {:else}
    ~ {display.toFormat("h ' hrs' m ' mins' ss ' secs'")}
    {/if}
 </div>
 {/if}

<style>
</style>
