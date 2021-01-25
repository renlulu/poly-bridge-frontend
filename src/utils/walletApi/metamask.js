import Web3 from 'web3';
import store from '@/store';
import { getChainApi } from '@/utils/chainApi';
import { integerToDecimal, decimalToInteger, toStandardHex } from '@/utils/convertors';
import { WalletName, ChainId, SingleTransactionStatus } from '@/utils/enums';
import { WalletError } from '@/utils/errors';
import { TARGET_MAINNET } from '@/utils/env';

const METAMASK_CONNECTED_KEY = 'METAMASK_CONNECTED';

const NETWORK_CHAIN_ID_MAPS = {
  [TARGET_MAINNET ? 1 : 3]: ChainId.Eth,
  [TARGET_MAINNET ? 56 : 97]: ChainId.Bsc,
  [TARGET_MAINNET ? 128 : 256]: ChainId.Heco,
};

let web3;

function confirmLater(promise) {
  return new Promise((resolve, reject) => {
    promise.on('transactionHash', resolve);
    promise.on('error', reject);

    function onConfirm(confNumber, receipt) {
      promise.off('confirmation', onConfirm);
    }
    promise.on('confirmation', onConfirm);
  });
}

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

async function queryState() {
  const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  const address = accounts[0] || null;
  const checksumAddress = address && web3.utils.toChecksumAddress(address);
  const network = await window.ethereum.request({ method: 'eth_chainId' });
  store.dispatch('updateWallet', {
    name: WalletName.Metamask,
    address: checksumAddress,
    connected: !!checksumAddress,
    chainId: NETWORK_CHAIN_ID_MAPS[Number(network)],
  });
}

async function init() {
  try {
    if (!window.ethereum) {
      return;
    }
    web3 = new Web3(window.ethereum);
    store.dispatch('updateWallet', { name: WalletName.Metamask, installed: true });

    if (sessionStorage.getItem(METAMASK_CONNECTED_KEY) === 'true') {
      await queryState();
    }

    window.ethereum.on('accountsChanged', accounts => {
      const address = accounts[0] || null;
      const checksumAddress = address && web3.utils.toChecksumAddress(address);
      store.dispatch('updateWallet', {
        name: WalletName.Metamask,
        address: checksumAddress,
        connected: !!checksumAddress,
      });
    });

    window.ethereum.on('chainChanged', network => {
      store.dispatch('updateWallet', {
        name: WalletName.Metamask,
        chainId: NETWORK_CHAIN_ID_MAPS[Number(network)],
      });
    });
  } finally {
    store.getters.getWallet(WalletName.Metamask).deferred.resolve();
  }
}

async function connect() {
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    await queryState();
    sessionStorage.setItem(METAMASK_CONNECTED_KEY, 'true');
  } catch (error) {
    throw convertWalletError(error);
  }
}

async function getBalance({ chainId, address, tokenHash }) {
  try {
    const tokenBasic = store.getters.getTokenBasicByChainIdAndTokenHash({ chainId, tokenHash });
    if (tokenHash === '0000000000000000000000000000000000000000') {
      const result = await web3.eth.getBalance(address);
      return integerToDecimal(result, tokenBasic.precision);
    }
    const tokenContract = new web3.eth.Contract(require('@/assets/json/eth-erc20.json'), tokenHash);
    const result = await tokenContract.methods.balanceOf(address).call();
    return integerToDecimal(result, tokenBasic.precision);
  } catch (error) {
    throw convertWalletError(error);
  }
}

async function getAllowance({ chainId, address, tokenHash, spender }) {
  try {
    const tokenBasic = store.getters.getTokenBasicByChainIdAndTokenHash({ chainId, tokenHash });
    if (tokenHash === '0000000000000000000000000000000000000000') {
      return null;
    }
    const tokenContract = new web3.eth.Contract(require('@/assets/json/eth-erc20.json'), tokenHash);
    const result = await tokenContract.methods.allowance(address, `0x${spender}`).call();
    return integerToDecimal(result, tokenBasic.precision);
  } catch (error) {
    throw convertWalletError(error);
  }
}

async function getTransactionStatus({ transactionHash }) {
  try {
    const transactionReceipt = await web3.eth.getTransactionReceipt(`0x${transactionHash}`);
    if (transactionReceipt) {
      return transactionReceipt.status
        ? SingleTransactionStatus.Done
        : SingleTransactionStatus.Failed;
    }
    return SingleTransactionStatus.Pending;
  } catch (error) {
    throw convertWalletError(error);
  }
}

async function approve({ chainId, address, tokenHash, spender, amount }) {
  try {
    const tokenBasic = store.getters.getTokenBasicByChainIdAndTokenHash({ chainId, tokenHash });
    const amountInt = decimalToInteger(amount, tokenBasic.precision);
    const tokenContract = new web3.eth.Contract(require('@/assets/json/eth-erc20.json'), tokenHash);
    return await tokenContract.methods.approve(`0x${spender}`, amountInt).send({
      from: address,
    });
  } catch (error) {
    throw convertWalletError(error);
  }
}

async function lock({
  fromChainId,
  fromAddress,
  fromTokenHash,
  toChainId,
  toAddress,
  amount,
  fee,
}) {
  try {
    const chain = store.getters.getChain(fromChainId);
    const tokenBasic = store.getters.getTokenBasicByChainIdAndTokenHash({
      chainId: fromChainId,
      tokenHash: fromTokenHash,
    });

    const lockContract = new web3.eth.Contract(
      require('@/assets/json/eth-lock.json'),
      chain.lockContractHash,
    );
    const toChainApi = await getChainApi(toChainId);
    const toAddressHex = toChainApi.addressToHex(toAddress);
    const amountInt = decimalToInteger(amount, tokenBasic.precision);
    const feeInt = decimalToInteger(fee, tokenBasic.precision);

    const result = await confirmLater(
      lockContract.methods
        .lock(`0x${fromTokenHash}`, toChainId, `0x${toAddressHex}`, amountInt, feeInt, 0)
        .send({
          from: fromAddress,
          value:
            fromTokenHash === '0000000000000000000000000000000000000000' ? amountInt : undefined,
        }),
    );
    return toStandardHex(result);
  } catch (error) {
    throw convertWalletError(error);
  }
}

export default {
  install: init,
  connect,
  getBalance,
  getAllowance,
  getTransactionStatus,
  approve,
  lock,
};
