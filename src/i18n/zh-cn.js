import { TARGET_MAINNET } from '@/utils/env';
import { WalletName, ChainId } from '@/utils/enums';

export default {
  buttons: {
    cancel: '取消',
    confirm: '确认',
    confirming: '正在确认...',
    next: '下一步',
    submit: '提交',
    submitting: '正在提交...',
    close: '关闭',
    complete: '完成',
    retry: '重试',
  },
  messages: {
    copied: '"{text}" 已复制到剪切板.',
  },
  enums: {
    walletName: {
      [WalletName.Metamask]: 'Metamask',
      [WalletName.NeoLine]: 'NeoLine',
      [WalletName.O3]: 'O3',
      [WalletName.Binance]: 'Binance',
    },
    chainName: {
      [ChainId.Poly]: 'PolyNetwork',
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
  },
  errors: {
    wallet: {
      UNKNOWN_ERROR: '未知钱包错误.',
      NOT_SUPPORTED: '钱包尚未支持.',
      NOT_INSTALLED: '钱包尚未安装.',
      NOT_CONNECTED: '{chainName} Wallet is not connected.',
      INCORRECT_NETWORK: 'Please switch network to {chainNetworkName} on {walletName} Wallet.',
      USER_REJECTED: '请求已被用户拒绝.',
      MALFORMED_INPUT: '输入错误.',
      INSUFFICIENT_FUNDS: '余额不足.',
      COMMUNICATE_FAILED: '钱包通讯失败.',
    },
    chain: {
      UNKNOWN_ERROR: '未知区块链错误.',
      NOT_SUPPORTED: '该区块链未被支持.',
      COMMUNICATE_FAILED: 'RPC通讯失败.',
    },
    http: {
      UNKNOWN_ERROR: '未知请求错误.',
      NETWORK_ERROR: '网络错误.',
      BAD_REQUEST: '请求错误.',
      INTERNAL_SERVICE_ERROR: '服务器内部错误.',
    },
  },
  validations: {
    required: '必填.',
    number: '请输入数字.',
    positive: '请输入大于零的数字.',
    maxDecimal: '超出小数位限制.',
    maxValue: '超出最大金额.',
    minValue: '低于最小金额.',
    address: '非法地址.',
  },
};
