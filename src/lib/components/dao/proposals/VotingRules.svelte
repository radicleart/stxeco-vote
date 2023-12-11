<script lang="ts">
	import type { ProposalEvent } from '$types/stxeco.type';
	import { fmtNumber } from 'sbtc-bridge-lib';
  
	export let proposalEvent: ProposalEvent;
	export let balanceAtHeight:number;

  </script>
		<div class="row mb-5">
			<div class="col-md-6 col-sm-12 mb-4">
				<div class="bg-card p-3 border" style="min-height: 41vh">
					<div class="text-white">
						<h4 class={'text-info'}>HOW VOTING WORKS</h4>
						<p>
							EcosystemDAO employs a mechanism called "Snapshot Voting," which allows any community
							member to vote, whether they're Stacking or not. Snapshot voting works by taking a
							snapshot of your STX balance (aka your "voting power") at a specific block height
							around the time that voting opens.
						</p>
						<p>
							Voting does not transfer or spend any STX (aside from the transaction fee). The
							proportion of your balance that you choose to vote with (your voting power) expresses
							the strength of your support for a proposal.
						</p>
						<p>Over 66% of the votes cast must be in favour of the proposal for it to pass.</p>
					</div>
				</div>
			</div>
			<div class="col-md-6 col-sm-12 mb-4">
				<div class="bg-card p-3 border" style="min-height: 41vh">
					<div class="text-white">
						<h4 class={'text-info'}>HOW TO VOTE</h4>
						<ol>
							<li>
								Make sure your wallet is connected (click 'Connect Wallet' in the top right corner
								of this page)
							</li>
							<li>Scroll down to find the proposal voting form</li>
							<li>
								Enter your voting power (the amount of STX in the account you want to commit) OR
								select 'Maximum Voting Power'
							</li>
							<li>Click 'Yes on 2.1' or 'No on 2.1' depending on your preference</li>
						</ol>
						<p>
							After voting you'll be able to claim your "I Voted" badge for your profile picture to
							display on social media. So be sure to have your favorite profile picture NFTs in your
							voting wallet!
						</p>
						{#if proposalEvent.proposalData.startBlockHeight}<p class="text-warning">
								Your snapshot balance at block 
                {fmtNumber(proposalEvent.proposalData.startBlockHeight)} was {balanceAtHeight} STX.
							</p>
						{:else}
							<p>The proposal is not yet fully funded.</p>
						{/if}
					</div>
				</div>
			</div>
		</div>
