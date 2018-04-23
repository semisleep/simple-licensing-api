<template>
  <div class="sign-in-wrapper">
    <div class="sign-in">
      <md-field :class="{'md-invalid': validation.hasError('form.email')}">
        <label for="sign-in-email">Email</label>
        <md-input type="email" id="sign-in-email" v-model="form.email"/>
        <span class="md-error">{{validation.firstError('form.email')}}</span>
      </md-field>
      <md-field :class="{'md-invalid': validation.hasError('form.password')}">
        <label for="sign-in-password">Password</label>
        <md-input type="password" id="sign-in-password" v-model="form.password"/>
        <span class="md-error">{{validation.firstError('form.password')}}</span>
      </md-field>
      <md-dialog-actions>
        <md-button class="md-primary md-raised" :disabled="working" @click="submit()">Sign In</md-button>
      </md-dialog-actions>
    </div>
    <md-progress-bar v-if="working" md-mode="indeterminate"/>
    <md-snackbar md-position="center" :md-duration="3000" :md-active.sync="showSnackbar" md-persistent>
      <span>{{errorMessage}}</span>
      <md-button class="md-primary" @click="showSnackbar = false">Close</md-button>
    </md-snackbar>
  </div>
</template>

<style lang="scss" scoped>

  .sign-in-wrapper {
    position: relative;

    .sign-in {
      max-width: 480px;
      margin: auto;
      padding: 40px;
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
    props: ['working'],
    data() {
      return {
        submitted: false,
        form: {
          email: '',
          password: '',
          repeat: ''
        },
        errorMessage: '',
        showSnackbar: false
      }
    },
    validators: {
      'form.email'(value) {
        return Validator.value(value).required().email();
      },
      'form.password'(value) {
        return Validator.value(value).required().minLength(6);
      }
    },
    methods: {
      async submit() {
        this.submitted = true;
        let success = await this.$validate();
        if (!success) {
          return;
        }
        this.$emit('update:working', true);
        try {
          await this.$http.post('/api/auth/login', this.form);
          window.location.href = '/app';
        } catch (e) {
          this.errorMessage = (e.body || {}).message || 'Failed to talk to server :(';
          this.showSnackbar = true;
        } finally {
          this.$emit('update:working', false);
        }
      }
    }
  };
</script>