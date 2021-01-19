import { list, model, alias } from '@/utils/serializr';

export const token = model({
  hash: alias('Hash'),
  chainId: alias('ChainId'),
  name: alias('Name'),
  tokenBasicName: alias('TokenBasicName'),
});

export const tokenBasic = model({
  name: alias('Name'),
  precision: alias('Precision'),
  tokens: alias('Tokens', list(token)),
});

export const tokenMap = model({
  fromToken: alias('SrcToken', token),
  toToken: alias('DstToken', token),
});
