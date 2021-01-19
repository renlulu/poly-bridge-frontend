import axios from 'axios';
import _ from 'lodash';
import { HttpError } from './errors';
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
    const tokenBasics = deserialize(list(schemas.tokenBasic), result.TokenBasics);
    const tokens = _.flatMap(tokenBasics, tokenBasic => tokenBasic.tokens);
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
  async getTransactions({ addresses }) {
    return 0;
  },
  async getTransaction({ hash }) {
    return 0;
  },
};
