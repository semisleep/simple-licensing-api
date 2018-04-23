'use strict';

import Promise from 'bluebird';
import dataFormatter from '../../../helpers/data-formatter';

import Vue from 'vue';
import VueResource from 'vue-resource';
import SimpleVueValidation from 'simple-vue-validator';
import VueMaterial from 'vue-material';
import constants from './constants';
import utils from './utils';

Vue.use(VueResource);
Vue.use(SimpleVueValidation, {Promise: Promise});
Vue.use(VueMaterial);

const hub = new Vue({});

Vue.mixin({
  filters: dataFormatter,
  created() {
    this.$constants = constants;
    this.$hub = hub;
    this.$formatter = dataFormatter;
    this.$utils = utils;
    this.$debounce = (methodName, interval) => {
      interval = interval || 200;
      let internalMethodName = `$__debounced_${methodName}`;
      if (!this[internalMethodName]) {
        this[internalMethodName] = _.debounce(() => this[methodName](), interval);
      }
      this[internalMethodName]();
    };
    this.$breakUpdateLoop = async function (code) {
      if (this._dataUpdating) {
        return;
      }
      this._dataUpdating = true;
      try {
        await code();
      } finally {
        await Vue.nextTick();
        this._dataUpdating = false;
      }
    }
  }
});

Vue.http.interceptors.push((request, next) => {
  // for fucking IE, fuck you microsoft!!!
  request.url += (request.url.indexOf('?') > 0 ? '&' : '?') + `v=${new Date().getTime()}`;
  next();
});