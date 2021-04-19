import { WalletName, ChainId } from './enums';
import { TARGET_MAINNET } from './env';

export const HTTP_BASE_URL = TARGET_MAINNET
  ? 'https://bridge.poly.network/v1'
  : 'https://bridge.poly.network/testnet/v1';

export const HTTP_NFT_BASE_URL = TARGET_MAINNET
  ? 'https://bridge.poly.network/nft/v1'
  : 'https://bridge.poly.network/testnet/nft/v1';

export const WALLETS = [
  {
    name: WalletName.MetaMask,
    supportedChainIds: [ChainId.Eth, ChainId.Bsc, ChainId.Heco],
    icon: require('@/assets/svg/meta-mask.svg'),
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
  {
    name: WalletName.Cyano,
    supportedChainIds: [ChainId.Ont],
    icon: require('@/assets/svg/ONT.svg'),
    downloadUrl:
      'https://chrome.google.com/webstore/detail/cyano-wallet/dkdedlpgdmmkkfjabffeganieamfklkm',
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
      ? '0x2aA63cd0b28FB4C31fA8e4E95Ec11815Be07b9Ac'
      : '0xe498fb7D00468a67A79dE5D4Ca264d3350165280',
    nftLockContractHash: TARGET_MAINNET
      ? '0xbaBaAF5CF7f63437755aAAFE7a4106463c5cD540'
      : '0xbaBaAF5CF7f63437755aAAFE7a4106463c5cD540',
    nftFeeContractHash: '0000000000000000000000000000000000000000',
    nftFeeName: 'ETH'
  },
  {
    id: ChainId.Neo,
    icon: require('@/assets/svg/neo.svg'),
    explorerUrl: TARGET_MAINNET
      ? 'https://neotube.io/transaction/0x{txHash}'
      : 'https://testnet.neotube.io/transaction/0x{txHash}',
    lockContractHash: TARGET_MAINNET
      ? '125c83403763670c215f9c7c815ef759b258a41b'
      : 'cd074cd290acc3d73c030784101afbcf40fd86a1',
  },
  {
    id: ChainId.Bsc,
    icon: require('@/assets/svg/bsc.svg'),
    explorerUrl: TARGET_MAINNET
      ? 'https://bscscan.com/tx/0x{txHash}'
      : 'https://testnet.bscscan.com/tx/0x{txHash}',
    lockContractHash: TARGET_MAINNET
      ? '0xE3D0FB6E3cB5DA61EB18b06D035052441009d1E6'
      : '0xCed7997C3e807Fcdc5ac18fFC0B8af93a15a9eE5',
    nftLockContractHash: TARGET_MAINNET
      ? '0x2E830E0cf3dc8643B497F88C07c8A72EFE24B11f'
      : '0x2E830E0cf3dc8643B497F88C07c8A72EFE24B11f',
    nftFeeContractHash: '0000000000000000000000000000000000000000',
    nftFeeName: 'BNB'
  },
  {
    id: ChainId.Heco,
    icon: require('@/assets/svg/heco.svg'),
    explorerUrl: TARGET_MAINNET
      ? 'https://hecoinfo.com/tx/0x{txHash}'
      : 'https://testnet.hecoinfo.com/tx/0x{txHash}',
    lockContractHash: TARGET_MAINNET
      ? '0x4fE451186c0D69205ACc1fA00FD75fc6d71e47eE'
      : '0x3c92F1E31aACA43Eb4fF8aE498C7E85618680F45',
    nftLockContractHash: TARGET_MAINNET
      ? '0x94aa42C5dAB9b1006f59FF5E311344CC460A2335'
      : '0x94aa42C5dAB9b1006f59FF5E311344CC460A2335',
    nftFeeContractHash: '0000000000000000000000000000000000000000',
    nftFeeName: 'HT'
  },
  {
    id: ChainId.Ont,
    icon: require('@/assets/svg/ONT.svg'),
    explorerUrl: TARGET_MAINNET
      ? 'https://explorer.ont.io/transaction/{txHash}'
      : 'https://explorer.ont.io/transaction/{txHash}/testnet',
    lockContractHash: TARGET_MAINNET
      ? 'c93837e82178d406af8c84e1841c6960af251cb5'
      : 'a5c101afa9e04e9dd2c912983795005a49e02efa',
  },
];

export const UNKNOWN_ICON = require('@/assets/svg/unknown.svg');
export const UNKNOWN_NFT = require('@/assets/png/nft.png');

export const TOKEN_BASIC_ICONS = {
  NEO: require('@/assets/svg/neo-token.svg'),
  nNEO: require('@/assets/svg/neo-token.svg'),
  ETH: require('@/assets/svg/eth-token.svg'),
  USDT: require('@/assets/svg/usdt.svg'),
  USDC: require('@/assets/svg/usdc.svg'),
  DAI: require('@/assets/svg/dai.svg'),
  sUSD: require('@/assets/svg/susd.svg'),
  BAC: require('@/assets/svg/bac.svg'),
  BASv2: require('@/assets/svg/basv2.svg'),
  CWS: require('@/assets/png/cws.png'),
  SHARE: require('@/assets/svg/share.svg'),
  FLM: require('@/assets/svg/flm.svg'),
  SWTH: require('@/assets/svg/swth.svg'),
  ONTd: require('@/assets/svg/ONT.svg'),
  WING: require('@/assets/svg/wing.svg'),
  YFI: require('@/assets/svg/YFI.svg'),
  UNI: require('@/assets/svg/UNI.svg'),
  UNFI: require('@/assets/svg/UNFI.svg'),
  MDX: require('@/assets/svg/mdx.svg'),
  WBTC: require('@/assets/svg/WBTC.svg'),
  renBTC: require('@/assets/svg/renBTC.svg'),
  COOK: require('@/assets/svg/cook.svg'),
  FEI: require('@/assets/png/fei.png'),
  Tribe: require('@/assets/png/tribe.png'),
  YNI: require('@/assets/png/yni.png'),
  REVO: require('@/assets/svg/revo.svg'),
  revo: require('@/assets/svg/revo.svg'),
  Revo: require('@/assets/svg/revo.svg'),
  ESS: require('@/assets/svg/ESS.svg'),
  Bles: require('@/assets/svg/bles.svg'),
  BLES: require('@/assets/svg/bles.svg'),
  aDAI: require('@/assets/svg/adai.svg'),
  aETH: require('@/assets/svg/aeth.svg'),
  cDAI: require('@/assets/svg/cdai.svg'),
  cETH: require('@/assets/svg/ceth.svg'),
  FLUX: require('@/assets/svg/flux.svg'),
  CVT: require('@/assets/svg/cvt.svg'),
  KEL: require('@/assets/png/kel.png'),
  SHIB: require('@/assets/png/shib.png'),
  Shib: require('@/assets/png/shib.png'),
  '8PAY': require('@/assets/jpg/8pay.jpg'),
};

export const DEFAULT_TOKEN_BASIC_NAME = 'USDT';
export const DEFAULT_CHAIN_NAME = 'ETH';

export const TOP_TOKEN_BASIC_NAMES = ['NEO', 'nNEO', 'ETH', 'USDT', 'USDC', 'DAI'];
