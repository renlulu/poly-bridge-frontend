<template>
  <div class="wallets">
    <CPopover v-if="!connectedWallets.length" v-model="connectWalletVisible">
      <CButton class="connect-wallet-button">Connect Wallet</CButton>
      <template #content>
        <ConnectWallet @close="connectWalletVisible = false" />
      </template>
    </CPopover>

    <template v-else>
      <CPopover v-for="(wallet, index) in connectedWallets" :key="index" trigger="hover">
        <CButton>
          <img class="wallet-icon" :src="wallet.icon" />
        </CButton>
        <template #content>
          <Wallet />
        </template>
      </CPopover>

      <CPopover class="show-all" v-model="connectWalletVisible">
        <CButton>
          <img src="@/assets/svg/chevron-down.svg" />
        </CButton>
        <template #content>
          <ConnectWallet @close="connectWalletVisible = false" />
        </template>
      </CPopover>
    </template>
  </div>
</template>

<script>
import Wallet from './Wallet';
import ConnectWallet from './ConnectWallet';

export default {
  name: 'Wallets',
  components: {
    Wallet,
    ConnectWallet,
  },
  data() {
    return {
      connectWalletVisible: false,
      connectedWallets: [
        {
          symbol: 'Neoline',
          name: 'Neoline',
          icon: require('@/assets/svg/neoline.svg'),
        },
        {
          symbol: 'Metamask',
          name: 'NeMetamaskoline',
          icon: require('@/assets/svg/metamask.svg'),
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.wallets {
  @include child-margin-h(4px);
}

.show-all {
  @include last-margin-h(10px);
}

.connect-wallet-button {
  padding: 8px 20px;
  border: 1px solid #ffffff;
  border-radius: 4px;
  font-size: 14px;
}
</style>
