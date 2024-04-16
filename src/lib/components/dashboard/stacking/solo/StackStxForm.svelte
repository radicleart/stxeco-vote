<script lang="ts">
	import { PostConditionMode } from 'micro-stacks/transactions';
	import { createEventDispatcher, tick, onMount } from 'svelte';
	import { CONFIG } from '$lib/config';
	import { bufferCV, noneCV, stringAsciiCV, tupleCV, uintCV } from '@stacks/transactions';
	import { showContractCall } from '@stacks/connect';
	import { sbtcConfig } from '$stores/stores';
	import { getStacksNetwork } from '$lib/stacks_connect';
	import { hex } from '@scure/base';
	import { explorerTxUrl, getHashBytesFromAddress } from '$lib/utils';
	import Banner from '$lib/components/shared/Banner.svelte';

	const stackStxParams = $sbtcConfig.signerSignature;

	let errorMessage: string | undefined;
	let txId: string | undefined;

	const stackStx = async () => {
		const auth = $sbtcConfig.signerSignature
		const poxAddress = getHashBytesFromAddress(auth.rewardAddress)
		const functionArgs = [
			tupleCV({version: bufferCV(hex.decode(poxAddress!.version)), hashbytes: bufferCV(hex.decode(poxAddress!.hashBytes))}),
			uintCV(auth.rewardCycle),
			stringAsciiCV(auth.topic),
			uintCV(auth.period),
			noneCV(),
			bufferCV(hex.decode(auth.signerKey!)),
			uintCV(auth.amount),
			uintCV(auth.maxAmount),
			uintCV(auth.authId),
		];
		const network = getStacksNetwork();
        await showContractCall({
            network,
            postConditions: [],
            postConditionMode: PostConditionMode.Deny,
            contractAddress: CONFIG.VITE_POX4_CONTRACT_ID.split('.')[0],
            contractName: CONFIG.VITE_POX4_CONTRACT_ID.split('.')[1],
            functionName: 'stack-stx',
            functionArgs,
            onFinish: (data:any) => {
              txId = data.txId
              console.log('finished contract call!', data);
            },
            onCancel: () => {
              console.log('popup closed!');
            }
        });
	};

	onMount(async () => {
		await tick();
	});
</script>

<div>
	<div class="flex justify-center">
		<div class="flex flex-col gap-y-5 w-full">
			<div class="flex flex-col text-base font-extralight my-10">
				<div class="my-5">
					<h3 class="text-2xl font-medium">Stack STX</h3>
					<p>You have authorised the following stacking data - your request will be rejected if you do ot meet the minimum threshold requirement</p>
				</div>

				{#if txId}
				<div class="my-2"><Banner bannerType={'info'} message={'Transaction in flight : <a href="' + explorerTxUrl(txId) + '" target="_blank">view on explorer</a>'} /></div>
				{/if}

				<div class="flex flex-col w-full text-base font-extralight mb-5">
					<label for="maxAmount">Amount of STX to lock. Denoted in ustx (1 stx = 1,000,000 ustx)</label>
					<input
						readonly
						id="maxAmount"
						type="number"
						class="text-black p-3 rounded-md border"
						bind:value={stackStxParams.amount}
					/>
				</div>
				<div class="flex flex-col w-full text-base font-extralight mb-5">
					<label for="poxAddress">Bitcoin reward address. The BTC wallet to receive Stacking rewards</label>
					<input
						readonly
						id="poxAddress"
						type="text"
						class="text-black p-3 rounded-md border"
						bind:value={stackStxParams.rewardAddress}
					/>
				</div>
				<div class="flex flex-col w-full text-base font-extralight mb-5">
					<label for="period">Lock period - the number of cycles to lock over - min 1 up to 12 cycles</label>
					<input
						readonly
						id="period"
						type="text"
						class="text-black p-3 rounded-md border"
						bind:value={stackStxParams.period}
					/>
				</div>
				<div class="flex flex-col w-full text-base font-extralight mb-5">
					<label for="period">Start block height - passes the current burn block height</label>
					<input
						readonly
						id="rewardCycle"
						type="text"
						class="text-black p-3 rounded-md border"
						bind:value={stackStxParams.rewardCycle}
					/>
				</div>
				<div class="flex flex-col w-full text-base font-extralight mb-5">
					<label for="authId">Signer key: the public key that your signer is using</label>
					<input
						readonly
						id="signerKey"
						type="text"
						class="text-black p-3 rounded-md border"
						bind:value={stackStxParams.signerKey}
					/>
				</div>
				<div class="flex flex-col w-full text-base font-extralight mb-5">
					<label for="authId">Signer signature: the signature that proves control of this signer key</label>
					<input
						readonly
						id="signerKey"
						type="text"
						class="text-black p-3 rounded-md border"
						bind:value={stackStxParams.signerSignature}
					/>
				</div>
				<div class="flex flex-col w-full text-base font-extralight mb-5">
					<label for="maxAmount">Max amount of STX to lock (in ustx) as passed to generate the signature</label>
					<input
						id="maxAmount"
						readonly
						type="number"
						class="text-black p-3 rounded-md border"
						bind:value={stackStxParams.maxAmount}
					/>
				</div>
				<div class="flex flex-col w-full text-base font-extralight mb-5">
					<label for="authId">Your auth id - from the signer binary config</label>
					<input
						id="authId"
						readonly
						type="number"
						class="text-black p-3 rounded-md border"
						bind:value={stackStxParams.authId}
					/>
				</div>
				
				<div class="flex justify-start">
					<button
						on:click={() => {
							errorMessage = undefined;
							stackStx();}} class="justify-center w-[150px] md:inline-flex items-center gap-x-1.5 bg-success-01 px-4 py-2 rounded-xl border border-black bg-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
						Stack STX
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
</style>
