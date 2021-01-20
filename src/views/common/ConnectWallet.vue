<template>
  <div class="connect-wallet">
    <CButton class="close" @click="$emit('close')">
      <img class="close-icon" src="@/assets/svg/close.svg" />
    </CButton>
    <div class="content">
      <div class="chains">
        <CButton
          v-for="chain in chains"
          :key="chain.id"
          class="chain"
          :class="{ selected: chainIdWithDefault === chain.id }"
          @click="chainId = chain.id"
          @mouseover="chainId = chain.id"
        >
          <img class="chain-icon" :src="chain.icon" />
        </CButton>
      </div>

      <CDivider direction="vertical" />

      <transition name="fade" mode="out-in">
        <div class="wallets" :key="chain.id">
          <div class="wallet-chain">{{ $formatEnum(chain.id, { type: 'chainName' }) }} Wallet</div>
          <div v-for="wallet in chainWallets" :key="wallet.name">
            <div v-if="wallet.connected && wallet.name === chain.selectedWalletName" class="wallet">
              <img :src="wallet.icon" />
              <span class="wallet-name">
                {{ $formatEnum(wallet.name, { type: 'walletName' }) }} Connected
              </span>
            </div>
            <CButton v-else class="connect" @click="connect(chain, wallet)">
              <span class="wallet-name">
                Connect {{ $formatEnum(wallet.name, { type: 'walletName' }) }}
              </span>
              <img :src="wallet.icon" />
            </CButton>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { ChainId } from '@/utils/enums';
import { getWalletApi } from '@/utils/walletApi';

export default {
  name: 'ConnectWallet',
  data() {
    return {
      chainId: 0,
    };
  },
  computed: {
    chains() {
      return this.$store.getters.chains.filter(chain => chain.id !== ChainId.Poly);
    },
    chainIdWithDefault() {
      return this.chainId ? this.chainId : this.chains[0].id;
    },
    chain() {
      return this.$store.getters.getChain(this.chainIdWithDefault);
    },
    chainWallets() {
      return this.$store.getters.getWalletsByChainId(this.chainIdWithDefault);
    },
  },
  methods: {
    async connect(chain, wallet) {
      if (wallet.installed) {
        if (!wallet.connected) {
          const walletApi = await getWalletApi(wallet.name);
          await walletApi.connect();
        }
        this.$store.dispatch('setChainSelectedWallet', {
          chainId: chain.id,
          walletName: wallet.name,
        });
      } else {
        window.open(wallet.downloadUrl);
      }
    },
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
