import { TARGET_MAINNET } from '@/utils/env';

export const WalletName = {
  MetaMask: 'MetaMask',
  NeoLine: 'NeoLine',
  O3: 'O3',
  Binance: 'Binance',
  Cyano: 'Cyano',
  WalletConnect: 'WalletConnnect',
};

export const ChainId = {
  Poly: 0,
  Eth: 2,
  Ont: 3,
  Neo: TARGET_MAINNET ? 4 : 5,
  Bsc: TARGET_MAINNET ? 6 : 79,
  Heco: 7,
};

export const SingleTransactionStatus = {
  Failed: -1,
  Pending: 1,
  Done: 2,
};

export const TransactionStatus = {
  Failed: -1,
  Finished: 0,
  Pending: 1,
  SourceDone: 2,
  SourceConfirmed: 3,
  PolyConfirmed: 4,
};
