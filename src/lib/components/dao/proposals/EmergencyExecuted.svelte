<script lang="ts">
	import type { ProposalEvent } from "$types/stxeco.type";


	export let proposalEvent:ProposalEvent;
</script>

<div class="bg-card py-4 px-5" >
  <div class="text-white">
    <h4>Proposal Executed by Executive Team</h4>
    <p>Proposal was executed at block {proposalEvent.executedAt}.
      {#if typeof proposalEvent.signals?.signals === 'number' && proposalEvent.signals?.signals > 0}
        And was executed by the executive team with {proposalEvent.signals?.signals} votes.
      {/if}
    </p>
  </div>
</div>

<style>
</style>
