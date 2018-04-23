<template>
  <div class="doc">

    <div class="welcome section">
      <md-icon class="md-size-5x">tag_faces</md-icon>
      <div class="md-headline">Welcome!</div>
    </div>

    <div class="section">
      Here's your API key:
      <div class="code">{{user.apiKey}}</div>
    </div>

    <div class="section">
      To activate or validate a license from a device, make a GET request using the url similar to the following url.
      <div class="code">http://simple-licensing-api.magictek.cn/api/check?key={{user.apiKey}}&license=xxxxx-xxxxx-xxxxx-xxxxx&device=0ee5040e9eaad5fe456c&extra=android</div>
    </div>

    <div class="section">
      Check out the following table for the description of each query params.
      <table class="table">
        <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td><b>key</b></td>
          <td>Required. Your API key.</td>
        </tr>
        <tr>
          <td><b>license</b></td>
          <td>
            Required. The license key you want to activate or validate.
            <br/>
            You can manage all your license keys in the <b>Manage Licenses</b> module.
          </td>
        </tr>
        <tr>
          <td><b>device</b></td>
          <td>
            Required. The unique key to identifier user's current device.
            <br/>
            More information on how to get the device id for
            <a href="https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor" target="_blank">iOS</a>
            or
            <a href="https://developer.android.com/training/articles/user-data-ids.html" target="_blank">Android</a>
          </td>
        </tr>
        <tr>
          <td><b>extra</b></td>
          <td>Optional. Any extra information you want to add for a license activation.</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      The HTTP status code of the response indicates whether the activation / validation succeeds.
      <table class="table">
        <thead>
        <tr>
          <th>Code</th>
          <th>Description</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td><b>400</b></td>
          <td>Missing required query key.</td>
        </tr>
        <tr>
          <td><b>404</b></td>
          <td>
            License cannot be found.
          </td>
        </tr>
        <tr>
          <td><b>403</b></td>
          <td>No more activation quota for this license.</td>
        </tr>
        <tr>
          <td><b>200</b></td>
          <td>
            If the license is activated by the specified device for the first time, this means activation succeeded.
            <br/>
            If the license is already activated by the specified device, then it means the license is still valid.
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="section all-set">
      <div class="text">
        Now you are all set, go create your first batch of licenses!
      </div>
      <md-button class="md-primary md-raised" @click="toLicenses()">Manage your licenses</md-button>
    </div>

  </div>
</template>

<style lang="scss" scoped>

  .doc {
    max-width: 800px;
    margin: 40px auto;

    .welcome {
      display: flex;
      flex-direction: column;
      align-items: center;

      .md-icon {
        color: #448aff;
      }
    }

    .section {
      padding: 40px 0;

      +.section {
        border-top: dashed #e0e0e0 1px;
      }
    }

    .code {
      padding: 20px;
      background-color: #eeeeee;
      border-left: solid #fdaa4c 4px;
      margin: 10px 0;
    }

    .table {
      border-collapse: collapse;
      width: 100%;
      margin: 10px 0;

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

    .all-set {
      text-align: center;

      .text {
        font-size: 20px;
        margin-bottom: 10px;
      }
    }
  }

</style>

<script type="text/babel">
  'use strict';

  export default {
    computed: {
      user() {
        return window.preload.user || {};
      }
    },
    methods: {
      toLicenses() {
        this.$router.push('/licenses');
      }
    }
  };
</script>