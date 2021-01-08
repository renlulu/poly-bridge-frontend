import { ChainError } from '@/utils/errors';
import { CHAIN_ID_ETHEREUM, CHAIN_ID_NEO, CHAIN_ID_BINANCE, CHAIN_ID_HUOBI } from '@/utils/values';

const APIS = {
  [CHAIN_ID_ETHEREUM]: () => import('./ethereum'),
  [CHAIN_ID_NEO]: () => import('./neo'),
  [CHAIN_ID_BINANCE]: () => import('./ethereum'),
  [CHAIN_ID_HUOBI]: () => import('./ethereum'),
};

export async function getChainApi(chainId) {
  if (!APIS[chainId]) {
    throw new ChainError('Chain is not supported', {
      code: ChainError.CODES.NOT_SUPPORTED,
    });
  }
  return (await APIS[chainId]()).default;
}
