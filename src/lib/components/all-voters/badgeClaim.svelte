<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from 'svelte';
    import MetaData from '$lib/components/nft/MetaData.svelte';
    import Canvas from '$lib/components/shared/Canvas.svelte';
    import DaoUtils from '$lib/service/DaoUtils';
    import { sbtcConfig } from "$stores/stores";
    import { CONFIG } from "$lib/config";
    import bns from '$lib/assets/bns.jpg'
    import { getDaoVotesByProposalAndVoter, getNftAssetClasses, getNftsbyPage } from "$lib/dao_api";
    import Banner from "$lib/components/shared/Banner.svelte";

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

      //holdings = await getNftsbyPage('ST1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28G8HXK9G5', assetId, pageSize, offset)
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
        //assetIdList = await getNftAssetClasses('ST1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28G8HXK9G5');
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
          //votes = await getDaoVotesByProposalAndVoter(contractId, 'ST1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28G8HXK9G5')
          votes = await getDaoVotesByProposalAndVoter(contractId, account.stxAddress)
          noAssets = false;
        }
      })
</script>

{#if !noAssets}
  <div class="mb-4 rounded-lg relative bg-[#E6E4E2] px-6 py-6 max-w-xl">
    {#if canvasMode}
      <div>
        <p class="mb-3">Create a personalized badge featuring a Stacks banner overlaying one of your NFTs, showcasing your active participation in the Stacks community.</p>
        <p class="mb-3">Select the desired banner to place atop your NFT. Once chosen, adjust the banner's position to your liking and proceed to download your customized badge. You can also preview it as a circle to visualize how it will appear as a social media avatar.</p>
        <Canvas {imageSrc} on:toggle_canvas={toggleCanvas} hasVotes={voted || votes.length > 0}/>
      </div>
    {:else}
      <p class="mb-3">Create a personalized badge featuring a Stacks banner overlaying one of your NFTs, showcasing your active participation in the Stacks community.</p>
      <p>Let’s start with choosing a collection:</p>
      <p class="text-base mt-3 mb-1">NFT collection</p>
      <select class="text-black h-10 w-full px-3 border rounded-lg" bind:value={assetId} on:change="{() => { selectAssetId() }}">
        <option value={''}>Choose an NFT collection</option>
        {#each sortedAssets as asset}
          <option value={asset}>{asset.assetName + ' (from collection: ' + asset.contractName + ')'}</option>
        {/each}
      </select>

      {#key componentKey}
        {#if assetId && assets.length === 0}
        <div class="w-full mt-2">
          {#if searching}
            <Banner bannerType={'waiting'} message={'Loading your NFTs...'}/>
          {:else}
            <Banner bannerType={'warning'} message={'No NFTs found'}/>
          {/if}
        </div>
        {/if}
      {/key}

      {#if assets.length > 0}
        {#key componentKey}
          <p class="text-base mt-3 mb-1">Select the NFT</p>
          <div class="grid grid-cols-4 gap-2 mt-2">
            {#each assets as item}
              <MetaData {item} on:select_item={selectItem}/>
            {/each}
          </div>
        {/key}
      {/if}
    {/if}
  </div>
{/if}
