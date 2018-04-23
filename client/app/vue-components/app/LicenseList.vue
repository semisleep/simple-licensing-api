<template>
  <div class="license-list">

    <div class="toolbar">
      <md-button class="md-primary md-raised" @click="showGenerateLicensesDialog = true">Add</md-button>
      <md-button class="md-primary md-raised" :disabled="!canViewOrEdit" @click="showLicenseDetailDialog = true">View ／ Edit</md-button>
      <md-button class="md-accent md-raised" :disabled="!canDelete" @click="showDeleteLicensesDialog = true">Delete</md-button>
      <md-button class="md-raised"  @click="exportAsExcel()">Export</md-button>
    </div>

    <div class="table-wrapper" :style="{height: tableHeight ? tableHeight + 'px' : 'auto'}">
      <md-table ref="table" v-model="items" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder"
                :md-sort-fn="customSort" :md-height="tableBodyHeight" md-fixed-header @md-selected="onSelect">
        <md-table-row slot="md-table-row" slot-scope="{item}" md-selectable="multiple" md-auto-select>
          <md-table-cell md-label="License Key" :style="{width: '35%'}">
            {{item.key}}
          </md-table-cell>
          <md-table-cell md-label="Max Usage" md-numeric md-sort-by="maxUsage" :style="{width: '10%'}">
            {{item.maxUsage}}
          </md-table-cell>
          <md-table-cell md-label="Current Usage" md-numeric md-sort-by="currentUsage" :style="{width: '10%'}">
            {{item.currentUsage}}
          </md-table-cell>
          <md-table-cell md-label="Created At" md-numeric md-sort-by="createdAt" :style="{width: '20%'}">
            {{item.createdAt | formatFullDate}}
          </md-table-cell>
          <md-table-cell md-label="Last Validated At" md-numeric md-sort-by="lastValidatedAt" :style="{width: '20%'}">
            {{item.lastValidatedAt | formatFullDate}}
          </md-table-cell>
        </md-table-row>
        <md-table-empty-state
          md-label="The list is empty"
          md-description="Try to create your first batch of licenses by clicking the following button.">
          <md-button class="md-primary md-raised" @click="showGenerateLicensesDialog = true">Add Licenses</md-button>
        </md-table-empty-state>
      </md-table>
    </div>

    <div v-show="loading" class="loading-wrapper">
      <md-progress-bar md-mode="indeterminate" />
    </div>

    <pagination v-model="pagination" />

    <md-snackbar :md-active.sync="showSnackbar" md-persistent>
      <span>{{snackbarText}}</span>
      <md-button class="md-primary" @click="showSnackbar = false">关闭</md-button>
    </md-snackbar>

    <generate-licenses-dialog :active.sync="showGenerateLicensesDialog" @done="reload()" />
    <license-detail-dialog :active.sync="showLicenseDetailDialog" :item="selectedItems[0]" @done="reload()" />
    <delete-licenses-dialog :active.sync="showDeleteLicensesDialog" :items="selectedItems" @done="reload()" />
  </div>
</template>

<style lang="scss" scoped>

  .license-list {

    .loading-wrapper {
      height: 0;
      position: relative;

      .md-progress-bar {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }
  }

</style>

<script type="text/babel">
  'use strict';

  import Pagination from './Pagination.vue';
  import GenerateLicensesDialog from './GenerateLicensesDialog.vue';
  import LicenseDetailDialog from './LicenseDetailDialog.vue';
  import DeleteLicensesDialog from './DeleteLicensesDialog.vue';

  export default {
    components: {
      Pagination, GenerateLicensesDialog, LicenseDetailDialog, DeleteLicensesDialog
    },
    data() {
      return {
        loading: false,
        currentSort: 'lastValidatedAt',
        currentSortOrder: 'desc',
        pagination: {page: 0, totalPages: 0, totalItems: 0},
        items: [],
        selectedItems: [],
        tableHeight: null,
        tableBodyHeight: 500,
        showSnackbar: false,
        snackbarText: '',
        showGenerateLicensesDialog: false,
        showLicenseDetailDialog: false,
        showDeleteLicensesDialog: false
      }
    },
    computed: {
      canViewOrEdit() {
        return this.selectedItems.length === 1;
      },
      canDelete() {
        return this.selectedItems.length > 0;
      }
    },
    watch: {
      'pagination.page'() {
        this.load();
      }
    },
    mounted() {
      this.updateTableHeight();
      this.load();
    },
    methods: {
      updateTableHeight() {
        // TODO a bug for MdTable, table height not adjusted correctly
        let el = this.$el;
        let outerHeight = el.offsetHeight;
        let parentEl = this.$el.parentElement;
        let parentStyle = window.getComputedStyle(parentEl, null);
        let parentPaddingTop = parseInt(parentStyle.getPropertyValue('padding-top'));
        let parentPaddingBottom = parseInt(parentStyle.getPropertyValue('padding-bottom'));
        let parentInnerHeight = parentEl.clientHeight - parentPaddingTop - parentPaddingBottom;
        this.tableHeight = this.tableBodyHeight + parentInnerHeight - outerHeight;
        this.tableBodyHeight = this.tableHeight - 56; // 56 for header height
      },
      async load() {
        this.loading = true;
        this.items = [];
        this.selectedItems = [];
        // TODO a bug for MdTable, selection items are not cleared
        this.$refs.table.MdTable.selectable = [];
        this.$refs.table.MdTable.selectedItems = [];
        try {
          let url = `/api/license?sortBy=${this.currentSort}&sortOrder=${this.currentSortOrder}&page=${this.pagination.page}&pageSize=30`;
          let response = await this.$http.get(url);
          this.items = response.body.items;
          this.pagination = response.body.pagination;
        } catch (e) {
          console.error(e);
          this.snackbarText = 'Unable to retrieve data from server!';
          this.showSnackbar = true;
        } finally {
          this.loading = false;
        }
      },
      customSort(value) {
        this.reload();
        // do nothing, sorting is performed on server side
        return value;
      },
      reload() {
        setTimeout(() => {
          if (this.pagination.page !== 0) {
            this.pagination.page = 0;
          } else {
            this.load();
          }
        }, 100);
      },
      onSelect(items) {
        this.selectedItems = items;
      },
      exportAsExcel() {
        let win = window.open('/export', '_blank');
        win.focus();
      }
    }
  };
</script>