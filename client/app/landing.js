'use strict';

import './scripts/bootstrap.js';
import Vue from 'vue';
import App from './vue-components/landing/App.vue';

new Vue({
  el: '#app',
  render(h) {
    return h(App);
  }
});
