<template>
  <ValidationObserver ref="validation"
                      tag="div"
                      v-slot="{ invalid }"
                      class="form">
    <div class="card">
      <div class="title">{{ $t('home.form.title') }}</div>
      <div class="fields">
        <div class="field">
          <div class="label">{{ $t('home.form.asset') }}</div>
          <CButton class="select-token-basic"
                   @click="selectTokenBasicVisible = true">
            <template v-if="tokenBasic">
              <img class="select-token-basic-icon"
                   :src="tokenBasic.icon" />
              <span class="select-token-basic-name">{{ tokenBasicName }}</span>
            </template>
            <CFlexSpan />
            <img src="@/assets/svg/chevron-right.svg" />
          </CButton>
        </div>

        <div class="fields-row">
          <div class="field">
            <div class="label">{{ $t('home.form.from') }}</div>
            <CButton class="select-chain"
                     :disabled="!tokenBasic"
                     @click="selectFromChainVisible = true">
              <div class="select-chain-content">
                <template v-if="fromChain">
                  <img class="select-chain-icon"
                       :src="fromChain.icon" />
                  <span class="select-chain-name">
                    {{
                      $t('home.form.chainName', {
                        chainName: $formatEnum(fromChainId, { type: 'chainName' }),
                      })
                    }}
                  </span>
                </template>
                <template v-else>
                  <img class="select-chain-icon"
                       src="@/assets/svg/from.svg" />
                  <span class="select-chain-name">
                    {{ $t('home.form.chainName', { chainName: $t('home.form.from') }) }}
                  </span>
                </template>
                <img class="chevron-down"
                     src="@/assets/svg/chevron-right.svg" />
              </div>
            </CButton>
            <div v-if="fromWallet"
                 class="address">
              <span class="address-value">
                {{ $formatLongText(fromWallet.address, { headTailLength: 6 }) }}
              </span>
              <CButton @click="copy(fromWallet.address)">
                <img src="@/assets/svg/copy.svg" />
              </CButton>
            </div>
          </div>

          <CButton :disabled="!toChainId"
                   @click="exchangeFromTo">
            <img src="@/assets/svg/exchange.svg" />
          </CButton>

          <div class="field">
            <div class="label">{{ $t('home.form.to') }}</div>
            <CButton class="select-chain"
                     :disabled="!toChains"
                     @click="selectToChainVisible = true">
              <div class="select-chain-content">
                <template v-if="toChain">
                  <img class="select-chain-icon"
                       :src="toChain.icon" />
                  <span class="select-chain-name">
                    {{
                      $t('home.form.chainName', {
                        chainName: $formatEnum(toChainId, { type: 'chainName' }),
                      })
                    }}
                  </span>
                </template>
                <template v-else>
                  <img class="select-chain-icon"
                       src="@/assets/svg/to.svg" />
                  <span class="select-chain-name">
                    {{ $t('home.form.chainName', { chainName: $t('home.form.to') }) }}
                  </span>
                </template>
                <img class="chevron-down"
                     src="@/assets/svg/chevron-right.svg" />
              </div>
            </CButton>
            <div v-if="toWallet"
                 class="address">
              <span class="address-value">
                {{ $formatLongText(toWallet.address, { headTailLength: 6 }) }}
              </span>
              <CButton @click="copy(toWallet.address)">
                <img src="@/assets/svg/copy.svg" />
              </CButton>
            </div>
          </div>
        </div>

        <ValidationProvider ref="amountValidation"
                            tag="div"
                            class="field"
                            :rules="{
            required: true,
            number: true,
            positive: true,
            maxDecimals: tokenBasic && tokenBasic.decimals,
            maxValue: balance,
            minValue: { min: fee, excluded: true },
          }"
                            v-slot="{ errors }">
          <div class="label">{{ $t('home.form.amount') }}</div>
          <div class="input">
            <CInput class="input-inner"
                    v-model="amount" />
            <CButton v-if="balance"
                     class="use-max"
                     @click="transferAll">
              {{ $t('home.form.max') }}
            </CButton>
          </div>
          <div class="input-error">{{ errors[0] }}</div>
          <div v-if="balance"
               class="balance">
            <span class="label">{{ $t('home.form.balance') }}</span>
            <CFlexSpan />
            <span class="value"> {{ $formatNumber(balance) }} {{ fromToken.name }} </span>
          </div>
          <div v-if="fee"
               class="fee">
            <span class="label">{{ $t('home.form.fee') }}</span>
            <CTooltip>
              <img class="tooltip-icon"
                   src="@/assets/svg/question.svg" />
              <template #content>
                {{ $t('home.form.feeTooltip') }}
              </template>
            </CTooltip>
            <CFlexSpan />
            <span class="fee-value">{{ $formatNumber(fee) }}</span>
            <img class="fee-icon"
                 :src="tokenBasic.icon" />
            <span class="fee-token">{{ fromToken.name }}</span>
          </div>
        </ValidationProvider>
      </div>

      <CSubmitButton v-if="fromChain && toChain && !(fromWallet && toWallet)"
                     @click="connectWalletVisible = true">
        {{ $t('home.form.connectWallet') }}
      </CSubmitButton>
      <CSubmitButton v-else-if="!invalid && fromToken && toToken && needApproval"
                     :loading="approving"
                     @click="approve">
        {{ approving ? $t('buttons.approving') : $t('buttons.approve') }}
      </CSubmitButton>
      <CSubmitButton v-else
                     :disabled="invalid || !(fromToken && toToken)"
                     @click="next">
        {{ $t('buttons.next') }}
      </CSubmitButton>
    </div>

    <div class="history">
      {{ $t('home.form.historyPrefix') }}
      <CLink class="link"
             :to="{ name: 'transactions' }">{{ $t('home.form.historyLink') }}</CLink>
    </div>

    <SelectTokenBasic :visible.sync="selectTokenBasicVisible"
                      :tokenBasicName="tokenBasicName"
                      @update:tokenBasicName="changeTokenBasicName"
                      :tokenBasics="tokenBasics"
                      :popularTokenBasics="tokenBasics" />
    <SelectChain :visible.sync="selectFromChainVisible"
                 :chainId="fromChainId"
                 @update:chainId="changeFromChainId"
                 :chains="fromChains || []" />
    <SelectChain :visible.sync="selectToChainVisible"
                 :chainId="toChainId"
                 @update:chainId="changeToChainId"
                 :chains="toChains || []" />
    <ConnectWallet :visible.sync="connectWalletVisible"
                   :fromChainId="fromChainId"
                   :toChainId="toChainId" />
    <Confirm :key="confirmUuid"
             :visible.sync="confirmVisible"
             :confirmingData.sync="confirmingData"
             @closed="handleClosed"
             @packed="handlePacked" />
    <TransactionDetails :visible.sync="transactionDetailsVisible"
                        :confirmingData="confirmingData" />
  </ValidationObserver>
</template>

<script>
import BigNumber from 'bignumber.js';
import copy from 'clipboard-copy';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_TOKEN_BASIC_NAME } from '@/utils/values';
import { ChainId } from '@/utils/enums';
import TransactionDetails from '@/views/transactions/Details';
import { getWalletApi } from '@/utils/walletApi';
import SelectTokenBasic from './SelectTokenBasic';
import SelectChain from './SelectChain';
import ConnectWallet from './ConnectWallet';
import Confirm from './Confirm';

export default {
  name: 'Form',
  components: {
    SelectTokenBasic,
    SelectChain,
    ConnectWallet,
    Confirm,
    TransactionDetails,
  },
  data () {
    return {
      selectTokenBasicVisible: false,
      selectFromChainVisible: false,
      selectToChainVisible: false,
      connectWalletVisible: false,
      confirmVisible: false,
      transactionDetailsVisible: false,
      tokenBasicName: DEFAULT_TOKEN_BASIC_NAME,
      fromChainId: null,
      toChainId: null,
      amount: '',
      approving: false,
      confirmingData: null,
      confirmUuid: uuidv4(),
    };
  },
  computed: {
    tokenBasics () {
      return this.$store.getters.tokenBasics;
    },
    tokenBasic () {
      return this.$store.getters.getTokenBasic(this.tokenBasicName);
    },
    chains () {
      return this.$store.getters.chains.filter(chain => chain.id !== ChainId.Poly);
    },
    fromChains () {
      return (
        this.tokenBasic &&
        this.$store.getters
          .getTokensByTokenBasicName(this.tokenBasic.name)
          .map(token => this.$store.getters.getChain(token.chainId))
          .filter(chain => chain)
      );
    },
    fromChain () {
      return this.$store.getters.getChain(this.fromChainId);
    },
    fromToken () {
      return (
        this.tokenBasic &&
        this.$store.getters.getTokenByTokenBasicNameAndChainId({
          tokenBasicName: this.tokenBasicName,
          chainId: this.fromChainId,
        })
      );
    },
    fromWallet () {
      return this.$store.getters.getChainConnectedWallet(this.fromChainId);
    },
    getTokenMapsParams () {
      if (this.fromToken) {
        return {
          fromChainId: this.fromChainId,
          fromTokenHash: this.fromToken.hash,
        };
      }
      return null;
    },
    tokenMaps () {
      return this.getTokenMapsParams && this.$store.getters.getTokenMaps(this.getTokenMapsParams);
    },
    toChains () {
      return (
        this.tokenMaps &&
        this.tokenMaps
          .map(tokenMap => this.$store.getters.getChain(tokenMap.toToken.chainId))
          .filter(chain => chain)
      );
    },
    toChain () {
      return this.$store.getters.getChain(this.toChainId);
    },
    toToken () {
      return (
        this.tokenBasic &&
        this.$store.getters.getTokenByTokenBasicNameAndChainId({
          tokenBasicName: this.tokenBasicName,
          chainId: this.toChainId,
        })
      );
    },
    toWallet () {
      return this.$store.getters.getChainConnectedWallet(this.toChainId);
    },
    getBalanceParams () {
      if (this.fromWallet && this.fromToken) {
        return {
          chainId: this.fromChainId,
          address: this.fromWallet.address,
          tokenHash: this.fromToken.hash,
        };
      }
      return null;
    },
    balance () {
      return this.getBalanceParams && this.$store.getters.getBalance(this.getBalanceParams);
    },
    getAllowanceParams () {
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
    allowance () {
      return this.getAllowanceParams && this.$store.getters.getAllowance(this.getAllowanceParams);
    },
    needApproval () {
      return !!this.amount && !!this.allowance && new BigNumber(this.amount).gt(this.allowance);
    },
    getFeeParams () {
      if (this.fromToken && this.toChainId) {
        return {
          fromChainId: this.fromChainId,
          fromTokenHash: this.fromToken.hash,
          toChainId: this.toChainId,
        };
      }
      return null;
    },
    fee () {
      return this.getFeeParams && this.$store.getters.getFee(this.getFeeParams);
    },
  },
  watch: {
    async getBalanceParams (value) {
      if (value) {
        await this.$store.dispatch('ensureChainWalletReady', value.chainId);
        this.$store.dispatch('getBalance', value);
      }
    },
    getFeeParams (value) {
      if (value) {
        this.$store.dispatch('getFee', value);
      }
    },
    getTokenMapsParams (value) {
      if (value) {
        this.$store.dispatch('getTokenMaps', value);
      }
    },
    async getAllowanceParams (value) {
      if (value) {
        await this.$store.dispatch('ensureChainWalletReady', value.chainId);
        this.$store.dispatch('getAllowance', value);
      }
    },
  },
  created () {
    this.$store.dispatch('getTokenBasics');
    this.interval = setInterval(() => {
      if (
        this.getBalanceParams &&
        this.fromWallet &&
        this.fromWallet.chainId === this.fromChainId
      ) {
        this.$store.dispatch('getBalance', this.getBalanceParams);
      }
      if (
        this.getAllowanceParams &&
        this.fromWallet &&
        this.fromWallet.chainId === this.fromChainId
      ) {
        this.$store.dispatch('getAllowance', this.getAllowanceParams);
      }
    }, 5000);
  },
  beforeDestroy () {
    clearInterval(this.interval);
  },
  methods: {
    changeTokenBasicName (tokenBasicName) {
      this.tokenBasicName = tokenBasicName;
      this.fromChainId = null;
      this.toChainId = null;
      this.clearAmount();
    },
    changeFromChainId (chainId) {
      this.fromChainId = chainId;
      this.toChainId = null;
      this.clearAmount();
    },
    changeToChainId (chainId) {
      this.toChainId = chainId;
      this.clearAmount();
    },
    async exchangeFromTo () {
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
      this.clearAmount();
    },
    copy (text) {
      copy(text);
      this.$message.success(this.$t('messages.copied', { text }));
    },
    transferAll () {
      this.amount = this.balance;
      this.$nextTick(() => this.$refs.amountValidation.validate());
    },
    async approve () {
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
    next () {
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
      this.confirmVisible = true;
    },
    handleClosed () {
      this.$nextTick(() => {
        this.confirmUuid = uuidv4();
      });
    },
    handlePacked () {
      this.transactionDetailsVisible = true;
      this.clearAmount();
    },
    clearAmount () {
      this.amount = '';
      this.$nextTick(() => this.$refs.amountValidation.reset());
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
  flex: 1;
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
  border-radius: 10px;
}

.select-token-basic-name {
  font-size: 14px;
}

.select-chain {
  width: 100%;
}

.select-chain-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
  white-space: pre-line;
  text-align: left;
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

.tooltip-icon {
  vertical-align: baseline;
}

.fee-value {
  font-size: 12px;
}

.fee-icon {
  width: 14px;
  border-radius: 7px;
}

.fee-token {
  font-size: 10px;
}

.link {
  color: #2fd8ca;
  text-decoration: underline;
}
.approve-wrapper {
  label {
    margin-bottom: 10px;
  }
}
</style>
