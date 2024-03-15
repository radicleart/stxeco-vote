# stx.eco

## Introduction

Information on the SIP 21 Nakamoto upgrade voting.

### Voting API

End points for reading voting information:

- [summary](https://mainnet.bridge.sbtc.tech/bridge-api/v1/dao/results/summary)
- [solo votes](https://mainnet.bridge.sbtc.tech/bridge-api/v1/dao/votes-solo)
- [pool votes](https://mainnet.bridge.sbtc.tech/bridge-api/v1/dao/votes-pool)
- [dao votes](https://mainnet.bridge.sbtc.tech/bridge-api/v1/dao/results/non-stackers)
- [results page](https://stx.eco/dao/proposals/SP3JP0N1ZXGASRJ0F7QAHWFPGTVK9T2XNXDB908Z.bdp001-sip-021-nakamoto/results?method=1)

### Issues to consider for the next vote

- problems with connecting ledger
- ineligible votes

Note: ineligible votes were either users sending pool stacking votes from addresses
which were not pool stacking and likewise for solo stackers.

We had 986 pool stacker votes and only 370 counting. With solo it was 156 to 28. The picture
with solo stacker votes is more nuanced - see below for more info.

We need to address this in future votes e.g. by improving messaging and additional UI/UX checks.

## Pool Stacker Voting

Pool stacker votes were counted by indexing the pox-3 pox tables and event streams,
matching stacking events against vote transactions. The results were sampled and double
checked against Ortega datasets.

## Solo Stacker Voting

Some votes were not backed by PoX data and so did not contribute to the results. Most of these
look like to have been transactions sent in error possibly out of enthusiasm some were not
included for reason below.

### Pool operator votes

Two pool operators seem to have voted:

- plan better = 42M = bc1qmv2pxw5ahvwsu94kq5f520jgkmljs3af8ly6tr
- xverse = 3,518,745 = bc1qs33quxgnwkrspgu82lmaczw7gtcfa88pll8fqm

These votes were removed from the count as per the SIP.

### Indirect votes

SIP 21 states that votes must come from the pox reward address. In some scenarios, e.g. because of the
the way addresses are rotated in centralised exchanges, this was not possible.
Some solo stacker votes were therefore not counted for this reason even though they may have
otherwise been valid.

### Multisig address votes

E.g. the address below sent a vote tx but the vote was not included because the pox data the address
resolved to could not be found. We tried finding the pox address both my the non direct method
described above and also by looking at the addresses within the multi-sig.

- [bc1qq5gxnfse4azcmn6d588z35ytpyyc2ctsjmfl5peghd5nl943rftsc32wtx](https://mainnet.bridge.sbtc.tech/bridge-api/v1/dao/results/solo-multisig/bc1qq5gxnfse4azcmn6d588z35ytpyyc2ctsjmfl5peghd5nl943rftsc32wtx)

this address resolves to (assuming version 0x04 the vote address is p2wsh) for the address derivation I get following addresses for the multisig (unable to find pox data though for them);

- bc1qq4uftfpl9al340de5zf8ece44hm53yjwu8x3q2
- bc1q9rzehag6m3wwlam3lf685zvwe5atx52mytrdgx
- bc1q28vm2sd3md2py3652rflm4fkqcyjf6uv32dacs

## Non Stacker Voting

This is the easiest of the three voting methods to count - the votes are controlled by the DAO contract.

The votes were counted by indexing the event data from the contract and by reading the 
data directly fom the database. The SQL query to fetch non stacker data (c/o Justin @ [Ortega](https://app.ortege.ai/))

```sql
SELECT 
  hash,
  sender_address,
  to_timestamp(block_timestamp) AS tx_timestamp,
  contract_call.function_name,
  -- Use try_cast to attempt to convert the substring to DOUBLE and divide by 1e6.
  -- If the conversion fails, NULL is returned.
  CASE 
    WHEN size(contract_call.function_args) > 0 
    THEN try_cast(substr(contract_call.function_args[0].repr, 2) AS DOUBLE) / 1e6
    ELSE NULL 
  END AS amount,
  -- Safe extraction of the second element's name value if present.
  CASE 
    WHEN size(contract_call.function_args) > 1 
    THEN contract_call.function_args[1].name 
    ELSE NULL 
  END AS second_arg_name
FROM db_stacks.tbl_prod_br_transactions
WHERE contract_call.contract_id = 'SP3JP0N1ZXGASRJ0F7QAHWFPGTVK9T2XNXDB908Z.bde007-snapshot-proposal-voting'
AND tx_status = 'success';
```
