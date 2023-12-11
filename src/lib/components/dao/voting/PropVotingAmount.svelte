<script lang="ts">
import { sbtcConfig } from '$stores/stores';

const title = 'time to vote on proposal';
export let vfor:boolean;

const tokenBalance = $sbtcConfig.userSettings.govTokens?.userBalance || 0
  const tokenBalanceLocked = $sbtcConfig.userSettings.govTokens?.userLocked || 0;

let amount = 0;
const getVote = () => {
    return (vfor) ? 'for' : 'against'
}
const unlockedMessage = () => {
  return 'Lock up to available balance of ECO tokens.'
}
const castVote = () => {
  console.log('empty function ?')
}
</script>

<section>
  <card-group>
    <card class="p-3" style="width: 100%;" bg-variant="white" header-tag="header" footer-tag="footer">
      <card-text class="text-right">
        <div class="mb-4 pb-4">
          <img width="10%" src={'img/logo.png'} alt="logogss" />
        </div>
      </card-text>
      <card-text class="">
        <h2 class="eag-header pointer mb-4">
          Lock ECO Tokens
        </h2>
        <h4 class="eag-header pointer mb-4">
          Voting <span class="text-warning">{ getVote() }</span> -> { title }
        </h4>
      </card-text>
      <card-text class="">
        <label for="status-name">Select the number of tokens to vote with - these tokens will be locked until after the vote finishes</label>
        <div class="w-100">
          <div class="form-field">
            <label for="question">Question</label>
          <input type="text" id="question" bind:value={amount}/>
        </div>
        <div class="w-100 d-flex justify-content-between">
          <div class="text-secondary">
            <span title={unlockedMessage()}>0</span>
            <span class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                    title={unlockedMessage()}>0</span>
          </div>
          <div class="text-secondary">
            <span class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                    title={unlockedMessage()}>{ tokenBalance - tokenBalanceLocked }</span>
          </div>
        </div>
      </card-text>
      <card-text>
        <div class="p-0 offset-8 col-4 text-right mb-5">
          <button class="w-100 outline-dark" on:click={castVote}>
            Locking { amount } ECO ->
          </button>
        </div>
      </card-text>
    </card>
  </card-group>
</section>
