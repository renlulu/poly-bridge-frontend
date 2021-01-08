import delay from 'delay';
import store from '@/store';
import { WalletError } from '@/utils/errors';
import { TARGET_MAINNET, WALLET_SYMBOL_NEOLINE, CHAIN_ID_NEO } from '@/utils/values';

const NEOLINE_CONNECTED_KEY = 'NEOLINE_CONNECTED';

const NETWORK_CHAIN_ID_MAPS = {
  [TARGET_MAINNET ? 'MainNet' : 'TestNet']: CHAIN_ID_NEO,
};

let neoDapi;

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
    symbol: WALLET_SYMBOL_NEOLINE,
    address,
    connected: !!address,
    chainId: NETWORK_CHAIN_ID_MAPS[network],
  });
}

async function init() {
  async function onReady() {
    try {
      window.removeEventListener('NEOLine.NEO.EVENT.READY', init);

      store.dispatch('updateWallet', { symbol: WALLET_SYMBOL_NEOLINE, installed: true });
      neoDapi = new window.NEOLine.Init();

      if (sessionStorage.getItem(NEOLINE_CONNECTED_KEY) === 'true') {
        await queryState();
      }

      neoDapi.addEventListener(neoDapi.EVENT.ACCOUNT_CHANGED, data => {
        const address = data.address || null;
        store.dispatch('updateWallet', {
          symbol: WALLET_SYMBOL_NEOLINE,
          address,
          connected: !!address,
        });
      });

      neoDapi.addEventListener(neoDapi.EVENT.NETWORK_CHANGED, ({ defaultNetwork: network }) => {
        store.dispatch('updateWallet', {
          symbol: WALLET_SYMBOL_NEOLINE,
          chainId: NETWORK_CHAIN_ID_MAPS[network],
        });
      });
    } finally {
      store.getters.getWallet(WALLET_SYMBOL_NEOLINE).deferred.resolve();
    }
  }

  if (window.NEOLine) {
    await onReady();
  } else {
    window.addEventListener('NEOLine.NEO.EVENT.READY', onReady);
    await delay(2000);
    store.getters.getWallet(WALLET_SYMBOL_NEOLINE).deferred.resolve();
  }
}

async function connect() {
  try {
    await queryState();
    sessionStorage.setItem(NEOLINE_CONNECTED_KEY, 'true');
  } catch (error) {
    throw convertWalletError(error);
  }
}

export default {
  install: init,
  connect,
};
