<template>
  <div class="footer">
    <div class="copyright">
      {{ $t('common.footer.copyright') }}
    </div>
    <CButton class="change-lang" @click="changeLocale">
      <span v-if="$i18n.locale === 'en'">English</span>
      <span v-if="$i18n.locale === 'zh-cn'">中文</span>
      <img src="@/assets/svg/switch.svg" />
    </CButton>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  methods: {
    changeLocale() {
      this.$i18n.locale = this.$i18n.locale === 'en' ? 'zh-cn' : 'en';
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  @include child-margin-h(30px);
}

.copyright {
  opacity: 0.4;
  font-size: 14px;
}

.change-lang {
  height: 30px;
  padding: 0 15px;
  border-radius: 15px;
  background: rgba(#ffffff, 0.2);
  font-size: 12px;
  @include child-margin-h(5px);
}
</style>
