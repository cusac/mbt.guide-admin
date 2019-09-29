<template>
  <section>
    <div v-if="loading" class="content content-centered">
      <pulse-loader />
    </div>

    <div v-show="!loading" class="content">
      <h1 class="text-center">Create Permission</h1>

      <div class="row">
        <div v-if="flash" class="flash-message col-md-4 col-md-offset-4 text-center">
          <div class="alert" :class="'alert-' + flashType">{{ flashMessage }}</div>
        </div>
      </div>

      <ul class="nav nav-tabs">
        <li class="active"><a data-toggle="tab" href="#details">Details</a></li>
        <li><a data-toggle="tab" href="#users">Users</a></li>
        <li><a data-toggle="tab" href="#groups">Groups</a></li>
      </ul>

      <div class="tab-content content">
        <div id="details" class="tab-pane fade in active">
          <vue-form :state="formstate" class="row" @submit.prevent="onSubmit">
            <div class="col-sm-4 col-sm-offset-4">
              <validate auto-label class="form-permission" :class="fieldClassName(formstate.name)">
                <vue-form-input
                  v-model="permission.name"
                  required
                  :formstate="formstate"
                  :type="'text'"
                  :label="'Name:'"
                  :name="'name'"
                  :messages="{ required: 'This field is required' }"
                />
              </validate>

              <validate
                auto-label
                class="form-permission"
                :class="fieldClassName(formstate.description)"
              >
                <vue-form-input
                  v-model="permission.description"
                  :formstate="formstate"
                  :type="'text'"
                  :label="'Description:'"
                  :name="'description'"
                />
              </validate>
            </div>
          </vue-form>

          <div class="py-2 text-center row" style="margin-top: 10px">
            <button
              class="btn btn-primary"
              type="submit"
              :disabled="!(formstate.$dirty && formstate.$valid)"
              @click="createPermission"
            >
              Create Permission
            </button>
          </div>
        </div>
        <div id="users" class="tab-pane fade">
          <permission-users v-if="!loading" :permission="permission" />
        </div>
        <div id="groups" class="tab-pane fade">
          <permission-groups v-if="!loading" :permission="permission" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import PermissionUsers from './PermissionUsers.vue';
import PermissionGroups from './PermissionGroups.vue';
import { permissionService, formService, eventBus } from '../../../services';
import { EVENTS } from '../../../config';

export default {
  name: 'PermissionCreate',
  components: {
    PermissionUsers,
    PermissionGroups,
  },
  data() {
    return {
      loading: false,
      flash: false,
      flashType: null,
      flashMessage: '',
      EVENTS: EVENTS,
      permission: null,
      permissions: [],
      groups: [],
      formstate: {},
    };
  },
  created() {
    this.permission = {
      users: [],
      groups: [],
    };
    eventBus.$on(EVENTS.GROUP_USERS_UPDATED, this.updateUsers);
    eventBus.$on(EVENTS.GROUP_PERMISSIONS_UPDATED, this.updateGroups);
  },
  beforeDestroy() {
    eventBus.$off(EVENTS.GROUP_USERS_UPDATED, this.updateUsers);
    eventBus.$off(EVENTS.GROUP_PERMISSIONS_UPDATED, this.updateGroups);
  },
  methods: {
    fieldClassName: formService.fieldClassName,
    createPermission() {
      this.loading = true;
      return permissionService
        .createPermission(this.permission)
        .then(() => {
          this.loading = false;
          this.flash = false;
          this.$snotify.success('Permission created', 'Success!');
          this.$router.push('/permissions');
        })
        .catch(error => {
          this.loading = false;
          console.error('PermissionCreate.createPermission-error:', error);
          this.$snotify.error('Create permission failed', 'Error!');
        });
    },
    updateUsers(users) {
      this.permission.users = users;
    },
    updateGroups(groups) {
      this.permission.groups = groups;
    },
  },
};
</script>
