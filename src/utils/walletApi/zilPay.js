import store from '@/store';
import { integerToDecimal, decimalToInteger, toStandardHex } from '@/utils/convertors';
import { WalletError } from '@/utils/errors';
import { WalletName, ChainId, SingleTransactionStatus } from '@/utils/enums';
import { tryToConvertAddressToHex } from '.';

const ZILPAY_CONNECTED_KEY = 'ZILPAY_CONNECTED_KEY';

let web3;

function convertWalletError (error) {
    if (error instanceof WalletError) {
      return error;
    }
    let code = WalletError.CODES.UNKNOWN_ERROR;
    if (error.code === 4001) {
      code = WalletError.CODES.USER_REJECTED;
    }
    return new WalletError(error.message, { code, cause: error });
  }

async function queryState () {
    const defaultAccount = await window.zilPay.wallet.defaultAccount;
    console.log("default account: ", defaultAccount);
    const checksumAddress = defaultAccount.base16;
    const addressHex = await tryToConvertAddressToHex(WalletName.ZilPay,checksumAddress);
    store.dispatch('updateWallet', {
        name: WalletName.ZilPay,
        address: defaultAccount.base16,
        addressHex,
        connected: !!checksumAddress,
        // todo wait zilpay expose chain id, so hard code here
        chainId: 110,
    });
}

async function init () {
    try {
        if (!window.zilPay) {
            return;
        }
        web3 = window.zilPay;
        store.dispatch('updateWallet', { name: WalletName.ZilPay, installed: true });

        if (sessionStorage.getItem(ZILPAY_CONNECTED_KEY) === 'true') {
            await queryState();
        }

        const accountStreamChanged = window.zilPay.wallet.observableAccount();
        accountStreamChanged.subscribe(async account => {
            const checksumAddress = account.base16;
            const addressHex = await tryToConvertAddressToHex(WalletName.ZILPay, checksumAddress);
            store.dispatch('updateWallet', {
                name: WalletName.ZilPay,
                address: account.base16,
                addressHex,
                connected: !!checksumAddress,
                // todo wait zilpay expose chain id, so hard code here
                chainId: 110,
            });
        });

        const networkStreamChanged = window.zilPay.wallet.observableNetwork();
        // todo
        networkStreamChanged.subscribe(net => console.log(net));
    } finally {
        store.getters.getWallet(WalletName.ZilPay).deferred.resolve();
    }
}

async function connect () {
    const isConnect = await window.zilPay.wallet.connect();
    if (isConnect) {
        await queryState();
        sessionStorage.setItem(ZILPAY_CONNECTED_KEY, 'true');
    } else {
        throw new Error('user rejected');
    }
}

async function getBalance ( { chainId, address, tokenHash }) {
    const tokenBasic = store.getters.getTokenBasicByChainIdAndTokenHash({ chainId, tokenHash });
    if (tokenHash === '0000000000000000000000000000000000000000') { 
        // there is no harm if the address format is bech32 already
        const bech32Address = window.zilPay.crypto.toBech32Address(address);
        const { result: { balance } } = await window.zilPay.blockchain.getBalance(bech32Address);
        return integerToDecimal(balance, tokenBasic.decimals);
    }

    // check ZRC2 token balance
    // scilla only knows base16 format
    let base16Addr = address;
    if (window.zilPay.utils.validation.isBech32(address)) {
        base16Addr = window.zilPay.crypto.toBech32Address(address);
    }

    const { result : { balances }} = await window.zilPay.blockchain.getSmartContractSubState(tokenHash, "balances", [base16Addr])
    const balance = balances[base16Addr];
    return integerToDecimal(balance, tokenBasic.decimals);
}

async function getTotalSupply ({ chainId, tokenHash }) {
    debugger
    try {
      const tokenBasic = store.getters.getTokenBasicByChainIdAndTokenHash({ chainId, tokenHash });
      if (tokenHash === '0000000000000000000000000000000000000000') {
        return null;
      }

      const result =  await window.zilPay.blockchain.getSmartContractSubState(tokenHash, "total_supply");

      return integerToDecimal(result.result.total_supply, tokenBasic.decimals);
    } catch (error) {
      throw convertWalletError(error);
    }
  }




export default {
    install: init,
    connect,
    getBalance,
    getTotalSupply,
}