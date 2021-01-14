<template>
  <CDrawer v-bind="$attrs" v-on="$listeners">
    <div class="content">
      <div class="title">Confirm Swap</div>
      <CDivider />
      <div class="scroll">
        <div class="fields">
          <div class="field">
            <div class="label">Amount</div>
            <div class="amount">
              <span class="amount-value">1000.0</span>
              <span class="token-basic-name">ETH</span>
            </div>
          </div>

          <div class="field">
            <div class="label">From</div>
            <div class="chain">
              <img class="chain-icon" src="@/assets/svg/eth.svg" />
              <span class="chain-name">Ethereum Network</span>
            </div>
            <div class="address">
              0xc1pmwndcnki09nk21nk18lnkk112e79F192
            </div>
          </div>

          <div class="field">
            <div class="label">To</div>
            <div class="chain">
              <img class="chain-icon" src="@/assets/svg/neo.svg" />
              <span class="chain-name">Neo Network</span>
            </div>
            <div class="address">
              0xc1pmwndcnki09nk21nk18lnkk112e79F192
            </div>
          </div>

          <div class="field">
            <div class="label">Fee</div>
            <div class="fee">
              <span class="fee-value">0.0132000000</span>
              <span class="token-basic-name">ETH</span>
            </div>
          </div>

          <div class="field">
            <div class="label">You will receive</div>
            <div class="fee">
              <span class="fee-value">999.08741</span>
              <span class="token-basic-name">ETH</span>
            </div>
          </div>
        </div>

        <CSubmitButton @click="confirm">Confirm</CSubmitButton>
      </div>
    </div>
  </CDrawer>
</template>

<script>
export default {
  name: 'ConfirmSwap',
  inheritAttrs: false,
  methods: {
    confirm() {
      this.$emit('update:visible', false);
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
