import Web3 from 'web3';
import store from '@/store';
import { WalletError } from '@/utils/errors';
import { TARGET_MAINNET, WALLET_SYMBOL_BINANCE, CHAIN_ID_BINANCE } from '@/utils/values';

const BINANCE_CONNECTED_KEY = 'BINANCE_CONNECTED';

const NETWORK_CHAIN_ID_MAPS = {
  [TARGET_MAINNET ? 56 : 97]: CHAIN_ID_BINANCE,
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
    if (!window.BinanceChain) {
      return;
    }
    web3 = new Web3(window.BinanceChain);
    store.dispatch('updateWallet', { symbol: WALLET_SYMBOL_BINANCE, installed: true });

    if (sessionStorage.getItem(BINANCE_CONNECTED_KEY) === 'true') {
      const accounts = await window.BinanceChain.request({ method: 'eth_accounts' });
      const address = accounts[0] || null;
      const checksumAddress = address && web3.utils.toChecksumAddress(address);
      store.dispatch('updateWallet', {
        symbol: WALLET_SYMBOL_BINANCE,
        address: checksumAddress,
        connected: !!checksumAddress,
      });
    }

    window.BinanceChain.on('accountsChanged', accounts => {
      const address = accounts[0] || null;
      const checksumAddress = address && web3.utils.toChecksumAddress(address);
      store.dispatch('updateWallet', {
        symbol: WALLET_SYMBOL_BINANCE,
        address: checksumAddress,
        connected: !!checksumAddress,
      });
    });

    {
      const network = await window.BinanceChain.request({ method: 'net_version' });
      store.dispatch('updateWallet', {
        symbol: WALLET_SYMBOL_BINANCE,
        chainId: NETWORK_CHAIN_ID_MAPS[network],
      });
    }

    window.BinanceChain.on('networkChanged', network => {
      store.dispatch('updateWallet', {
        symbol: WALLET_SYMBOL_BINANCE,
        chainId: NETWORK_CHAIN_ID_MAPS[network],
      });
    });
  } finally {
    store.getters.getWallet(WALLET_SYMBOL_BINANCE).deferred.resolve();
  }
}

async function connect() {
  try {
    await window.BinanceChain.request({ method: 'eth_requestAccounts' });
    sessionStorage.setItem(BINANCE_CONNECTED_KEY, 'true');
  } catch (error) {
    throw convertWalletError(error);
  }
}

export default {
  install: init,
  connect,
};
