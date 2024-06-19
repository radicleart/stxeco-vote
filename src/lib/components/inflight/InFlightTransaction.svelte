<script lang="ts">
	import { sessionStore } from '$stores/stores';
	import Banner from '../../ui/Banner.svelte';
	import { explorerTxUrl } from '$lib/utils';
	import { onMount } from 'svelte';
	import { getTransaction } from '$lib/admin';

	let status:string = 'pending';
    const getMessage = (inFlight:any) => {
		return `${inFlight.name} transaction sent (status ${status}) - <a href="${explorerTxUrl(inFlight.txid)}" target="_blank"> view on explorer</a>`
	}

	onMount(async () => {
		if (sessionStore.daoData?.inFlight) {
			const txid  = $sessionStore.daoData?.inFlight.txid
			if (typeof txid === 'string') {
				const myint = setInterval(async () => {
					const tx = await getTransaction(txid)
					status = tx.tx_status
					if (tx.tx_status === 'success') {
						sessionStore.update((conf:SessionStore) => {
							if (!conf.daoData) conf.daoData = {} as InFlight;
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

{#if sessionStore.daoData?.inFlight}
<div class="py-6 mx-auto max-w-7xl md:px-6">
	<div class="flex flex-col w-full my-8">
  <div class={' text-gray-1000 '}>
	<Banner message={getMessage(sessionStore.daoData?.inFlight)} bannerType={'info'}/>
</div>
</div>
</div>
{/if}