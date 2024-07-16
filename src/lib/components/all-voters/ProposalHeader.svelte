<script lang="ts">
	import { Dropdown, DropdownItem } from 'flowbite-svelte'
	import { Icon, CheckCircle, Share } from "svelte-hero-icons"
	import Preamble from './Preamble.svelte';
	import { page } from '$app/stores';
	import ProposalStageUpdate from './ProposalStageUpdate.svelte';
	import { type VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { isVoting } from '$lib/proposals';
	import { onMount } from 'svelte';

	export let proposal:VotingEventProposeProposal;
	let linkAddress = ''
	let linkName = ''
	let method = 3
	const tweetText = `Voting on proposal ${proposal.proposalMeta.title} to improve the Stacks Blockchain is under way at `;
	const siteUrl = "https://stx.eco"; // Replace with your site's URL

	const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText + siteUrl)}`;

	let showDetails = false;
	let dropdownOpen = false;

	const switchMethod = (newMethod:number) => {
		if (method === newMethod) return
		const sp = $page.url.searchParams
		sp.set('method', '' + newMethod)
		location.assign($page.url.href)
	}
	onMount(async () => {
		if ($page.url.searchParams.has('method')) {
			method = Number($page.url.searchParams.get('method'))
		}
	})

</script>

<div class="sm:flex sm:items-start sm:justify-between mt-8">
	<div class="flex flex-col gap-y-4">
		<ProposalStageUpdate {proposal} />
	</div>
	

	{#if isVoting(proposal)}
		<div class="mt-4 sm:mt-0">
			<p class="text-sm text-[#131416]/[0.64] sm:text-right mb-1">Switch voting method:</p>
			<button on:click={() => (dropdownOpen = !dropdownOpen)} class="font-mono uppercase inline-flex items-center bg-[#EEEBE7] text-[#27282B] gap-2 px-4 py-2 text-xs rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0">
				{#if method === 1 || method === 2}
				Stackers
				{:else}
				Non Stackers
				{/if}
				<svg class="inline w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
					<path fill-rule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
				</svg>
			</button>
			<Dropdown
				containerClass="z-30 rounded-lg !bg-[#EEEBE7] !border py-1 !border-[#131416]/[0.16]"
				placement='bottom-end'>
					<DropdownItem defaultClass="relative hover:bg-sand-300/50 pl-12 pr-4 py-2 text-[#27282B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500/50" on:click={() => switchMethod(2)}>
						{#if method === 1 || method === 2}<Icon src="{CheckCircle}" mini class="absolute left-4 top-1/2 -translate-y-1/2 inline h-6 w-6 text-sand-800" aria-hidden="true" />{/if}
						Stackers
					</DropdownItem>
					<DropdownItem defaultClass="relative hover:bg-sand-300/50 pl-12 pr-4 py-2 text-[#27282B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500/50" on:click={() => switchMethod(3)}>
						{#if method === 3}<Icon src="{CheckCircle}" mini class="absolute left-4 top-1/2 -translate-y-1/2 inline h-6 w-6 text-sand-800" aria-hidden="true" />{/if}
						Non stacker voting
					</DropdownItem>
			</Dropdown>
		</div>
	{/if}
</div>
<div class="sm:flex sm:items-center sm:justify-between mt-6">
	<h1 class="text-[#0A0A0B] text-2xl sm:text-4xl sm:-mx-4 flex">
		<a href={linkAddress || '/'} on:click|preventDefault={() => {}} class="py-2 px-4 rounded-md" target="_blank">
			{proposal.proposalMeta.title}
		</a>
		<a href={tweetUrl} target="_blank" class="mt-3">
			<button style="display: flex; ">
			  <Icon src={Share} width={30} height={30}/>
			</button>
		</a>	
	</h1>

	<button on:click={() => (showDetails = !showDetails)} class="text-sm font-mono uppercase inline-flex items-center bg-transparent gap-2 px-4 py-2  text-[#0A0A0B]/[0.64] rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0">
		<!-- Show/Hide toggle -->
		Show details <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
			<path fill-rule="evenodd" d="M8 2a.75.75 0 0 1 .75.75v8.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.22 3.22V2.75A.75.75 0 0 1 8 2Z" clip-rule="evenodd" />
		</svg>
	</button>
</div>

{#if showDetails}
<Preamble proposalMeta={proposal.proposalMeta} votingContract={proposal.votingContract} submissionContract={proposal.submissionContract} contractId={proposal.proposal} />
{/if}
