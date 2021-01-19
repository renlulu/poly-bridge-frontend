import Vue from 'vue';
import getStoreKey from '@/utils/getStoreKey';
import httpApi from '@/utils/httpApi';

export default {
  state: {
    feeMap: {},
  },
  getters: {
    getFee: state => ({ fromChainId, fromTokenHash, toChainId }) =>
      state.feeMap[getStoreKey({ fromChainId, fromTokenHash, toChainId })],
  },
  mutations: {
    setFee(state, { params, value }) {
      Vue.set(state.feeMap, getStoreKey(params), value);
    },
  },
  actions: {
    async getFee({ commit }, { fromChainId, fromTokenHash, toChainId }) {
      const fee = await httpApi.getFee({ fromChainId, fromTokenHash, toChainId });
      commit('setFee', { params: { fromChainId, fromTokenHash, toChainId }, value: fee });
    },
  },
};
