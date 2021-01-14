<template>
  <div class="connect-wallet">
    <CButton class="close" @click="$emit('close')">
      <img class="close-icon" src="@/assets/svg/close.svg" />
    </CButton>
    <div class="content">
      <div class="chains">
        <CButton
          v-for="(chain, index) in chains"
          :key="index"
          class="chain"
          :class="{ selected: selectedChainId === chain.id }"
        >
          <img class="chain-icon" :src="chain.icon" />
        </CButton>
      </div>
      <CDivider direction="vertical" />
      <div class="wallets">
        <div class="wallet-chain">Ethereum Wallet</div>
        <CButton v-for="(wallet, index) in wallets" :key="index" class="wallet">
          <span class="wallet-name">Connect {{ wallet.name }}</span>
          <img :src="wallet.icon" />
        </CButton>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConnectWallet',
  data() {
    return {
      selectedChainId: 1,
      chains: [
        { id: 1, name: 'Ethereum', icon: require('@/assets/svg/eth.svg') },
        {
          id: 2,
          name: 'Binance Smart Chain',
          icon: require('@/assets/svg/bsc.svg'),
        },
        { id: 3, name: 'Huobi ECO Chain', icon: require('@/assets/svg/heco.svg') },
        { id: 4, name: 'Neo', icon: require('@/assets/svg/neo.svg') },
      ],
      wallets: [
        {
          symbol: 'Neoline',
          name: 'Neoline',
          icon: require('@/assets/svg/neoline.svg'),
        },
        {
          symbol: 'O3',
          name: 'O3',
          icon: require('@/assets/svg/o3.svg'),
        },
        {
          symbol: 'Metamask',
          name: 'Metamask',
          icon: require('@/assets/svg/metamask.svg'),
        },
        {
          symbol: 'Binance',
          name: 'Binance',
          icon: require('@/assets/svg/binance.svg'),
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.connect-wallet {
  border-radius: 4px;
  background: #182233;
  box-shadow: 0px 2px 10px 7px rgba(0, 0, 0, 0.16);
  overflow: hidden;
}

.close {
  position: absolute;
  transform: translateX(calc(-100% - 10px));
}

.close-icon {
  width: 20px;
}

.content {
  display: flex;
}

.chains {
  display: flex;
  flex-direction: column;
}

.chain {
  padding: 20px;

  &.selected {
    background: rgba(#ffffff, 0.05);
  }
}

.chain-icon {
  width: 30px;
}

.wallets {
  display: flex;
  flex-direction: column;
  padding: 20px;
  @include child-margin-v(16px);
}

.wallet-chain {
  font-weight: 500;
  font-size: 12px;
  @include next-margin-v(8px);
}

.wallet {
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

.wallet-name {
  font-size: 12px;
}
</style>
