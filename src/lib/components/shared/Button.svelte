<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from 'flowbite-svelte'

  export let darkScheme:boolean;
  export let label:string;
  export let target:string;

  let btnClass="menu-btn" + ' h-10 px-8 rounded-md cursor-pointer';
  let btnTextClass="text-black font-medium";

  if (darkScheme) {
    btnClass="menu-btn-dark" + ' btn';
    btnTextClass="menu-btn-text-dark";
  }

  const dispatch = createEventDispatcher();

  const doClicked = (event:any) => {
    const menuTarget = { offsetTop: event.target.offsetTop, offsetLeft: event.target.offsetLeft };
    dispatch('clicked', { target, menuTarget });
  }
</script>

<div class="mr-3">
  {#if darkScheme}
    <Button
      type="button"
      on:click={(event) => doClicked(event)}
      class="bg-primary-02 p-px font-normal rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50"
    >
      <span class="inline-flex items-center gap-x-1.5 bg-gray-1000 px-4 py-2 rounded-lg h-full">
        <span class="text-transparent bg-clip-text bg-primary-02">{label}</span>
      </span>
    </Button>
  {:else}
    <Button
      type="button"
      on:click={(event) => doClicked(event)}
      class="inline-flex items-center gap-x-1.5 bg-primary-01 px-4 py-2 font-normal text-black rounded-lg border border-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50"
    >
      {label}
    </Button>
  {/if}
</div>
