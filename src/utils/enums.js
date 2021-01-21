import { TARGET_MAINNET } from '@/utils/env';

export const WalletName = {
  Metamask: 'Metamask',
  NeoLine: 'NeoLine',
  O3: 'O3',
  Binance: 'Binance',
};

export const ChainId = {
  Poly: 0,
  Eth: 2,
  Neo: TARGET_MAINNET ? 4 : 5,
  Bsc: 79, // TODO
  Heco: 7, // TODO
};

export const TransactionStatus = {
  Finished: 0,
  Pending: 1,
  SourceDone: 2,
  SourceConfirmed: 3,
  PolyConfirmed: 4,
};
