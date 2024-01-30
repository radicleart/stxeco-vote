<script lang="ts">
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte'
	import { Icon, CheckCircle } from "svelte-hero-icons"


	import { fmtNumber } from '$lib/utils';
	import type { ProposalEvent } from '$types/stxeco.type';
	import Preamble from './Preamble.svelte';
	import { goto } from '$app/navigation';

	export let proposal:ProposalEvent;
	let showDetails = false;
	let dropdownOpen = false;
</script>

<div class="flex items-start justify-between mt-8">
	<div class="inline-block pt-2 pb-1 px-6 rounded-2xl border border-[#131416]/[12%]">
		<div class="flex items-center gap-2">
			<span class="w-2 h-2 rounded-full bg-bloodorange"></span>
			<p class="font-mono text-xs uppercase tracking-wider text-bloodorange">
				{#if proposal.proposalData}
					Vote in progress
				{:else}
					Funding in progress
				{/if}
			</p>
		</div>
		{#if proposal.proposalData}
			<span class="font-mono text-[#131416] text-xs uppercase tracking-wider">Ends at block {fmtNumber(proposal.proposalData.endBlockHeight)}</span>
			{:else}
			<span class="font-mono text-[#131416] text-xs uppercase tracking-wider">Awaiting funding</span>
		{/if}
	</div>

	<div>
		<p class="text-sm text-[#131416]/[0.64] text-right mb-1">Switch voting method:</p>
		<button on:click={() => (dropdownOpen = !dropdownOpen)} class="font-mono uppercase inline-flex items-center bg-[#EEEBE7] text-[#27282B] gap-2 px-4 py-2 text-xs rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0">
			<!--We want to fill this dinamically  -->
			Solo Stackers - Method 1
			<svg class="hidden md:inline w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
				<path fill-rule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
			</svg>
		</button>
		<Dropdown
			containerClass="z-30 rounded-lg !bg-[#EEEBE7] !border py-1 !border-[#131416]/[0.16]"
			placement='bottom-end'>
				<DropdownItem defaultClass="relative hover:bg-sand-300/50 pl-12 pr-4 py-2 text-[#27282B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500/50" on:click={() => goto('/pox')}>
					<Icon src="{CheckCircle}" mini class="absolute left-4 top-1/2 -translate-y-1/2 inline h-6 w-6 text-sand-800" aria-hidden="true" />
					Solo Stackers (Method 1)
				</DropdownItem>
				<DropdownItem defaultClass="relative hover:bg-sand-300/50 pl-12 pr-4 py-2 text-[#27282B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500/50" on:click={() => goto('/dao/proposals/propose')}>
					Community Pool Stackers (Method 2)
				</DropdownItem>
				<DropdownItem defaultClass="relative hover:bg-sand-300/50 pl-12 pr-4 py-2 text-[#27282B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500/50" on:click={() => goto('/admin')}>
					Non-Stackers (Method 3)
				</DropdownItem>
		</Dropdown>
	</div>
</div>
<div class="sm:flex sm:items-center sm:justify-between mt-6">
	<h1 class="text-[#0A0A0B] text-2xl sm:text-4xl sm:-mx-4">
		<a href="https://github.com/stacksgov/sips/blob/6d27e7cf706df5a367d8714e6037226d741630de/sips/sip-021/sip-021-nakamoto.md" class="py-2 px-4 rounded-md" target="_blank">
			SIP-021 - Nakamoto Release
			<svg class="inline" width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M34.8958 27.6042L37.5 25C40.9518 21.5482 40.9518 15.9518 37.5 12.5C34.0482 9.04822 28.4518 9.04822 25 12.5L22.3958 15.1042" stroke="#0A0A0B" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M15.1042 22.3958L12.5 25C9.04822 28.4518 9.04822 34.0482 12.5 37.5C15.9518 40.9518 21.5482 40.9518 25 37.5L27.6042 34.8958" stroke="#0A0A0B" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M29.6875 20.3125L20.3125 29.6875" stroke="#0A0A0B" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
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
	<Preamble {proposal} />
{/if}
