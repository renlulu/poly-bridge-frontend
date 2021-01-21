import { list, model, alias } from '@/utils/serializr';

export const token = model({
  hash: alias('Hash'),
  chainId: alias('ChainId'),
  name: alias('Name'),
  tokenBasicName: alias('TokenBasicName'),
  tokenBasic: alias(
    'TokenBasic',
    model({
      name: alias('Name'),
      precision: alias('Precision'),
    }),
  ),
});

export const tokenBasic = model({
  name: alias('Name'),
  precision: alias('Precision'),
  tokens: alias(
    'Tokens',
    list(
      model({
        hash: alias('Hash'),
        chainId: alias('ChainId'),
        name: alias('Name'),
        tokenBasicName: alias('TokenBasicName'),
      }),
    ),
  ),
});

export const tokenMap = model({
  fromToken: alias('SrcToken', token),
  toToken: alias('DstToken', token),
});

export const transactionStep = model({
  hash: alias('Hash'),
  chainId: alias('ChainId'),
  blocks: alias('Blocks'),
  needBlocks: alias('NeedBlocks'),
  time: alias('Time'),
});

export const transaction = model({
  hash: alias('Hash'),
  fromChainId: alias('SrcChainId'),
  toChainId: alias('DstChainId'),
  fromAddress: alias('User'),
  toAddress: alias('DstUser'),
  token: alias('Token', token),
  amount: alias('Amount'),
  time: alias('Time'),
  status: alias('State'),
  steps: alias('TransactionState', list(transactionStep)),
});
