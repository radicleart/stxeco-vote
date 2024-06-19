<script lang="ts">
import DaoUtils from '$lib/service/DaoUtils';
import ChainUtils from '$lib/service/ChainUtils';
import FormatUtils from '$lib/service/FormatUtils';
import { onMount } from 'svelte';
	import { sessionStore } from '$stores/stores';
	import { ArrowDown, ArrowUp, Icon } from 'svelte-hero-icons';
	import { CaretLeftOutline, CaretRightOutline } from 'flowbite-svelte-icons';
	import { getConfig } from '$stores/store_helpers';

const account = $sessionStore.keySets[getConfig().VITE_NETWORK];

export let method2a:any;

let showVotes = false;
let componentKey = 0;
const color = 'warning';
const totalVotePower = FormatUtils.fmtNumber(Math.floor(ChainUtils.fromMicroAmount(method2a.countFor + method2a.countAgainst)));
const totalAccounts = method2a.numbVotesFor + method2a.numbVotesAgainst;
const scrollTop = () => {
  const getMeTo = document.getElementById("page-header");
  if (getMeTo) getMeTo.scrollIntoView({behavior: 'smooth'});
}

const inFavour = Number(((method2a.countFor / (method2a.countFor + method2a.countAgainst)) * 100).toFixed(2));
const vAg = FormatUtils.fmtNumber(Math.floor(ChainUtils.fromMicroAmount(method2a.countAgainst)));
const vFr = FormatUtils.fmtNumber(Math.floor(ChainUtils.fromMicroAmount(method2a.countFor)));

let winning = 'danger';
if (inFavour > 80) {
  winning = 'success';
}

let sortDir = '';
let sortField = 'for';
const reorder = (sf:string) => {
    sortField = sf;
    sortDir = (sortDir === '-') ? '' : '-';
    componentKey++;
}

const votes: any[] = []
onMount(async () => {
  for (const [key, value] of Object.entries(method2a.votes)) {
    value.forEach((val) => {
      if (val.stxBalance.locked > 0) {
        votes.push({
          address: key,
          locked: Number(val.stxBalance.locked),
          block_height: val.block_height,
          for: val.token_transfer.recipient_address === 'SP00000000000003SCNSJTCHE66N2PXHX'
        })
      }
    })
  }
})

$: sortedEvents = votes.sort(DaoUtils.dynamicSort(sortDir + sortField));
</script>

<section class="bg-card my-5 p-4">
  <div class="row">
    <div class="cols-12"><h1 class={'text-' + color}><span>Method 2: Stacking in a Pool</span>
    <span class="css-1wdxw4w"><svg viewBox="0 0 812 812" focusable="false" class="chakra-icon css-1wdxw4w"><path fill-rule="evenodd" clip-rule="evenodd" d="M406 812C630.228 812 812 630.228 812 406C812 181.772 630.228 0 406 0C181.772 0 0 181.772 0 406C0 630.228 181.772 812 406 812ZM583 394.451V351.353H477.186L551.494 239H495.317L405.851 374.536L316.683 239H260.506L334.814 351.353H229V394.748H583V394.451ZM550.305 593L475.106 479.161H583V436.36H229V479.458H336.894L261.695 593H317.574L405.851 459.247L494.128 593H550.305Z" fill="white"></path></svg></span>
    </h1></div>
    <div class="cols-12"><h4 class="text-white">Total voting power is <span class="text-warning">{totalVotePower}</span> with votes cast from <span class="text-warning">{totalAccounts}</span> accounts.</h4></div>
    <div class="cols-12"><p class="text-white"><a href="https://sip015.xyz/">Voting now closed</a></p></div>
  </div>
  <div class="my-5 p-4">
    <div class={'mt-5 row text-' + color}>
      <div class="col-md-6 col-sm-12 text-center mb-5">
        <h4 class="text-big text-center text-success">{vFr} <span class="text-white" style="font-size: 2.2rem;">YES ON 2.1</span></h4>
        <h6 class="text-center text-success">from {method2a.numbVotesFor} accounts</h6>
      </div>
      <div class="col-md-6 col-sm-12 text-center mb-5">
        <h4 class="text-big text-center text-danger">{vAg} <span class="text-white" style="font-size: 2.2rem;">NO ON 2.1</span></h4>
        <h6 class="text-center text-danger">from {method2a.numbVotesAgainst} accounts</h6>
      </div>
    </div>
    <div class={' mb-4 d-flex justify-content-around text-' + winning}>
      <div class="text-big text-center" style="font-size: 2.2rem;">
        <span class="text-big text-center">{inFavour}%</span> <span class="text-white"> in favour of this proposal</span>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="cols-12 text-end my-3">
      <p class="w-100 text-right">
        <a href="/" class={'text-white'} on:click|preventDefault={() => { showVotes = !showVotes }}>{#if showVotes}<Icon src={CaretLeftOutline} />{:else}<Icon src={CaretRightOutline} />{/if} transactions</a>
        <a href="/" class="pointer text-akrobat-thin" on:click|preventDefault={() => scrollTop()}><img class="mx-2" src="/img/png-assets/stx_eco_arrow_up.png" alt="Scroll down" width="20" height="auto" /></a>
      </p>
    </div>
  </div>
  
  {#if showVotes}
  <div class="row">
    <div class="cols-12 my-3">
      <table class="table text-white">
        <thead>
          <tr>
            <th scope="col" class="pointer" on:click={() => reorder('address')}>{#if sortDir}<Icon src={ArrowUp} />{:else}<Icon src={ArrowDown} />{/if} Voter</th>
            <th scope="col" class="pointer" on:click={() => reorder('locked')}>{#if sortDir}<Icon src={ArrowUp} />{:else}<Icon src={ArrowDown} />{/if} Power</th>
            <th scope="col" class="pointer" on:click={() => reorder('block_height')}>{#if sortDir}<Icon src={ArrowUp} />{:else}<Icon src={ArrowDown} />{/if} Height</th>
            <th scope="col" class="pointer" on:click={() => reorder('for')}>{#if sortDir}<Icon src={ArrowUp} />{:else}<Icon src={ArrowDown} />{/if} For/Against</th>
          </tr>
        </thead>
        <tbody>
      {#key componentKey}
      {#each sortedEvents as vote}
        <tr>
        <th scope="row" class={(vote.address === account.stxAddress) ? 'text-success' : ''} title={'I voted!'}>{vote.address}</th>
        <td class="py-3">{@html ChainUtils.fromOnChainAmount(vote.locked)}</td>
        <td class="py-3">{vote.block_height}</td>
        <td class="py-3">{@html (vote.for) ? '<span class="text-warning">for</span>' : 'against'}</td>
      </tr>
      {/each}
      {/key}
  </tbody>
</table>
</div>
</div>
{/if}
</section>

<style>
  .text-big {
    font-size: 2.0rem;
  }
  h1 {
    font-size: 1.8rem;
  }
section {
}
.part0 {
  font-size: 1.2rem;
  font-weight: 700;
}
.part1 {
  font-size: 1.2rem;
  font-weight: 700;
}
.text-big {
    font-size: 2.0rem;
}
.css-1wdxw4w {
    width: 2.0rem;
    height: 2.0rem;
    display: inline-block;
    line-height: 1em;
    flex-shrink: 0;
    color: rgb(85, 70, 255);
    vertical-align: middle;
    margin-inline-start: 2px;
}
</style>
