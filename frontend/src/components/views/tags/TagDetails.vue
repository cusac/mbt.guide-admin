<template>
  <section class="content">
    <div class="box box-primary box-solid">
      <div class="box-body">
        <v-server-table
          ref="tagDetailsTable"
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
          <template slot="edit" slot-scope="props">
            <div>
              <a class="fa fa-edit" role="button" @click.stop="edit(props.row)" />
            </div>
          </template>
        </v-server-table>
      </div>
    </div>
  </section>
</template>

<script>

import { tagmatchService } from '../../../services';
// import { EVENTS } from '../../../config';
export default {
  name: 'Tags',
  data() {
    return {
      loading: null,
      tagTable: null,
      columns: ['target', 'rating','segmentCount'],
      options: {
        highlightMatches: true,
        sortable: ['target', 'rating', 'segmentCount'],
        requestFunction: request => {
          const params = {};
          params.$page = request.page;
          params.$limit = request.limit;
          if (request.orderBy) {
            params.$sort = request.ascending ? '-' + request.orderBy : request.orderBy;
          }
          alert('request:' + JSON.stringify(request));
          alert('request.$term:' + request.$term);
          alert('this.$page:' + JSON.stringify(this.$page));
        
          if (request.query) {
            params.$term = request.query;
          }
          this.loading = true;
          return tagmatchService.getMatchingTags('pain').catch(error => {
            console.error('TagDetails.requestFunction-error:', error);
            this.$snotify.error('Get tag details failed', 'Error!');
          });
        },
        responseAdapter: response => {
          //alert('resonse datails: ' + JSON.stringify(response));
          //alert('response.data.length:' + response.data.length);
          this.loading = false;
          return { data: response.data, count: response.data.length };
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
    edit(row) {
      //alert('row._id: ' + row._id);
      //alert('JSON.stringify(row):' + JSON.stringify(row));
      //this.$router.push({path: '/tagdetails', name: 'TagDetails', params: { _id: row.name }, props: row });
    },
  },
};
</script>