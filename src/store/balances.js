import Vue from 'vue';
import getStoreKey from '@/utils/getStoreKey';
import { getWalletApi } from '@/utils/walletApi';

export default {
  state: {
    balanceMap: {},
  },
  getters: {
    getBalance: state => ({ chainId, address, tokenHash }) =>
      state.balanceMap[getStoreKey({ chainId, address, tokenHash })],
  },
  mutations: {
    setBalance(state, { params, value }) {
      Vue.set(state.balanceMap, getStoreKey(params), value);
    },
  },
  actions: {
    async getBalance({ getters, commit }, { chainId, address, tokenHash }) {
      const wallet = getters.getChainConnectedWallet(chainId);
      if (!wallet) {
        return;
      }
      const walletApi = await getWalletApi(wallet.name);
      const balance = await walletApi.getBalance({ chainId, address, tokenHash });
      const oldValue = getters.getBalance({ chainId, address, tokenHash });
      if (oldValue !== balance) {
        commit('setBalance', { params: { chainId, address, tokenHash }, value: balance });
      }
    },
  },
};
