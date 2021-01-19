import Vue from 'vue';
import { CHAINS } from '@/utils/values';
import { toStandardHex, objectToBase64, base64ToObject } from '@/utils/convertors';
import { WalletError } from '@/utils/errors';

const CHAIN_SELECTED_WALLETS_KEY = 'CHAIN_SELECTED_WALLETS';

export default {
  state: {
    chainMap: CHAINS.reduce((pre, cur) => {
      const lockContractHash = cur.lockContractHash && toStandardHex(cur.lockContractHash);
      return { ...pre, [cur.id]: { ...cur, lockContractHash } };
    }, {}),
    chainSelectedWalletMap: {},
  },
  getters: {
    chains: (state, getters) => {
      return Object.keys(state.chainMap).map(key => getters.getChain(key));
    },
    getChain: state => id => {
      const chain = state.chainMap[id];
      if (!chain) {
        return null;
      }
      return { ...chain, selectedWalletName: state.chainSelectedWalletMap[id] };
    },
    getChainConnectedWallet: (state, getters) => id => {
      const wallet = getters.getWallet(state.chainSelectedWalletMap[id]);
      return wallet && wallet.connected ? wallet : null;
    },
    getChainWalletReady: (state, getters) => id => {
      const wallet = getters.getChainConnectedWallet(id);
      return wallet && wallet.chainId === id;
    },
  },
  mutations: {
    setChainSelectedWallet(state, { chainId, walletName }) {
      Vue.set(state.chainSelectedWalletMap, chainId, walletName);
    },
    setChainSelectedWalletMap(state, map) {
      state.chainSelectedWalletMap = map;
    },
  },
  actions: {
    loadChainSelectedWallets({ commit }) {
      const data = base64ToObject(sessionStorage.getItem(CHAIN_SELECTED_WALLETS_KEY), null);
      if (data) {
        commit('setChainSelectedWalletMap', data);
      }
    },
    saveChainSelectedWallets({ state }) {
      const data = objectToBase64(state.chainSelectedWalletMap);
      sessionStorage.setItem(CHAIN_SELECTED_WALLETS_KEY, data);
    },
    setChainSelectedWallet({ commit, dispatch }, { chainId, walletName }) {
      commit('setChainSelectedWallet', { chainId, walletName });
      dispatch('saveChainSelectedWallets');
    },
    async ensureChainWalletReady({ getters }, chainId) {
      if (!getters.getChainConnectedWallet(chainId)) {
        throw new WalletError('Wallet is not connected.', {
          code: WalletError.CODES.NOT_CONNECTED,
        });
      }
      if (!getters.getChainWalletReady(chainId)) {
        throw new WalletError('Wallet is not in correct network.', {
          code: WalletError.CODES.INCORRECT_NETWORK,
        });
      }
    },
  },
};
