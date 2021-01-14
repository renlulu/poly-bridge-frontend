<template>
  <CDrawer v-bind="$attrs" v-on="$listeners">
    <div class="content">
      <div class="title">Transaction Details</div>
      <div class="scroll">
        <div class="step">
          <div class="step-dot" :class="{ active: true }" />
          <div class="step-line" />
          <div class="step-title">ETH</div>
          <div class="description">
            The transaction is proceeding on the ETH. Please be patient…
          </div>
          <div class="progress">
            <ElProgress class="progress-bar" :percentage="100" :showText="false" />
            <span class="progress-text">1/2 Confirm</span>
          </div>
          <CLink class="hash">hash 709dd2a9a0054f02cf102ed81e0b…</CLink>
        </div>

        <div class="step">
          <div class="step-dot" :class="{ active: true }" />
          <div class="step-line" />
          <div class="step-title">NEO（1/2 Confirm）</div>
          <div class="description">
            The transaction is proceeding on the ETH. Please be patient…
          </div>
          <div class="progress">
            <ElProgress class="progress-bar" :percentage="50" :showText="false" />
            <span class="progress-text">1/2 Confirm</span>
          </div>
          <CLink class="hash">hash 709dd2a9a0054f02cf102ed81e0b…</CLink>
        </div>

        <div class="step">
          <div class="step-dot" :class="{ active: false }" />
          <div class="step-title">PolyNetwork（1/2 Confirm）</div>
          <div class="description">
            The transaction is proceeding on the ETH. Please be patient…
          </div>
          <div class="progress">
            <ElProgress class="progress-bar" :percentage="0" :showText="false" />
            <span class="progress-text">1/2 Confirm</span>
          </div>
          <CLink class="hash">hash 709dd2a9a0054f02cf102ed81e0b…</CLink>
        </div>
      </div>
    </div>
  </CDrawer>
</template>

<script>
export default {
  name: 'TransactionDetails',
  inheritAttrs: false,
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
