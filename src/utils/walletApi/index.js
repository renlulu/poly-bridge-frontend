import { WalletError } from '@/utils/errors';
import {
  WALLET_SYMBOL_METAMASK,
  WALLET_SYMBOL_NEOLINE,
  WALLET_SYMBOL_O3,
  WALLET_SYMBOL_BINANCE,
} from '@/utils/values';

const APIS = {
  [WALLET_SYMBOL_METAMASK]: () => import('./metamask'),
  [WALLET_SYMBOL_NEOLINE]: () => import('./neoline'),
  [WALLET_SYMBOL_O3]: () => import('./o3'),
  [WALLET_SYMBOL_BINANCE]: () => import('./binance'),
};

export async function getWalletApi(walletSymbol) {
  if (!APIS[walletSymbol]) {
    throw new WalletError('Wallet is not supported', {
      code: WalletError.CODES.NOT_SUPPORTED,
    });
  }
  return (await APIS[walletSymbol]()).default;
}
