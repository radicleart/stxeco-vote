<script lang="ts">
import { createEventDispatcher } from "svelte";

let clazz = '';
export {clazz as class};

const dispatch = createEventDispatcher();

const doClicked = (event:any) => {
    const menuTarget = { offsetTop: event.target.offsetTop, offsetLeft: event.target.offsetLeft };
    dispatch('clicked', { menuTarget });
}
</script>

<div class="ml-auto flex items-center">
  <button title="Show in Explorer" on:keydown on:click={(event) => doClicked(event)} class="cursor-pointer h-8 w-8 rounded-md bg-black flex items-center justify-center border border-transparent hover:border-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 focus:ring-4 focus:outline-none transition duration-200">
    <svg class={clazz} viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 9H8.625M5.5 11.5H8.625M5.5 14H8.625M11.125 14.625H13C13.4973 14.625 13.9742 14.4275 14.3258 14.0758C14.6775 13.7242 14.875 13.2473 14.875 12.75V4.09C14.875 3.14417 14.1708 2.34167 13.2283 2.26333C12.9167 2.23749 12.6047 2.21526 12.2925 2.19667M12.2925 2.19667C12.3478 2.3759 12.3751 2.56243 12.375 2.75C12.375 2.91576 12.3092 3.07473 12.1919 3.19194C12.0747 3.30915 11.9158 3.375 11.75 3.375H8C7.655 3.375 7.375 3.095 7.375 2.75C7.375 2.5575 7.40417 2.37167 7.45833 2.19667M12.2925 2.19667C12.0567 1.43167 11.3433 0.875 10.5 0.875H9.25C8.84937 0.875094 8.45929 1.00345 8.13688 1.24128C7.81448 1.47911 7.57669 1.81392 7.45833 2.19667M7.45833 2.19667C7.145 2.21583 6.83333 2.23833 6.52167 2.26333C5.57917 2.34167 4.875 3.14417 4.875 4.09V5.875M4.875 5.875H2.0625C1.545 5.875 1.125 6.295 1.125 6.8125V16.1875C1.125 16.705 1.545 17.125 2.0625 17.125H10.1875C10.705 17.125 11.125 16.705 11.125 16.1875V6.8125C11.125 6.295 10.705 5.875 10.1875 5.875H4.875ZM3.625 9H3.63167V9.00667H3.625V9ZM3.625 11.5H3.63167V11.5067H3.625V11.5ZM3.625 14H3.63167V14.0067H3.625V14Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</div>
