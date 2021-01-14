import { ChainError } from '@/utils/errors';
import { CHAIN_ID_ETH, CHAIN_ID_NEO, CHAIN_ID_BSC, CHAIN_ID_HECO } from '@/utils/values';

const APIS = {
  [CHAIN_ID_ETH]: () => import('./eth'),
  [CHAIN_ID_NEO]: () => import('./neo'),
  [CHAIN_ID_BSC]: () => import('./eth'),
  [CHAIN_ID_HECO]: () => import('./eth'),
};

export async function getChainApi(chainId) {
  if (!APIS[chainId]) {
    throw new ChainError('Chain is not supported', {
      code: ChainError.CODES.NOT_SUPPORTED,
    });
  }
  return (await APIS[chainId]()).default;
}
