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
	<label class="cursor-pointer w-52 justify-center items-center gap-x-1.5 bg-success-01 px-4 py-2 font-normal rounded-xl border border-success-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 shrink-0 ">
		<input type="file" id="fileinput" bind:files/>
		Upload clarity
	</label>
</div>
<style>
input[type="file"] {
    display: none;
}
</style>

