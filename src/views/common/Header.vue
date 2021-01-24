<template>
  <div class="header">
    <CLink class="brand" :to="{ name: 'home' }">
      <img class="brand-logo" src="@/assets/svg/logo.svg" />
      <span class="brand-name">{{ $t('common.header.brandName') }}</span>
    </CLink>
    <Wallets />
  </div>
</template>

<script>
import Wallets from './Wallets';

export default {
  name: 'Header',
  components: {
    Wallets,
  },
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  padding: 0 50px;
}

.brand {
  display: flex;
  align-items: center;
  @include child-margin-h(12px);
}

.brand-name {
  font-size: 20px;
}
</style>
