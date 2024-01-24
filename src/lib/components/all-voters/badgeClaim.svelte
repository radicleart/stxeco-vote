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
    import BannerWithSpinner from "$lib/shared/BannerWithSpinner.svelte";
    import Banner from "$lib/components/shared/Banner.svelte";
    import type { ProposalEvent } from "$types/stxeco.type";
    
    export let proposal:ProposalEvent;
    const voted = true;
    const account = $sbtcConfig.keySets[CONFIG.VITE_NETWORK];
    let votes: any[] = [];
    let assetIdList: any[] = [];
    let assetId:any;
    let componentKey = 0
    let noAssets = true;
    let searching = true;
    $: offset = 0;
    let assets: any[] = []
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
      searching = true;
      if (init) {
        offset = 0;
        currentPage = 0;
      }
      loading = true;
      assets = []
    
      holdings = await getNftsbyPage(account.stxAddress, assetId, pageSize, offset)
      holdings.results = holdings.results.filter((o:any) => typeof o.metaData !== 'undefined')
      if (!init && holdings.total <= (currentPage * pageSize)) return;
      holdings.results.forEach((item:any) => {
        let image = item?.metaData?.image || '';
        if (image.startsWith('ipfs://')) {
          image = item.metaData.image.replace('ipfs://', gateway + 'ipfs/')
        } else if (image.startsWith('ipfs/')) {
          image = gateway + image;
        } else if (image.startsWith('ar://')) {
          image = item.metaData.image.replace('ar://', gatewayAr)
        }
        if (item && item.metaData) {
          item.metaData.image = image;
          assets.push(item)
        }
      })
      offset += pageSize;
      componentKey++;
      currentPage++;
      loading = false;
      searching = false;
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
        const contractId = $page.params.slug;
        // await nextPage(true)
        assetIdList = await getNftAssetClasses(account.stxAddress);
        if (assetIdList && assetIdList.length > 0) {
          assetIdList.forEach((o) => {
            sortedAssets.push({
              contractAddress: o.split('.')[0],
              contractName: o.split('.')[1].split('::')[0],
              assetName: o.split('.')[1].split('::')[1]
            })
          })
          sortedAssets = sortedAssets.sort(DaoUtils.dynamicSort('assetName'));
          votes = await getDaoVotesByProposalAndVoter(contractId, account.stxAddress)
          noAssets = false;
        }
      })
</script>

{#if !noAssets}
<div>
  {#if !canvasMode}
  <div class="my-5">
    <p class="text-2xl mb-2">Select collection</p>
    <select class="text-black h-10 w-1/2 ps-3 border rounded-lg" bind:value={assetId} on:change="{() => { selectAssetId() }}">
      <option value={''}>Choose an NFT collection for your badge</option>
      {#each sortedAssets as asset}
      <option value={asset}>{asset.assetName + ' (from collection: ' + asset.contractName + ')'}</option>
      {/each}
    </select>
  </div>
  {/if}
  {#key componentKey}
      {#if assets.length > 0}
        {#if canvasMode}
          <div class="row">
            <Canvas {imageSrc} on:toggle_canvas={toggleCanvas} hasVotes={voted || votes.length > 0}/>
          </div>
        {:else}
          <div class="flex justify-between">
            <p class="text-2xl">Select NFT</p>
            <!-- <p class="text-primary-500"><a href="/" on:click|preventDefault={() => nextPage(false)}>page {currentPage} / {(Math.floor(holdings.total / pageSize)) + 1} ({holdings.total} NFTs)</a></p>-->
          </div>
          <div class="grid grid-cols-4">
            {#each assets as item}
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
      {:else if assetId}
      <div class="w-1/2">
        {#if searching}
        <BannerWithSpinner bannerType={'warning'} message={'Searching your NFTs'}/>
        {:else}
        <Banner bannerType={'warning'} message={'No nfts found'}/>
        {/if}
      </div>
      {/if}
  {/key}
</div>
{/if}
