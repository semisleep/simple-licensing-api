<template>
  <div class="pagination">
    <div class="summary">
      <span v-show="value.totalPages"><b>{{value.totalItems}}</b> items / <b>{{value.totalPages}}</b> pages</span>
    </div>
    <md-button class="md-raised" :disabled="value.page <= 0" :md-ripple="false" @click="page(-1)">
      <md-icon>keyboard_arrow_left</md-icon>
    </md-button>
    <div class="page-number">{{value.page + 1}}</div>
    <md-button class="md-raised" :disabled="value.page >= value.totalPages - 1" :md-ripple="false" @click="page(1)">
      <md-icon>keyboard_arrow_right</md-icon>
    </md-button>
  </div>
</template>

<style lang="scss" scoped>

  .pagination {
    height: 56px;
    display: flex;
    align-items: center;
    border-top: solid #e0e0e0 1px;

    .summary {
      flex: 1;
    }

    .page-number {
      margin: 0 10px;
      font-weight: bold;
    }

    .md-button {
      padding: 2px;
      width: auto;
      min-width: 0;
    }
  }

</style>

<script type="text/babel">
  'use strict';

  export default {
    props: ['value'],
    methods: {
      page(delta) {
        let pagination = this.$utils.fullClone(this.value);
        pagination.page += delta;
        this.$emit('input', pagination);
      }
    }
  };
</script>