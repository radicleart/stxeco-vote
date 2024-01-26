<script>
import WalletConnectButton from '$lib/header/WalletConnectButton.svelte'

</script>

<div class="my-5 container bg-card p-5 text-white">
	<h4><span class="strokeme-white">Log In</span> to Continue</h4>
	<p class="mt-3 text-warning">Please connect your Stacks Wallet to continue</p>
	<p class="text-warning"><WalletConnectButton /></p>

	<p class="mt-5">Download <a href="https://wallet.hiro.so/#download" target="_blank">Stacks web wallet</a></p>
	<p>Download <a href="https://www.xverse.app/" target="_blank">Xverse wallet</a></p>

	<p class="mt-5">There are several types</p>
	<ul>
		<li>Desktop wallet</li>
		<li>Web wallet (aka browser extension wallet)</li>
		<li>Mobile wallet (android/iphone)</li>
	</ul>
	<p>
	 You need the web wallet to interract with
	 decentralised applications like this one.</p>
</div>

<style>
</style>