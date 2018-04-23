<template>
  <div class="message-wrapper">
    <div class="message">{{message}}</div>
    <div v-if="error" class="detail" v-html="error"></div>
  </div>
</template>

<style lang="scss" scoped>

  .message-wrapper {
    padding: 120px 60px;
    text-align: center;

    .message {
      font-size: 24px;
      text-align: center;
    }

    .detail {
      font-size: 12px;
    }
  }

</style>

<script type="text/babel">
  'use strict';

  export default {
    computed: {
      message() {
        return (window.preload.data || {}).message || 'ERROR';
      },
      error() {
        return (window.preload.data || {}).error || '';
      }
    }
  };
</script>