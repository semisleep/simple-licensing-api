<template>
  <div class="page">
    <div class="header">
      <div class="container">
        <div class="title">
          Simple Licensing API
        </div>
        <div class="buttons-wrapper">
          <a class="github-button" href="https://github.com/semisleep/simple-vue-validator" data-icon="octicon-star" data-style="mega" aria-label="Star semisleep/simple-vue-validator on GitHub">Star</a>
          <a class="github-button" href="https://github.com/semisleep/simple-vue-validator/issues" data-icon="octicon-issue-opened" data-style="mega" aria-label="Issue semisleep/simple-vue-validator on GitHub">Issue</a>
        </div>
      </div>
    </div>
    <div class="block">
      <div class="icon">🔒</div>
      <div class="desc">
        <div class="text">
          <b>Simple Licensing API</b> is a simple and ready to use API to manage your software license.
          <br/><br/>
          It generates license keys in bulk, and provides a simple RESTful + JSON API to activate and validate a license key from any device on which your app runs.
          <br/><br/>
          All you need is to create a free account on our server, then you are ready to go.
        </div>
        <div class="button-wrapper">
          <md-button class="md-primary md-raised" :md-ripple="false" @click="getStarted()">Get Started</md-button>
        </div>
      </div>
    </div>
    <div class="block">
      <div class="desc">
        <div class="text">
          This is an <b>open source</b> project, thus you can clone the source code and deploy it on your own server!
          <br/><br/>
          If what you want is a more sophisticated licensing solution, this project can still be a good starting point for you. Feel free to folk and make change to it :)
        </div>
        <div class="button-wrapper">
          <md-button class="md-raised" :md-ripple="false">Check it out at Github</md-button>
        </div>
      </div>
      <div class="icon">📦</div>
    </div>

    <md-dialog :md-active.sync="showAuthDialog" :md-close-on-esc="false" :md-click-outside-to-close="!blockAuthDialog">
      <md-tabs md-dynamic-height>
        <md-tab md-label="Sign In">
          <sign-in-form :working.sync="blockAuthDialog" />
        </md-tab>

        <md-tab md-label="Sign Up">
          <sign-up-form :working.sync="blockAuthDialog" />
        </md-tab>

        <md-tab md-label="Forgot Password">
          <forgot-password-form />
        </md-tab>
      </md-tabs>
    </md-dialog>
  </div>
</template>

<style lang="scss" scoped>

  .page {
    padding-top: 60px;
    min-width: 960px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .container {
    width: 920px;
    margin: auto;
  }

  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    box-shadow: 0px 1px 10px 1px rgba(0,0,0,0.2);

    .container {
      display: flex;
      align-items: center;
      height: 56px;

      .title {
        flex: 1;
        font-weight: 600;
        font-size: 20px;
      }
    }
  }

  .block {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 40px 0;

    .icon {
      font-size: 120px;
      line-height: 120px;
    }

    .desc {
      width: 420px;

      .text {
        font-weight: 300;
      }

      .button-wrapper {
        margin-top: 20px;
        text-align: center;

        .md-button {
          padding: 10px 20px;
        }
      }
    }

    > *:first-child {
      margin-right: 120px;
    }

    +.block {
      border-top: dashed #e0e0e0 1px;
    }
  }

  .md-dialog {

    .md-tab {
      padding: 0;
    }
  }

</style>

<script type="text/babel">
  'use strict';

  import SignInForm from './SignInForm.vue';
  import SignUpForm from './SignUpForm.vue';
  import ForgotPasswordForm from './ForgotPasswordForm.vue';

  export default {
    components: {
      SignInForm, SignUpForm, ForgotPasswordForm
    },
    data() {
      return {
        showAuthDialog: false,
        blockAuthDialog: false
      };
    },
    methods: {
      getStarted() {
        this.showAuthDialog = true;
      }
    }
  };
</script>