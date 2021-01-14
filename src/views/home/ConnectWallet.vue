<template>
  <CDrawer v-bind="$attrs" v-on="$listeners">
    <div class="content">
      <div class="title">Connect Wallet</div>
      <CDivider />
      <div class="scroll">
        <div class="from">
          <div class="chain">
            <img class="chain-icon" src="@/assets/svg/eth.svg" />
            <span class="chain-name">Ethereum Network</span>
          </div>
          <div class="wallets">
            <div v-for="(wallet, index) in fromChainWallets" :key="index">
              <div v-if="wallet.connected" class="wallet">
                <img :src="wallet.icon" />
                <span class="wallet-name">{{ wallet.name }} Connected</span>
              </div>
              <CButton v-else class="connect" :disabled="wallet.disabled" @click="connect(wallet)">
                <span class="wallet-name">Connect {{ wallet.name }}</span>
                <img :src="wallet.icon" />
              </CButton>
            </div>
          </div>
        </div>

        <div class="to">
          <div class="chain">
            <img class="chain-icon" src="@/assets/svg/eth.svg" />
            <span class="chain-name">Ethereum Network</span>
          </div>
          <div class="wallets">
            <div v-for="(wallet, index) in toChainWallets" :key="index">
              <div v-if="wallet.connected" class="wallet">
                <img :src="wallet.icon" />
                <span class="wallet-name">{{ wallet.name }} Connected</span>
              </div>
              <CButton v-else class="connect" :disabled="wallet.disabled" @click="connect(wallet)">
                <span class="wallet-name">Connect {{ wallet.name }}</span>
                <img :src="wallet.icon" />
              </CButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CDrawer>
</template>

<script>
export default {
  name: 'ConnectWallet',
  inheritAttrs: false,
  data() {
    return {
      fromChainWallets: [
        { symbol: 'Metamask', name: 'Metamask', icon: require('@/assets/svg/metamask.svg') },
        { symbol: 'NeoLine', name: 'NeoLine', icon: require('@/assets/svg/neoline.svg') },
        { symbol: 'O3', name: 'O3', icon: require('@/assets/svg/o3.svg'), connected: true },
      ],
      toChainWallets: [
        { symbol: 'Metamask', name: 'Metamask', icon: require('@/assets/svg/metamask.svg') },
        { symbol: 'NeoLine', name: 'NeoLine', icon: require('@/assets/svg/neoline.svg') },
        { symbol: 'O3', name: 'O3', icon: require('@/assets/svg/o3.svg'), disabled: true },
      ],
    };
  },
  methods: {
    connect(wallet) {
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

.from,
.to {
  @include child-margin-v(20px);
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
  font-weight: 300;
  font-size: 12px;
}

.scroll {
  display: flex;
  justify-content: space-evenly;
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
  @include scroll-bar(rgba(#fff, 0.2), transparent);
}

.wallets {
  display: flex;
  flex-direction: column;
  @include child-margin-v(16px);
}

.wallet {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 167px;
  height: 34px;
  padding: 0px 16px;
  @include child-margin-h(8px);
}

.wallet-name {
  font-size: 12px;
}

.connect {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  min-width: 167px;
  height: 34px;
  padding: 0px 15px;
  border-radius: 4px;
  border: 1px solid #ffffff;
  @include child-margin-h(8px);
}
</style>
