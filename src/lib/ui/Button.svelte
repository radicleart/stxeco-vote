<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";

    const dispatch = createEventDispatcher();

    export let label:string;
    export let bannerType = 'info'
    let clazz = '';
    
    export {clazz as class};

    const clicked = () => {
        dispatch('clicked')
    }

    let bannerClassList = ''
    onMount(async () => {
        if (bannerType === 'warning') {
        bannerClassList = clazz + ' bg-yellow/60';
        } else if (bannerType === 'danger') {
        bannerClassList = clazz + ' bg-error-400';
        } else if (bannerType === 'success') {
        bannerClassList = clazz + ' bg-success-400';
        } else if (bannerType === 'waiting' || bannerType === 'checking') {
        bannerClassList = clazz + ' bg-lightpurple/60';
        } else {
        bannerClassList = clazz + ' bg-sand-500/60';
        }
    })
</script>

<button on:click={() => {clicked()}} class="justify-center w-[150px] md:inline-flex items-center gap-x-1.5 bg-danger-01 px-4 py-2 rounded-xl border border-black bg-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
    <slot name="message">{@html label}</slot>
</button>
