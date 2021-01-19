<template>
  <Page class="transactions">
    <img class="top-decoration" src="@/assets/svg/poly-bg.svg" />
    <div class="bottom-decoration-wrapper">
      <img class="bottom-decoration" src="@/assets/svg/poly-bg.svg" />
    </div>
    <div class="content">
      <div class="content-inner">
        <div class="title">The historical records</div>

        <div class="table-wrapper">
          <ElTable :data="transactions.items">
            <ElTableColumn width="20" />
            <ElTableColumn #default="{}" label="Source Chain" min-width="150">
              <div class="chain">
                <img src="@/assets/svg/eth.svg" />
                <span>Ethereum</span>
              </div>
              <CLink class="hash">hash:0xc12E…79F192</CLink>
            </ElTableColumn>
            <ElTableColumn #default="{}" label="Destination Chain" min-width="150">
              <div class="chain">
                <img src="@/assets/svg/neo.svg" />
                <span>Neo</span>
              </div>
              <CLink class="hash">hash:0xc12E…79F192</CLink>
            </ElTableColumn>
            <ElTableColumn label="Amount" prop="amount" />
            <ElTableColumn label="Asset" prop="tokenBasicName" />
            <ElTableColumn label="Time" prop="updateTime" />
            <ElTableColumn #default="{row}" label="Status" align="right">
              <CButton class="view-details" @click="transactionDetailsVisible = true">
                {{ row.status }}
              </CButton>
            </ElTableColumn>
            <ElTableColumn width="20" />
          </ElTable>
          <div class="pagination">
            <CButton>
              <img src="@/assets/svg/arrow-left.svg" />
            </CButton>
            <span>Page 1 of 10</span>
            <CButton>
              <img src="@/assets/svg/arrow-right.svg" />
            </CButton>
          </div>
        </div>
      </div>
    </div>
    <TransactionDetails :visible.sync="transactionDetailsVisible" />
  </Page>
</template>

<script>
import Page from '@/views/common/Page';
import TransactionDetails from '@/views/home/TransactionDetails';

export default {
  name: 'Transactions',
  components: {
    Page,
    TransactionDetails,
  },
  data() {
    return {
      transactionDetailsVisible: false,
      transactions: {
        items: [
          { amount: 1000, tokenBasicName: 'pNeo', updateTime: '2020.04.12', status: 'Completed' },
          { amount: 1000, tokenBasicName: 'pNeo', updateTime: '2020.04.12', status: 'Completed' },
          { amount: 1000, tokenBasicName: 'pNeo', updateTime: '2020.04.12', status: 'Completed' },
          { amount: 1000, tokenBasicName: 'pNeo', updateTime: '2020.04.12', status: 'Completed' },
          { amount: 1000, tokenBasicName: 'pNeo', updateTime: '2020.04.12', status: 'Completed' },
          { amount: 1000, tokenBasicName: 'pNeo', updateTime: '2020.04.12', status: 'Completed' },
          { amount: 1000, tokenBasicName: 'pNeo', updateTime: '2020.04.12', status: 'Completed' },
          { amount: 1000, tokenBasicName: 'pNeo', updateTime: '2020.04.12', status: 'Completed' },
          { amount: 1000, tokenBasicName: 'pNeo', updateTime: '2020.04.12', status: 'Completed' },
          { amount: 1000, tokenBasicName: 'pNeo', updateTime: '2020.04.12', status: 'Completed' },
        ],
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.transactions {
  min-width: 1440px;
  overflow: hidden;
}

.top-decoration {
  position: absolute;
  top: 0;
  z-index: -1;
}

.bottom-decoration-wrapper {
  position: absolute;
  right: 0px;
  bottom: 0px;
  overflow: hidden;
  z-index: -1;
}

.bottom-decoration {
  transform: translate3d(60px, 60px, 0) scale(1.2);
}

.content {
  display: flex;
  flex: 1;
  margin: auto;
  @include child-margin-v(24px);
}

.content-inner {
  width: 1090px;
  margin: 20px auto;
  @include child-margin-v(24px);
}

.title {
  font-size: 20px;
}

.table-wrapper {
  padding: 12px 0 24px;
  border-radius: 20px;
  background: #182233;
  @include child-margin-v(24px);
}

.chain {
  display: flex;
  align-items: center;
  @include child-margin-h(6px);
}

.hash {
  color: #2fd8ca;
  font-size: 14px;
}

.view-details {
  color: #2fd8ca;
  text-decoration: underline;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  @include child-margin-h(6px);
}
</style>
