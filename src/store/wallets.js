import Deferred from 'promise-deferred';
import _ from 'lodash';
import Vue from 'vue';
import { WALLETS } from '@/utils/values';

export default {
  walletMap: WALLETS.reduce(
    (pre, cur) => ({ ...pre, [cur.symbol]: { ...cur, deferred: new Deferred() } }),
    {},
  ),
  getters: {
    wallets: state => Object.values(state.walletMap),
    getWallet: state => symbol => state.walletMap[symbol],
    getWalletsByChainId: (state, getters) => chainId =>
      getters.wallets.filter(wallet => wallet.supportedChainIds.includes(chainId)),
  },
  mutations: {
    setWallet(state, wallet) {
      Vue.set(state.walletMap, wallet.symbol, wallet);
    },
  },
  actions: {
    updateWallet({ getters, commit }, wallet) {
      const oldValue = getters.getWallet(wallet.symbol);
      const newValue = { ...oldValue, ...wallet };
      if (!_.isEqual(oldValue, newValue)) {
        commit('setWallet', newValue);
      }
    },
  },
};
