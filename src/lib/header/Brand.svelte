<script lang="ts">
	import logoWhite from '$lib/assets/png-assets/stx_eco_logo_icon_white.png'
	import logoBlack from '$lib/assets/png-assets/stx_eco_logo_icon_grey.png'
	import { page } from '$app/stores';

	$: homepage = $page.route.id === '/';
</script>

<div class="flex items-center gap-3 mr-4 flex-no-wrap">
  <a class="navbar-brand mx-0 px-0" href="/">
    {#if homepage}
    <img width={'40px'} class="nav-logo" src={logoWhite} alt="stacks ecosystem dao logo" />
    {:else}
    <img width={'40px'} class="nav-logo" src={logoWhite} alt="stacks ecosystem dao logo" />
    <!-- <img class="nav-logo" src="/img/STX ECO logo concepts-01-yellow.jpeg" alt="stacks ecosystem dao logo" /> -->
    {/if}
  </a>
  <a href="/" class="inline font-bold text-transparent bg-clip-text text-xl md:text-2xl bg-primary-01 whitespace-nowrap	">STX ECO</a>
</div>
