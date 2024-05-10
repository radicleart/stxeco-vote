<script lang="ts">
	import { page } from '$app/stores';
	import InsightsBanner from '$lib/components/dashboard/common/InsightsBanner.svelte';
	import { CONFIG } from '$lib/config';
	import { sbtcConfig } from '$stores/stores';

	export let method:number;
	const threshold = $sbtcConfig.poxInfo.min_amount_ustx

	const showMethodSwitcher = () => {
		//return proposal.stage === ProposalStage.ACTIVE && $page.route.id?.indexOf('/results') === -1
	}

	const switchMethod = (newMethod:number) => {
		if (method === newMethod) return
		const sp = $page.url.searchParams
		sp.set('method', '' + newMethod)
		location.assign($page.url.href)
	}
</script>

<div class="w-full sm:flex sm:items-start sm:justify-between mt-8">
	<div class="w-full pt-2 pb-1 px-6 rounded-2xl border border-[#131416]/[12%]">
		<div class="mb-1 flex flex-col">
			<div class="flex justify-between">
				<div class="mt-3">
					<span class="w-2 h-2 rounded-full bg-bloodorange"></span>
					<p class="font-mono text-xs uppercase tracking-wider text-bloodorange">
						Nakamoto stacking information
					</p>
				</div>
				<div class="mt-3">
					<p class="font-mono text-xs uppercase tracking-wider text-bloodorange">
						NETWORK: {CONFIG.VITE_NETWORK.toUpperCase()}
					</p>
				</div>
			</div>
			<InsightsBanner/>
		</div>
	</div>
	<!--
	<div class="mt-4 sm:mt-0">
		<p class="text-sm text-[#131416]/[0.64] sm:text-right mb-1">Switch option:</p>
		<button on:click={() => (dropdownOpen = !dropdownOpen)} class="font-mono uppercase inline-flex items-center bg-[#EEEBE7] text-[#27282B] gap-2 px-4 py-2 text-xs rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0">
			{#if method === 1}
			Stacking stats
			{:else if method === 2}
			Stack stacks
			{/if}
			<svg class="inline w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
				<path fill-rule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
			</svg>
		</button>
		<Dropdown
			containerClass="z-30 rounded-lg !bg-[#EEEBE7] !border py-1 !border-[#131416]/[0.16]"
			placement='bottom-end'>
				<DropdownItem defaultClass="relative hover:bg-sand-300/50 pl-12 pr-4 py-2 text-[#27282B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500/50" on:click={() => switchMethod(1)}>
					{#if method === 1}<Icon src="{CheckCircle}" mini class="absolute left-4 top-1/2 -translate-y-1/2 inline h-6 w-6 text-sand-800" aria-hidden="true" />{/if}
					Stacking stats
				</DropdownItem>
				<DropdownItem defaultClass="relative hover:bg-sand-300/50 pl-12 pr-4 py-2 text-[#27282B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500/50" on:click={() => switchMethod(2)}>
					{#if method === 2}<Icon src="{CheckCircle}" mini class="absolute left-4 top-1/2 -translate-y-1/2 inline h-6 w-6 text-sand-800" aria-hidden="true" />{/if}
					Stack stacks
				</DropdownItem>
		</Dropdown>
	</div>
	-->
</div>
