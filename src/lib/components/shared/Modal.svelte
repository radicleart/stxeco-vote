<script>
    export let showModal = false;

    scroll(0,0);
</script>

{#if showModal}
<div class="backdrop" on:keyup tabindex="0" role="button" aria-pressed="false">
    <div class="sv-modal">
        <slot name="title"></slot>
        <slot></slot>
    </div>
</div>
{/if}

<style>
    .backdrop {
        z-index: 5000;
        width: 100%;
        height: 100%;
        position: absolute;
        background: rgba(0,0,0,0.8);
        top: -100px;
        left: 0;
        right: 0;
    }
    .sv-modal {
        padding: 10px;
        border-radius: 0px;
        min-width: 400px;
        min-height: 70vh;
        margin: 10% 10%;
        background: transparent;
    }
</style>