import delay from 'delay';
import neoDapi from 'neo-dapi';
import store from '@/store';
import { WalletError } from '@/utils/errors';
import { TARGET_MAINNET, WALLET_SYMBOL_O3, CHAIN_ID_NEO } from '@/utils/values';

const NETWORK_CHAIN_ID_MAPS = {
  [TARGET_MAINNET ? 'MainNet' : 'TestNet']: CHAIN_ID_NEO,
};

function convertWalletError(error) {
  if (error instanceof WalletError) {
    return error;
  }
  let code = '';
  switch (error.type) {
    case 'NO_PROVIDER':
      code = WalletError.CODES.NOT_INSTALLED;
      break;
    case 'CONNECTION_DENIED':
      code = WalletError.CODES.USER_REJECTED;
      break;
    case 'CONNECTION_REFUSED':
      code = WalletError.CODES.COMMUNICATE_FAILED;
      break;
    case 'RPC_ERROR':
      code = WalletError.CODES.COMMUNICATE_FAILED;
      break;
    case 'MALFORMED_INPUT':
      code = WalletError.CODES.MALFORMED_INPUT;
      break;
    case 'CANCELED':
      code = WalletError.CODES.USER_REJECTED;
      break;
    case 'INSUFFICIENT_FUNDS':
      code = WalletError.CODES.INSUFFICIENT_FUNDS;
      break;
    default:
      code = WalletError.CODES.UNKNOWN_ERROR;
  }
  return new WalletError(error.message || error.description, { code, cause: error });
}

async function queryState() {
  const address = (await neoDapi.getAccount()).address || null;
  const network = (await neoDapi.getNetworks()).defaultNetwork;
  store.dispatch('updateWallet', {
    symbol: WALLET_SYMBOL_O3,
    address,
    connected: !!address,
    chainId: NETWORK_CHAIN_ID_MAPS[network],
  });
}

async function init() {
  async function onReady() {
    try {
      store.dispatch('updateWallet', { symbol: WALLET_SYMBOL_O3, installed: true });

      neoDapi.addEventListener(neoDapi.Constants.EventName.ACCOUNT_CHANGED, data => {
        const address = data.address || null;
        store.dispatch('updateWallet', { symbol: WALLET_SYMBOL_O3, address, connected: !!address });
      });

      neoDapi.addEventListener(
        neoDapi.Constants.EventName.NETWORK_CHANGED,
        ({ defaultNetwork: network }) => {
          store.dispatch('updateWallet', {
            symbol: WALLET_SYMBOL_O3,
            chainId: NETWORK_CHAIN_ID_MAPS[network],
          });
        },
      );
    } finally {
      store.getters.getWallet(WALLET_SYMBOL_O3).deferred.resolve();
    }
  }
  neoDapi.addEventListener(neoDapi.Constants.EventName.READY, onReady);
  await delay(2000);
  store.getters.getWallet(WALLET_SYMBOL_O3).deferred.resolve();
}

async function connect() {
  try {
    await queryState();
  } catch (error) {
    throw convertWalletError(error);
  }
}

export default {
  install: init,
  connect,
};
