<template>
  <router-link v-if="$attrs.to" v-bind="$attrs" :target="target" :class="b()" v-on="listeners">
    <slot />
  </router-link>
  <a
    v-else
    v-bind="$attrs"
    :class="b()"
    :target="target"
    rel="noopener noreferrer"
    v-on="listeners"
  >
    <slot />
  </a>
</template>

<script>
export default {
  name: 'CLink',
  inheritAttrs: false,
  props: {
    target: {
      type: String,
      default: '_blank',
    },
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        click: event => {
          if (this.$attrs.disabled) {
            event.preventDefault();
          } else {
            this.$emit('click', event);
          }
        },
      };
    },
  },
};
</script>

<style lang="scss">
@include block(c-link) {
  color: inherit;
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    filter: brightness(0.8);
  }

  &[disabled] {
    filter: brightness(0.6);
    cursor: not-allowed;
  }
}
</style>
