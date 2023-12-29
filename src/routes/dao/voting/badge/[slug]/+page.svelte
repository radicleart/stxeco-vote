<script lang="ts">
import { page } from "$app/stores";
import { onMount } from 'svelte';
import MetaData from '$lib/components/nft/MetaData.svelte';
import Canvas from '$lib/shared/Canvas.svelte';
import DaoUtils from '$lib/service/DaoUtils';
import { sbtcConfig } from "$stores/stores";
import { CONFIG } from "$lib/config";
import bns from '$lib/assets/bns.jpg'
import { getDaoVotesByProposalAndVoter, getNftAssetClasses, getNftsbyPage } from "$lib/dao_api";
import { loggedIn } from "$lib/stacks_connect";
import { goto } from "$app/navigation";

const voted = true;
const account = $sbtcConfig.keySets[CONFIG.VITE_NETWORK];
let votes: any[] = [];
let assetIdList: any[] = [];
let assetId:any;
$: offset = 0;
$: holdings = {
  total: 0,
  results: []
};;
$: currentPage = 0;
let pageSize = 10;
let loading = true;
const gateway = "https://hashone.mypinata.cloud/";
const gatewayAr = "https://arweave.net/";

const nextPage = async (init:boolean) => {
  if (init) {
    offset = 0;
    currentPage = 0;
  }
  loading = true;
  //const assetIdentifier = assetId?.contractAddress + '.' + assetId?.contractName + '::' + assetId?.assetName;
  //const url = CONFIG.VITE_BRIDGE_API + '/daoapi/v2/nft/' + account.stxAddress + '/' + assetIdentifier + '/' + offset + '/' + pageSize;
  //const res = await fetch(url).catch(error => {
  //  console.error('error was: ' + error);
  //});
  holdings = await getNftsbyPage(account.stxAddress, pageSize, offset)
  holdings.results = holdings.results.filter((o:any) => typeof o.metaData !== 'undefined')
  if (!init && holdings.total <= (currentPage * pageSize)) return;
  holdings.results.forEach((item:any) => {
    let image = item?.metaData?.image || '';
    if (image.startsWith('ipfs://')) {
      image = item.metaData.image.replace('ipfs://', gateway)
    } else if (image.startsWith('ipfs/')) {
      image = gateway + image;
    } else if (image.startsWith('ar://')) {
      image = item.metaData.image.replace('ar://', gatewayAr)
    }
    if (item && item.metaData) item.metaData.image = image;
  })
  offset += pageSize;
  currentPage++;
  loading = false;
}

const selectAssetId = () => {
  nextPage(true)
}

  let imageSrc:string = bns;
  let canvasMode = false;
  const selectItem = (event: any) => {
    const item = event.detail.item;
    imageSrc = item?.metaData?.image || bns;
    canvasMode = !canvasMode;
  }
  const toggleCanvas = () => {
    canvasMode = !canvasMode;
  }

  let sortedAssets: any[] = [];
  onMount(async () => {
    if (!loggedIn()) {
      goto('/')
      return
    }
    const contractId = $page.params.slug;
    // await nextPage(true)
    assetIdList = await getNftAssetClasses(account.stxAddress);
    assetIdList.forEach((o) => {
      sortedAssets.push({
        contractAddress: o.split('.')[0],
        contractName: o.split('.')[1].split('::')[0],
        assetName: o.split('.')[1].split('::')[1]
      })
    })
    sortedAssets = sortedAssets.sort(DaoUtils.dynamicSort('assetName'));
    //assetId = sortedAssets[0];
    //nextPage(true);

    votes = await getDaoVotesByProposalAndVoter(contractId, account.stxAddress)
  })
</script>


<svelte:head>
	<title>Ecosystem DAO</title>
	<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

<div class="py-6 mx-auto max-w-7xl md:px-6">
  <div class="flex flex-col w-full my-8">
    <div class="flex flex-col w-full border-[0.5px] border-gray-700 rounded-lg p-6 sm:p-10 overflow-hidden bg-gray-1000">
      <h1 class="text-4xl text-info"><span class="strokeme-info">Badge</span> Pickup</h1>
      {#if voted || votes.length > 0}<h2 class="text-center text-info my-4 mb-5">Thank you so much on voting on this Stacks Upgrade. <br/>You are now part of Stacks' history! 🎉</h2>{/if}
      {#if !canvasMode}
      <div class="mb-5">
        <select class="text-black h-10 w-1/2 ps-3 border rounded-lg" bind:value={assetId} on:change="{() => { selectAssetId() }}">
          <option class="" value={''}>Choose an NFT collection for your badge</option>
          {#each sortedAssets as asset}
          <option class="" value={asset}>{asset.assetName + ' (from collection: ' + asset.contractName + ')'}</option>
          {/each}
        </select>
      </div>
      {/if}
      <!--
      {#if voted || votes.length > 0}
      <div class="border rounded-lg border-gray-300 my-5 p-4">
        <p class="text-2xl">Make a badge</p>
        <ol class="list-decimal ms-10">
          <li>Select a collection</li>
          <li>Pick an NFT and align the banner</li>
          <li>Click the download icon</li>
          <li>Set the image as your profile pic!</li>
        </ol>
      </div>
      {/if}
      -->
          {#if holdings.total > 0}
            {#if canvasMode}
            <div class="row">
              <Canvas {imageSrc} on:toggle_canvas={toggleCanvas} hasVotes={voted || votes.length > 0}/>
            </div>
            {:else}
            <div class="flex justify-between">
              <p class="text-2xl">Step 1: Choose an NFT</p>
              <p class="text-primary-500"><a href="/" on:click|preventDefault={() => nextPage(false)}>page {currentPage} / {(Math.floor(holdings.total / pageSize)) + 1} ({holdings.total} NFTs)</a></p>
            </div>
            <div class="grid grid-cols-4">
              {#each holdings.results as item}
                <MetaData {item} on:select_item={selectItem}/>
              {/each}
            </div>
            {/if}
            <!--
            {:else}
            <div>
              <p>No NFTs for address: {account.stxAddress} on {currentNetork}</p>
              <p>Transfer an NFT to this address to claim a badge. Or vote with an address
                with NFTs already in the wallet.
              </p>
            </div>
            -->
          {/if}
    </div>
  </div>
</div>

<style>
</style>