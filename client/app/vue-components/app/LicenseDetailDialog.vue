<template>
  <div>
    <md-dialog :md-active.sync="showing" :md-close-on-esc="false" :md-click-outside-to-close="!working">
      <md-dialog-title>Licenses detail</md-dialog-title>
      <div class="license-detail-wrapper">
        <div class="license-detail">
          <div class="md-layout md-gutter viewer-row">
            <div class="md-layout-item viewer-item">
              <div class="name">Key</div>
              <div class="value">{{safeItem.key}}</div>
            </div>
          </div>
          <div class="md-layout md-gutter viewer-row">
            <div class="md-layout-item viewer-item">
              <div class="name">Max Usage</div>
              <div class="value">{{safeItem.maxUsage}}</div>
            </div>
            <div class="md-layout-item viewer-item">
              <div class="name">Current Usage</div>
              <div class="value">{{safeItem.currentUsage}}</div>
            </div>
          </div>
          <div class="md-layout md-gutter viewer-row">
            <div class="md-layout-item viewer-item">
              <div class="name">Created At</div>
              <div class="value">{{safeItem.createdAt | formatFullDate}}</div>
            </div>
            <div class="md-layout-item viewer-item">
              <div class="name">Last Validated At</div>
              <div class="value">{{safeItem.lastValidatedAt | formatFullDate}}</div>
            </div>
          </div>
          <md-content v-show="safeItem.devices.length" class="md-scrollbar">
            <table class="table">
              <thead>
              <tr>
                <th>Identifier</th>
                <th>Extra</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="device of safeItem.devices">
                <td>{{device.identifier}}</td>
                <td>{{device.extra}}</td>
              </tr>
              </tbody>
            </table>
          </md-content>
          <div class="form">
            <md-field :class="{'md-invalid': validation.hasError('form.maxUsage')}">
              <label for="generate-license-max-usage">Max Usage Number</label>
              <md-input type="number" id="generate-license-max-usage" v-model="form.maxUsage"/>
              <span class="md-error">{{validation.firstError('form.maxUsage')}}</span>
              <div class="md-helper-text">How many times a license can be used for activation.</div>
            </md-field>
            <md-dialog-actions>
              <md-button class="md-primary md-raised" :disabled="working" @click="submit()">Update License</md-button>
              <md-button class="md-raised" :disabled="working" @click="close()">Close</md-button>
            </md-dialog-actions>
          </div>
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

  .license-detail-wrapper {
    position: relative;

    .license-detail {
      width: 720px;
      margin: auto;
      padding: 40px;

      .viewer-row {
        padding: 10px 0;
        border-top: dashed #e0e0e0 1px;
        border-bottom: dashed #e0e0e0 1px;
        margin: 0;

        + .viewer-row {
          border-top: none;
        }

        .viewer-item {
          display: flex;
          align-items: center;
          padding: 0;

          .name {
            width: 140px;
            margin-right: 10px;
            color: rgba(0, 0, 0, .54);
          }

          .value {

          }
        }
      }

      .md-content {
        margin-top: 20px;
        max-height: 150px;
        overflow: auto;
        padding-bottom: 20px;
        border-bottom: dashed #e0e0e0 1px;
      }

      .table {
        border-collapse: collapse;
        width: 100%;

        th,
        td {
          text-align: left;
          padding: 10px 20px;
          border: solid #e0e0e0 1px;
        }

        th {
          background-color: #eeeeee;
        }
      }

      .form {
        margin-top: 20px;
      }

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

</style>

<script type="text/babel">
  'use strict';

  import {Validator} from 'simple-vue-validator';

  export default {
    props: ['active', 'item'],
    data() {
      return {
        showing: false,
        working: false,
        form: {maxUsage: 0},
        errorMessage: '',
        showSnackbar: false
      }
    },
    computed: {
      safeItem() {
        return this.item || {devices: []};
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
      },
      item(to) {
        if (to) {
          this.form.maxUsage = to.maxUsage;
        }
      }
    },
    validators: {
      'form.maxUsage'(value) {
        return Validator.value(value).required().greaterThanOrEqualTo(0);
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
          await this.$http.put(`/api/license/${this.item._id}`, this.form);
          this.showing = false;
          this.$emit('done');
        } catch (e) {
          console.error(e);
          this.errorMessage = (e.body || {}).message || 'Failed to talk to server :(';
          this.showSnackbar = true;
        } finally {
          this.working = false;
        }
      },
      close() {
        this.showing = false;
      }
    }
  };
</script>