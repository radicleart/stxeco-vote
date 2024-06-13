
export interface Config {
    VITE_ENVIRONMENT:string;
    VITE_PUBLIC_APP_NAME: string;
    VITE_PUBLIC_APP_VERSION: string;
    VITE_API_BACKEND: string;
    VITE_API_STXECO: string;
    VITE_NETWORK: string;
    VITE_DOA_DEPLOYER: string;
    VITE_DOA: string;
    VITE_DOA_PROPOSAL: string;
    VITE_DOA_SNAPSHOT_VOTING_EXTENSION: string;
    VITE_DOA_PROPOSAL_VOTING_EXTENSION: string;
    VITE_DOA_FUNDED_SUBMISSION_EXTENSION: string;
    VITE_DOA_EMERGENCY_EXECUTE_EXTENSION: string;
    VITE_SBTC_COORDINATOR: string;
    VITE_SBTC_CONTRACT_ID: string;
    VITE_POX4_CONTRACT_ID: string;
    VITE_BRIDGE_API: string;
    VITE_REVEALER_API: string;
    VITE_POX4_API: string;
    VITE_STACKS_API_HIRO: string;
    VITE_STACKS_API_HIRO_WS: string;
    VITE_STACKS_API: string;
    VITE_STACKS_WS: string;
    VITE_STACKS_EXPLORER: string;
    VITE_BSTREAM_EXPLORER: string;
    VITE_MEMPOOL_EXPLORER: string;
    VITE_EXTENSIONS: Array<string>
}
  
export const config: { [key: string]: Config } = {
    "local": {
        VITE_API_BACKEND: '',
        VITE_API_STXECO: '',
        VITE_ENVIRONMENT: 'testnet',
        VITE_PUBLIC_APP_NAME: 'Stacks Ecosystem DAO Testnet',
        VITE_PUBLIC_APP_VERSION: '1.0.0',
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
        VITE_POX4_CONTRACT_ID: 'ST000000000000000000002AMW42H.pox-4',
        VITE_REVEALER_API: 'https://testnet.bridge.sbtc.tech/revealer-api/v1',
        VITE_BRIDGE_API: 'https://testnet.bridge.sbtc.tech/bridge-api/v1',
        VITE_POX4_API: 'https://testnet.bridge.sbtc.tech/bridge-api/v4',
        VITE_STACKS_API_HIRO: 'https://api.testnet.hiro.so',
        VITE_STACKS_API_HIRO_WS: 'wss://api.testnet.hiro.so',
        VITE_STACKS_API: 'https://api.testnet.hiro.so',
        VITE_STACKS_WS: 'ws://api.testnet.hiro.so',
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
        },
    "production": {
        VITE_API_BACKEND: '',
        VITE_API_STXECO: '',
        VITE_ENVIRONMENT: 'mainnet',
        VITE_PUBLIC_APP_NAME: 'Stacks Ecosystem DAO',
        VITE_PUBLIC_APP_VERSION: '1.0.0',
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
        VITE_POX4_CONTRACT_ID: 'SP000000000000000000002Q6VF78.pox-4',
        VITE_BRIDGE_API: 'https://mainnet.bridge.sbtc.tech/bridge-api/v1',
        VITE_REVEALER_API: 'https://mainnet.bridge.sbtc.tech/revealer-api/v1',
        VITE_POX4_API: 'https://mainnet.bridge.sbtc.tech/bridge-api/v4',
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
};

export let CONFIG = config['production'];

export function setConfig(network:string) {
    const mode = import.meta.env.MODE
    console.log('mode: ' + mode)

    if (network === 'testnet') {
        CONFIG = config['production'];
    } else {
        CONFIG = config['production'];
    }
}

export function setConfigByUrl(search:URLSearchParams) {
    let network = 'mainnet'
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
        CONFIG.VITE_BRIDGE_API = 'http://localhost:3010/bridge-api/v1';
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
