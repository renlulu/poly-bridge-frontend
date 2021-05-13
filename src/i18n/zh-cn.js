import element from 'element-ui/lib/locale/lang/en';
import { TARGET_MAINNET } from '@/utils/env';
import { WalletName, ChainId, TransactionStatus } from '@/utils/enums';

export default {
  ...element,
  common: {
    header: {
      brandName: 'PolyBridge',
    },
    wallets: {
      connectWallet: 'Connect Wallet',
    },
    networks: {
      mainnet: 'MainNet',
      testnet: 'TestNet',
    },
    menu: {
      token: 'Token Asset',
      nft: 'NFT Asset'
    },
    connectWallet: {
      chainName: '{chainName} Wallet',
      walletConnected: '{walletName} Connected',
      connectWallet: 'Connect {walletName}',
    },
    footer: {
      copyright: '© 2021 Polynetwork. All rights reserved.',
    },
  },
  home: {
    index: {
      slogon:
        'To\nbuild the next generation\nInternet infrastructure,\nrealize interoperability\nbetween\nmultiple <em>chains</em>',
    },
    form: {
      title: 'Bridge',
      asset: 'Asset',
      from: 'From',
      to: 'To',
      chainName: '{chainName}\nNetwork',
      amount: 'Amount',
      max: 'MAX',
      balance: 'Balance',
      fee: 'Fee',
      feeTooltip:
        'Fee is required to incentive the Relayer who will move the cross chain transaction, it will dynamic change according to the transaction of target chain.',
      connectWallet: 'Connect Wallet',
      historyPrefix: 'You can view your',
      historyLink: 'history',
    },
    selectTokenBasic: {
      title: 'Select Asset',
      inputPlaceholder: 'Search name',
      hint: 'Token Name',
    },
    selectChain: {
      title: 'Select Network',
    },
    connectWallet: {
      title: 'Connect Wallet',
      chainName: '{chainName} Network',
      walletConnected: '{walletName} Connected',
      connectWallet: 'Connect {walletName}',
    },
    confirm: {
      title: 'Confirm',
      amount: 'Amount',
      from: 'From',
      to: 'To',
      fee: 'Fee',
      chainName: '{chainName} Network',
      receiving: 'You will receive',
      packing: 'Transaction is packing on {chainName}. Please be patient...',
      hash: 'Hash: {hash}',
    },
  },
  transactions: {
    index: {
      title: 'The historical records',
      fromChain: 'Source Chain',
      toChain: 'Destination Chain',
      hash: 'Hash: {hash}',
      amount: 'Amount',
      fee: 'Fee',
      asset: 'Asset',
      time: 'Time',
      status: 'Status',
      pagination: 'Page {page} of {pageCount}',
    },
    details: {
      title: 'Transaction Details',
      waiting:
        'The transaction is waiting to be processed on the {chainName}. Please be patient...',
      pending: 'The transaction is proceeding on the {chainName}. Please be patient...',
      succeeded: 'The transaction is succeeded on the {chainName}.',
      failed: 'The transaction is failed on the {chainName}.',
      confirmation: '{blocks}/{needBlocks} Confirm',
      hash: 'Hash: {hash}',
      failedTitle: 'Failed',
      finishedTitle: 'Finished',
      gotoHistory: 'Goto History',
    },
  },
  buttons: {
    next: 'Next',
    confirm: 'Confirm',
    confirming: 'Confirming...',
    approve: 'Approve',
    approving: 'Approving...',
  },
  messages: {
    copied: '"{text}" has been copied to clipboard.',
  },
  enums: {
    walletName: {
      [WalletName.MetaMask]: 'MetaMask',
      [WalletName.NeoLine]: 'NeoLine',
      [WalletName.O3]: 'O3',
      [WalletName.Binance]: 'Binance',
      [WalletName.Cyano]: 'Cyano',
      [WalletName.ZilPay]: 'ZilPay'
    },
    chainName: {
      [ChainId.Poly]: 'Poly',
      [ChainId.Eth]: 'Ethereum',
      [ChainId.Neo]: 'Neo',
      [ChainId.Bsc]: 'BSC',
      [ChainId.Heco]: 'Heco',
      [ChainId.Ont]: 'Ontology',
      [ChainId.Zil]: 'Zilliqa',
    },
    chainNetworkName: {
      [ChainId.Poly]: TARGET_MAINNET ? 'MainNet' : 'TestNet',
      [ChainId.Eth]: TARGET_MAINNET ? 'MainNet' : 'Ropsten TestNet',
      [ChainId.Neo]: TARGET_MAINNET ? 'MainNet' : 'TestNet',
      [ChainId.Bsc]: TARGET_MAINNET ? 'BSC MainNet' : 'BSC TestNet',
      [ChainId.Heco]: TARGET_MAINNET ? 'Heco MainNet' : 'Heco TestNet',
      [ChainId.Ont]: TARGET_MAINNET ? 'MainNet' : 'TestNet',
      [ChainId.Zil]: TARGET_MAINNET ? 'MainNet' : 'TestNet',
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
      NOT_CONNECTED: '{chainName} wallet is not connected.',
      NOT_SUPPORTED_NETWORK: 'The network in {walletName} wallet is not supported.',
      INCORRECT_NETWORK: 'Please switch network to {chainNetworkName} on {walletName} wallet.',
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
    maxDecimals: "You've exceeded the decimal limit.",
    maxValue: "You've exceeded the max amount.",
    minValue: 'You entered less than the minimum amount.',
    address: "You've entered an invalid address.",
  },
};
