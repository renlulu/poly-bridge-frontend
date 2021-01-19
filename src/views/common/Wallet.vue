<template>
  <div class="wallet">
    <div class="top">
      <img :src="wallet.icon" />
      <span class="wallet-name">{{ wallet.name }}</span>
    </div>
    <div class="address">
      <span class="address-value">{{ $formatLongText(wallet.address) }}</span>
      <CButton @click="copy(wallet.address)">
        <img src="@/assets/svg/copy.svg" />
      </CButton>
    </div>
  </div>
</template>

<script>
import copy from 'clipboard-copy';

export default {
  name: 'Wallet',
  props: {
    wallet: Object,
  },
  methods: {
    copy(text) {
      copy(text);
      this.$message.success(this.$t('messages.copied', { text }));
    },
  },
};
</script>

<style lang="scss" scoped>
.wallet {
  padding: 20px;
  border-radius: 4px;
  background: #182233;
  box-shadow: 0px 2px 10px 7px rgba(0, 0, 0, 0.16);
  @include child-margin-v(12px);
}

.top {
  display: flex;
  align-items: center;
  @include child-margin-h(12px);
}

.wallet-name {
  opacity: 0.6;
  font-weight: 400;
  font-size: 12px;
}

.address {
  display: flex;
  align-items: center;
  @include child-margin-h(12px);
}

.address-value {
  font-size: 12px;
}
</style>
