<script lang="ts">
	import { fmtNumber } from '$lib/utils';
	import { sessionStore } from '$stores/stores';
	import Countdown from '../../ui/Countdown.svelte';
	import { onMount } from 'svelte';

	export let message:string;

	onMount(async () => {
	})

</script>

<div class="inline-block pt-2 pb-1 px-6 rounded-2xl border border-[#131416]/[12%]">
	<div class="mb-1 flex items-center gap-2">
		<span class="w-2 h-2 rounded-full bg-bloodorange"></span>
		<p class="font-mono text-xs uppercase tracking-wider text-bloodorange">
			{message}
		</p>
	</div>
</div>
