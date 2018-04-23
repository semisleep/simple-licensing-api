<template>
  <div class="content-wrapper">
    Please send an email from the email-address that you used to create your account, to <a href="mailto:jiezhou@magictek.cn"><b>jiezhou@magictek.cn</b></a>,
    with the new password you would like to use.
    <br/><br/>
    We will reset the password for you once we got your email.
  </div>
</template>

<style lang="scss" scoped>

  .content-wrapper {
    max-width: 600px;
    margin: auto;
    padding: 40px;
  }

</style>

<script type="text/babel">
  'use strict';

  export default {
    data() {
      return {
        sending: false,
        form: {
          email: '',
          password: ''
        }
      }
    }
  };
</script>