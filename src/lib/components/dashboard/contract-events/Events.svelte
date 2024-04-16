<script lang="ts">
  import { onMount } from 'svelte';
  import { Skeleton, Tabs, TabItem } from 'flowbite-svelte';
  import { page } from '$app/stores';
  import { COMMS_ERROR } from '$lib/utils.js'
  import { sbtcConfig } from '$stores/stores';
  import { CONFIG } from '$lib/config';
	import EventRow from './EventRow.svelte';
	import Paging from './Paging.svelte';
	import EventHeader from './EventHeader.svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import type { PoolStackerEvent } from '$types/stxeco.type';
	import { aggregateDelegationData, findPoolStackerEvents, findPoolStackerEventsByEvent, findPoolStackerEventsByStacker } from '$lib/pox4_api';
	import DaoUtils from '$lib/service/DaoUtils';
	import { ArrowsUpDown, AdjustmentsHorizontal, Icon, MagnifyingGlassCircle } from 'svelte-hero-icons';
	import EventFilters from './EventFilters.svelte';
	import DaoResults from '$lib/components/all-voters/dao-voting/DaoResults.svelte';

  
  export let mode:string;
  let inited = false;
  let events:Array<PoolStackerEvent> = []
  let errorReason:string|undefined;
  let details:boolean = false;
  let searching:boolean = false;
  let showMenu = false
  
  const limit = 40;
  let numPages = 0;
  let total = 0;
  let stxAddress = $sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress
	let sortDir = '';
	let sortField = 'locked';
  
	let filterTopic:string|undefined;
	let filterDelegator:string|undefined;

  $: activeClass = (!details) ? 'text-bloodorange h-7 w-7 text-white border-none' : 'h-7 w-7 text-white border-none'

  const reorder = (ev:any) => {
		sortField = ev.detail.field;
		sortDir = (sortDir === '-') ? '' : '-';
	}

  const changeFilters = async (e:any) => {
    filterTopic = e.detail.filters.filterTopic
    const mypage = ($page.url.searchParams.has('page')) ? Number($page.url.searchParams.get('page')) - 1 : 0
    await fetchPageCheck(mypage)
  }

  const changeDelegator = async (e:any) => {
    filterDelegator = e.detail.filters.filterDelegator
    const mypage = ($page.url.searchParams.has('page')) ? Number($page.url.searchParams.get('page')) - 1 : 0
    await fetchPageCheck(mypage)
  }

  const changeStacker = async (stacker: string) => {
    mode = 'stacker'
    filterDelegator = stacker;
    const mypage = ($page.url.searchParams.has('page')) ? Number($page.url.searchParams.get('page')) - 1 : 0
    await fetchPageCheck(mypage)
  }

  const changeAll = async () => {
    mode = 'all'
    filterDelegator = undefined;
    filterTopic = undefined;
    const mypage = ($page.url.searchParams.has('page')) ? Number($page.url.searchParams.get('page')) - 1 : 0
    await fetchPageCheck(mypage)
  }

  const fetchPage = async (evt:any) => {
    await fetchPageCheck(evt.detail.page)
  }

  const fetchPageCheck = async (mypage:number) => {
    if (mypage < 0) mypage = 0
    if (mypage > numPages) mypage = numPages
    let result:any
    if (mode === 'all') {
      if (filterTopic) {
        result = await findPoolStackerEventsByEvent(filterTopic, mypage, limit)
      } else if (filterDelegator) {
        result = await findPoolStackerEventsByStacker(filterDelegator)
      } else {
        result = await findPoolStackerEvents(mypage, limit)
      }
    } else {
      result = await findPoolStackerEventsByStacker($sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress)
      if (!result || !result.events) {
        result = {
          events: [], total: 0
        }
      }
    }
    events = result.events
    total = result.total

    const resid = ((total % limit) > 0) ? 1 : 0;
    numPages = Math.floor(total / limit) + resid;
  }

	$: sortedEvents = events.sort(DaoUtils.dynamicSort(sortDir + sortField));

  afterNavigate(async(nav) => {
    if ($page.url.searchParams.has('event')) {
        filterTopic = $page.url.searchParams.get('event') || undefined
    }
    //searching = false;
    details = false
    await fetchPageCheck(0)
  })

  onMount(async () => {
    try {
      if ($page.url.searchParams.has('event')) {
        filterTopic = $page.url.searchParams.get('event') || undefined
        searching = true;
      }
      let mypage = 0;
      if ($page.url.searchParams.has('page')) {
        mypage = Number($page.url.searchParams.get('page')) - 1
      }
      await fetchPageCheck(mypage)
      inited = true;
    } catch (err) {
      errorReason = COMMS_ERROR;
    }
  })
</script>

<svelte:head>
  <title>sBTC Bridge - Transactions</title>
  <meta name="description" content="A detailed table of all the transactions going through the sBTC Bridge." />
</svelte:head>

<div class="py-6 mx-auto max-w-7xl md:px-6">
  <div class="flex flex-col w-full my-8">
    <div class="bg-black text-white flex flex-col w-full border-[0.5px] border-gray-700 rounded-lg p-6 sm:p-10 overflow-hidden bg-gray-1000">
      <div class="text-4xl font-medium">Stacking History
        <a href="/" on:click|preventDefault={() => showMenu = !showMenu} class="pointer">
          <Icon src={ArrowsUpDown} mini class="inline-block h-9 w-9 text-white" aria-hidden="true" />
        </a>
        {#if showMenu}
        <div class="bg-white w-[300px] text-base text-black border border-bloodorange rounded-lg absolute mx-5 p-2">
          <div class="w-full pb-2 flex flex-col my-0 font-semibold ">
            <div class="my-3 border-b border-bloodorange">Switch view</div>
            <div class="my-3"><a href="/insights/events?chain=testnet">Stacker contract calls</a></div>
            <div class="my-3"><a href="/insights/cycles?chain=testnet">Stacking per cycle</a></div>
            <div class="my-3"><a href="/insights/rewards?chain=testnet">Current reward slots</a></div>
          </div>
        </div>
        {/if}
      </div>
    {#if inited}
        <Tabs style="underline" contentClass="py-4">
          <TabItem on:click={() => changeAll()} open={mode === 'all'} title="All stacking events">
            <div class="bg-black text-white rounded-md p-4 border border-gray-900">
              <div class="mt-2 flex justify-between">
                <div class="flex gap-x-3">
                  <a class={activeClass} title="show event details" href="/" on:click|preventDefault={() => details = !details}>
                    <Icon src={AdjustmentsHorizontal} mini class={activeClass} aria-hidden="true" />
                  </a>
                  <a class="" href="/" on:click|preventDefault={() => searching = !searching}>
                    <Icon src={MagnifyingGlassCircle} mini class="h-7 w-7 text-white border-none" aria-hidden="true" />
                  </a>
                </div>
                <div class="flex gap-x-5">
                    <div class="text-1xl font-normal"><Paging on:fetch_page={fetchPage} {numPages} totalEvents={total} {limit}/></div>
                </div>
              </div>
              {#if searching}
              <EventFilters {filterTopic} {filterDelegator} on:change_filter={changeFilters} on:change_delegator={changeDelegator}/>
              {/if}
              <EventHeader on:reorder_events={reorder}/>
              {#each sortedEvents as event}
              <EventRow {event} {details} />
              {/each}
            </div>
          </TabItem>
          <TabItem on:click={() => changeStacker(stxAddress)} open={mode !== 'all'} title="Your stacking events">
            <div class="bg-sand-900 rounded-md p-4 border  border-gray-900">
              <div class="mt-5 flex justify-end">
                <div class="flex gap-x-5">
                    <div class="text-1xl font-normal"><Paging on:fetch_page={fetchPage} {numPages} totalEvents={total} {limit}/></div>
                </div>
              </div>
              <EventHeader on:reorder_events={reorder}/>
              {#each sortedEvents as event}
              <EventRow {event} {details} />
              {/each}
            </div>
          </TabItem>
        </Tabs>
      {:else}
        <Tabs style="underline" contentClass="mt-8">
          <TabItem open={true} title="All transactions">
            <Skeleton size="md" />
          </TabItem>
          <TabItem title="Your transactions">
            <Skeleton size="md" />
          </TabItem>
        </Tabs>
      {/if}
    </div>
  </div>
</div>

