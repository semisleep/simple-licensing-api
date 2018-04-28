'use strict';

import './scripts/bootstrap.js';
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './vue-components/app/App.vue';
import NotFound from './vue-components/app/NotFound.vue';
import LicenseList from './vue-components/app/LicenseList.vue';
import Doc from './vue-components/app/Doc.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: '/app/',
  routes: [
    {
      path: '/doc',
      component: Doc,
      meta: {
        title: 'Documentation'
      }
    },
    {
      path: '/licenses',
      component: LicenseList,
      meta: {
        title: 'Manage Licenses'
      }
    },
    {path: '*', component: NotFound}
  ]
});

new Vue({
  el: '#app',
  router,
  render(h) {
    return h(App);
  },
  created() {
    if (this.$route.path === '/') {
      this.$router.push('/doc');
    }
  }
});
