<template>
  <CDrawer v-bind="$attrs" v-on="$listeners">
    <div class="content">
      <div class="title">Select Network</div>
      <CDivider />
      <div class="scroll">
        <div v-for="(chain, index) in chains" :key="index" class="chain" @click="select(chain)">
          <span class="chain-left">
            <img :src="chain.icon" />
            <span>{{ chain.name }}</span>
          </span>
          <img v-if="selectedChainId === chain.id" src="@/assets/svg/check.svg" />
        </div>
      </div>
    </div>
  </CDrawer>
</template>

<script>
export default {
  name: 'SelectChain',
  inheritAttrs: false,
  data() {
    return {
      selectedChainId: 1,
      chains: [
        { id: 1, name: 'Ethereum', icon: require('@/assets/svg/eth.svg') },
        { id: 2, name: 'Binance Smart Chain', icon: require('@/assets/svg/eth.svg') },
        { id: 3, name: 'Huobi ECO Chain', icon: require('@/assets/svg/eth.svg') },
      ],
    };
  },
  methods: {
    select(chain) {
      this.$emit('update:visible', false);
      this.$emit('select', chain);
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
  padding: 16px 10px;
  overflow-y: auto;
  @include scroll-bar(rgba(#fff, 0.2), transparent);
}

.chain {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 32px;
  transition: all 0.3s;
  @include child-margin-h(16px);

  &:hover {
    opacity: 0.8;
    background: rgba(#000000, 0.3);
  }
}

.chain-left {
  display: flex;
  align-items: center;
  @include child-margin-h(8px);
}
</style>
