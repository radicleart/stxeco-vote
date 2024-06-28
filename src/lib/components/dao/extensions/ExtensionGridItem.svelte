<script lang="ts">
import { createEventDispatcher } from 'svelte';
import arr from '$lib/assets/png-assets/stx_eco_directional_arrow.png'
	import type { ExtensionType } from '@mijoco/stx_helpers/dist/index';
	import { getConfig } from '$stores/store_helpers';

let dispatch = createEventDispatcher();

export let extension:ExtensionType;
export let status = { name: 'active', color: 'info', colorCode: '#4786cd' };
if (!extension.valid) {
	status = { name: 'inactive', color: 'primary', colorCode: '#4B515D' };
}
const openSesame = () => {
	dispatch('openSourceModal', extension)
}
const openExtensionChecker = () => {
	dispatch('openExtensionChecker', extension)
}
const explorerUrl = () => {
	return getConfig().VITE_STACKS_EXPLORER + '/txid/' + extension.contractId + '?chain=' + getConfig().VITE_NETWORK;
}
const statusStyle = () => {
    let clazzes = 'border-top: 1pt solid ' + status.colorCode + '; border-left: 1pt solid ' + status.colorCode + '; border-right: 1pt solid ' + status.colorCode + ';';
    return clazzes;
}

const actionStyle = () => {
    let clazzes = 'border-top: 1pt solid ' + status.colorCode + '; border-left: 1pt solid ' + status.colorCode + '; border-bottom: 1pt solid ' + status.colorCode + ';';
    return clazzes;
}

const actionRightStyle = () => {
    let clazzes = 'border: 1pt solid ' + status.colorCode + ';';
    return clazzes;
}
const headerStyle = () => {
    let clazzes = 'upper text-' + status.color;
    return clazzes;
}

</script>

<div class="col-11">
	<div class="row">
		<div class="cols-12">
			<h2 class={headerStyle()}><a href="/" on:click|preventDefault={() => openExtensionChecker()}>{extension.contractId.split('.')[1]}</a></h2>
		</div>
	</div>
	<div class="row">
		<div class="cols-12">
			<p  class="p-2" style={statusStyle()}>
				{status.name}
			</p>
		</div>
	</div>
	<div class="row">
		<div class="col-3"><p class="text-light p-2" style={actionStyle()}>actions</p></div>
		<div class="col-9">
			<p class="p-2" style={actionRightStyle()}><a class="pointer text-light" href="/" on:click|preventDefault={() => { openSesame() }}>Show Clarity</a></p>
			<p class="p-2" style={actionRightStyle()}><a class="pointer text-light" href={explorerUrl()} target="_blank">Open Explorer</a></p>
		</div>
	</div>
</div>

