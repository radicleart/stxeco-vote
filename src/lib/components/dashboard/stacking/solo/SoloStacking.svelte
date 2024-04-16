<script lang="ts">
	import { onMount } from 'svelte';
	import { sbtcConfig } from '$stores/stores';
	import StackStxForm from './StackStxForm.svelte';
	import GenerateKeyForm from './GenerateKeyForm.svelte';

	let errorMessage: string | undefined;
	let method: string | undefined;
	let showForm = false;

	const addSignature = (e:any) => {
		showForm = false
		method = $sbtcConfig.signerSignature.topic
	}

	onMount(async () => {
		if ($sbtcConfig.signerSignature?.signerSignature) {
			method = $sbtcConfig.signerSignature.topic
		}
	});
</script>

<div>
	<div class="flex justify-center">
		<div class="flex flex-col gap-y-5 w-full">
			<div class="flex flex-col text-base font-extralight my-10">
				<div class="my-5"><span class="text-2xl font-medium">Solo stacking</span></div>
				<div class="my-5">
					<p class="mb-2 text-1xl font-medium">In order to call the stacking contract you'll need to
						generate a digital signature over the data below.
						This signature lets the contract know the stacks 
						account where stx is to be locked and 
						bitcoin reward address to send the payouts to.
					</p>
					<p>See the <a class="underline text-bloodorange" href="https://docs.stacks.co/nakamoto-upgrade/signing-and-stacking/stacking-flow" target="_blank">official docs</a> for more information</p>
				</div>

				{#if $sbtcConfig.signerSignature?.signerSignature}

				<div class="my-5">
					<div class="flex justify-between my-5 gap-x-2">
						<button on:click={() => { errorMessage = undefined; method = 'stack-stx';}} class="w-full justify-center md:inline-flex items-center gap-x-1.5 bg-success-01 px-4 py-2 rounded-xl border border-black bg-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
							Stack STX
						</button>
						<button on:click={() => { errorMessage = undefined; method = 'stack-increase-stx';}} class="w-full justify-center md:inline-flex items-center gap-x-1.5 bg-success-01 px-4 py-2 rounded-xl border border-black bg-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
							Increase stacks STX
						</button>
						<button on:click={() => { errorMessage = undefined; method = 'stack-extend-stx';}} class="w-full justify-center md:inline-flex items-center gap-x-1.5 bg-success-01 px-4 py-2 rounded-xl border border-black bg-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
							Extend stacking
						</button>
					</div>
				</div>

				{#if method === 'stack-stx'}
				<StackStxForm />
				{:else if method === 'stack-increase-stx'}
				<StackStxForm />
				{:else if method === 'stack-extend-stx'}
				<StackStxForm />
				{/if}

				{:else}
				<p>In order to solo stack you need to generate a signature to prove you own the public. 
					Since generating a signature requires a private key there are a couple of things to 
					consider</p>
					<ol class="m-5">
						<li class="list-disc list-item my-2">do this here if you understand what you are doing and intend to 
							generate a new key pair for stacking on mainnet</li>
						<li class="list-disc list-item my-2">generate the signature independently and store it in pox-4 
							contract - we can check if you have already authorised your signing key</li>
						<li class="list-disc list-item my-2">wait for wallet support to generate your signature</li>
					</ol>
				<p>
					<a class="text-bloodorange" href="/" on:click|preventDefault={() => showForm = !showForm} >Click here to check or generate a signature</a>
				</p>

				{#if showForm}
				<GenerateKeyForm on:signer_signed_params={addSignature}/>
				{/if}

				{/if}

			</div>
		</div>
	</div>
</div>

<style>
</style>
