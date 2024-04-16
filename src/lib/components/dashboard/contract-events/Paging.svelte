<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { createEventDispatcher, onMount } from "svelte";
  import { Pagination } from 'flowbite-svelte';

  const dispatch = createEventDispatcher();

  export let totalEvents:number;
  export let limit:number;
  export let numPages:number;
  let currentPage:number = 1;
  let inited = false;

  let pages:Array<{name:string, href:string, active:boolean}> = [];

  $: helper = { start: (currentPage - 1) * limit + 1, end: (currentPage -1) * limit + limit, total: totalEvents };

  $: activeUrl = $page.url.searchParams.get('page');

  $: {
    pages.forEach((page) => {
      let splitUrl = page.href.split('?');
      let queryString = splitUrl.slice(1).join('?');
      const hrefParams = new URLSearchParams(queryString);
      let hrefValue = hrefParams.get('page');
      if (hrefValue === activeUrl) {
        page.active = true;
      } else {
        page.active = false;
      }
    });
    pages = pages;
  }

  const previous = () => {
    const current = ($page.url.searchParams.has('page')) ? Number($page.url.searchParams.get('page')) : 1;
    if (current <= 1) return
    goto($page.url.pathname + '?page=' + (current - 1))
  };
  const next = () => {
    const current = ($page.url.searchParams.has('page')) ? Number($page.url.searchParams.get('page')) : 1;
    if (current >= numPages) return
    goto($page.url.pathname + '?page=' + (current + 1))
  };
  afterNavigate((nav) => {
    currentPage = ($page.url.searchParams.has('page')) ? Number($page.url.searchParams.get('page')) : 1;
    const mypage = ($page.url.searchParams.size === 0) ? 0 : Number($page.url.searchParams.get('page'))
    dispatch("fetch_page", { page: mypage - 1 });
  })

  onMount(async () => {
    
    currentPage = ($page.url.searchParams.has('page')) ? Number($page.url.searchParams.get('page')) : 1;
    let active = false;
    for (let i=0; i < numPages; i++) {
      let name = Number(i+1)
      if ((i === 0 && ($page.url.searchParams.size === 0))) active = true
      else if ((i+1) === currentPage) active = true
      pages.push({name: String(name), href: $page.url.pathname + '?page=' + (i+1), active})
      active = false;
    }
    inited = true;
  })

</script>

{#if totalEvents > 0 && inited}
<!--
  <Pagination
    {pages}
    on:previous={previous}
    on:next={next}
    normalClass="!bg-gray-1000 !dark:bg-gray-1000 !border-[0.5px] !border-gray-700 !hover:bg-gray-800 !dark:hover:bg-gray-800"
    activeClass="!dark:gray-700 !bg-primary-500/10 !border-[0.5px] !border-gray-700 !dark:bg-primary-500/10 !text-primary-500"
  >
    <svelte:fragment slot="prev">
      <span class="sr-only">Previous</span>
      <ChevronLeftOutline class="w-2.5 h-2.5" />
    </svelte:fragment>
    <svelte:fragment slot="next">
      <span class="sr-only">Next</span>
      <ChevronRightOutline class="w-2.5 h-2.5" />
    </svelte:fragment>
  </Pagination>
-->
  <div class="flex flex-col items-center justify-center gap-2">
    {#if helper.total > limit}
    <div class="text-sm text-gray-700 dark:text-gray-400">
      Showing <span class="font-semibold text-gray-900 dark:text-white">{helper.start}</span>
      to
      <span class="font-semibold text-gray-900 dark:text-white">{helper.end}</span>
      of
      <span class="font-semibold text-gray-900 dark:text-white">{helper.total}</span>
      entries
    </div>
    <Pagination table
      on:previous={previous}
      on:next={next}
      normalClass="!bg-gray-1000 !dark:bg-gray-1000 !border-[0.5px] !border-gray-700 !hover:bg-gray-800 !dark:hover:bg-gray-800"
      activeClass="!dark:gray-700 !bg-primary-500/10 !border-[0.5px] !border-gray-700 !dark:bg-primary-500/10 !text-primary-500"
    >
      <span slot="prev">Prev</span>
    </Pagination>
    {:else}
    <div class="text-sm text-gray-700 dark:text-gray-400">
      <span class="font-semibold text-gray-900 dark:text-white">{helper.total}</span>
      found
    </div>
    {/if}
  
  </div>
{/if}
