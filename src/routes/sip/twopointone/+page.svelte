<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	onMount(async () => {
    try {
		goto('/')
    } catch (err) {
    }
  })
</script>
