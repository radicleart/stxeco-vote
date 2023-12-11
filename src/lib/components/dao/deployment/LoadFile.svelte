<script>
// @ts-nocheck

    import { createEventDispatcher } from 'svelte';

	let dispatch = createEventDispatcher();
	let data;
	let files = [];
	$: {
		if (files.length > 0) {
			let binfile = files[0];
			let filename = binfile.name.split('.')[0];
			let reader = new FileReader();
			reader.onload = function(evt) {
				data = new TextDecoder().decode(new Uint8Array(evt.target.result));
				dispatch('fileLoaded', { source: data, contractName: filename })
			}
			reader.readAsArrayBuffer(binfile);
		}
	}
</script>
<div class="my-4">
	<label class="cursor-pointer rounded-lg border border-primary-1000 bg-primary-02 px-4 py-2 text-black">
		<input type="file" id="fileinput" bind:files/>
		Upload Clarity
	</label>
</div>
<style>
input[type="file"] {
    display: none;
}
</style>