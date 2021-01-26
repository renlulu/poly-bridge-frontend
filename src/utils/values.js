/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
import { WalletName, ChainId } from './enums';
import { TARGET_MAINNET } from './env';

export const HTTP_BASE_URL = TARGET_MAINNET
  ? 'http://40.115.153.174:30330/v1'
  : 'http://40.115.153.174:30330/v1'; // TODO

export const WALLETS = [
  {
    name: WalletName.Metamask,
    supportedChainIds: [ChainId.Eth, ChainId.Bsc, ChainId.Heco],
    icon: require('@/assets/svg/metamask.svg'),
    downloadUrl:
      'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
  },
  {
    name: WalletName.NeoLine,
    supportedChainIds: [ChainId.Neo],
    icon: require('@/assets/svg/neoline.svg'),
    downloadUrl:
      'https://chrome.google.com/webstore/detail/neoline/cphhlgmgameodnhkjdmkpanlelnlohao',
  },
  {
    name: WalletName.O3,
    supportedChainIds: [ChainId.Neo],
    icon: require('@/assets/svg/o3.svg'),
    downloadUrl: 'https://o3.network/#download',
  },
  {
    name: WalletName.Binance,
    supportedChainIds: [ChainId.Bsc],
    icon: require('@/assets/svg/binance.svg'),
    downloadUrl:
      'https://chrome.google.com/webstore/detail/binance-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp',
  },
];

export const CHAINS = [
  {
    id: ChainId.Poly,
    explorerUrl: TARGET_MAINNET
      ? 'http://explorer.poly.network/tx/{txHash}'
      : 'http://explorer.poly.network/testnet/tx/{txHash}',
  },
  {
    id: ChainId.Eth,
    icon: require('@/assets/svg/eth.svg'),
    explorerUrl: TARGET_MAINNET
      ? 'https://etherscan.io/tx/0x{txHash}'
      : 'https://ropsten.etherscan.io/tx/0x{txHash}',
    lockContractHash: TARGET_MAINNET
      ? '0x250e76987d838a75310c34bf422ea9f1AC4Cc906'
      : '0xe498fb7D00468a67A79dE5D4Ca264d3350165280',
  },
  {
    id: ChainId.Neo, // TODO
    icon: require('@/assets/svg/neo.svg'),
    explorerUrl: TARGET_MAINNET
      ? 'https://neotube.io/transaction/0x{txHash}'
      : 'https://testnet.neotube.io/transaction/0x{txHash}',
    lockContractHash: TARGET_MAINNET
      ? 'f263ca001a7fdeea43a45300c01bb99713809de7'
      : 'cd074cd290acc3d73c030784101afbcf40fd86a1',
  },
  {
    id: ChainId.Bsc, // TODO
    icon: require('@/assets/svg/bsc.svg'),
    explorerUrl: TARGET_MAINNET
      ? 'https://bscscan.com/tx/0x{txHash}'
      : 'https://testnet.bscscan.com/tx/0x{txHash}',
    lockContractHash: TARGET_MAINNET
      ? '0x250e76987d838a75310c34bf422ea9f1AC4Cc906'
      : '0xCed7997C3e807Fcdc5ac18fFC0B8af93a15a9eE5',
  },
  {
    id: ChainId.Heco, // TODO
    icon: require('@/assets/svg/heco.svg'),
    explorerUrl: TARGET_MAINNET
      ? 'https://scan.hecochain.com/tx/0x{txHash}'
      : 'https://scan-testnet.hecochain.com/tx/0x{txHash}',
    lockContractHash: TARGET_MAINNET
      ? '0x250e76987d838a75310c34bf422ea9f1AC4Cc906'
      : '0x3c92F1E31aACA43Eb4fF8aE498C7E85618680F45',
  },
];

export const TOKEN_BASIC_ICONS = {
  NEO: require('@/assets/svg/neo-token.svg'),
  Ethereum: require('@/assets/svg/eth-token.svg'),
};

export const UNKNOWN_ICON = require('@/assets/svg/unknown.svg');

export const DEFAULT_TOKEN_BASIC_NAME = 'USDT';

export const TOP_TOKEN_BASIC_NAMES = ['NEO', 'Ethereum', 'USDT', 'USDC', 'DAI'];
