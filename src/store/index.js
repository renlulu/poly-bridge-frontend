import Vue from 'vue';
import Vuex from 'vuex';
import chains from './chains';
import wallets from './wallets';
import tokenBasics from './tokenBasics';
import tokens from './tokens';
import transactions from './transactions';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    chains,
    wallets,
    tokenBasics,
    tokens,
    transactions,
  },
});
