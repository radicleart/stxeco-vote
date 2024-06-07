<script lang="ts">
	import { onMount } from "svelte";
	import sipflow from '$lib/assets/sipflow.png'
	import PageIntro from "$lib/ui/PageIntro.svelte";

	let message = 'STX ECO supports the Stacks Improvement Proposals (SIPs). Vote on upcoming proposals. Why not submit your own suggestion?';
	
	onMount(async () => {
    try {
    } catch (err) {
    }
  })
</script>

<svelte:head>
	<title>Ecosystem DAO - Nakamoto SIP Voting</title>
	<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

<PageIntro {message} />

<div class="py-4 mx-auto max-w-7xl md:px-6">
  	<div class="flex flex-col w-full my-4">
    	<div>
			<div class="space-y-6 mt-5">
				<h2 class="text-[#0A0A0B] text-2xl sm:text-4xl mt-6">SIP Process</h2>
				<p class="text-base text-gray-600">
					Stacks improvement proposals begin as drafts and become standards via the process in the diagram below. 
					Community members are encouraged to submit their idea.
					The process is described in full in  
					the <a class="text-bitcoinorange" href="https://github.com/stacksgov/sips/blob/main/sips/sip-000/sip-000-stacks-improvement-proposal-process.md#introduction" target="_blank">SIP-000 in the Github repository</a></p>
				<div class="py-10 px-10 bg-[#F4F3F0] rounded-2xl lg:grid lg:gap-8 lg:grid-cols-1 space-y-4 lg:space-y-0">
					<img class="w-full h-auto" alt="SIP process flow diagram" src={sipflow} />
				</div>
			</div>
		</div>
  	</div>
</div>
