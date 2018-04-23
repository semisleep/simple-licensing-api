<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary" md-elevation="0">
        <md-button v-if="shouldShowMenuButton && !menuVisible" class="md-icon-button" @click="toggleMenu">
          <md-icon>menu</md-icon>
        </md-button>
        <md-button v-if="shouldShowBackButton" class="md-icon-button" @click="back">
          <md-icon>keyboard_arrow_left</md-icon>
        </md-button>
        <span class="md-title" style="flex: 1">Simple Licensing API - {{title}}</span>
        <div class="buttons-wrapper">
          <a class="github-button" href="https://github.com/semisleep/simple-vue-validator" data-icon="octicon-star" data-style="mega" aria-label="Star semisleep/simple-vue-validator on GitHub">Star</a>
          <a class="github-button" href="https://github.com/semisleep/simple-vue-validator/issues" data-icon="octicon-issue-opened" data-style="mega" aria-label="Issue semisleep/simple-vue-validator on GitHub">Issue</a>
        </div>
        <md-button class="md-icon-button" @click="signOut">
          <md-icon>exit_to_app</md-icon>
        </md-button>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible" md-persistent="mini">
        <md-toolbar class="md-transparent" md-elevation="0">
          <span>Navigation</span>
          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button md-dense" @click="toggleMenu">
              <md-icon>keyboard_arrow_left</md-icon>
            </md-button>
          </div>
        </md-toolbar>
        <md-list>
          <md-list-item to="/doc">
            <md-icon :class="{'list-icon-activated': showingDocumentation}">assignment</md-icon>
            <span class="md-list-item-text">Documentation</span>
          </md-list-item>
          <md-list-item to="/licenses">
            <md-icon :class="{'list-icon-activated': showingLicenses}">lock</md-icon>
            <span class="md-list-item-text">Manage Licenses</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </md-app-content>
    </md-app>

    <md-dialog :md-active.sync="showSignOutDialog" :md-close-on-esc="false" :md-click-outside-to-close="false">
      <md-dialog-title>Sign Out</md-dialog-title>
      <div class="sign-out-dialog-text">
        Working, please wait for page redirection...
      </div>
      <md-progress-bar md-mode="indeterminate"/>
    </md-dialog>
  </div>
</template>

<style lang="scss" scoped>
  .md-app {
    min-height: 100vh;
    max-height: 100vh;
  }

  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  .list-icon-activated {
    color: #488dfc !important;
  }

  .sign-out-dialog-text {
    padding: 20px 40px;
  }

</style>

<script type="text/babel">
  'use strict';

  if (!Number.prototype.localeCompare) {
    // patch for the datatable sorting
    Number.prototype.localeCompare = function (other) {
      return other - this;
    }
  }

  export default {
    data() {
      return {
        menuVisible: false,
        title: this.$route.meta.title || 'Simple Licensing API',
        showSignOutDialog: false
      };
    },
    computed: {
      shouldShowMenuButton() {
        return !this.$route.meta.canGoBack;
      },
      shouldShowBackButton() {
        return this.$route.meta.canGoBack;
      },
      showingDocumentation() {
        return this.$route.path.startsWith('/doc');
      },
      showingLicenses() {
        return this.$route.path.startsWith('/licenses');
      }
    },
    watch: {
      $route(to) {
        this.title = to.meta.title || 'Simple Licensing API';
      },
      shouldShowBackButton(to) {
        if (to) {
          this.menuVisible = false;
        }
      }
    },
    mounted() {
      this.$hub.$on(this.$constants.SET_TITLE_EVENT, title => {
        this.title = title;
      });
    },
    methods: {
      toggleMenu() {
        this.menuVisible = !this.menuVisible
      },
      back() {
        this.$router.back();
      },
      async signOut() {
        this.showSignOutDialog = true;
        try {
          await this.$http.post('/api/auth/logout');
        } catch (e) {
          console.log(e);
        }
        window.location.href = '/';
      }
    }
  };
</script>