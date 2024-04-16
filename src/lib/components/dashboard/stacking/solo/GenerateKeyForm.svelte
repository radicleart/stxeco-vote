<script lang="ts">
	import { createEventDispatcher, tick, onMount } from 'svelte';
	import { CONFIG } from '$lib/config';
	import { createStacksPrivateKey } from '@stacks/transactions';
	import { sbtcConfig } from '$stores/stores';
	import { getStacksNetwork } from '$lib/stacks_connect';
	import { signPox4SignatureHash, Pox4SignatureTopic } from '@stacks/stacking';
	import StackStxForm from './StackStxForm.svelte';
	import { verifySignerKeySig } from '$lib/signers_api';
	import Banner from '$lib/components/shared/Banner.svelte';
	import { updated } from '$app/stores';
	import type { VerifySignerKey } from '$types/signer_types';

	const dispatch = createEventDispatcher();

	const poxInfo = $sbtcConfig.poxInfo;
	let checkedAuthorisation = false
	let authorisationExists = false
	let verifyError: string|undefined;

	const updateField = (e:any, field:string) => {
		const val = e.currentTarget.value
		if (field === 'signerKey') keyParams[field] = val
		if (field === 'signerSignature') keyParams[field] = val
		sbtcConfig.update((conf) => {
			conf.signerSignature = keyParams
			return conf;
		})
	}

	let errorMessage: string | undefined;
	let keyParams = {
		authId: 12345,
		amount: $sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxBalance | 10000,
		maxAmount: $sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxBalance | 10000,
		rewardCycle: poxInfo.current_cycle.id,
		period: 2,
		topic: Pox4SignatureTopic.StackStx as string,
		rewardAddress: $sbtcConfig.keySets[CONFIG.VITE_NETWORK].cardinal,
		signerSignature: undefined,
		signerKey: undefined
	} as VerifySignerKey                                     

	let privateKey: string;

	const stacksTipHeight = $sbtcConfig.stacksInfo?.stacks_tip_height | 0;
	const burnHeight = $sbtcConfig.stacksInfo?.burn_block_height | 0;
	const topics = [
		Pox4SignatureTopic.StackStx,
		Pox4SignatureTopic.AggregateCommit,
		Pox4SignatureTopic.StackExtend,
		Pox4SignatureTopic.StackIncrease
	];
	const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

	const selectTopic = () => {};

	const signPox4 = async () => {
		if (!privateKey) {
			errorMessage = 'key needed';
		}
		const pk = createStacksPrivateKey(privateKey);
		const pox4SigOpts = {
			privateKey: pk,
			authId: keyParams.authId,
			maxAmount: keyParams.maxAmount,
			rewardCycle: keyParams.rewardCycle,
			period: keyParams.period,
			poxAddress: keyParams.rewardAddress,
			topic: Pox4SignatureTopic.StackStx,
			network: getStacksNetwork()
		};
		const signerInfo = signPox4SignatureHash(pox4SigOpts);
		sbtcConfig.update((conf) => {
			conf.signerSignature.signerSignature = signerInfo
			return conf;
		})
		dispatch('signer_signed_params');
	};

	const checkAuthorisation = async () => {
		verifyError = undefined; 
		if (!keyParams.signerKey) {
			verifyError = 'Your signing public key is required. You can find this in the key chain you generated when setting up the signer'
			return
		}
		const result = await verifySignerKeySig(keyParams)
		checkedAuthorisation = true;
		if (result.success) {
			authorisationExists = true;
		} else {
			verifyError = 'no authorisation exists for this stacking request'
		}
	}

	onMount(async () => {
		if ($sbtcConfig.signerSignature?.amount > 0 && $sbtcConfig.signerSignature?.signerKey) {
			keyParams = $sbtcConfig.signerSignature
		} else {
			sbtcConfig.update((conf) => {
				conf.signerSignature = keyParams
				return conf;
			})
		}
	});
</script>

<div>
	<div class="flex justify-center">
		<div class="flex flex-col gap-y-5 w-full">
			<div class="flex flex-col text-base font-extralight my-10">
				<div class="my-5"><span class="text-2xl font-medium">Authorisations</span></div>

				<div class="flex flex-col w-full text-base font-extralight mb-5">
					<label for="poxAddress">Bitcoin reward address</label>
					<input
						id="poxAddress"
						type="text"
						class="text-black p-3 rounded-md border"
						bind:value={keyParams.rewardAddress}
					/>
				</div>

				<div class="flex flex-col w-full text-base font-extralight mb-5">
					<label for="authId">Your auth id - from the signer binary config</label>
					<input
						id="authId"
						type="number"
						class="text-black p-3 rounded-md border"
						bind:value={keyParams.authId}
					/>
				</div>

				<div class="flex flex-col w-full text-base font-extralight mb-5">
					<label for="maxAmount">Max amount of STX to lock</label>
					<input
						id="maxAmount"
						type="number"
						class="text-black p-3 rounded-md border"
						bind:value={keyParams.maxAmount}
					/>
				</div>

				<div class="flex flex-col w-full text-base font-extralight mb-5">
					<label for="rewardCycle">Current reward cycle</label>
					<input
						id="rewardCycle"
						type="number"
						class="text-black p-3 rounded-md border"
						bind:value={keyParams.rewardCycle}
					/>
				</div>

				<div class="flex flex-col w-full text-base font-extralight mb-5">
					<label for="signerKey">signer key</label>
					<input
						id="signerKey"
						type="text"
						class="text-black p-3 rounded-md border"
						bind:value={keyParams.signerKey}
						on:input={(e) => updateField(e, 'signerKey')}
					/>
				</div>

				<div class="flex flex-col w-full text-base font-extralight mb-5">
					<label for="period">Number of cycles (1 to 12) ? </label>
					<select class="text-black h-10 w-full px-3 border rounded-lg" bind:value={keyParams.period}>
						<option value={''}>Change stacking method</option>
						{#each periods as periodOpt}
							<option value={periodOpt} selected={periodOpt === keyParams.period}>{periodOpt}</option>
						{/each}
					</select>
				</div>

				<div class="flex flex-col w-full text-base font-extralight mb-5">
					<label for="topic">Authorisation for stacking method: {keyParams.topic}</label>
				</div>
				<div class="flex flex-col w-full text-base font-extralight mb-5">
					<select
						class="text-black h-10 w-full px-3 border rounded-lg"
						bind:value={keyParams.topic}
						on:change={() => {
							selectTopic();
						}}
					>
						<option value={''}>Change stacking method</option>
						{#each topics as topicOpt}
							<option value={topicOpt} selected={topicOpt === keyParams.topic}>{topicOpt}</option>
						{/each}
					</select>
				</div>
				
				{#if checkedAuthorisation}
				<div class="my-2"><Banner bannerType={'danger'} message={'FOR TEST PURPOSES ONLY !'} /></div>
				<div class="flex flex-col w-full text-base font-extralight mb-5">
					<label for="privateKey">Enter you private key to generate an authorisation and store in the pox4 contract</label>
					<input
						id="privateKey"
						type="text"
						class="text-black p-3 rounded-md border"
						bind:value={privateKey}
					/>
				</div>

				<div class="flex justify-start w-full">
					<button on:click={() => {errorMessage = undefined; signPox4(); }} class="justify-center w-auto md:inline-flex items-center gap-x-1.5 bg-success-01 px-4 py-2 rounded-xl border border-black bg-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
						Authorise signer key and stacking data
					</button>
				</div>

				{:else}

				{#if verifyError}
				<div class="my-2"><Banner bannerType={'warning'} message={verifyError} /></div>
				{/if}

				<div class="flex justify-start w-full">
					<button on:click={() => checkAuthorisation() } class="justify-center w-auto md:inline-flex items-center gap-x-1.5 bg-success-01 px-4 py-2 rounded-xl border border-black bg-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
						Check for authorisation
					</button>
				</div>

				{/if}
			</div>
		</div>
	</div>
</div>

<style>
</style>
