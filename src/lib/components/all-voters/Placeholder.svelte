<script lang="ts">
	import NakamotoBackground from "../shared/NakamotoBackground.svelte";
	import NakamotoShield from "../shared/NakamotoShield.svelte";
</script>

<div class="mt-8 inline-block pt-2 pb-1 px-6 rounded-2xl border border-[#131416]/[12%]">
	<div class="flex items-center gap-2">
		<span class="w-2 h-2 rounded-full bg-bloodorange"></span>
		<p class="font-mono text-xs uppercase tracking-wider text-bloodorange">
			Vote info loading
		</p>
	</div>
	<div class="h-2 bg-sand-400 rounded my-1 animate-pulse"></div>
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
</div>
<div class="flex flex-row w-full my-8">
	<div class="flex flex-col w-full my-8 bg-[#F4F3F0] rounded-2xl">
		<div class="py-10 px-10 md:px-12 md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
			<div>
				<div class="h-6 bg-sand-600 rounded animate-pulse w-2/3"></div>
				<div class="h-2 bg-sand-500 rounded animate-pulse mt-6"></div>
				<div class="h-2 bg-sand-500 rounded mt-3 animate-pulse w-3/4"></div>
				<div class="h-2 bg-sand-500 rounded mt-3 animate-pulse w-2/3"></div>
				<div class="h-2 bg-sand-500 rounded mt-3 animate-pulse"></div>
			</div>
			<NakamotoBackground />
			<NakamotoShield />
		</div>
	</div>
</div>

