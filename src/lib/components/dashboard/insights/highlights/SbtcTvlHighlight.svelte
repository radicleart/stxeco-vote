
<script lang="ts">
	import { fmtNumber, satsToBitcoin } from '$lib/utils';
	import { sbtcConfig } from '$stores/stores';

	let showFiat = true

	const tvl = (showFiat:boolean) => {
		if (showFiat) {
			const currency = $sbtcConfig.userSettings.currency.myFiatCurrency;
			const tvlSBTC = satsToBitcoin($sbtcConfig.sbtcContractData.totalSupply || 0)
			return currency.symbol + fmtNumber(currency.fifteen * tvlSBTC || 0) + ' ' + currency.currency
		} else {
			const tvlSBTC = satsToBitcoin($sbtcConfig.sbtcContractData.totalSupply || 0)
			return fmtNumber(tvlSBTC) + ' sBTC'
		}
	}

</script>
<div class="flex flex-col gap-y-5">
	<dl class="min-w-0 flex-1" on:mouseenter={() => showFiat = false}  on:mouseleave={() => showFiat = true}>
		<dt class="text-xl font-bold leading-none text-yellow-500">Total value locked</dt>
	</dl>
	<div class="flex flex-col items-center justify-center gap-y-10">
		<dl class="min-w-0 flex-1" on:mouseenter={() => showFiat = false}  on:mouseleave={() => showFiat = true}>
			<dd class="mt-1 text-4xl font-bold leading-none text-transparent bg-clip-text bg-sbtc-primary-02">
			{tvl(false)}
			</dd>
		</dl>
		<dl class="min-w-0 flex-1" on:mouseenter={() => showFiat = false}  on:mouseleave={() => showFiat = true}>
			<dd class="mt-1 text-4xl font-bold leading-none text-transparent bg-clip-text bg-sbtc-primary-02">
			{tvl(true)}
			</dd>
		</dl>
	</div>
</div>