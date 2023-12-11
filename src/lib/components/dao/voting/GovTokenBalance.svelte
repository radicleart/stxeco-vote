<script lang="ts">
	import { CONFIG } from '$lib/config';
	import { EXTENSIONS, getGovernanceData } from '$lib/sbtc_admin';
	import { sbtcConfig } from '$stores/stores';
	import type { GovernanceData } from '$types/stxeco.type';
	import { onMount } from 'svelte';

  const governanceExt = EXTENSIONS['ede006-treasury'];
  const governance = governanceExt //&& governanceExt.valid;

  let govData:GovernanceData;
  let totalSupply:number;
  let tokenBalance:number;
  let tokenBalanceLocked:number;
  let totalDelegatedToMe:number;

	onMount(async () => {
    govData = await getGovernanceData($sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress ) //$settings.daoProperties?.find((o) => o.id === 'get-total-supply')?.value || 0;
    totalSupply = govData.totalSupply;
    tokenBalance = govData.userBalance
    tokenBalanceLocked = govData.userLocked
    totalDelegatedToMe = 0 //$settings.userProperties?.find((dp) => dp.functionName === 'edg-get-total-delegated')?.value?.value || 0
  })
</script>

<section class="bg-dark text-white p-4 my-4">
    {#if governance}
    <div class="row mt-5">
      <div class="col-12">
        <div class="row">
          <div class="col-md-4 col-sm-12">Unlocked</div>  
          <div class="col-md-6 col-sm-12">{ tokenBalance }</div>  
        </div>
        <div class="row">
          <div class="col-md-4 col-sm-12">locked</div>  
          <div class="col-md-6 col-sm-12">{ tokenBalanceLocked }</div>  
        </div>
        <div class="row">
          <div class="col-md-4 col-sm-12">delegated</div>  
          <div class="col-md-6 col-sm-12">{ totalDelegatedToMe }</div>  
        </div>
        <div class="row">
          <div class="col-md-4 col-sm-12">Total Supply:</div>  
          <div class="col-md-6 col-sm-12">{ totalSupply }</div>  
        </div>
      </div>  
    </div>
    {/if}
</section>

<style>
</style>
