<template>
  <div>
    <md-dialog :md-active.sync="showing" :md-close-on-esc="false" :md-click-outside-to-close="!working">
      <md-dialog-title>Delete licenses</md-dialog-title>
      <div class="delete-licenses-wrapper">
        <div class="delete-licenses">
          <span v-if="items.length > 1">
          Do you want to delete these <b>{{items.length}}</b> licenses?
          </span>
          <span v-else>
          Do you want to delete this license?
          </span>
          <md-dialog-actions>
            <md-button class="md-accent md-raised" :disabled="working" @click="submit()">Delete Licenses</md-button>
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

  .delete-licenses-wrapper {
    position: relative;

    .delete-licenses {
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

</style>

<script type="text/babel">
  'use strict';

  export default {
    props: ['active', 'items'],
    data() {
      return {
        showing: false,
        working: false,
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
    methods: {
      async submit() {
        this.working = true;
        try {
          for (let item of this.items) {
            await this.$http.delete(`/api/license/${item._id}`);
          }
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