<template>
  <section class="content">
    <div class="box box-primary box-solid">
      <div class="box-body">
        <v-server-table
          ref="tagTable"
          url=""
          :columns="columns"
          :options="options"
          @row-click="rowClick"
          @loaded="onLoaded"
        >
          <template slot="beforeBody">
            <tr v-if="loading" class="VueTables__no-results">
              <td class="text-center" colspan="2"><pulse-loader /></td>
            </tr>
          </template>
        </v-server-table>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Tags',
  data() {
    return {
      loading: null,
      tagTable: null,
      columns: ['name', 'segmentCount'],
      options: {
        highlightMatches: true,
        sortable: ['name', 'segmentCount'],
        requestFunction: request => {
          const params = {};
          params.$page = request.page;
          params.$limit = request.limit;
          if (request.orderBy) {
            params.$sort = request.ascending ? '-' + request.orderBy : request.orderBy;
          }
          if (request.query) {
            params.$term = request.query;
          }
          this.loading = true;
          return this.$tagRepository.list(params).catch(error => {
            console.error('Tags.requestFunction-error:', error);
            this.$snotify.error('Get tags failed', 'Error!');
          });
        },
        responseAdapter: response => {
          this.loading = false;
          return { data: response.data.docs, count: response.data.items.total };
        },
        uniqueKey: '_id',
      },
    };
  },
  computed: {
    addButtonClass() {
      if (this.tagTable) {
        return this.tagTable.count > this.tagTable.limit ? 'shift-add-left' : 'add-item';
      } else {
        return 'add-item';
      }
    },
  },
  methods: {
    rowClick(data) {
      this.$refs.tagTable.toggleChildRow(data.row._id);
    },
    onLoaded() {
      this.tagTable = this.$refs.tagTable;
    },
  },
};
</script>
