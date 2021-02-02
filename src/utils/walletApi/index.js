import { WalletError } from '@/utils/errors';
import { WalletName } from '@/utils/enums';

const APIS = {
  [WalletName.Metamask]: () => import('./metamask'),
  [WalletName.NeoLine]: () => import('./neoline'),
  [WalletName.O3]: () => import('./o3'),
  [WalletName.Binance]: () => import('./binance'),
};

export async function getWalletApi(walletName) {
  if (!APIS[walletName]) {
    throw new WalletError('Wallet is not supported', {
      code: WalletError.CODES.NOT_SUPPORTED,
    });
  }
  return (await APIS[walletName]()).default;
}
