<template>
  <ValidationObserver ref="validation" tag="div" v-slot="{ invalid }" class="form">
    <div class="card">
      <div class="title">Bridge</div>
      <div class="fields">
        <div class="field">
          <div class="label">Asset</div>
          <CButton class="select-token-basic" @click="selectTokenBasicVisible = true">
            <template v-if="tokenBasic">
              <img class="select-token-basic-icon" :src="tokenBasic.icon" />
              <span class="select-token-basic-name">{{ tokenBasicName }}</span>
            </template>
            <CFlexSpan />
            <img src="@/assets/svg/chevron-right.svg" />
          </CButton>
        </div>

        <div class="fields-row">
          <div class="field">
            <div class="label">From</div>
            <CButton
              class="select-chain"
              :disabled="!tokenBasic"
              @click="selectFromChainVisible = true"
            >
              <template v-if="fromChain">
                <img class="select-chain-icon" :src="fromChain.icon" />
                <span class="select-chain-name">
                  {{ $formatEnum(fromChainId, { type: 'chainName' }) }}
                </span>
              </template>
              <template v-else>
                <img class="select-chain-icon" src="@/assets/svg/from.svg" />
                <span class="select-chain-name">From</span>
              </template>
              <span class="select-chain-name">Network</span>
              <img class="chevron-down" src="@/assets/svg/chevron-down.svg" />
            </CButton>
            <div v-if="fromWallet" class="address">
              <span class="address-value">
                {{ $formatLongText(fromWallet.address, { headTailLength: 6 }) }}
              </span>
              <CButton @click="copy(fromWallet.address)">
                <img src="@/assets/svg/copy.svg" />
              </CButton>
            </div>
          </div>

          <!-- TODO -->
          <CButton :disabled="!toChainId" @click="exchangeFromTo">
            <img src="@/assets/svg/exchange.svg" />
          </CButton>

          <div class="field">
            <div class="label">To</div>
            <CButton
              class="select-chain"
              :disabled="!toChains"
              @click="selectToChainVisible = true"
            >
              <template v-if="toChain">
                <img class="select-chain-icon" :src="toChain.icon" />
                <span class="select-chain-name">
                  {{ $formatEnum(toChainId, { type: 'chainName' }) }}
                </span>
              </template>
              <template v-else>
                <img class="select-chain-icon" src="@/assets/svg/to.svg" />
                <span class="select-chain-name">To</span>
              </template>
              <span class="select-chain-name">Network</span>
              <img class="chevron-down" src="@/assets/svg/chevron-down.svg" />
            </CButton>
            <div v-if="toWallet" class="address">
              <span class="address-value">
                {{ $formatLongText(toWallet.address, { headTailLength: 6 }) }}
              </span>
              <CButton @click="copy(toWallet.address)">
                <img src="@/assets/svg/copy.svg" />
              </CButton>
            </div>
          </div>
        </div>

        <ValidationProvider
          ref="amountValidation"
          tag="div"
          class="field"
          :rules="{
            required: true,
            number: true,
            positive: true,
            maxDecimal: tokenBasic && tokenBasic.precision,
            maxValue: balance,
            minValue: { min: fee, excluded: true },
          }"
          v-slot="{ errors }"
        >
          <div class="label">Amount</div>
          <div class="input">
            <CInput class="input-inner" v-model="amount" />
            <CButton v-if="balance" class="use-max" @click="transferAll">MAX</CButton>
          </div>
          <div class="input-error">{{ errors[0] }}</div>
          <div v-if="balance" class="balance">
            <span class="label">Balance</span>
            <CFlexSpan />
            <span class="value">{{ balance }} {{ tokenBasicName }}</span>
          </div>
          <div v-if="fee" class="fee">
            <span class="label">Fee</span>
            <CFlexSpan />
            <span class="fee-value">{{ fee }}</span>
            <img class="fee-icon" src="@/assets/svg/eth-token.svg" />
            <span class="fee-token">{{ tokenBasicName }}</span>
          </div>
        </ValidationProvider>
      </div>

      <CSubmitButton
        v-if="fromChain && toChain && !(fromWallet && toWallet)"
        @click="connectWalletVisible = true"
      >
        Connect Wallet
      </CSubmitButton>
      <CSubmitButton
        v-else-if="!invalid && fromToken && toToken && needApproval"
        :loading="approving"
        @click="approve"
      >
        Approve
      </CSubmitButton>
      <CSubmitButton v-else :disabled="invalid || !(fromToken && toToken)" @click="submit">
        {{ $t('buttons.next') }}
      </CSubmitButton>
    </div>

    <div class="history">
      You can view your
      <CLink class="link" :to="{ name: 'transactions' }">history</CLink>
    </div>

    <SelectTokenBasic
      :visible.sync="selectTokenBasicVisible"
      :tokenBasicName="tokenBasicName"
      @update:tokenBasicName="changeTokenBasicName"
      :tokenBasics="tokenBasics"
      :popularTokenBasics="tokenBasics"
    />
    <SelectChain
      :visible.sync="selectFromChainVisible"
      :chainId="fromChainId"
      @update:chainId="changeFromChainId"
      :chains="fromChains || []"
    />
    <SelectChain
      :visible.sync="selectToChainVisible"
      :chainId="toChainId"
      @update:chainId="changeToChainId"
      :chains="toChains || []"
    />
    <ConnectWallet
      :visible.sync="connectWalletVisible"
      :fromChainId="fromChainId"
      :toChainId="toChainId"
    />
    <ConfirmSwap
      :visible.sync="confirmSwapVisible"
      :confirmingData="confirmingData"
      @succeed="clearForm"
    />
    <TransactionDetails :visible.sync="transactionDetailsVisible" />
  </ValidationObserver>
</template>

<script>
import BigNumber from 'bignumber.js';
import copy from 'clipboard-copy';
import { ChainId } from '@/utils/enums';
import { getWalletApi } from '@/utils/walletApi';
import SelectTokenBasic from './SelectTokenBasic';
import SelectChain from './SelectChain';
import ConnectWallet from './ConnectWallet';
import ConfirmSwap from './ConfirmSwap';
import TransactionDetails from './TransactionDetails';

export default {
  name: 'Form',
  components: {
    SelectTokenBasic,
    SelectChain,
    ConnectWallet,
    ConfirmSwap,
    TransactionDetails,
  },
  data() {
    return {
      selectTokenBasicVisible: false,
      selectFromChainVisible: false,
      selectToChainVisible: false,
      connectWalletVisible: false,
      confirmSwapVisible: false,
      transactionDetailsVisible: false,
      tokenBasicName: 'USDT',
      fromChainId: null,
      toChainId: null,
      amount: '',
      confirmingData: null,
      approving: false,
    };
  },
  computed: {
    tokenBasics() {
      return this.$store.getters.tokenBasics;
    },
    tokenBasic() {
      return this.$store.getters.getTokenBasic(this.tokenBasicName);
    },
    chains() {
      return this.$store.getters.chains.filter(chain => chain.id !== ChainId.Poly);
    },
    fromChains() {
      return (
        this.tokenBasic &&
        this.$store.getters
          .getTokensByTokenBasicName(this.tokenBasic.name)
          .map(token => this.$store.getters.getChain(token.chainId))
      );
    },
    fromChain() {
      return this.$store.getters.getChain(this.fromChainId);
    },
    fromToken() {
      return (
        this.tokenBasic &&
        this.$store.getters.getTokenByTokenBasicNameAndChainId({
          tokenBasicName: this.tokenBasicName,
          chainId: this.fromChainId,
        })
      );
    },
    fromWallet() {
      return this.$store.getters.getChainConnectedWallet(this.fromChainId);
    },
    getTokenMapsParams() {
      if (this.fromToken) {
        return {
          fromChainId: this.fromChainId,
          fromTokenHash: this.fromToken.hash,
        };
      }
      return null;
    },
    tokenMaps() {
      return this.getTokenMapsParams && this.$store.getters.getTokenMaps(this.getTokenMapsParams);
    },
    toChains() {
      return (
        this.tokenMaps &&
        this.tokenMaps.map(tokenMap => this.$store.getters.getChain(tokenMap.toToken.chainId))
      );
    },
    toChain() {
      return this.$store.getters.getChain(this.toChainId);
    },
    toToken() {
      return (
        this.tokenBasic &&
        this.$store.getters.getTokenByTokenBasicNameAndChainId({
          tokenBasicName: this.tokenBasicName,
          chainId: this.toChainId,
        })
      );
    },
    toWallet() {
      return this.$store.getters.getChainConnectedWallet(this.toChainId);
    },
    getBalanceParams() {
      if (this.fromWallet && this.fromToken) {
        return {
          chainId: this.fromChainId,
          address: this.fromWallet.address,
          tokenHash: this.fromToken.hash,
          walletReady: this.walletReady,
        };
      }
      return null;
    },
    balance() {
      return this.getBalanceParams && this.$store.getters.getBalance(this.getBalanceParams);
    },
    getAllowanceParams() {
      if (this.fromWallet && this.fromChain && this.fromToken) {
        return {
          chainId: this.fromChainId,
          address: this.fromWallet.address,
          tokenHash: this.fromToken.hash,
          spender: this.fromChain.lockContractHash,
        };
      }
      return null;
    },
    allowance() {
      return this.getAllowanceParams && this.$store.getters.getAllowance(this.getAllowanceParams);
    },
    needApproval() {
      return this.amount && this.allowance && new BigNumber(this.amount).gt(this.allowance);
    },
    getFeeParams() {
      if (this.fromToken && this.toChainId) {
        return {
          fromChainId: this.fromChainId,
          fromTokenHash: this.fromToken.hash,
          toChainId: this.toChainId,
        };
      }
      return null;
    },
    fee() {
      return this.getFeeParams && this.$store.getters.getFee(this.getFeeParams);
    },
  },
  watch: {
    async getBalanceParams(value) {
      if (value) {
        await this.$store.dispatch('ensureChainWalletReady', value.chainId);
        this.$store.dispatch('getBalance', value);
      }
    },
    getFeeParams(value) {
      if (value) {
        this.$store.dispatch('getFee', value);
      }
    },
    getTokenMapsParams(value) {
      if (value) {
        this.$store.dispatch('getTokenMaps', value);
      }
    },
    getAllowanceParams(value) {
      if (value) {
        this.$store.dispatch('getAllowance', value);
      }
    },
  },
  created() {
    this.$store.dispatch('getTokenBasics');
    this.interval = setInterval(() => {
      if (this.getBalanceParams) {
        this.$store.dispatch('getBalance', this.getBalanceParams);
      }
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    changeTokenBasicName(tokenBasicName) {
      this.tokenBasicName = tokenBasicName;
      this.fromChainId = null;
      this.toChainId = null;
    },
    changeFromChainId(chainId) {
      this.fromChainId = chainId;
      this.toChainId = null;
    },
    changeToChainId(chainId) {
      this.toChainId = chainId;
    },
    async exchangeFromTo() {
      await this.$store.dispatch('getTokenMaps', {
        fromChainId: this.toChainId,
        fromTokenHash: this.toToken.hash,
      });
      const { fromChainId } = this;
      this.fromChainId = this.toChainId;
      if (this.toChains && this.toChains.find(chain => chain.id === fromChainId)) {
        this.toChainId = fromChainId;
      } else {
        this.toChainId = null;
      }
    },
    copy(text) {
      copy(text);
      this.$message.success(this.$t('messages.copied', { text }));
    },
    transferAll() {
      this.amount = this.balance;
      this.$nextTick(() => this.$refs.amountValidation.validate());
    },
    async approve() {
      await this.$store.dispatch('ensureChainWalletReady', this.fromChainId);
      try {
        this.approving = true;
        const walletApi = await getWalletApi(this.fromWallet.name);

        if (!new BigNumber(this.allowance).isZero()) {
          await walletApi.approve({
            chainId: this.fromChainId,
            address: this.fromWallet.address,
            tokenHash: this.fromToken.hash,
            spender: this.fromChain.lockContractHash,
            amount: 0,
          });
        }

        await walletApi.approve({
          chainId: this.fromChainId,
          address: this.fromWallet.address,
          tokenHash: this.fromToken.hash,
          spender: this.fromChain.lockContractHash,
          amount: this.amount,
        });

        await this.$store.dispatch('getAllowance', this.getAllowanceParams);
      } finally {
        this.approving = false;
      }
    },
    submit() {
      this.confirmingData = {
        fromAddress: this.fromWallet.address,
        toAddress: this.toWallet.address,
        fromChainId: this.fromChainId,
        toChainId: this.toChainId,
        fromTokenHash: this.fromToken.hash,
        toTokenHash: this.toToken.hash,
        amount: this.amount,
        fee: this.fee,
      };
      this.confirmSwapVisible = true;
    },
    clearForm() {
      this.amount = '';
      this.$refs.validation.reset();
    },
  },
};
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  @include child-margin-v(30px);
}

.card {
  box-sizing: border-box;
  width: 452px;
  padding: 40px 50px 54px;
  background: #171f31;
  box-shadow: 0px 2px 18px 7px rgba(#000000, 0.1);
  border-radius: 10px;
}

.title {
  font-weight: 500px;
  font-size: 20px;
  text-align: center;
  @include next-margin-v(30px);
}

.fields {
  @include child-margin-v(20px);
  @include next-margin-v(40px);
}

.fields-row {
  display: flex;
  @include child-margin-h(18px);
}

.field {
  width: stretch;
  @include child-margin-v(10px);
}

.label {
  opacity: 0.6;
  font-weight: 500;
  font-size: 12px;
}

.value {
  font-size: 10px;
}

.select-token-basic {
  display: flex;
  align-items: center;
  width: stretch;
  height: 40px;
  padding: 0 14px;
  background: rgba(#000000, 0.26);
  border-radius: 4px;
  @include child-margin-h(8px);
}

.select-token-basic-icon {
  width: 20px;
}

.select-token-basic-name {
  font-size: 14px;
}

.select-chain {
  display: flex;
  flex-direction: column;
  width: stretch;
  padding: 15px;
  border: 1px solid rgba(#ffffff, 0.1);
  border-radius: 4px;
  background: rgba(#ffffff, 0.04);
}

.select-chain-icon {
  width: 40px;
  @include next-margin-v(8px);
}

.select-chain-name {
  font-size: 14px;
}

.address {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.address-value {
  font-size: 12px;
}

.chevron-down {
  align-self: flex-end;
}

.input {
  display: flex;
  padding: 18px 14px;
  background: rgba(#000000, 0.26);
  border-radius: 4px;
}

.input-error {
  color: $--color-danger;
  font-size: 12px;
}

.use-max {
  padding: 5px;
  border-radius: 4px;
  color: rgba(#ffffff, 0.6);
  background: rgba(#ffffff, 0.05);
  font-weight: 600;
  font-size: 12px;
}

.balance,
.fee {
  display: flex;
  align-items: center;
  @include child-margin-h(4px);
}

.fee-value {
  font-size: 12px;
}

.fee-icon {
  width: 14px;
}

.fee-token {
  font-size: 10px;
}

.link {
  color: #2fd8ca;
  text-decoration: underline;
}
</style>
