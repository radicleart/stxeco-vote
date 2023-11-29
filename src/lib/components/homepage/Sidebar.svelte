<script>
export let context = 2;
</script>
  
<div class="box" style="">
  <div class="col-12 align-self-start pt-4">
    <img class="mx-1" width="50%" height="auto" src="/img/png-assets/stx_eco_logo_icon_white.png" alt="action 4"/>
  </div>
  <div class="col-12 align-self-center">
    {#if context === 2}
    <img src="/img/png-assets/stx_eco_side_nav.png" alt="stacks ecosystem dao logo" width="12" height="auto"/>
    {:else}
      <div class="socials">
        <div class="mb-3"><a class="text-light" href="https://discord.com/channels/621759717756370964/971037457661444156" target="_blank"><img src="/img/png-assets/stx_eco_discord.png" alt="discord ecosystem dao logo" width="39" height="auto"/></a></div>
        <div class="mb-3"><a class="text-light" href="https://mobile.twitter.com/radicleart" target="_blank"><img src="/img/png-assets/stx_eco_twitter.png" alt="twitter ecosystem dao logo" width="39" height="auto"/></a></div>
        <div class="mb-3"><a class="text-light" href="https://github.com/Clarity-Innovation-Lab/ecosystem-dao" target="_blank"><img src="/img/png-assets/stx_eco_github.png" alt="github ecosystem dao logo" width="39" height="auto"/></a></div>
      </div>
    {/if}
  </div>
  <div class="col-12 align-self-end pb-1">
    <p class="text-akrobat-thin">01<br/>/<br/>HOME</p>
  </div>
</div>

<style>
.box {
  text-align: center;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  background-color: #262626;
  font-size: 0.7rem;
  font-weight: 300;
  color: #fff;
  line-height: 1.0rem;
  max-width: 100px;
  min-width: 100px;
}

.socials {
  line-height: 1.8rem;;
}
</style>