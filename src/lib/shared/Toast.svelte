<script>
import { toasts, ToastContainer, FlatToast }  from "svelte-toasts";
import {beforeUpdate} from 'svelte'

export let showToast = false;
export /**
* @type {{ title: any; description: any; }}
*/ let toastData;

const configureToast = () => {
    toasts.add({
        title: toastData.title,
        description: toastData.description,
        duration: 10000, // 0 or negative to avoid auto-remove
        placement: 'bottom-right',
        type: 'info',
        theme: 'dark',
        onClick: () => {},
        onRemove: () => {
            showToast = false;
            console.log("Toast removed");
        },
        // component: BootstrapToast, // allows to override toast component/template per toast
    });

    // toast.remove()
};
beforeUpdate(async () => {
        configureToast();
    })
</script>
  
  {#if showToast}
  <main class="flex flex-col container items-center mt-10">
    <ToastContainer placement="bottom-right" let:data={data}>
      <FlatToast {data} /> <!-- Provider template for your toasts -->
    </ToastContainer>
  </main>
  {/if}