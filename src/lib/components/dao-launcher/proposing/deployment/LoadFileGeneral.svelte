<script lang="ts">
	import {onMount} from 'svelte'

	let internalError = false;
	let contentModel = {
		title: 'Drop File',
		message: 'Upload Clarity File',
		buttonName: 'Upload'
	};

	let uploader: HTMLElement|null;
	onMount(async () => {
		if (typeof window !== 'undefined') {
			uploader = window.document.getElementById('my-uploader');
		}
	})

	const chooseFiles = () => {
		if (uploader) uploader.click();
	}

	const loadMediaObjects = (e:any) => {
		let userFiles
		if (e.dataTransfer) {
			userFiles = e.dataTransfer.files
		} else if (e.target) {
			userFiles = e.target.files
		}
		/**
        const thisFile = {
			lastModified: userFiles[0].lastModified,
			lastModifiedDate: userFiles[0].lastModifiedDate,
			name: userFiles[0].name,
			type: 'type',
			size: userFiles[0].size,
			dataUrl: ''
        }
		**/
        const reader = new FileReader()
        reader.onload = function (e) {
			console.log(e?.target?.result)
        }
        reader.readAsDataURL(userFiles[0])
    }


</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class=" mb-4 mx-10">
	<div class="p-4 drop-zone d-flex flex-column align-items-center"  on:drop|preventDefault={(e) => loadMediaObjects(e)} on:dragover|preventDefault >
	<div class="mt-4 mb-5">{@html contentModel.title}</div>
	<div class="mx-5 px-5 " style="border: 1pt dashed #000;" >
		<div class="mt-5">{@html contentModel.message}</div>
		<div>
			<input class="light input-file" id="my-uploader" style="width: 80%;" type="file" on:change={(e) => loadMediaObjects(e)}>
		</div>
		<div class="mx-auto" style="position:relative; top: 35px;">
			<button class="light" on:click={() => chooseFiles()}>{@html contentModel.buttonName}</button>
		</div>
	</div>
</div>
</div>
{#if internalError}
<div class="invalid-feedback d-block">
{ internalError }
</div>
{/if}

<style>
</style>