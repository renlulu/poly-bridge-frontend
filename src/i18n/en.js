import element from 'element-ui/lib/locale/lang/en';
import { TARGET_MAINNET } from '@/utils/env';
import { WalletName, ChainId, TransactionStatus } from '@/utils/enums';

export default {
  ...element,
  buttons: {
    cancel: 'Cancel',
    confirm: 'Confirm',
    confirming: 'Confirming...',
    next: 'Next',
    submit: 'Submit',
    submitting: 'Submitting...',
    close: 'Close',
    complete: 'Complete',
    retry: 'Retry',
  },
  messages: {
    copied: '"{text}" has been copied to clipboard.',
  },
  enums: {
    walletName: {
      [WalletName.Metamask]: 'Metamask',
      [WalletName.NeoLine]: 'NeoLine',
      [WalletName.O3]: 'O3',
      [WalletName.Binance]: 'Binance',
    },
    chainName: {
      [ChainId.Poly]: 'Poly',
      [ChainId.Eth]: 'Ethereum',
      [ChainId.Neo]: 'Neo',
      [ChainId.Bsc]: 'BSC',
      [ChainId.Heco]: 'Heco',
    },
    chainNetworkName: {
      [ChainId.Poly]: TARGET_MAINNET ? 'MainNet' : 'TestNet',
      [ChainId.Eth]: TARGET_MAINNET ? 'MainNet' : 'Ropsten TestNet',
      [ChainId.Neo]: TARGET_MAINNET ? 'MainNet' : 'TestNet',
      [ChainId.Bsc]: TARGET_MAINNET ? 'BSC MainNet' : 'BSC TestNet',
      [ChainId.Heco]: TARGET_MAINNET ? 'Heco MainNet' : 'Heco TestNet',
    },
    transactionStatus: {
      [TransactionStatus.Finished]: 'Finished',
      [TransactionStatus.Pending]: 'Pending',
      [TransactionStatus.SourceDone]: 'Pending',
      [TransactionStatus.SourceConfirmed]: 'Pending',
      [TransactionStatus.PolyConfirmed]: 'Pending',
    },
  },
  errors: {
    wallet: {
      UNKNOWN_ERROR: 'Unknown wallet error.',
      NOT_SUPPORTED: 'Wallet is not supported.',
      NOT_INSTALLED: 'Wallet is not installed.',
      NOT_CONNECTED: '{chainName} Wallet is not connected.',
      INCORRECT_NETWORK: 'Please switch network to {chainNetworkName} on {walletName} Wallet.',
      USER_REJECTED: 'Request is rejected by user.',
      MALFORMED_INPUT: 'Malformed input.',
      INSUFFICIENT_FUNDS: 'Insufficient funds.',
      COMMUNICATE_FAILED: 'Communicate failed with wallet.',
    },
    chain: {
      UNKNOWN_ERROR: 'Unknown chain error.',
      NOT_SUPPORTED: 'Chain is not supported.',
      COMMUNICATE_FAILED: 'Communicate failed with RPC.',
    },
    http: {
      UNKNOWN_ERROR: 'Unknown request error.',
      NETWORK_ERROR: 'Network error.',
      BAD_REQUEST: 'Bad request.',
      INTERNAL_SERVICE_ERROR: 'Internal server error.',
    },
  },
  validations: {
    required: 'Required.',
    number: 'Please input a number.',
    positive: 'Please input a positive number.',
    maxDecimal: "You've exceeded the decimal limit.",
    maxValue: "You've exceeded the max amount.",
    minValue: 'You entered less than the minimum amount.',
    address: "You've entered an invalid address.",
  },
};
