/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
export const IN_PRODUCTION = process.env.NODE_ENV === 'production';
export const TARGET_MAINNET = process.env.VUE_APP_TARGET === 'mainnet';

export const WALLET_SYMBOL_METAMASK = 'Metamask';
export const WALLET_SYMBOL_NEOLINE = 'NeoLine';
export const WALLET_SYMBOL_O3 = 'O3';
export const WALLET_SYMBOL_BINANCE = 'Binance';

export const CHAIN_ID_POLY = 0;
export const CHAIN_ID_ETH = 2;
export const CHAIN_ID_NEO = TARGET_MAINNET ? 4 : 5;
export const CHAIN_ID_BSC = 10; // TODO
export const CHAIN_ID_HECO = 11; // TODO

export const WALLETS = [
  {
    symbol: WALLET_SYMBOL_METAMASK,
    name: 'Metamask',
    supportedChainIds: [CHAIN_ID_ETH, CHAIN_ID_BSC, CHAIN_ID_HECO],
    icon: require('@/assets/svg/metamask.svg'),
    downloadUrl:
      'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
  },
  {
    symbol: WALLET_SYMBOL_NEOLINE,
    name: 'NeoLine',
    supportedChainIds: [CHAIN_ID_NEO],
    icon: require('@/assets/svg/neoline.svg'),
    downloadUrl:
      'https://chrome.google.com/webstore/detail/neoline/cphhlgmgameodnhkjdmkpanlelnlohao',
  },
  {
    symbol: WALLET_SYMBOL_O3,
    name: 'O3',
    supportedChainIds: [CHAIN_ID_NEO],
    icon: require('@/assets/svg/o3.svg'),
    downloadUrl: 'https://o3.network/#download',
  },
  {
    symbol: WALLET_SYMBOL_BINANCE,
    name: 'Binance',
    supportedChainIds: [CHAIN_ID_BSC],
    icon: require('@/assets/svg/binance.svg'),
    downloadUrl:
      'https://chrome.google.com/webstore/detail/binance-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp',
  },
];

export const CHAINS = [
  {
    id: CHAIN_ID_POLY,
    name: 'PolyNetwork',
    icon: require('@/assets/svg/poly.svg'),
    url: 'https://poly.network',
    explorerName: 'Transaction Browser',
    explorerUrl: TARGET_MAINNET
      ? 'http://explorer.poly.network/tx/{txHash}'
      : 'http://explorer.poly.network/testnet/tx/{txHash}',
  },
  {
    id: CHAIN_ID_ETH,
    name: 'Ethereum',
    icon: require('@/assets/svg/eth.svg'),
    explorerName: 'Etherscan',
    explorerUrl: TARGET_MAINNET
      ? 'https://etherscan.io/tx/0x{txHash}'
      : 'https://ropsten.etherscan.io/tx/0x{txHash}',
    lockContractHash: TARGET_MAINNET
      ? '0x250e76987d838a75310c34bf422ea9f1AC4Cc906'
      : '0xD8aE73e06552E270340b63A8bcAbf9277a1aac99',
    unlockContractHash: TARGET_MAINNET
      ? '0x838bf9e95cb12dd76a54c9f9d2e3082eaf928270'
      : '0x726532586C50ec9f4080B71f906a3d9779bbd64F',
  },
  {
    id: CHAIN_ID_NEO,
    name: 'Neo',
    icon: require('@/assets/svg/neo.svg'),
    explorerName: 'NeoTube',
    explorerUrl: TARGET_MAINNET
      ? 'https://neotube.io/transaction/0x{txHash}'
      : 'https://testnet.neotube.io/transaction/0x{txHash}',
    lockContractHash: TARGET_MAINNET
      ? 'f263ca001a7fdeea43a45300c01bb99713809de7'
      : 'c23143755be681f949f4c5fcfa5b4f8646dd34b5',
    unlockContractHash: TARGET_MAINNET
      ? '82a3401fb9a60db42c6fa2ea2b6d62e872d6257f'
      : 'e1695b1314a1331e3935481620417ed835669407',
  },
  {
    id: CHAIN_ID_BSC, // TODO
    name: 'Binance Smart Chain',
    icon: require('@/assets/svg/binance.svg'),
    explorerName: 'BscScan',
    explorerUrl: TARGET_MAINNET
      ? 'https://bscscan.com/tx/0x{txHash}'
      : 'https://testnet.bscscan.com/tx/0x{txHash}',
    lockContractHash: TARGET_MAINNET
      ? '0x250e76987d838a75310c34bf422ea9f1AC4Cc906'
      : '0xD8aE73e06552E270340b63A8bcAbf9277a1aac99',
    unlockContractHash: TARGET_MAINNET
      ? '0x838bf9e95cb12dd76a54c9f9d2e3082eaf928270'
      : '0x726532586C50ec9f4080B71f906a3d9779bbd64F',
  },
  {
    id: CHAIN_ID_HECO, // TODO
    name: 'Huobi ECO Chain',
    icon: require('@/assets/svg/heco.svg'),
    explorerName: 'HecoScan',
    explorerUrl: TARGET_MAINNET
      ? 'https://scan.hecochain.com/tx/0x{txHash}'
      : 'https://scan-testnet.hecochain.com/tx/0x{txHash}',
    lockContractHash: TARGET_MAINNET
      ? '0x250e76987d838a75310c34bf422ea9f1AC4Cc906'
      : '0xD8aE73e06552E270340b63A8bcAbf9277a1aac99',
    unlockContractHash: TARGET_MAINNET
      ? '0x838bf9e95cb12dd76a54c9f9d2e3082eaf928270'
      : '0x726532586C50ec9f4080B71f906a3d9779bbd64F',
  },
];

export const UNKNOWN_ICON = require('@/assets/svg/eth.svg'); // TODO

export const TOKEN_BASIC_ICONS = [
  {
    symbol: 'ETH',
    icon: require('@/assets/svg/eth-token.svg'),
  },
  {
    symbol: 'NEO',
    icon: require('@/assets/svg/neo-token.svg'),
  },
];
