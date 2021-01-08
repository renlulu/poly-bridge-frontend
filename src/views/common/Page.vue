<template>
  <div class="page">
    <Header />
    <div class="main">
      <slot />
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from './Header';
import Footer from './Footer';

export default {
  name: 'Page',
  components: {
    Header,
    Footer,
  },
};
</script>
