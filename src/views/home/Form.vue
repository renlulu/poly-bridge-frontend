<template>
  <div class="form">
    <div class="card">
      <div class="title">Bridge</div>
      <div class="fields">
        <div class="field">
          <div class="label">Asset</div>
          <CButton class="select-token-basic" @click="selectTokenBasicVisible = true">
            <img class="select-token-basic-icon" src="@/assets/svg/eth-token.svg" />
            <span class="select-token-basic-text">ETH</span>
            <CFlexSpan />
            <img src="@/assets/svg/chevron-right.svg" />
          </CButton>
        </div>

        <div class="fields-row">
          <div class="field">
            <div class="label">From</div>
            <CButton class="select-chain" @click="selectFromChainVisible = true">
              <img class="select-chain-icon" src="@/assets/svg/eth.svg" />
              <span class="select-chain-name">Ethereum</span>
              <span class="select-chain-name">Network</span>
              <img class="chevron-down" src="@/assets/svg/chevron-down.svg" />
            </CButton>
            <div class="address">
              <span class="address-value">0xc12E…79F192</span>
              <CButton>
                <img src="@/assets/svg/copy.svg" />
              </CButton>
            </div>
          </div>
          <CButton class="exchange">
            <img src="@/assets/svg/exchange.svg" />
          </CButton>
          <div class="field">
            <div class="label">To</div>
            <CButton class="select-chain" @click="selectToChainVisible = true">
              <img class="select-chain-icon" src="@/assets/svg/neo.svg" />
              <span class="select-chain-name">Neo</span>
              <span class="select-chain-name">Network</span>
              <img class="chevron-down" src="@/assets/svg/chevron-down.svg" />
            </CButton>
            <div class="address">
              <span class="address-value">0xc12E…79F192</span>
              <CButton>
                <img src="@/assets/svg/copy.svg" />
              </CButton>
            </div>
          </div>
        </div>

        <div class="field">
          <div class="label">Amount</div>
          <div class="input">
            <CInput class="input-inner" />
            <CButton class="use-max">MAX</CButton>
          </div>
          <div class="balance">
            <span class="label">Balance</span>
            <CFlexSpan />
            <span class="value">70,00235 ETH</span>
          </div>
          <div class="fee">
            <span class="label">Fee</span>
            <CFlexSpan />
            <span class="fee-value">0.25567</span>
            <img class="fee-icon" src="@/assets/svg/eth-token.svg" />
            <span class="fee-token">ETH</span>
          </div>
        </div>
      </div>

      <CSubmitButton @click="connectWalletVisible = true">Connect Wallet</CSubmitButton>
    </div>

    <div class="history">
      You can view your
      <CLink class="link" :to="{ name: 'transactions' }">history</CLink>
    </div>

    <SelectTokenBasic :visible.sync="selectTokenBasicVisible" />
    <SelectChain :visible.sync="selectFromChainVisible" />
    <SelectChain :visible.sync="selectToChainVisible" />
    <ConnectWallet :visible.sync="connectWalletVisible" />
    <ConfirmSwap :visible.sync="confirmSwapVisible" />
    <TransactionDetails :visible.sync="transactionDetailsVisible" />
  </div>
</template>

<script>
import SelectTokenBasic from './SelectTokenBasic';
import SelectChain from './SelectChain';
import ConnectWallet from './ConnectWallet';
import ConfirmSwap from './ConfirmSwap';
import TransactionDetails from './TransactionDetails';

export default {
  name: 'Form',
  components: {
    SelectTokenBasic,
    SelectChain,
    ConnectWallet,
    ConfirmSwap,
    TransactionDetails,
  },
  data() {
    return {
      selectTokenBasicVisible: false,
      selectFromChainVisible: false,
      selectToChainVisible: false,
      connectWalletVisible: false,
      confirmSwapVisible: false,
      transactionDetailsVisible: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  @include child-margin-v(30px);
}

.card {
  box-sizing: border-box;
  width: 452px;
  padding: 40px 50px 54px;
  background: #171f31;
  box-shadow: 0px 2px 18px 7px rgba(#000000, 0.1);
  border-radius: 10px;
}

.title {
  font-weight: 500px;
  font-size: 20px;
  text-align: center;
  @include next-margin-v(30px);
}

.fields {
  @include child-margin-v(20px);
  @include next-margin-v(40px);
}

.fields-row {
  display: flex;
  @include child-margin-h(18px);
}

.field {
  width: stretch;
  @include child-margin-v(10px);
}

.label {
  opacity: 0.6;
  font-weight: 500;
  font-size: 12px;
}

.value {
  font-size: 10px;
}

.select-token-basic {
  display: flex;
  align-items: center;
  width: stretch;
  padding: 10px 14px;
  background: rgba(#000000, 0.26);
  border-radius: 4px;
  @include child-margin-h(8px);
}

.select-token-basic-icon {
  width: 20px;
}

.select-token-basic-text {
  font-size: 14px;
}

.select-chain {
  display: flex;
  flex-direction: column;
  width: stretch;
  padding: 15px;
  border: 1px solid rgba(#ffffff, 0.1);
  border-radius: 4px;
  background: rgba(#ffffff, 0.04);
}

.select-chain-icon {
  width: 40px;
  @include next-margin-v(8px);
}

.select-chain-name {
  font-size: 14px;
}

.address {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.address-value {
  font-size: 12px;
}

.chevron-down {
  align-self: flex-end;
}

.exchange {
  position: relative;
  top: 10px;
}

.input {
  display: flex;
  padding: 18px 14px;
  background: rgba(#000000, 0.26);
  border-radius: 4px;
}

.use-max {
  padding: 5px;
  border-radius: 4px;
  color: rgba(#ffffff, 0.6);
  background: rgba(#ffffff, 0.05);
  font-weight: 600;
  font-size: 12px;
}

.balance,
.fee {
  display: flex;
  align-items: center;
  @include child-margin-h(4px);
}

.fee-value {
  font-size: 12px;
}

.fee-icon {
  width: 14px;
}

.fee-token {
  font-size: 10px;
}

.link {
  color: #2fd8ca;
  text-decoration: underline;
}
</style>
