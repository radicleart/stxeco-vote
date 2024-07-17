# stxeco-vote

stxeco-vote is the main ui component of the stx.eco community voting application.

## Routes

The main routes are;

- [home page](https://stx.eco/) displays current and previous votes
- [voting page](https://stx.eco/dao/proposals/SP3JP0N1ZXGASRJ0F7QAHWFPGTVK9T2XNXDB908Z.bdp-multisig-transactions/) displays a specific proposal
- [results page](https://stx.eco/dao/proposals/SP3JP0N1ZXGASRJ0F7QAHWFPGTVK9T2XNXDB908Z.bdp-multisig-transactions/results) displays a specific proposal results

## Components

The stxeco-vote svelte application depends on;

- [stxeco-api-vote](https://github.com/radicleart/stxeco-api-vote) for indexing contract data
- [stxeco-helpers-btc](https://github.com/radicleart/stxeco-helpers-btc) wraps bitcoin api and helper methods for use in other components
- [stxeco-helpers-stx](https://github.com/radicleart/stxeco-helpers-stx) wraps stacks api and helper methods for use in other components
- [stxeco-components](https://github.com/radicleart/stxeco-components) shared ui components (header/footer)

## Developing

Test with node v20.10.0

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Deployment

Application currently runs in Linode cloud.
