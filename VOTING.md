# stx.eco

## Introduction

Information on the SIP 21 Nakamoto upgrade voting.

### Voting end points

Api end points for reading voting information:

- [summary](https://mainnet.bridge.sbtc.tech/bridge-api/v1/dao/results/summary)
- [solo votes](https://mainnet.bridge.sbtc.tech/bridge-api/v1/dao/votes-solo)
- [pool votes](https://mainnet.bridge.sbtc.tech/bridge-api/v1/dao/votes-pool)
- [dao votes](https://mainnet.bridge.sbtc.tech/bridge-api/v1/dao/results/non-stackers)

The stx.eco application provides results and more in depth stacking information per address;

- [results page](https://stx.eco/dao/proposals/SP3JP0N1ZXGASRJ0F7QAHWFPGTVK9T2XNXDB908Z.bdp001-sip-021-nakamoto/results?method=1)
- [e.g. stacker info](https://stx.eco/stacker-info/SP0ATPX8ZDQT2SZE61EGC4GVSY4MN6G17WPDKP8M)

### Issues to consider for the next vote

- problems with connecting ledger
- ineligible votes
- privacy issues
- pox complexity

Note: ineligible votes were either users sending pool stacking votes from addresses
which were not pool stacking. For solo stackers its likely that votes were sent either
from wallets that are not stacking or from address in wallets where a different address
controls the reward slots.

986 pool stacker votes were recorded and only 370 counted. With solo it was 156 transactions were
sent and 28 counted. The picture with solo stacker votes is more nuanced - see below for more info.

We need to address this in future. Improving messaging and additional UI/UX checks may help
but a more fundamental review is needed because using pox data as the basis for voting is extremely
complicated and error prone.

For, large stake holders who wish to preserve their privacy pox voting is also unhelpful.

## Pool stacker voting

Votes were counted as the average of the pool stackers stacked STX over cycle 78 and 79 as per the SIP.

Pool stacker votes were counted by indexing the pox-3 pox tables and event streams,
matching stacking events against vote transactions. The results were sampled and double
checked against Ortega datasets.

## Solo stacker voting

Votes were counted as the average of the solo stackers stacked STX over cycle 78 and 79 as per the SIP.

Some votes were not backed by PoX data and so did not contribute to the results. Most of these
look like to have been transactions sent in error possibly out of enthusiasm some were not
included for reasons discussed below.

### Pool operator votes

Two pool operators seem to have voted:

- bc1qmv2pxw5ahvwsu94kq5f520jgkmljs3af8ly6tr (~42M)
- bc1qs33quxgnwkrspgu82lmaczw7gtcfa88pll8fqm (~3.5M)

These votes were removed from the count as per the SIP.

### Indirect votes

SIP 21 states that votes must come from the pox reward address. In some scenarios, e.g. because of the
the way addresses are rotated in centralised exchanges, this was not possible.
Some solo stacker votes were therefore not counted for this reason even though they may have
otherwise been valid. A caveat to this is where we were able to find pox information relating to the
address that had directly funded the voting address. In the two cases where this was the
case the vote was included.

### Multisig address votes

At least one voting address was identified as a multisig. The vote was not included
because no link to pox data could be found. Constituent addresses of the multisig and
transactions which funded the voting transaction were considered.

## Non stacker voting

Votes are controlled by the DAO contract and the counts are read directly from the contract. Individual
vote transactions were also read from contract event stream and double checked against data
mined by [Ortega](https://app.ortege.ai/) thanks to c/o Justin @ Ortege
