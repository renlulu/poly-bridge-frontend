<template>
  <CDrawer
    v-bind="$attrs"
    :closeOnClickModal="!confirming"
    :closeOnPressEscape="!confirming"
    v-on="$listeners"
  >
    <div class="content">
      <div class="title">{{ $t('home.confirmSwap.title') }}</div>
      <CDivider />
      <div v-if="confirmingData" class="scroll">
        <div class="fields">
          <div class="field">
            <div class="label">{{ $t('home.confirmSwap.amount') }}</div>
            <div class="amount">
              <span class="amount-value">{{ $formatNumber(confirmingData.amount) }}</span>
              <span class="token-basic-name">{{ tokenBasic.name }}</span>
            </div>
          </div>

          <div class="field">
            <div class="label">{{ $t('home.confirmSwap.from') }}</div>
            <div class="chain">
              <img class="chain-icon" :src="fromChain.icon" />
              <span class="chain-name">
                {{
                  $t('home.confirmSwap.chainName', {
                    chainName: $formatEnum(confirmingData.fromChainId, { type: 'chainName' }),
                  })
                }}
              </span>
            </div>
            <div class="address">
              {{ confirmingData.fromAddress }}
            </div>
          </div>

          <div class="field">
            <div class="label">{{ $t('home.confirmSwap.to') }}</div>
            <div class="chain">
              <img class="chain-icon" :src="toChain.icon" />
              <span class="chain-name">
                {{
                  $t('home.confirmSwap.chainName', {
                    chainName: $formatEnum(confirmingData.toChainId, { type: 'chainName' }),
                  })
                }}
              </span>
            </div>
            <div class="address">
              {{ confirmingData.toAddress }}
            </div>
          </div>

          <div class="field">
            <div class="label">{{ $t('home.confirmSwap.fee') }}</div>
            <div class="fee">
              <span class="fee-value">{{ $formatNumber(confirmingData.fee) }}</span>
              <span class="token-basic-name">{{ fromToken.name }}</span>
            </div>
          </div>

          <div class="field">
            <div class="label">{{ $t('home.confirmSwap.receiving') }}</div>
            <div class="fee">
              <span class="fee-value">{{ $formatNumber(receivingAmount) }}</span>
              <span class="token-basic-name">{{ toToken.name }}</span>
            </div>
          </div>
        </div>

        <CSubmitButton :loading="confirming" @click="confirm">
          {{ confirming ? $t('buttons.confirming') : $t('buttons.confirm') }}
        </CSubmitButton>
      </div>
    </div>
  </CDrawer>
</template>

<script>
import BigNumber from 'bignumber.js';
import delay from 'delay';
import { SingleTransactionStatus } from '@/utils/enums';
import { getWalletApi } from '@/utils/walletApi';

export default {
  name: 'ConfirmSwap',
  inheritAttrs: false,
  props: {
    confirmingData: Object,
  },
  data() {
    return {
      confirming: false,
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
    fromChain() {
      return this.confirmingData && this.$store.getters.getChain(this.confirmingData.fromChainId);
    },
    fromToken() {
      return (
        this.tokenBasic &&
        this.$store.getters.getTokenByTokenBasicNameAndChainId({
          tokenBasicName: this.tokenBasic.name,
          chainId: this.confirmingData.fromChainId,
        })
      );
    },
    toChain() {
      return this.confirmingData && this.$store.getters.getChain(this.confirmingData.toChainId);
    },
    toToken() {
      return (
        this.tokenBasic &&
        this.$store.getters.getTokenByTokenBasicNameAndChainId({
          tokenBasicName: this.tokenBasic.name,
          chainId: this.confirmingData.toChainId,
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
        this.confirming = true;
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
        let status;
        // eslint-disable-next-line no-constant-condition
        while (true) {
          try {
            // eslint-disable-next-line no-await-in-loop
            status = await walletApi.getTransactionStatus({ transactionHash });
            if (status !== SingleTransactionStatus.Pending) {
              break;
            }
            // eslint-disable-next-line no-await-in-loop
            await delay(5000);
          } catch (error) {
            // ignore error
          }
        }
        this.$emit('confirmed', {
          ...this.confirmingData,
          transactionHash,
          transactionStatus: status,
        });
        this.$emit('update:visible', false);
      } finally {
        this.confirming = false;
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
