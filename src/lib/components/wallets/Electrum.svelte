<script lang="ts">
import electrum1 from '$lib/assets/wallets/electrum1.png';
import electrum2 from '$lib/assets/wallets/electrum2.png';
import electrum3 from '$lib/assets/wallets/electrum3.png';
import { explorerBtcAddressUrl } from "$lib/utils";
	import { getConfig } from '$stores/store_helpers';
import { sessionStore } from '$stores/stores';

const network = getConfig().VITE_NETWORK;
const from = $sessionStore.keySets[getConfig().VITE_NETWORK].cardinal
const getExplorerUrl = () => {
  return explorerBtcAddressUrl(from!)
}
</script>

<div>
  <div class="my-4">
    <h4>Intro.</h4>
    <p>The transaction has been copied to the clipboard.</p>
    <p>This flow has been tested with Electrum 4.3.3.</p>
    <p>Once sent the transaction will show up on the <a href={getExplorerUrl()} target="_blank" rel="noreferrer">explorer</a></p>
    {#if network === 'testnet'}
    <p class="text-small">Testnet Hint: /Applications/Electrum.app/Contents/MacOS/run_electrum --testnet</p>
    {/if}
  </div>
  <div class="slide">
    <h4>1. Paste the Transaction.</h4>
    <p>Paste the transaction into your Electrum wallet</p>
    <img src={electrum1} alt="night time" />
  </div>
  <div>
    <img src={electrum2} alt="night time" />
  </div>
  <div class="slide">
    <h4>2. Sign the Transaction.</h4>
    <img src={electrum2} alt="night time" />
  </div>
  <div class="slide">
    <h4>3. Broadcast the Transaction.</h4>
    <p><span class="text-warning">Note: Double check your wallet displays the correct recipient and amount.</span></p>
    <img src={electrum3} alt="night time" />
  </div>
</div>

<style>
img {
  width: 100%;
}
</style>