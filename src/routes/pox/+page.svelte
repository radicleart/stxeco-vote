<script lang="ts">
	import Banner from '$lib/components/shared/Banner.svelte';
	import NakamotoBackground from '$lib/components/shared/NakamotoBackground.svelte';
	import NakamotoShield from '$lib/components/shared/NakamotoShield.svelte';
	import { getPoxInfo } from '$lib/pox_api';
	import { onMount } from 'svelte';

  let poxInfo:any;

  onMount(async () => {
    poxInfo = await getPoxInfo()
  })

</script>

<svelte:head>
    <title>Ecosystem DAO</title>
    <meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

<div>
  <div class="flex flex-col w-full my-8 bg-[#F4F3F0] rounded-2xl">
    <div class="py-10 px-10 md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
      <div class="mt-6 md:mt-0 flex flex-col gap-y-2 bg-warning-01">
        <div class="mb-4">
          <h2 class="text-[#131416] text-2xl mb-3">Voting as Non Stackers (Method 3)</h2>
        </div>
        <div class="mb-4 rounded-lg relative bg-[#E6E4E2] px-6 py-6 space-y-3 max-w-xl">
          <p>Vote with your liquid STX balance using your Leather / Xverse wallet.</p>
        </div>
        <div class="mb-3 max-w-xl">
          <Banner bannerType={'warning'} message={'No STX will be spent by voting but you will pay a gas fee.'} />
        </div>
        <div>
          body text
        </div>
      </div>

      <NakamotoBackground />
      <NakamotoShield />
    </div>
  </div>
</div>
