<template>
  <div>
    <md-dialog :md-active.sync="showing" :md-close-on-esc="false" :md-click-outside-to-close="!working">
      <md-dialog-title>Generate licenses in a batch</md-dialog-title>
      <div class="generate-licenses-wrapper">
        <div class="generate-licenses">
          <md-field :class="{'md-invalid': validation.hasError('form.licenseNum')}">
            <label for="generate-license-number">Number of Licenses</label>
            <md-input type="number" id="generate-license-number" v-model="form.licenseNum"/>
            <span class="md-error">{{validation.firstError('form.licenseNum')}}</span>
            <div class="md-helper-text">The number of license you want to generate.</div>
          </md-field>
          <md-field :class="{'md-invalid': validation.hasError('form.maxUsage')}">
            <label for="generate-license-max-usage">Max Usage Number</label>
            <md-input type="number" id="generate-license-max-usage" v-model="form.maxUsage"/>
            <span class="md-error">{{validation.firstError('form.maxUsage')}}</span>
            <div class="md-helper-text">How many times a license can be used for activation.</div>
          </md-field>
          <md-dialog-actions>
            <md-button class="md-primary md-raised" :disabled="working" @click="submit()">Generate Licenses</md-button>
          </md-dialog-actions>
        </div>
        <md-progress-bar v-if="working" md-mode="indeterminate"/>
      </div>
    </md-dialog>
    <md-snackbar md-position="center" :md-duration="6000" :md-active.sync="showSnackbar" md-persistent>
      <span class="error-message">{{errorMessage}}</span>
      <md-button class="md-primary" @click="showSnackbar = false">Close</md-button>
    </md-snackbar>
  </div>
</template>

<style lang="scss" scoped>

  .generate-licenses-wrapper {
    position: relative;

    .generate-licenses {
      width: 480px;
      margin: auto;
      padding: 40px;

      .md-dialog-actions {
        padding-top: 20px;
      }
    }

    .md-progress-bar {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }

  // for the long quota error message
  .md-snackbar {
    max-height: 320px;

    .error-message {
      flex: 1;
      overflow: hidden;
    }
  }

</style>

<script type="text/babel">
  'use strict';

  import {Validator} from 'simple-vue-validator';

  export default {
    props: ['active'],
    data() {
      return {
        showing: false,
        working: false,
        form: {
          licenseNum: 50,
          maxUsage: 1
        },
        errorMessage: '',
        showSnackbar: false
      }
    },
    watch: {
      active(to) {
        this.$breakUpdateLoop(() => {
          this.showing = to;
        });
      },
      showing(to) {
        this.$breakUpdateLoop(() => {
          this.$emit('update:active', to);
        });
      }
    },
    validators: {
      'form.licenseNum'(value) {
        return Validator.value(value).required().greaterThan(0);
      },
      'form.maxUsage'(value) {
        return Validator.value(value).required().greaterThan(0);
      }
    },
    methods: {
      async submit() {
        let success = await this.$validate();
        if (!success) {
          return;
        }
        this.working = true;
        try {
          await this.$http.post('/api/license/generate', this.form);
          this.showing = false;
          this.$emit('done');
        } catch (e) {
          console.error(e);
          this.errorMessage = (e.body || {}).message || 'Failed to talk to server :(';
          this.showSnackbar = true;
        } finally {
          this.working = false;
        }
      }
    }
  };
</script>