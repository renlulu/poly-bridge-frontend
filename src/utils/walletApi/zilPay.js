import store from '@/store';
import { integerToDecimal, decimalToInteger, toStandardHex } from '@/utils/convertors';
import { getChainApi } from '@/utils/chainApi';
import { WalletError } from '@/utils/errors';
import { WalletName, ChainId, SingleTransactionStatus } from '@/utils/enums';
import { tryToConvertAddressToHex } from '.';

const ZILPAY_CONNECTED_KEY = 'ZILPAY_CONNECTED_KEY';

const NETWORK_CHAIN_ID_MAPS = {
    "https://api.zilliqa.com/": ChainId.Zilliqa,
    "https://poly-api.zilliqa.com": ChainId.Zilliqa,
}

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
    const checksumAddress = defaultAccount.base16;
    const addressHex = await tryToConvertAddressToHex(WalletName.ZilPay,checksumAddress);
    const blockchainInfo = await window.zilPay.blockchain.getBlockChainInfo();
    const { url } = blockchainInfo.req;
    console.log(url);
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
        base16Addr = window.zilPay.crypto.fromBech32Address(address);
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

async function getAllowance ({ chainId, address, tokenHash, spender }) {
    const tokenBasic = store.getters.getTokenBasicByChainIdAndTokenHash({ chainId, tokenHash });
    if (tokenHash === '0000000000000000000000000000000000000000') {
      return null;
    }

    let addressBase16 =  address;
    if (window.zilPay.utils.validation.isBech32(address)) {
        addressBase16 = window.zilPay.crypto.fromBech32Address(address);
    }

    let spenderBase16 = spender;
    if (window.zilPay.utils.validation.isBech32(spender)) {
        spenderBase16 = window.zilPay.crypto.fromBech32Address(spender);
    }

    const result =  await window.zilPay.blockchain.getSmartContractSubState(tokenHash, "allowances", [addressBase16,spenderBase16])
    const amount = result.allowances[addressBase16][spenderBase16];
    return integerToDecimal(amount, tokenBasic.decimals);
}


async function lock ({
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
        const gasPrice = web3.utils.units.toQa('1000', web3.utils.units.Units.Li)
        const lockProxy = web3.contracts.at(chain.lockContractHash);
        const toChainApi = await getChainApi(toChainId);
        const toAddressHex = toChainApi.addressToHex(toAddress);
        const amountInt = decimalToInteger(amount, tokenBasic.decimals);
        const zeroAmount = web3.utils.units.toQa(0, web3.utils.units.Units.Zil);
        const feeInt = decimalToInteger(fee, tokenBasic.decimals);
        const tx = await lockProxy.call(
            'lock',
            [
                {
                    vname: 'fromAssetHash',
                    type: 'ByStr20',
                    value: '0x'.concat(fromTokenHash),
                },
                {
                    vname: 'toChainId',
                    type: 'Uint64',
                    value: toChainId.toString(),
                },
                {
                    vname: 'toAddress',
                    type: 'ByStr',
                    value: '0x'.concat(toAddressHex),
                },
                {
                    vname: 'amount',
                    type: 'Uint128',
                    value: amountInt.toString(),
                },
            ],
            {
                zeroAmount,
                gasPrice,
                gasLimit: window.zilPay.utils.Long.fromNumber(50000)
            },
            true
        );
      } catch (error) {
        throw convertWalletError(error);
      }
      
  }



export default {
    install: init,
    connect,
    getBalance,
    getTotalSupply,
    getAllowance,
    lock,
}