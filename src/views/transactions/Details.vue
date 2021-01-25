<template>
  <CDrawer v-bind="$attrs" v-on="$listeners">
    <div class="content">
      <div class="title">{{ $t('transactions.details.title') }}</div>
      <div v-if="mergedTransaction" class="scroll">
        <div v-for="(step, index) in mergedTransaction.steps" :key="step.chainId" class="step">
          <div class="step-dot" :class="{ active: step.hash }" />
          <div v-if="index !== mergedTransaction.steps.length - 1" class="step-line" />
          <div class="step-title">{{ $formatEnum(step.chainId, { type: 'chainName' }) }}</div>
          <div class="description">
            <template v-if="!step.hash">
              {{
                $t('transactions.details.waiting', {
                  chainName: $formatEnum(step.chainId, { type: 'chainName' }),
                })
              }}
            </template>
            <template v-else-if="!(step.blocks >= step.needBlocks)">
              {{
                $t('transactions.details.proceeding', {
                  chainName: $formatEnum(step.chainId, { type: 'chainName' }),
                })
              }}
            </template>
            <template v-else>
              {{
                $t('transactions.details.proceeded', {
                  chainName: $formatEnum(step.chainId, { type: 'chainName' }),
                })
              }}
            </template>
          </div>
          <div class="progress">
            <ElProgress
              class="progress-bar"
              :percentage="(step.blocks / step.needBlocks) * 100"
              :showText="false"
            />
            <span class="progress-text">
              {{
                $t('transactions.details.confirmation', {
                  blocks: step.blocks || '-',
                  needBlocks: step.needBlocks || '-',
                })
              }}
            </span>
          </div>
          <CLink
            class="hash"
            :href="$format(getChain(step.chainId).explorerUrl, { txHash: step.hash })"
            :disabled="!step.hash"
          >
            {{
              $t('transactions.details.hash', {
                hash: $formatLongText(step.hash || 'N/A', { headTailLength: 16 }),
              })
            }}
          </CLink>
        </div>
      </div>
    </div>
  </CDrawer>
</template>

<script>
import { ChainId } from '@/utils/enums';

export default {
  name: 'Details',
  inheritAttrs: false,
  props: {
    hash: String,
    confirmingData: Object,
  },
  computed: {
    mergedHash() {
      return this.hash || (this.confirmingData && this.confirmingData.transactionHash);
    },
    transaction() {
      return this.$store.getters.getTransaction(this.mergedHash);
    },
    mergedTransaction() {
      return (
        this.transaction ||
        (this.confirmingData && {
          steps: [
            {
              hash: this.confirmingData.transactionHash,
              chainId: this.confirmingData.fromChainId,
            },
            {
              chainId: ChainId.Poly,
            },
            {
              chainId: this.confirmingData.toChainId,
            },
          ],
        })
      );
    },
  },
  watch: {
    mergedHash(value) {
      if (value) {
        this.$store.dispatch('getTransaction', value);
      }
    },
  },
  created() {
    this.interval = setInterval(() => {
      if (this.mergedHash && this.$attrs.visible) {
        this.$store.dispatch('getTransaction', this.mergedHash);
      }
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    getChain(chainId) {
      return this.$store.getters.getChain(chainId);
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
  padding: 80px 50px 40px;
  font-weight: 600;
  font-size: 40px;
}

.scroll {
  flex: 1;
  padding: 40px 50px 40px 80px;
  overflow-y: auto;
  @include scroll-bar(rgba(#fff, 0.2), transparent);
  @include child-margin-v(56px);
}

.step {
  position: relative;
}

.step-dot {
  position: absolute;
  left: -28px;
  top: 3px;
  width: 8px;
  height: 8px;
  border: 1px solid #ffffff;
  border-radius: 5px;

  &.active {
    background: #3ec7eb;
  }
}

.step-line {
  position: absolute;
  left: -24.5px;
  top: 18px;
  width: 1px;
  height: calc(100% + 36px);
  background: #ffffff;
  opacity: 0.3;
}

.step-title {
  font-weight: 500;
  @include next-margin-v(10px);
}

.description {
  opacity: 0.6;
  font-size: 14px;
  @include next-margin-v(20px);
}

.progress {
  display: flex;
  align-items: center;
  @include child-margin-h(20px);
  @include next-margin-v(26px);
}

.progress-bar {
  flex: 1;
  ::v-deep .el-progress-bar__outer {
    background: rgba(#ffffff, 0.3);
  }

  ::v-deep .el-progress-bar__inner {
    background: #ffffff;
  }
}

.progress-text {
  opacity: 0.6;
  font-size: 12px;
}

.hash {
  display: inline-block;
  opacity: 0.6;
  color: #3ec7eb;
  font-size: 14px;
  text-decoration: underline;
}
</style>
