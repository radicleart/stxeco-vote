<script lang="ts">
	import Dashboard from '$lib/components/dashboard/Dashboard.svelte';
	import Flow from '$lib/components/dashboard/Flow.svelte';
  export let title: string;
</script>


<svelte:head>
  <title>sBTC Bridge - {title}</title>
  <meta name="description" content="The sBTC Bridge
  provides a non-custodial, permissionless way to move Bitcoin into and out of the Stacks Blockchain." />
</svelte:head>

<div class="mx-auto max-w-7xl md:px-6 py-6">
  <div class="my-8">
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-6">
      <Dashboard />
      <Flow />
    </div>
  </div>
</div>
