<script lang="ts">
  import { onMount } from 'svelte';
  import { Spinner } from 'flowbite-svelte';
  import { Icon, InformationCircle, XCircle,ExclamationCircle, CheckCircle } from "svelte-hero-icons";

  export let message:string;
  export let bannerType = 'info'
  let clazz = '';
  export {clazz as class};

  let bannerClassList = ''
  onMount(async () => {
    if (bannerType === 'warning') {
      bannerClassList = clazz + ' bg-warning-400';
    } else if (bannerType === 'danger') {
      bannerClassList = clazz + ' bg-error-400';
    } else if (bannerType === 'success') {
      bannerClassList = clazz + ' bg-success-400';
    } else {
      bannerClassList = clazz + ' bg-gray-400';
    }
  })
</script>

<div class="flex px-4 py-3 rounded-md text-base text-black {bannerClassList}">
  <div class="flex gap-2">
    <Spinner class="w-10 inline text-black " />
    <div>
      <slot name="message">{@html message}</slot>
    </div>
  </div>
</div>
