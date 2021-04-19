<template>
  <ValidationObserver ref="validation"
                      tag="div"
                      class="form">
    <div class="card">
      <div class="fields-row">
        <div class="field-left">
          <div class="label">{{ $t('nft.form.chain') }}</div>
          <CButton class="select-token-basic"
                   @click="selectFromChainVisible = true">
            <template>
              <img class="select-token-basic-icon"
                   :src="fromChain.icon" />
              <span class="select-token-basic-name">{{ $formatEnum(fromChain.id, { type: 'chainName' }) }}</span>
            </template>
            <CFlexSpan />
            <img src="@/assets/svg/chevron-right.svg" />
          </CButton>
          <div class="label margin-top-40">{{ $t('nft.form.items') }}</div>
          <div class="input asset-input">
            <img src="@/assets/png/search.png" />
            <CInput class="input-inner"
                    placeholder="Filter"
                    v-model="assetsName" />
          </div>
          <div class="scroll">
            <div v-for="item in assets"
                 :key="item.Hash"
                 :class="itemHash === item.Hash?'asset asset-active ':'asset'"
                 @click="itemSelect(item)">
              <span class="asset-left">
                <span>{{ item.Name }}</span>
              </span>
              <img v-if="itemHash === item.Hash"
                   style="color:#fff"
                   src="@/assets/svg/check-w.svg" />
            </div>
          </div>
        </div>
        <div class="field-right">
          <div class="fields-row">
            <div class="id-input input">
              <img src="@/assets/png/search.png" />
              <CInput class="input-inner"
                      placeholder="NFT ID"
                      v-model="searchTokenID"
                      v-on:keyup.enter="getItems(itemHash,searchTokenID,1)" />
            </div>
            <!--             <div class="search-button"
                 @click="getItems(itemHash,searchTokenID,1)">
              {{$t('nft.form.search')}}
            </div> -->
          </div>
          <div class="item-content"
               v-loading="itemLoading">
            <div v-if="fromWallet"
                 class="total">
              {{itemsTotal}} {{$t('nft.form.result')}}
            </div>
            <div class="items-content">
              <div v-for="item in items"
                   class="nft-item"
                   :key="item.TokenId"
                   @click="tokenSelect(item)">
                <div class="image">
                  <div v-if="item.Image"
                       class="img-wrapper">
                    <img :src="item.Image" />
                  </div>
                  <div v-else
                       class="img-wrapper-unknow">
                    <img :src="unknowNFT" />
                  </div>
                </div>
                <div class="nft-name">{{item.Name}}</div>
                <div class="nft-tokenid">#{{item.TokenId}}</div>
              </div>
            </div>
            <div class="pagination"
                 v-if="fromWallet && itemsTotal > 6">
              <el-pagination layout="prev, pager, next"
                             @current-change="handleCurrentChange"
                             :current-page="currentPage"
                             :page-size="6"
                             :total="itemsTotal">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
      <!--       <div style="display:none">
        <CSubmitButton v-if="fromChain && toChain && !(fromWallet && toWallet)"
                       @click="connectWalletVisible = true">
          {{ $t('home.form.connectWallet') }}
        </CSubmitButton>
        <CSubmitButton v-else-if="!invalid && fromToken && toToken && needApproval"
                       :loading="approving"
                       @click="approve">
          {{ approving ? $t('buttons.approving') : $t('buttons.approve') }}
        </CSubmitButton>
        <CSubmitButton v-else
                       :disabled="invalid || !(fromToken && toToken)"
                       @click="next">
          {{ $t('buttons.next') }}
        </CSubmitButton>
      </div> -->
    </div>

    <div class="history">
      {{ $t('home.form.historyPrefix') }}
      <CLink class="link"
             :to="{ name: 'nfttransactions' }">{{ $t('home.form.historyLink') }}</CLink>
    </div>

    <SelectChain :visible.sync="selectFromChainVisible"
                 :chainId="fromChainId"
                 @update:chainId="changeFromChainId"
                 :chains="nftChains || []" />
    <SelectChain :visible.sync="selectToChainVisible"
                 :chainId="toChainId"
                 @update:chainId="changeToChainId"
                 :chains="toChains || []" />
    <ConnectWallet :visible.sync="connectWalletVisible"
                   :fromChainId="fromChainId"
                   :toChainId="toChainId" />
    <Confirm :key="confirmUuid"
             :visible.sync="confirmVisible"
             :confirmingData.sync="confirmingData"
             @closed="handleClosed"
             @packed="handlePacked" />
    <Detail v-if="detailVisible"
            :visible.sync="detailVisible"
            :nftData.sync="nftData"
            @openSelectToChain="openSelectToChain"
            @openConnectWallet="openConnectWallet"
            @openConfirm="openConfirm" />
    <TransactionDetails :visible.sync="transactionDetailsVisible"
                        :confirmingData="confirmingData" />
  </ValidationObserver>
</template>

<script>
import BigNumber from 'bignumber.js';
import copy from 'clipboard-copy';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_CHAIN_NAME, UNKNOWN_NFT } from '@/utils/values';
import { ChainId } from '@/utils/enums';
import TransactionDetails from '@/views/nfttransactions/Details';
import { getWalletApi } from '@/utils/walletApi';
import SelectTokenBasic from './SelectTokenBasic';
import SelectChain from './SelectChain';
import ConnectWallet from './ConnectWallet';
import Confirm from './Confirm';
import Detail from './Detail';

export default {
  name: 'Form',
  components: {
    SelectTokenBasic,
    SelectChain,
    ConnectWallet,
    Confirm,
    Detail,
    TransactionDetails,
  },
  data () {
    return {
      selectTokenBasicVisible: false,
      selectFromChainVisible: false,
      selectToChainVisible: false,
      connectWalletVisible: false,
      confirmVisible: false,
      transactionDetailsVisible: false,
      detailVisible: false,
      tokenBasicName: DEFAULT_CHAIN_NAME,
      chainBasicName: DEFAULT_CHAIN_NAME,
      fromChainId: 2,
      toChainId: null,
      amount: '',
      approving: false,
      confirmingData: null,
      nftData: null,
      confirmUuid: uuidv4(),
      itemHash: null,
      unknowNFT: require('../../assets/svg/back.svg'),
      currentPage: 1,
      assetsName: '',
      searchTokenID: '',
      itemLoading: false,
    };
  },
  computed: {
    tokenBasic () {
      return this.$store.getters.getTokenBasic(this.tokenBasicName);
    },
    assets () {
      console.log(this.$store.getters.getAssetsBasics)
      const assetsList = this.$store.getters.getAssetsBasics.Assets
      let list = []
      if (this.assetsName !== '') {
        for (let i = 0; i < assetsList.length; i += 1) {
          if (assetsList[i].Name.toUpperCase().indexOf(this.assetsName.toUpperCase()) > -1) {
            list.push(assetsList[i])
          }
        }
      } else {
        list = assetsList
      }
      return list
    },
    chainBasic () {
      return this.nftChains[0]
    },
    itemsTotal () {
      const itemsShowTotal = this.$store.getters.getItemsShow.Assets ? this.$store.getters.getItemsShow.Assets[0].Items.length : 0
      const itemsTotal = this.$store.getters.getItems.TotalCount ? this.$store.getters.getItems.TotalCount : 0
      return this.fromWallet ? itemsTotal : itemsShowTotal
    },
    items () {
      const itemsShow = this.$store.getters.getItemsShow.Assets ? this.$store.getters.getItemsShow.Assets[0].Items : []
      const items = this.$store.getters.getItems ? this.$store.getters.getItems.Items : []
      return this.fromWallet ? items : itemsShow
    },
    itemsShow () {
      return this.$store.getters.getItemsShow.Assets
    },
    itemsTrue () {
      return this.$store.getters.getItems
    },
    chains () {
      return this.$store.getters.chains.filter(chain => chain.id !== ChainId.Poly);
    },
    nftChains () {
      return this.$store.getters.chains.filter(chain => chain.id !== ChainId.Poly && chain.id !== ChainId.Ont && chain.id !== ChainId.Neo);
    },
    fromChains () {
      return (
        this.tokenBasic &&
        this.$store.getters
          .getTokensByTokenBasicName(this.tokenBasic.name)
          .map(token => this.$store.getters.getChain(token.chainId))
          .filter(chain => chain)
      );
    },
    fromChain () {
      return this.fromChainId ? this.$store.getters.getChain(this.fromChainId) : this.chainBasic;
    },
    fromToken () {
      return (
        this.tokenBasic &&
        this.$store.getters.getTokenByTokenBasicNameAndChainId({
          tokenBasicName: this.tokenBasicName,
          chainId: this.fromChainId,
        })
      );
    },
    fromWallet () {
      return this.$store.getters.getChainConnectedWallet(this.fromChainId);
    },
    getTokenMapsParams () {
      if (this.fromToken) {
        return {
          fromChainId: this.fromChainId,
          fromTokenHash: this.fromToken.hash,
        };
      }
      return null;
    },
    tokenMaps () {
      return this.getTokenMapsParams && this.$store.getters.getTokenMaps(this.getTokenMapsParams);
    },
    assetMap () {
      return this.$store.getters.getAssetMap.DstAssets
    },
    toChains () {
      console.log(this.assetMap)
      return (
        this.assetMap &&
        this.assetMap
          .map(asset => this.$store.getters.getChain(asset.ChainId))
          .filter(chain => chain)
      );
    },
    toChain () {
      return this.$store.getters.getChain(this.toChainId);
    },
    toToken () {
      return (
        this.tokenBasic &&
        this.$store.getters.getTokenByTokenBasicNameAndChainId({
          tokenBasicName: this.tokenBasicName,
          chainId: this.toChainId,
        })
      );
    },
    toWallet () {
      return this.$store.getters.getChainConnectedWallet(this.toChainId);
    },
    getBalanceParams () {
      if (this.fromWallet && this.fromToken) {
        return {
          chainId: this.fromChainId,
          address: this.fromWallet.address,
          tokenHash: this.fromToken.hash,
        };
      }
      return null;
    },
    balance () {
      return this.getBalanceParams && this.$store.getters.getBalance(this.getBalanceParams);
    },
    getAllowanceParams () {
      if (this.fromWallet && this.fromChain && this.fromToken) {
        return {
          chainId: this.fromChainId,
          address: this.fromWallet.address,
          tokenHash: this.fromToken.hash,
          spender: this.fromChain.lockContractHash,
        };
      }
      return null;
    },
    allowance () {
      return this.getAllowanceParams && this.$store.getters.getAllowance(this.getAllowanceParams);
    },
    needApproval () {
      return !!this.amount && !!this.allowance && new BigNumber(this.amount).gt(this.allowance);
    },
    fee () {
      return this.$store.getters.getNftFee;
    },
  },
  watch: {
    async getBalanceParams (value) {
      if (value) {
        await this.$store.dispatch('ensureChainWalletReady', value.chainId);
        this.$store.dispatch('getBalance', value);
      }
    },
    getFeeParams (value) {
      if (value) {
        this.$store.dispatch('getFee', value);
      }
    },
    getTokenMapsParams (value) {
      if (value) {
        this.$store.dispatch('getTokenMaps', value);
      }
    },
    async getAllowanceParams (value) {
      if (value) {
        await this.$store.dispatch('ensureChainWalletReady', value.chainId);
        this.$store.dispatch('getAllowance', value);
      }
    },
    assets () {
      if (this.assets[0]) {
        this.itemHash = this.assets[0].Hash
        this.getItems(this.itemHash, '', this.currentPage)
        this.getAssetMap()
      }
    },
    fromWallet () {
      this.getItems(this.itemHash, '', 1)
      this.getAssetMap()
    },
    items () {
      console.log(this.items)
    },
    itemsShow () {
      this.itemLoading = false
    },
    itemsTrue () {
      this.itemLoading = false
    },
    toWallet () {
      this.nftData.toWallet = this.toWallet
    }
  },
  created () {
    this.init()
  },
  beforeDestroy () {
  },
  methods: {
    handleCurrentChange (val) {
      this.currentPage = val
      this.getItems(this.itemHash, '', this.currentPage)
    },
    itemSelect (item) {
      this.itemHash = item.Hash
      this.getItems(this.itemHash, '', this.currentPage)
    },
    async tokenSelect (item) {
      if (!this.fromWallet) {
        this.connectWalletVisible = true
      }
      const a = await this.$store.dispatch('ensureChainWalletReady', this.fromChainId);
      this.getAssetMap()
      const walletApi = await getWalletApi(this.fromWallet.name);
      const Approval = await walletApi.getNFTApproved({
        fromChainId: this.fromChainId,
        tokenHash: this.itemHash,
        id: item.TokenId,
      });
      this.nftData = {
        fromChainId: this.fromChainId,
        toChains: this.toChains,
        toChainId: this.toChainId,
        nft: item,
        assetHash: this.itemHash,
        fromWallet: this.fromWallet,
        toWallet: this.toWallet,
        needApproval: Approval
      }
      this.detailVisible = true
    },
    async init () {
      this.getItemsShow()
      this.getAssets()
    },
    getItemsShow () {
      this.itemLoading = true
      const params = {
        id: this.fromChain.id,
        size: 12
      }
      this.$store.dispatch('getItemsShow', params);
    },
    getAssets () {
      this.$store.dispatch('getAssetsBasics', this.fromChain);
    },
    getAssetMap () {
      const params = {
        ChainId: this.fromChain.id,
        Hash: this.itemHash
      }
      this.$store.dispatch('getAssetMap', params);
    },
    getItems ($Asset, $TokenId, page) {
      debugger
      if (this.fromWallet) {
        this.itemLoading = true
      }
      const params = {
        ChainId: this.fromChain.id,
        Asset: $Asset,
        Address: this.fromWallet.addressHex,
        TokenId: $TokenId,
        PageNo: page - 1,
        PageSize: 10,
      }
      this.$store.dispatch('getItems', params);
    },
    openSelectToChain () {
      this.selectToChainVisible = true
    },
    openConnectWallet () {
      this.connectWalletVisible = true
    },
    openConfirm () {
      console.log(this.confirmingData)
      this.confirmingData = {
        fromAddress: this.fromWallet.address,
        toAddress: this.toWallet.address,
        fromChainId: this.fromChainId,
        toChainId: this.toChainId,
        fromTokenHash: this.itemHash,
        nft: this.nftData.nft,
        amount: 0,
        fee: this.fee,
      };
      this.confirmVisible = true
    },
    changeTokenBasicName (tokenBasicName) {
      this.tokenBasicName = tokenBasicName;
      this.fromChainId = null;
      this.toChainId = null;
      this.clearAmount();
    },
    changeFromChainId (chainId) {
      this.fromChainId = chainId;
      this.toChainId = null;
      this.init()
    },
    changeToChainId (chainId) {
      this.toChainId = chainId;
      this.nftData.toChainId = chainId;
      const params = {
        SrcChainId: this.fromChainId,
        Hash: this.fromChain.nftFeeContractHash,
        DstChainId: this.toChainId,
      }
      this.$store.dispatch('getNftFee', params);
    },
    async exchangeFromTo () {
      await this.$store.dispatch('getTokenMaps', {
        fromChainId: this.toChainId,
        fromTokenHash: this.toToken.hash,
      });
      const { fromChainId } = this;
      this.fromChainId = this.toChainId;
      if (this.toChains && this.toChains.find(chain => chain.id === fromChainId)) {
        this.toChainId = fromChainId;
      } else {
        this.toChainId = null;
      }
      this.clearAmount();
    },
    copy (text) {
      copy(text);
      this.$message.success(this.$t('messages.copied', { text }));
    },
    transferAll () {
      this.amount = this.balance;
      this.$nextTick(() => this.$refs.amountValidation.validate());
    },
    async approve () {
      await this.$store.dispatch('ensureChainWalletReady', this.fromChainId);
      try {
        this.approving = true;
        const walletApi = await getWalletApi(this.fromWallet.name);

        if (!new BigNumber(this.allowance).isZero()) {
          await walletApi.approve({
            chainId: this.fromChainId,
            address: this.fromWallet.address,
            tokenHash: this.fromToken.hash,
            spender: this.fromChain.lockContractHash,
            amount: 0,
          });
        }

        await walletApi.approve({
          chainId: this.fromChainId,
          address: this.fromWallet.address,
          tokenHash: this.fromToken.hash,
          spender: this.fromChain.lockContractHash,
          amount: this.amount,
        });

        await this.$store.dispatch('getAllowance', this.getAllowanceParams);
      } finally {
        this.approving = false;
      }
    },
    next () {
      this.confirmingData = {
        fromAddress: this.fromWallet.address,
        toAddress: this.toWallet.address,
        fromChainId: this.fromChainId,
        toChainId: this.toChainId,
        fromTokenHash: this.fromToken.hash,
        toTokenHash: this.toToken.hash,
        amount: this.amount,
        fee: this.fee,
      };
      this.confirmVisible = true;
    },
    handleClosed () {
      this.$nextTick(() => {
        this.confirmUuid = uuidv4();
      });
    },
    handlePacked () {
      this.transactionDetailsVisible = true;
      this.clearAmount();
    },
    clearAmount () {
      this.amount = '';
      this.$nextTick(() => this.$refs.amountValidation.reset());
    },
  },
};
</script>
<style>
.el-pagination button:disabled {
  background-color: rgba(255, 255, 255, 0);
}
.el-pagination .btn-prev,
.el-pagination .btn-next {
  background-color: rgba(255, 255, 255, 0);
}
.el-pagination .btn-prev:hover,
.el-pagination .btn-next:hover {
  background-color: rgba(255, 255, 255, 0);
  color: rgba(255, 255, 255, 1);
}
.el-pagination button {
  background-color: rgba(255, 255, 255, 0);
}
.el-pager li {
  background-color: rgba(255, 255, 255, 0);
  color: rgba(255, 255, 255, 0.3);
}
.el-pager li:hover {
  background-color: rgba(255, 255, 255, 0);
  color: rgba(255, 255, 255, 1);
}

.el-pager li.active {
  color: #fff;
}
.el-loading-mask {
  background-color: rgba(255, 255, 255, 0);
}
.el-loading-spinner .path {
  stroke: #3ec7eb;
}
</style>
<style lang="scss" scoped>
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  @include child-margin-v(30px);
}

.card {
  box-sizing: border-box;
  width: 1280px;
  min-height: 1055px;
  padding: 20px;
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

.field-left {
  flex: inherit;
  width: 300px;
  background-color: rgba(0, 0, 0, 0.25);
  padding: 30px 20px;
  box-sizing: border-box;
  @include child-margin-v(10px);
}

.field-right {
  flex: inherit;
  width: 920px;
  margin-left: 20px !important;
  @include child-margin-v(10px);
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
  flex: 1;
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
  height: 48px;
  padding: 0 14px;
  background: rgba(#000000, 0.26);
  border-radius: 4px;
  @include child-margin-h(8px);
}

.select-token-basic-icon {
  width: 20px;
  border-radius: 10px;
}

.select-token-basic-name {
  font-size: 14px;
}

.select-chain {
  width: 100%;
}

.select-chain-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
  white-space: pre-line;
  text-align: left;
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

.input {
  display: flex;
  padding: 9px 14px;
  background: rgba(#000000, 0.26);
  border-radius: 4px;
}

.input-error {
  color: $--color-danger;
  font-size: 12px;
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

.tooltip-icon {
  vertical-align: baseline;
}

.fee-value {
  font-size: 12px;
}

.fee-icon {
  width: 14px;
  border-radius: 7px;
}

.fee-token {
  font-size: 10px;
}

.link {
  color: #2fd8ca;
  text-decoration: underline;
}
.scroll {
  margin-top: 20px !important;
  flex: 1;
  overflow-y: auto;
  @include scroll-bar(rgba(#fff, 0.2), transparent);
}

.asset {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 20px;
  transition: all 0.3s;
  @include child-margin-h(16px);

  &:hover {
    opacity: 0.8;
    color: #3ec7eb;
    background: rgba(#000000, 0.3);
  }
}
.asset-active {
  opacity: 0.8;
  color: #3ec7eb;
  background: rgba(#000000, 0);
}

.asset-left {
  display: flex;
  align-items: center;
  @include child-margin-h(8px);
}
.search-button {
  cursor: pointer;
  text-align: center;
  width: 160px;
  height: 60px;
  background: linear-gradient(225deg, #3ec7eb 0%, #282bdb 100%);
  border-radius: 4px;
  font-size: 18px;
  font-family: Avenir-Medium, Avenir;
  font-weight: 500;
  color: #ffffff;
  line-height: 60px;
  transition: all ease 0.3s;
}
.search-button:hover {
  opacity: 0.8;
  transition: all ease 0.3s;
}
.search-input {
  flex: 1;
}
.field-right > .fields-row > .input {
  flex: 1;
}
.item-content {
  width: 920px;
  min-height: 985px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  padding: 30px 20px;
  box-sizing: border-box;
  margin-top: 20px !important;
  .items-content {
    margin-top: 20px;
    height: 855px;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    .nft-item:nth-child(4n) {
      margin-right: 0px;
    }
    .nft-item:hover {
      border: 1px solid;
      border-image: linear-gradient(225deg, rgba(62, 199, 235, 1), rgba(40, 43, 219, 1)) 1 1;
    }
    .nft-item {
      cursor: pointer;
      margin-right: 20px;
      margin-bottom: 20px;
      width: 205px;
      height: 265px;
      border: 1px solid rgba(255, 255, 255, 0.09);
      padding: 10px;
      display: flex;
      flex-flow: column;
      box-sizing: border-box;
      .image {
        width: 185px;
        height: 185px;
        background-image: url('../../assets/svg/back.svg');
        background: rgba(0, 0, 0, 0.3);
        background-repeat: no-repeat;
        background-position: center;
        .img-wrapper {
          width: 100%;
          height: 100%;
          background-color: #000000;
          text-align: center;
          img {
            height: 100%;
          }
        }
        .img-wrapper-unknow {
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.3);
          text-align: center;
          img {
            height: 100%;
          }
        }
      }
      .nft-name {
        padding-top: 20px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.6);
        line-height: 20px;
      }
      .nft-tokenid {
        padding-top: 5px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.6);
        line-height: 20px;
      }
    }
  }
}
.input {
  position: relative;
  padding-left: 60px;
  box-sizing: border-box;
  img {
    width: 18px;
    position: absolute;
    left: 20px;
    top: 9px;
  }
}
.id-input {
  position: relative;
  padding-left: 60px;
  padding-top: 19px;
  padding-bottom: 19px;
  box-sizing: border-box;
  border: 2px solid rgba(255, 255, 255, 0);
  transition: all ease 0.3s;
  img {
    width: 18px;
    position: absolute;
    left: 20px;
    top: 20px;
  }
}
.id-input:focus-within {
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: all ease 0.3s;
}
.asset-input {
  box-sizing: border-box;
  border: 2px solid rgba(255, 255, 255, 0);
  transition: all ease 0.3s;
}
.asset-input:focus-within {
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: all ease 0.3s;
}
.pagination {
  text-align: right;
}
.margin-top-40 {
  margin-top: 40px !important;
}
</style>
