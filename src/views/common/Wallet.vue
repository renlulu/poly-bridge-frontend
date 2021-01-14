<template>
  <div class="wallet">
    <div class="top">
      <img src="@/assets/svg/metamask.svg" />
      <span class="wallet-name">Metamask</span>
    </div>
    <div class="address">
      <span class="address-value">0xc12E…79F192</span>
      <CButton>
        <img src="@/assets/svg/copy.svg" />
      </CButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wallet {
  padding: 20px;
  border-radius: 4px;
  background: #182233;
  box-shadow: 0px 2px 10px 7px rgba(0, 0, 0, 0.16);
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
