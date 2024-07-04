<script lang="ts">
	import VotingOptionBackground from "$lib/assets/home/VotingOptionBackground.svelte";
	import ProposalStageCustom from "$lib/components/all-voters/ProposalStageCustom.svelte";
	import ProposalHomePageActive from "$lib/components/dao/proposals/ProposalHomePageActive.svelte";
	import ProposalHomePageEmptyItem from "$lib/components/dao/proposals/ProposalHomePageEmptyItem.svelte";
	import ProposalHomePageListItem from "$lib/components/dao/proposals/ProposalHomePageListItem.svelte";
	import TentativeProposalHeader from "$lib/components/dao/proposals/rows/TentativeProposalHeader.svelte";
	import { getActiveProposals, getInactiveProposals, getTentativeProposals } from "$lib/proposals";
	import PageIntro from "$lib/ui/PageIntro.svelte";
	import { getConfig } from "$stores/store_helpers";
	import { daoStore } from "$stores/stores_dao";
	import type { VotingEventConcludeProposal, VotingEventProposeProposal } from "@mijoco/stx_helpers/dist/index";
	import { QuestionCircleOutline } from "flowbite-svelte-icons";
	import { onMount } from "svelte";
	import { Icon, CheckCircle, PlusCircle } from "svelte-hero-icons"
	
	let message = 'STX ECO is the all-in-one voting platform where the Stacks community can weigh in on major protocol changes';
	let componentKey = 0;

	let votingOptions = [
		{
			title: 'Solo Stackers',
			method: 1,
			icon: '<svg class="mx-auto text-[#141414] group-hover:text-[#FC6432] group-hover:scale-[0.90] transition ease-out duration-200" xmlns="http://www.w3.org/2000/svg" width="112" height="138" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-width="11.5" d="M105.984 106.5c.016-1.026.016-2.069.016-3.125 0-15.533-22.386-28.125-50-28.125S6 87.842 6 103.375 6 131.5 56 131.5c13.944 0 23.999-.979 31.25-2.729M81 31.5c0 13.807-11.193 25-25 25s-25-11.193-25-25 11.193-25 25-25 25 11.193 25 25Z"/></svg>',
			description: 'Send a dust BTC transaction',
			explanation: 'Voters who are stacking on their own must send a dust amount of BTC (~6,000 sats) from their PoX reward address to an address representing a ‘Yes’ vote or an address representing a ‘No’ vote.'
		},
		{
			title: 'Community Pool Stackers',
			method: 2,
			icon: '<svg class="mx-auto text-[#141414] group-hover:text-[#FC6432] group-hover:scale-[0.90] transition ease-out duration-200" xmlns="http://www.w3.org/2000/svg" width="158" height="137" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-width="11.5" d="M129.484 106c.016-1.026.016-2.069.016-3.125 0-15.533-22.386-28.125-50-28.125s-50 12.592-50 28.125S29.5 131 79.5 131c13.944 0 23.999-.979 31.25-2.729M104.5 31c0 13.807-11.193 25-25 25s-25-11.193-25-25 11.193-25 25-25 25 11.193 25 25ZM113.5 54.8c10.631 0 19.25-8.686 19.25-19.4 0-10.714-8.619-19.4-19.25-19.4m38.488 77.6c.012-.796.012-1.605.012-2.425 0-12.054-17.237-21.825-38.5-21.825M44.5 54.8c-10.632 0-19.25-8.686-19.25-19.4 0-10.714 8.618-19.4 19.25-19.4M6.012 93.6C6 92.804 6 91.995 6 91.175 6 79.121 23.237 69.35 44.5 69.35"/></svg>',
			description: 'Send a minimal STX transaction',
			explanation: 'Voters who are stacking in a community pool must send a minimal amount of STX (~1 uSTX) from their stacking address to an address representing a ‘Yes’ vote or an address representing a ‘No’ vote.'
		},
		{
			title: 'Non-Stackers',
			method: 3,
			icon: '<svg class="mx-auto text-[#141414] group-hover:text-[#FC6432] group-hover:scale-[0.90] transition ease-out duration-200" width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M40.453 86.6625C41.4144 89.0662 40.2451 91.7941 37.8414 92.7555L32.9211 94.7234L32.9208 94.7235C26.6058 97.2497 22.2298 99.0069 19.3935 100.494C19.1164 100.639 18.8667 100.776 18.642 100.903C18.8667 101.031 19.1164 101.167 19.3935 101.312C22.2299 102.799 26.6059 104.557 32.921 107.083M32.921 107.083L50.4739 114.104C63.1292 119.166 68.4347 121.216 75.0624 121.216C80.1264 121.216 84.522 119.999 92.1317 117.076C94.5484 116.148 97.26 117.355 98.1883 119.771C99.1165 122.188 97.9099 124.9 95.4932 125.828C87.6517 128.84 81.9223 130.591 75.0624 130.591C66.4429 130.591 59.4464 127.791 47.7188 123.099C47.4786 123.003 47.2365 122.906 46.9923 122.809L29.1558 115.674C23.1896 113.287 18.3574 111.354 15.0404 109.615C13.3616 108.735 11.7354 107.737 10.4813 106.535C9.19293 105.299 7.875 103.425 7.875 100.903C7.875 98.3816 9.19293 96.5073 10.4813 95.2715C11.7354 94.0687 13.3616 93.071 15.0404 92.1908C18.3575 90.4518 23.1897 88.5188 29.1558 86.1323L34.36 84.0509C36.7637 83.0895 39.4916 84.2588 40.453 86.6625M109.672 86.6625C110.633 84.2588 113.361 83.0895 115.765 84.0509L120.686 86.0189L120.686 86.019L120.967 86.1316C126.935 88.5185 131.767 90.4516 135.085 92.1909C136.763 93.071 138.39 94.0688 139.644 95.2716C140.932 96.5074 142.25 98.3817 142.25 100.903C142.25 103.424 140.932 105.299 139.644 106.535C138.39 107.737 136.763 108.735 135.085 109.615C131.767 111.355 126.935 113.288 120.968 115.675L120.686 115.787C118.282 116.749 115.554 115.58 114.593 113.176C113.631 110.772 114.8 108.044 117.204 107.083C123.519 104.557 127.895 102.799 130.732 101.312C131.009 101.167 131.258 101.031 131.483 100.903C131.258 100.776 131.009 100.639 130.732 100.494C127.895 99.0069 123.519 97.2497 117.204 94.7235L117.204 94.7234L112.284 92.7555C109.88 91.7941 108.711 89.0662 109.672 86.6625Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M82.7349 95.2215C80.0351 95.9034 77.6496 96.2156 75.0624 96.2156C68.4347 96.2156 63.1292 94.1658 50.4739 89.1041L32.9211 82.0828L31.005 70.4906C31.6228 70.2429 32.2612 69.9873 32.9209 69.7235L37.8416 67.7553L34.3599 59.0508L29.1559 61.1323C23.1896 63.519 18.3574 65.4519 15.0403 67.191C13.3616 68.0711 11.7353 69.0688 10.4813 70.2716C9.19294 71.5074 7.875 73.3816 7.875 75.9031C7.875 78.4246 9.19294 80.2989 10.4813 81.5347C11.7353 82.7375 13.3616 83.7352 15.0403 84.6153C18.3574 86.3544 23.1896 88.2873 29.1559 90.6738L47.7188 98.0992C59.4463 102.791 66.4429 105.591 75.0624 105.591C79.9029 105.591 84.2314 104.708 89.1735 103.103L82.7349 95.2215ZM31.005 70.4906C25.7083 72.6138 21.9336 74.1622 19.3933 75.494C19.1164 75.6393 18.8664 75.7756 18.642 75.9031C18.8666 76.0306 19.1164 76.167 19.3933 76.3123C22.2298 77.7993 26.6059 79.5566 32.9211 82.0828L31.005 70.4906Z" fill="currentColor"/><path d="M103.95 97.4814L120.968 90.6744C126.935 88.2875 131.768 86.3546 135.085 84.6153C136.763 83.7352 138.39 82.7375 139.644 81.5347C140.932 80.2989 142.25 78.4245 142.25 75.9031C142.25 73.3818 140.932 71.5074 139.644 70.2716C138.39 69.0688 136.763 68.0711 135.085 67.191C131.768 65.4517 126.935 63.5186 120.968 61.1319L115.765 59.0508L112.283 67.7553L117.204 69.7235C123.519 72.2497 127.895 74.007 130.732 75.494C131.009 75.6393 131.258 75.7756 131.483 75.9031C131.258 76.0306 131.009 76.167 130.732 76.3123C127.895 77.7993 123.519 79.5566 117.204 82.0828L99.651 89.1041C98.9921 89.3675 98.3529 89.6231 97.7325 89.8704L103.95 97.4814Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M30.352 19.245C32.3569 17.6071 35.3099 17.9047 36.9478 19.9096L122.201 124.268C123.839 126.272 123.542 129.225 121.537 130.863C119.532 132.501 116.579 132.204 114.941 130.199L29.6875 25.8407C28.0496 23.8359 28.3472 20.8828 30.352 19.245Z" fill="currentColor"/><path d="M60.513 68.0197C57.7149 66.9931 54.4588 65.6979 50.4741 64.1041L32.9211 57.0826C26.6059 54.5566 22.2298 52.7996 19.3933 51.3125C19.1404 51.1802 18.8898 51.0438 18.6414 50.9032C18.8897 50.7626 19.1404 50.6261 19.3933 50.4939C22.2298 49.0068 26.6059 47.2498 32.9211 44.7236C35.3246 43.7623 36.4939 41.0341 35.5324 38.6306C34.5709 36.2268 31.8429 35.0578 29.4392 36.0191L29.1562 36.1323C23.19 38.5188 18.3576 40.4516 15.0403 42.1906C13.3616 43.0708 11.7353 44.0686 10.4813 45.2715C9.19275 46.5075 7.875 48.3817 7.875 50.9032C7.875 53.4245 9.19275 55.299 10.4813 56.5348C11.7353 57.7376 13.3616 58.7355 15.0403 59.6156C18.3576 61.3546 23.19 63.2876 29.1562 65.6739L47.7188 73.0993C57.3544 76.9543 63.7963 79.5316 70.5686 80.3285L60.513 68.0197ZM88.3371 78.3693C92.4206 77.0943 96.8897 75.3061 102.405 73.0994L120.968 65.6745C126.935 63.2878 131.767 61.3548 135.085 59.6156C136.763 58.7355 138.39 57.7376 139.644 56.5348C140.932 55.2988 142.25 53.4245 142.25 50.9032C142.25 48.3819 140.932 46.5075 139.644 45.2716C138.39 44.0686 136.763 43.0708 135.085 42.1906C131.767 40.4516 126.935 38.5185 120.968 36.132L102.408 28.7081C90.6791 24.0151 83.6824 21.2156 75.0624 21.2156C68.2026 21.2156 62.4733 22.9666 54.6317 25.9786C52.215 26.907 51.0084 29.6186 51.9366 32.0353C52.8649 34.4521 55.5765 35.6585 57.9932 34.7302C65.6029 31.8071 69.9984 30.5906 75.0624 30.5906C81.6902 30.5906 86.9955 32.6403 99.651 37.7025L117.204 44.7236C123.519 47.2498 127.895 49.0068 130.732 50.4939C131.009 50.6392 131.259 50.7755 131.483 50.9032C131.259 51.0307 131.009 51.1672 130.732 51.3125C127.895 52.7996 123.519 54.5566 117.204 57.0826L99.651 64.104C91.3916 67.4075 86.2628 69.4282 81.8539 70.4334L88.3371 78.3693Z" fill="currentColor"/></svg>',
			description: 'Send a vote transaction',
			explanation: 'Non stackers can vote by connecting their wallets to EcosystemDAO to use the amount of STX in their wallet to represent a ‘Yes’ vote or a ‘No’ vote.'
		},
	]

	let currentContract = ($daoStore.currentProposal) ? $daoStore.currentProposal?.contractId : getConfig().VITE_DOA_PROPOSAL
	let tentativeProposals:Array<TentativeProposalHeader>
	let activeProposals:Array<VotingEventProposeProposal>
	let inactiveProposals:Array<VotingEventConcludeProposal>

	const fetchInactive = async () => {
		inactiveProposals = await getInactiveProposals()
		componentKey++;
	}

	onMount(async () => {
		tentativeProposals = await getTentativeProposals()
		activeProposals = await getActiveProposals()
  	})
</script>

<svelte:head>
	<title>Ecosystem DAO - Nakamoto SIP Voting</title>
	<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

<PageIntro {message} />

<div class="py-4 mx-auto max-w-7xl md:px-6">
  	<div class="flex flex-col w-full my-8">
    	<div>
			<div class="space-y-6">

				<ProposalStageCustom message={'stacks improvement proposals'} />

				{#if $daoStore.tentativeProposals && $daoStore.tentativeProposals.length > 0}
				<div>
					<h1 class="text-[#0A0A0B] text-2xl sm:text-4xl sm:-mx-4 mt-6">
						<a href="/" on:click|preventDefault={() => {}} class="py-2 px-4 rounded-md" target="_blank">
							Upcoming proposals
						</a>
					</h1>
				</div>
				{#each $daoStore.tentativeProposals as tProp }
				<ProposalHomePageListItem propType={'tentative'} contractId={tProp.tag} title={tProp.proposalMeta.title} description={tProp.proposalMeta.description} infoItems={tProp.info || []} />
				{/each}
				{/if}

				<div>
					<h1 class="text-[#0A0A0B] text-2xl sm:text-4xl sm:-mx-4 mt-6">
						<a href="/" on:click|preventDefault={() => {}} class="py-2 px-4 rounded-md" target="_blank">
							Current proposals
						</a>
					</h1>
				</div>
				{#if activeProposals && activeProposals.length > 0}
				{#each activeProposals as aProp }
				<ProposalHomePageActive prop={aProp} infoItems={[]} />
				{/each}
				{/if}
				{#if !activeProposals || activeProposals.length === 0}
				<ProposalHomePageEmptyItem propType={'active'} />
				{/if}

				<div>
					<h1 class="text-[#0A0A0B] text-2xl sm:text-4xl sm:-mx-4 mt-6">
						<a href="/" on:click|preventDefault={() => {}} class="py-2 px-4 rounded-md" target="_blank">
							Past proposals <a href="/" class="text-bitcoinorange" on:click={() => fetchInactive()}><Icon class="inline-block" src={PlusCircle} width={30} height={30}/></a>
						</a>
					</h1>
				</div>
				{#key componentKey}
				{#if inactiveProposals && inactiveProposals.length > 0}
				{#each inactiveProposals as aProp }
				<ProposalHomePageListItem propType={'inactive'} contractId={aProp.proposal} title={aProp.proposalMeta.title} description={aProp.proposalMeta.description} infoItems={[]} />
				{/each}
				{#if !inactiveProposals || inactiveProposals.length === 0}
				<ProposalHomePageEmptyItem propType={'inactive'} />
				{/if}
				{/if}
				{/key}

			</div>






			<div class="space-y-6 mt-24">
				<h2 class="text-[#0A0A0B] text-2xl sm:text-4xl mt-6">Cast your vote</h2>
				<div class="py-10 px-10 bg-[#F4F3F0] rounded-2xl lg:grid lg:gap-8 lg:grid-cols-3 space-y-4 lg:space-y-0">
					{#each votingOptions as opt}
						<a href={`/dao/proposals/${currentContract}?method=${opt.method}`} class="group flex flex-col overflow-hidden border border-transparent hover:border-[#FC6432] rounded-lg relative bg-[#E6E4E2] px-6 py-6 transition duration-300 ease-in-out">

							<VotingOptionBackground />

							<div class="flex flex-col h-full relative z-[1]">
								<div class="flex-1">
									{@html opt.icon}
									<h4 class="text-lg mt-12 text-[#131416] mb-3">{opt.title}</h4>
								</div>
								<p class="mt-auto text-[#131416]/[0.64]">{opt.explanation}</p>
							</div>

							<div class="mt-3 text-center sm:hidden w-full text-sm font-mono uppercase inline-block bg-bloodorange px-4 py-2 text-[#0A0A0B] rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0" role="button">
								Vote now
							</div>
						</a>
					{/each}
				</div>
			</div>
		</div>
  	</div>
</div>