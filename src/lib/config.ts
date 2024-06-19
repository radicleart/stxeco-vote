import { switchConfig } from "$stores/stores_config";
import type { HeaderLink } from "$types/local_types";

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
    VITE_POX4_API: string;
    VITE_STACKS_API_HIRO: string;
    VITE_STACKS_API_HIRO_WS: string;
    VITE_STACKS_API: string;
    VITE_STACKS_WS: string;
    VITE_STACKS_EXPLORER: string;
    VITE_BSTREAM_EXPLORER: string;
    VITE_MEMPOOL_EXPLORER: string;
    VITE_EXTENSIONS: Array<string>;
    VITE_HEADER_LINKS: Array<HeaderLink>;
}
  
export const config: { [key: string]: Config } = {
    "testnet": {
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
        VITE_BRIDGE_API: 'https://testnet.stx.eco/bridge-api/v1',
        VITE_POX4_API: 'https://testnet.stx.eco/bridge-api/v4',
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
        ],
        VITE_HEADER_LINKS: [
            {name: '/voting', href: 'http://localhost:8080', display: 'Voting', target:'_self'},
            {name: '/sip', href: '/sip', display: 'Upcoming SIPs', target:'_self'},
            //{name: '/insights', href: 'http://localhost:8082/insights', display: 'Insights', target:'_self'},
            //{name: '/dao-launcher', href: '/launcher/dao-launcher', display: 'DAO Launcher', target:'_self'},
            //{name: '/shop-front', href: 'http://localhost:8086/shop-front', display: 'Shop Front', target:'_self'}
        ]
    },
    "mainnet": {
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
        VITE_BRIDGE_API: 'https://stx.eco/bridge-api/v1',
        VITE_POX4_API: 'https://stx.eco/bridge-api/v4',
        VITE_STACKS_API_HIRO: 'https://api.hiro.so',
        VITE_STACKS_API_HIRO_WS: 'wss://api.hiro.so',
        VITE_STACKS_API: 'https://api.hiro.so',
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
        ],
        VITE_HEADER_LINKS: [
            {name: '/voting', href: 'https://stx.eco', display: 'Past Votes', target:'_self',
                items: [
                    //{name: '/edp015-sip-activation', href: 'https://stx.eco/dao/proposals/SP3JP0N1ZXGASRJ0F7QAHWFPGTVK9T2XNXDB908Z.edp015-sip-activation/results', display: 'SIP 015 Stacks 2.1 Upgrade', target:'_self'},
                    {name: '/bdp001-sip-021-nakamoto', href: 'https://stx.eco/dao/proposals/SP3JP0N1ZXGASRJ0F7QAHWFPGTVK9T2XNXDB908Z.bdp001-sip-021-nakamoto/results?method=1', display: 'SIP 021 Nakamoto Upgrade', target:'_self'},
                ]
            },
            {name: '/sip', href: '/sip', display: 'Upcoming Votes', target:'_self'},
            {name: '/insights', href: 'https://stx.eco/insights', display: 'Insights', target:'_self'},
            {name: '/dao-launcher', href: 'https://stx.eco/launcher', display: 'DAO', target:'_self'},
            {name: '/shop-front', href: 'https://stx.eco/shop-front', display: 'Shop Front', target:'_self'},
        ]
    }
};
