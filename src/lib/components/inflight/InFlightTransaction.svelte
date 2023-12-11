<script lang="ts">
	import { sbtcConfig } from '$stores/stores';
	import Banner from '../shared/Banner.svelte';
	import { explorerTxUrl } from '$lib/utils';
	import { onMount } from 'svelte';
	import { getTransaction } from '$lib/sbtc_admin';
	import type { SbtcConfig } from '$types/sbtc_config';
	import type { DaoData } from '$types/stxeco.type';

	let status:string = 'pending';
    const getMessage = (inFlight:any) => {
		return `${inFlight.name} transaction sent (status ${status}) - <a href="${explorerTxUrl(inFlight.txid)}" target="_blank"> view on explorer</a>`
	}

	onMount(async () => {
		if ($sbtcConfig.daoData?.inFlight) {
			const txid  = $sbtcConfig.daoData?.inFlight.txid
			if (typeof txid === 'string') {
				const myint = setInterval(async () => {
					const tx = await getTransaction(txid)
					status = tx.tx_status
					if (tx.tx_status === 'success') {
						sbtcConfig.update((conf:SbtcConfig) => {
							if (!conf.daoData) conf.daoData = {} as DaoData;
							conf.daoData.inFlight = undefined
							return conf;
						})
						clearInterval(myint)
					}
				}, 20000)
			}
		}
	})

</script>

{#if $sbtcConfig.daoData?.inFlight}
<div class="py-6 mx-auto max-w-7xl md:px-6">
	<div class="flex flex-col w-full my-8">
  <div class={' text-gray-1000 '}>
	<Banner message={getMessage($sbtcConfig.daoData?.inFlight)} bannerType={'info'}/>
</div>
</div>
</div>
{/if}