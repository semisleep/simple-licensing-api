'use strict';

import './scripts/bootstrap.js';

import Vue from 'vue';
import App from './vue-components/message/App.vue';

new Vue({
  el: '#app',
  render (h) {
    return h(App);
  }
});
