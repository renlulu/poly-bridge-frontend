import { ChainId } from '@/utils/enums';

export default {
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
    walletName: {},
    chainName: {
      [ChainId.Poly]: 'PolyNetwork',
      [ChainId.Eth]: 'Ethereum',
      [ChainId.Neo]: 'Neo',
      [ChainId.Bsc]: 'BSC',
      [ChainId.Heco]: 'Heco',
    },
    tokenBasicName: {},
  },
  errors: {
    wallet: {
      UNKNOWN_ERROR: 'Unknown wallet error.',
      NOT_SUPPORTED: 'Wallet is not supported.',
      NOT_INSTALLED: 'Wallet is not installed.',
      NOT_CONNECTED: 'Wallet is not connected.',
      INCORRECT_NETWORK: 'Wallet is not in correct network.',
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
