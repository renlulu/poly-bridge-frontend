<template>
  <Page class="home">
    <img class="decoration" src="@/assets/svg/poly-bg.svg" />
    <div class="content">
      <div class="slogan" v-html="slogon" />
      <Form />
    </div>
  </Page>
</template>

<script>
import Page from '@/views/common/Page';
import Form from './Form';

export default {
  name: 'Home',
  components: {
    Page,
    Form,
  },
  data() {
    return {
      slogon:
        'In order to\nbuild the next generation\nInternet infrastructure,\nrealize interoperability\nbetween\nmultiple <em>chains</em>',
    };
  },
};
</script>

<style lang="scss" scoped>
.home {
  min-width: 1440px;
  background-image: var(--background-image);
}

.decoration {
  position: absolute;
  top: 0;
  z-index: -1;
}

.content {
  position: relative;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  @include child-margin-h(128px);
}

.slogan {
  position: relative;
  top: -40px;
  white-space: pre-line;
  font-weight: 500;
  font-size: 50px;
  line-height: 68px;

  ::v-deep > em {
    font-style: normal;
    color: #3ec7eb;
  }
}
</style>
