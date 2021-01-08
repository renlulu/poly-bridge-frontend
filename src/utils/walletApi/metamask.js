import Web3 from 'web3';
import store from '@/store';
import { WalletError } from '@/utils/errors';
import {
  TARGET_MAINNET,
  WALLET_SYMBOL_METAMASK,
  CHAIN_ID_ETHEREUM,
  CHAIN_ID_BINANCE,
  CHAIN_ID_HUOBI,
} from '@/utils/values';

const NETWORK_CHAIN_ID_MAPS = {
  [TARGET_MAINNET ? 1 : 3]: CHAIN_ID_ETHEREUM,
  [TARGET_MAINNET ? 56 : 97]: CHAIN_ID_BINANCE,
  [TARGET_MAINNET ? 128 : 256]: CHAIN_ID_HUOBI,
};

let web3;

function convertWalletError(error) {
  if (error instanceof WalletError) {
    return error;
  }
  let code = WalletError.CODES.UNKNOWN_ERROR;
  if (error.code === 4001) {
    code = WalletError.CODES.USER_REJECTED;
  }
  return new WalletError(error.message, { code, cause: error });
}

async function init() {
  try {
    if (!window.ethereum) {
      return;
    }
    web3 = new Web3(window.ethereum);
    store.dispatch('updateWallet', { symbol: WALLET_SYMBOL_METAMASK, installed: true });

    {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const address = accounts[0] || null;
      const checksumAddress = address && web3.utils.toChecksumAddress(address);
      store.dispatch('updateWallet', {
        symbol: WALLET_SYMBOL_METAMASK,
        address: checksumAddress,
        connected: !!checksumAddress,
      });
    }

    window.ethereum.on('accountsChanged', accounts => {
      const address = accounts[0] || null;
      const checksumAddress = address && web3.utils.toChecksumAddress(address);
      store.dispatch('updateWallet', {
        symbol: WALLET_SYMBOL_METAMASK,
        address: checksumAddress,
        connected: !!checksumAddress,
      });
    });

    {
      const network = await window.ethereum.request({ method: 'net_version' });
      store.dispatch('updateWallet', {
        symbol: WALLET_SYMBOL_METAMASK,
        chainId: NETWORK_CHAIN_ID_MAPS[network],
      });
    }

    window.ethereum.on('networkChanged', network => {
      store.dispatch('updateWallet', {
        symbol: WALLET_SYMBOL_METAMASK,
        chainId: NETWORK_CHAIN_ID_MAPS[network],
      });
    });
  } finally {
    store.getters.getWallet(WALLET_SYMBOL_METAMASK).deferred.resolve();
  }
}

async function connect() {
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  } catch (error) {
    throw convertWalletError(error);
  }
}

export default {
  install: init,
  connect,
};
