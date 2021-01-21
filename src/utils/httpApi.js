import axios from 'axios';
import _ from 'lodash';
import { getChainApi } from '@/utils/chainApi';
import { HttpError } from './errors';
import { mapTransactionToDo } from './mappers';
import { HTTP_BASE_URL } from './values';
import * as schemas from './schemas';
import { deserialize, list } from './serializr';

const request = axios.create({
  baseURL: HTTP_BASE_URL,
  headers: { 'content-type': 'application/json' },
});

request.interceptors.response.use(
  response => {
    return response.data;
  },
  async error => {
    const { response } = error;
    let newError = error;
    if (response) {
      let code = HttpError.CODES.UNKNOWN_ERROR;
      if (response.status === 400) {
        code = HttpError.CODES.BAD_REQUEST;
      } else if (response.status === 500) {
        code = HttpError.CODES.INTERNAL_SERVICE_ERROR;
      }
      newError = new HttpError(response.data.message, { cause: error, code });
    } else {
      newError = new HttpError(error.message || 'Network Error', {
        cause: error,
        code: HttpError.CODES.NETWORK_ERROR,
      });
    }
    throw newError;
  },
);

export default {
  async getTokenBasics() {
    const result = await request({ method: 'post', url: '/tokenbasics', data: {} });
    const tokenBasics = deserialize(list(schemas.tokenBasic), result.TokenBasics || []);
    const tokens = _.flatMap(tokenBasics, tokenBasic => tokenBasic.tokens || []);
    return { tokenBasics, tokens };
  },
  async getTokenMaps({ fromChainId, fromTokenHash }) {
    const result = await request({
      method: 'post',
      url: '/tokenmap',
      data: {
        ChainId: fromChainId,
        Hash: fromTokenHash,
      },
    });
    const tokenMaps = deserialize(list(schemas.tokenMap), result.TokenMaps);
    return tokenMaps;
  },
  async getFee({ fromChainId, fromTokenHash, toChainId }) {
    const result = await request({
      method: 'post',
      url: '/getfee',
      data: {
        SrcChainId: fromChainId,
        Hash: fromTokenHash,
        DstChainId: toChainId,
      },
    });
    return result.TokenAmount;
  },
  async getTransactions({ addressAndChainIds, page, pageSize }) {
    const addressHexs = await Promise.all(
      addressAndChainIds.map(async addressAndChainId => {
        const chainApi = await getChainApi(addressAndChainId.chainId);
        return chainApi.addressToHex(addressAndChainId.address);
      }),
    );

    const result = await request({
      method: 'post',
      url: 'transactionsofaddress',
      data: {
        Addresses: addressHexs,
        PageNo: page - 1,
        PageSize: pageSize,
      },
    });
    const transactions = deserialize(list(schemas.transaction), result.Transactions || []);
    return {
      items: transactions.map(mapTransactionToDo),
      pageCount: result.TotalPage,
    };
  },
  async getTransaction({ hash }) {
    const result = await request({
      method: 'post',
      url: 'transactionofhash',
      data: {
        Hash: hash,
      },
    });
    const transaction = deserialize(schemas.transaction, result);
    return mapTransactionToDo(transaction);
  },
};
