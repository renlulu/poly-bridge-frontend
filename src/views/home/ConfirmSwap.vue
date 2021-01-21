<template>
  <CDrawer v-bind="$attrs" v-on="$listeners">
    <div class="content">
      <div class="title">Confirm Swap</div>
      <CDivider />
      <div v-if="confirmingData" class="scroll">
        <div class="fields">
          <div class="field">
            <div class="label">Amount</div>
            <div class="amount">
              <span class="amount-value">{{ confirmingData.amount }}</span>
              <span class="token-basic-name">{{ tokenBasic.name }}</span>
            </div>
          </div>

          <div class="field">
            <div class="label">From</div>
            <div class="chain">
              <img class="chain-icon" src="@/assets/svg/eth.svg" />
              <span class="chain-name">
                {{ $formatEnum(confirmingData.fromChainId, { type: 'chainName' }) }} Network
              </span>
            </div>
            <div class="address">
              {{ confirmingData.fromAddress }}
            </div>
          </div>

          <div class="field">
            <div class="label">To</div>
            <div class="chain">
              <img class="chain-icon" src="@/assets/svg/neo.svg" />
              <span class="chain-name">
                {{ $formatEnum(confirmingData.toChainId, { type: 'chainName' }) }} Network
              </span>
            </div>
            <div class="address">
              {{ confirmingData.toAddress }}
            </div>
          </div>

          <div class="field">
            <div class="label">Fee</div>
            <div class="fee">
              <span class="fee-value">{{ confirmingData.fee }}</span>
              <span class="token-basic-name">{{ tokenBasic.name }}</span>
            </div>
          </div>

          <div class="field">
            <div class="label">You will receive</div>
            <div class="fee">
              <span class="fee-value">{{ receivingAmount }}</span>
              <span class="token-basic-name">{{ tokenBasic.name }}</span>
            </div>
          </div>
        </div>

        <CSubmitButton :loading="submitting" @click="confirm">Confirm</CSubmitButton>
      </div>
    </div>
  </CDrawer>
</template>

<script>
import BigNumber from 'bignumber.js';
import { getWalletApi } from '@/utils/walletApi';

export default {
  name: 'ConfirmSwap',
  inheritAttrs: false,
  props: {
    confirmingData: Object,
  },
  data() {
    return {
      submitting: false,
    };
  },
  computed: {
    tokenBasic() {
      return (
        this.confirmingData &&
        this.$store.getters.getTokenBasicByChainIdAndTokenHash({
          chainId: this.confirmingData.fromChainId,
          tokenHash: this.confirmingData.fromTokenHash,
        })
      );
    },
    receivingAmount() {
      return (
        this.confirmingData &&
        new BigNumber(this.confirmingData.amount).minus(this.confirmingData.fee).toString()
      );
    },
    fromWallet() {
      return (
        this.confirmingData &&
        this.$store.getters.getChainConnectedWallet(this.confirmingData.fromChainId)
      );
    },
  },
  methods: {
    async confirm() {
      await this.$store.dispatch('ensureChainWalletReady', this.confirmingData.fromChainId);
      try {
        this.submitting = true;
        const walletApi = await getWalletApi(this.fromWallet.name);
        const transactionHash = await walletApi.lock({
          fromChainId: this.confirmingData.fromChainId,
          fromAddress: this.confirmingData.fromAddress,
          fromTokenHash: this.confirmingData.fromTokenHash,
          toChainId: this.confirmingData.toChainId,
          toAddress: this.confirmingData.toAddress,
          amount: this.confirmingData.amount,
          fee: this.confirmingData.fee,
        });
        this.$message.success(`Success. Transaction hash: ${transactionHash}`);
        this.$emit('update:visible', false);
        this.$emit('succeed');
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 100vh;
  background: #171f31;
  box-shadow: 0px 2px 18px 7px rgba(#000000, 0.1);
}

.title {
  padding: 80px 50px 20px;
  font-weight: 500;
}

.scroll {
  flex: 1;
  padding: 40px 50px;
  overflow-y: auto;
  @include child-margin-v(40px);
  @include scroll-bar(rgba(#fff, 0.2), transparent);
}

.fields {
  @include child-margin-v(20px);
}

.field {
  @include child-margin-v(10px);
}

.label {
  opacity: 0.6;
  font-weight: 500;
  font-size: 14px;
}

.amount {
  display: flex;
  align-items: center;
  @include child-margin-h(10px);
}

.amount-value {
  font-weight: 500;
  font-size: 20px;
}

.token-basic-name {
  opacity: 0.6;
  font-size: 14px;
}

.chain {
  display: flex;
  align-items: center;
  @include child-margin-h(8px);
}

.chain-icon {
  width: 20px;
}

.chain-name {
  opacity: 0.6;
  font-size: 14px;
}

.address {
  opacity: 0.6;
  font-size: 14px;
}

.fee {
  display: flex;
  align-items: center;
  @include child-margin-h(8px);
}

.fee-value {
  font-weight: 500;
  font-size: 14px;
}
</style>
