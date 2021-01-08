import Vue from 'vue';
import { CHAINS } from '@/utils/values';
import { toStandardHex, serialize, deserialize } from '@/utils/convertors';

const CHAIN_SELECTED_WALLETS_KEY = 'CHAIN_SELECTED_WALLETS';

export default {
  state: {
    chainMap: CHAINS.reduce((pre, cur) => {
      const lockContractHash = cur.lockContractHash && toStandardHex(cur.lockContractHash);
      const unlockContractHash = cur.unlockContractHash && toStandardHex(cur.unlockContractHash);
      return { ...pre, [cur.id]: { ...cur, lockContractHash, unlockContractHash } };
    }, {}),
    chainSelectedWalletMap: {},
  },
  getters: {
    chains: state => Object.values(state.chainMap),
    getChain: state => id => state.chainMap[id],
    getChainSelectedWallet: (state, getters) => id => {
      const wallet = getters.getWallet(state.chainSelectedWalletMap[id]);
      return wallet && wallet.supportedChainIds.includes(id) ? wallet : null;
    },
    getChainConnnectedWallet: (state, getters) => id => {
      const wallet = getters.getChainSelectedWallet(id);
      return wallet && wallet.connected ? wallet : null;
    },
  },
  mutations: {
    setChainSelectedWallet(state, { chainId, walletSymbol }) {
      Vue.set(state.chainSelectedWalletMap, chainId, walletSymbol);
    },
    setChainSelectedWalletMap(state, map) {
      this.chainSelectedWalletMap = map;
    },
  },
  actions: {
    loadChainSelectedWallets({ commit }) {
      const data = deserialize(sessionStorage.getItem(CHAIN_SELECTED_WALLETS_KEY), null);
      if (data) {
        commit('setChainSelectedWalletMap', data);
      }
    },
    saveChainSelectedWallets({ commit, getters }) {
      const data = serialize(getters.chainSelectedWalletMap);
      sessionStorage.setItem(CHAIN_SELECTED_WALLETS_KEY, data);
    },
    setChainSelectedWallets({ commit }, { chainId, walletSymbol }) {
      commit('setChainSelectedWallet', { chainId, walletSymbol });
    },
  },
};
