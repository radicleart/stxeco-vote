const SHARED_DEVENV_CONFIG = {
    VITE_ENVIRONMENT: 'devenv',
    VITE_PUBLIC_APP_NAME: 'Bitcoin DAO Devnet',
    VITE_PUBLIC_APP_VERSION: '1.0.0',
    VITE_NETWORK: 'devnet',
    VITE_DOA_DEPLOYER: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    VITE_DOA: 'bitcoin-dao',
    VITE_DOA_PROPOSAL: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.bdp001-sip-021-test-01',
    VITE_DOA_SNAPSHOT_VOTING_EXTENSION: 'bde007-snapshot-proposal-voting',
    VITE_DOA_PROPOSAL_VOTING_EXTENSION: 'bde007-snapshot-proposal-voting',
    VITE_DOA_FUNDED_SUBMISSION_EXTENSION: 'bde008-flexible-funded-submission',
    VITE_DOA_EMERGENCY_EXECUTE_EXTENSION: 'bde004-emergency-execute',
    VITE_SBTC_COORDINATOR: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    VITE_SBTC_CONTRACT_ID: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.asset-3',
    VITE_BRIDGE_WS: 'ws://45.79.130.153:3999',
    VITE_BRIDGE_API: 'https://devnet.uasu.finance/bridge-api/v1',
    VITE_CLARITYLAB_API: 'https://devnet.uasu.finance/bridge-api/v1',
    VITE_STACKS_API_HIRO: 'https://api.hiro.so',
    VITE_STACKS_API_HIRO_WS: 'wss://api.testnet.hiro.so',
    VITE_STACKS_API: 'https://devnet-stacks.uasu.finance',
    VITE_STACKS_WS: 'ws://45.79.130.153:3999',
    VITE_STACKS_EXPLORER: 'https://devnet-stacks-explorer.uasu.finance',
    VITE_BSTREAM_EXPLORER: 'https://devnet-mempool.uasu.finance',
    VITE_MEMPOOL_EXPLORER: 'https://devnet-mempool.uasu.finance',
    VITE_EXTENSIONS: [
        'bde000-governance-token', 
        'bde007-snapshot-proposal-voting', 
        'bde002-threshold-proposal-submission', 
        'bde003-emergency-proposals', 
        'bde004-emergency-execute', 
        'bde005-dev-fund', 
        'bde006-treasury-1',
        'bde007-snapshot-proposal-voting-1', 
        'bde008-flexible-funded-submission-1',
        'bde009-governance-token-sale'
    ]
      
}

const TESTNET_CONFIG = {
    VITE_ENVIRONMENT: 'testnet',
    VITE_PUBLIC_APP_NAME: 'Stacks Ecosystem DAO Testnet',
    VITE_PUBLIC_APP_VERSION: '1.0.0',
    VITE_BRIDGE_WS: 'wss://bridge.sbtc.tech',
    VITE_NETWORK: 'testnet',
    VITE_DOA_DEPLOYER: 'ST167Z6WFHMV0FZKFCRNWZ33WTB0DFBCW9M1FW3AY',
    VITE_DOA: 'bitcoin-dao',
    VITE_DOA_PROPOSAL: 'ST167Z6WFHMV0FZKFCRNWZ33WTB0DFBCW9M1FW3AY.bdp001-sip-021-test-01',
    VITE_DOA_SNAPSHOT_VOTING_EXTENSION: 'bde007-snapshot-proposal-voting',
    VITE_DOA_PROPOSAL_VOTING_EXTENSION: 'bde007-snapshot-proposal-voting',
    VITE_DOA_FUNDED_SUBMISSION_EXTENSION: 'bde008-flexible-funded-submission',
    VITE_DOA_EMERGENCY_EXECUTE_EXTENSION: 'bde004-emergency-execute',
    VITE_SBTC_COORDINATOR: 'ST1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28G8HXK9G5',
    VITE_SBTC_CONTRACT_ID: 'ST1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28G8HXK9G5.asset-3',
    VITE_BRIDGE_API: 'https://testnet.bridge.sbtc.tech/bridge-api/v1',
    VITE_CLARITYLAB_API: 'https://testnet.bridge.sbtc.tech/bridge-api/v1',
    VITE_STACKS_API_HIRO: 'https://api.testnet.hiro.so',
    VITE_STACKS_API_HIRO_WS: 'wss://api.testnet.hiro.so',
    VITE_STACKS_API: 'https://leibniz.brightblock.org',
    VITE_STACKS_WS: 'ws://spinoza.brightblock.org',
    VITE_STACKS_EXPLORER: 'https://explorer.hiro.so',
    VITE_BSTREAM_EXPLORER: 'https://mempool.space/testnet',
    VITE_MEMPOOL_EXPLORER: 'https://mempool.space/testnet/api',
    VITE_EXTENSIONS: [
        'bde000-governance-token', 
        'bde001-proposal-voting', 
        'bde002-threshold-proposal-submission', 
        'bde003-emergency-proposals', 
        'bde004-emergency-execute', 
        'bde005-dev-fund', 
        'bde006-treasury',
        'bde007-snapshot-proposal-voting', 
        'bde008-funded-proposal-submission',
        'bde009-governance-token-sale'
    ]
}

const MAINNET_CONFIG = {
    VITE_ENVIRONMENT: 'mainnet',
    VITE_PUBLIC_APP_NAME: 'Stacks Ecosystem DAO',
    VITE_PUBLIC_APP_VERSION: '1.0.0',
    VITE_BRIDGE_WS: 'wss://bridge.sbtc.tech',
    VITE_NETWORK: 'mainnet',
    VITE_DOA_DEPLOYER: 'SP3JP0N1ZXGASRJ0F7QAHWFPGTVK9T2XNXDB908Z',
    VITE_DOA: 'bitcoin-dao',
    VITE_DOA_PROPOSAL: 'SP3JP0N1ZXGASRJ0F7QAHWFPGTVK9T2XNXDB908Z.bdp001-sip-021-nakamoto',
    VITE_DOA_SNAPSHOT_VOTING_EXTENSION: 'bde007-snapshot-proposal-voting',
    VITE_DOA_PROPOSAL_VOTING_EXTENSION: 'bde007-snapshot-proposal-voting',
    VITE_DOA_FUNDED_SUBMISSION_EXTENSION: 'bde008-flexible-funded-submission',
    VITE_DOA_EMERGENCY_EXECUTE_EXTENSION: 'bde004-emergency-execute',
    VITE_SBTC_COORDINATOR: 'ST3SPZXMPYVNHH3KF0RXNXVX1WVJ3QM1ZMD5FKWDN',
    VITE_SBTC_CONTRACT_ID: 'ST3SPZXMPYVNHH3KF0RXNXVX1WVJ3QM1ZMD5FKWDN.asset',
    VITE_BRIDGE_API: 'https://mainnet.bridge.sbtc.tech/bridge-api/v1',
    VITE_CLARITYLAB_API: 'https://mainnet.bridge.sbtc.tech/bridge-api/v1',
    VITE_STACKS_API_HIRO: 'https://api.hiro.so',
    VITE_STACKS_API_HIRO_WS: 'wss://api.hiro.so',
    VITE_STACKS_API: 'https://leibniz.brightblock.org',
    VITE_STACKS_WS: 'ws://spinoza.brightblock.org',
    VITE_STACKS_EXPLORER: 'https://explorer.hiro.so',
    VITE_BSTREAM_EXPLORER: 'https://mempool.space',
    VITE_MEMPOOL_EXPLORER: 'https://mempool.space/api',
    VITE_EXTENSIONS: [
        'bde000-governance-token', 
        'bde001-proposal-voting', 
        'bde002-threshold-proposal-submission', 
        'bde003-emergency-proposals', 
        'bde004-emergency-execute', 
        'bde005-dev-fund', 
        'bde006-treasury',
        'bde007-snapshot-proposal-voting', 
        'bde008-funded-proposal-submission',
        'bde009-governance-token-sale'
    ]
}

export let CONFIG = MAINNET_CONFIG;

export function setConfig(network:string) {
    const mode = import.meta.env.MODE
    console.log('mode: ' + mode)

    if (mode === 'shared-devenv') {
        CONFIG = SHARED_DEVENV_CONFIG;
        return;
    } else if (mode === 'local-testnet') {
        CONFIG = TESTNET_CONFIG;
        CONFIG.VITE_BRIDGE_API = 'http://localhost:3010/bridge-api/v1';
        CONFIG.VITE_CLARITYLAB_API = 'http://localhost:3010/bridge-api/v1';
        return;
    } else if (mode === 'local-mainnet') {
        CONFIG = MAINNET_CONFIG;
        CONFIG.VITE_BRIDGE_API = 'http://localhost:3010/bridge-api/v1';
        CONFIG.VITE_CLARITYLAB_API = 'http://localhost:3010/bridge-api/v1';
        return;
    }

    if (network === 'testnet') {
        CONFIG = TESTNET_CONFIG;
    } else {
        CONFIG = MAINNET_CONFIG;
    }
}
export function setConfigByUrl(search:URLSearchParams, hostname:string) {
    let network = 'mainnet'
    if (hostname === 'stx.eco') {
        setConfig(network)
        return
    }
    if (search.has('chain')) {
        network = search.get('chain') || 'mainnet'
    }
    setConfig(network)
}
/**
export function setConfig(network:string) {
    const mode = import.meta.env.MODE
    console.log('mode: ' + mode)
    if (mode === 'shared-devenv') {
        CONFIG = SHARED_DEVENV_CONFIG;
        return;
    } else if (mode === 'shared-devenv-local') {
        CONFIG = SHARED_DEVENV_LOCAL_CONFIG;
        return;
    } else if (mode === 'local-testnet') {
        CONFIG = TESTNET_CONFIG;
        CONFIG.VITE_BRIDGE_API = 'http://localhost:3010/bridge-api/v1';
        CONFIG.VITE_CLARITYLAB_API = 'http://localhost:3010/bridge-api/v1';
        return;
    } else if (mode === 'devenv'  || mode === 'dev' || mode === 'development') {
        CONFIG = DEVNET_CONFIG;
        return;
    }

    if (!network || network.length === 0 || network.indexOf('chain=') === -1) {
        network = 'testnet'
        CONFIG = TESTNET_CONFIG;
    } else if (network.indexOf('mainnet') > -1) {
        network = 'mainnet'
        CONFIG = MAINNET_CONFIG;
    } else {
        network = 'testnet'
        CONFIG = TESTNET_CONFIG;
    }
}
 */
