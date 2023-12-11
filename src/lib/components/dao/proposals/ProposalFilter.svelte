<script lang="ts">
  import { createEventDispatcher } from 'svelte';

	export let currentFilter:string|null;
  if (!currentFilter) currentFilter = 'all';
  const filterValues = ['all', 'emergexec', 'voting', 'funding', 'concluded', 'deployed']
  let dispatch = createEventDispatcher();
</script>

<div class="dropdown">
  <span class="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown"  data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    {currentFilter}
  </span>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    {#each filterValues as filter }
      <a href="/" class="dropdown-item mb-2 border-bottom pointer" on:click|preventDefault={() => dispatch('propFilterChange', filter)}>{filter}</a>
    {/each}
  </div>
</div>

<style>
.dropdown-item {
  font-size: 1.0rem;
  border: 0pt solid #787878;
      color: #787878;
      padding: 3px 17px;
  
}
.dropdown-menu {
  background-color: #333;
  min-width: 300px;
  
}
</style>
