<template>
  <section>
    <div v-if="loading" class="content content-centered">
      <pulse-loader />
    </div>

    <div v-show="!loading" class="content">
      <div class="box box-primary">
        <div class="box-header with-border">
          <h3 class="box-title">Create New Document</h3>
        </div>
        <!-- /.box-header -->
        <div class="box-body">
          <div class="form-group">
            <input v-model="document.title" class="form-control" placeholder="Title" />
          </div>

          <vue-editor :can-edit="true" />
        </div>
        <!-- /.box-body -->
        <div class="box-footer">
          <div class="pull-right">
            <button
              v-permission.enable="['document', 'createDocument']"
              class="btn btn-primary"
              @click="requestDataToSave"
            >
              <i class="fa fa-file-text" /> Create
            </button>
          </div>
          <button class="btn btn-default" @click="clearDocument">
            <i class="fa fa-times" /> Clear
          </button>
        </div>
        <!-- /.box-footer -->
      </div>
    </div>
  </section>
</template>

<script>
import { eventBus } from '../../../services';
import { EVENTS } from '../../../config';

export default {
  name: 'DocumentCreate',
  data() {
    return {
      loading: false,
      EVENTS: EVENTS,
      document: {},
    };
  },
  created() {
    eventBus.$on(EVENTS.DATA_READY, this.createDocument);
  },
  beforeDestroy() {
    eventBus.$off(EVENTS.DATA_READY, this.createDocument);
  },
  methods: {
    createDocument(data) {
      this.document.body = data;
      this.loading = true;
      return this.$documentRepository
        .create(this.document)
        .then(() => {
          this.loading = false;
          this.flash = false;
          this.$snotify.success('Document created', 'Success!');
          this.$router.push('/documents');
        })
        .catch(error => {
          this.loading = false;
          console.error('DocumentCreate.createDocument-error:', error);
          this.$snotify.error('Create document failed', 'Error!');
        });
    },
    clearDocument() {
      eventBus.$emit(EVENTS.CLEAR_REQUESTED);
      this.document.title = '';
    },
    requestDataToSave() {
      eventBus.$emit(EVENTS.DATA_REQUESTED);
    },
  },
};
</script>
