# stx.eco

## Introduction

To vote on the Nakamoto Release and other major stacks protocol upgrades.

[stx.eco](https://stx.eco)

## Development

```bash
node -v
v19.7.0
npm install
npm run 'mode'
```

where mode is one of;

```#Javascript
// run against api deployed in remote devnet / regtest
"rd": "mode remote-devnet"
//  run against api deployed in local devnet / regtest 
"ld": "mode local-devnet"
//   run against api deployed remotely (network determined by settings) 
"dev": "mode development"
// run against api deployed locally connecting to testnet
"lt": "mode local-testnet"
// run against api deployed locally connecting to mainnet
"lm": "mode local-mainnet"
```

## Block Height Conversions

Stacks          Bitcoin     When                Diff
138783          829612      9 Feb 5.41am
134783          824764      2024-01-07T16:19    4848
130783          819615      2023-12-03T19:59    5149
126783          814583      2023-10-30T22:27    5032
122783          809855      2023-09-29T09:50    4728
118783          805223      2023-08-28T23:48    4632
114783          800557      2023-07-28T02:37    4666
110783          796018      2023-06-26T14:26    4539

Sum = 33594

Avg = 4799 bitcoin blocks for every 4000 stacks blocks

Every bitcoin block => 0.83 stacks

-----------------------------------------------------

Cycle 79 ends at 833950 (4302 from now)

Current stacks block is 138784

Voting starts in 202 bitcoin blocks / 202*0.83=168 stacks blocks
Voting ends in 4302 bitcoin blocks / 4302*0.83=3571 stacks blocks

## Voting with liquid STX

Users with liquid STX can vote on proposals using the [Ecosystem DAO](https://stx.eco).
Liquid STX is the users balance, less any STX they have locked in PoX stacking protocol,
at the block height at which the voting started (preventing the same STX from being transferred between accounts and used to effectively double vote).
This is referred to generally as "snapshot" voting.

For SIP 21 Nakamoto Upgrade to pass 66% of all liquid STX committed by voting
must in favour of the proposal.

## Commands for running nodes

Change the paths to suit specific setup

```bash
alias sn-psql='sudo -u postgres psql'
alias sn-postgres-docker='docker run -d --rm --name postgres --net=stacks-blockchain -e POSTGRES_PASSWORD=postgres -v /mnt/bitcoin-testnet/stacks-testnet/postgres/postgresql/15/main:/var/lib/postgresql/data -p 5432:5432 postgres:alpine'
alias sn-run-cd='cd /mnt/bitcoin-testnet/stacks-testnet/stacks-core'

alias sn-run-node='cd /mnt/bitcoin-testnet/stacks-testnet/stacks-core && nohup cargo run --bin stacks-node -- start --config /mnt/bitcoin-testnet/stacks-testnet/stacks-core/testnet/stacks-node/conf/testnet-signer-conf.toml  >> /mnt/bitcoin-testnet/stacks-testnet/logs/stacks-node.log &'
alias sn-run-signer='cd /mnt/bitcoin-testnet/stacks-testnet/stacks-core && nohup cargo run --bin stacks-signer run --config /mnt/bitcoin-testnet/stacks-testnet/stacks-core/testnet/stacks-node/conf/signer-config.toml  >> /mnt/bitcoin-testnet/stacks-testnet/logs/signer-binary.log &'
alias sn-run-api='cd /mnt/bitcoin-testnet/stacks-testnet/stacks-blockchain-api && nohup node ./lib/index.js >> /mnt/bitcoin-testnet/stacks-testnet/logs/stacks-api.log &'

alias sn-stop-node='sudo kill $(ps -ef | grep "stacks-node start --config" | grep -v grep | awk {`print $2`})'
alias sn-stop-signer='sudo kill $(ps -ef | grep "stacks-signer" | grep -v grep | awk {`print $2`})'
alias sn-stop-api='sudo kill $(ps -ef | grep "lib/index.js" | grep -v grep | awk {print $2})'

alias sn-check-node='ps -ef | grep "stacks-node start --config" | grep -v grep'
alias sn-check-api='ps -ef | grep "lib/index.js" | grep -v grep'
alias sn-check-signer='ps -ef | grep "stacks-signer" | grep -v grep'

alias sn-tail-node='tail -f -n 50 /mnt/bitcoin-testnet/stacks-testnet/logs/stacks-node.log'
alias sn-tail-api='tail -f -n 50 /mnt/bitcoin-testnet/stacks-testnet/logs/stacks-api.log'
alias sn-tail-signer='tail -f -n 50 /mnt/bitcoin-testnet/stacks-testnet/logs/signer-binary.log'

alias sn-run-api-docker='docker run -d --rm --name stacks-blockchain --net=stacks-blockchain -v /mnt/bitcoin-testnet/stacks-testnet:/root/stacks-node/data -v $(pwd)/config:/src/stacks-node -p 20443:20443 -p 20444:20444 blockstack/stacks-blockchain /bin/stacks-node start --config /src/stacks-node/Config.toml'
#alias sn-run-api-docker='docker run -d --rm --name stacks-blockchain-api --net=stacks-blockchain --env-file $(pwd)/.env -v $(pwd)/bns:/bns-data -p 3700:3700 -p 3999:3999 blockstack/stacks-blockchain-api'
alias sn-run-api-docker='docker run -d --rm --name stacks-blockchain-api --network host --env-file $(pwd)/.env -v $(pwd)/bns:/bns-data -p 3700:3700 -p 3999:3999 blockstack/stacks-blockchain-api'
```
