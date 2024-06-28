<script lang="ts">
	import Banner from '../../ui/Banner.svelte';
	import { explorerTxUrl } from '$lib/utils';
	import { onMount } from 'svelte';
	import type { DaoStore } from '@mijoco/stx_helpers/dist/index';
	import { daoStore } from '$stores/stores_dao';
	import { getTransaction, type InFlight } from '@mijoco/stx_helpers/dist/index';
	import { getConfig } from '$stores/store_helpers';

	let status:string = 'pending';
    const getMessage = (inFlight:any) => {
		return `${inFlight.name} transaction sent (status ${status}) - <a href="${explorerTxUrl(inFlight.txid)}" target="_blank"> view on explorer</a>`
	}

	onMount(async () => {
		if ($daoStore.daoData) {
			const txid  = $daoStore.daoData?.txid
			if (typeof txid === 'string') {
				const myint = setInterval(async () => {
					const tx = await getTransaction(getConfig().VITE_STACKS_API, txid)
					status = tx.tx_status
					if (tx.tx_status === 'success') {
						daoStore.update((conf:DaoStore) => {
							if (!conf.daoData) conf.daoData = {} as InFlight;
							conf.daoData = undefined
							return conf;
						})
						clearInterval(myint)
					}
				}, 20000)
			}
		}
	})

</script>

{#if $daoStore.daoData}
<div class="py-6 mx-auto max-w-7xl md:px-6">
	<div class="flex flex-col w-full my-8">
  <div class={' text-gray-1000 '}>
	<Banner message={getMessage($daoStore.daoData)} bannerType={'info'}/>
</div>
</div>
</div>
{/if}