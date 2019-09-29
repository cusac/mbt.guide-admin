<template>
  <section>
    <div v-if="loading" class="content content-centered">
      <pulse-loader />
    </div>

    <div v-show="!loading" v-if="ready" class="content">
      <div class="box box-primary box-solid">
        <div class="box-header">
          <h3 class="box-title">{{ newGroup.name }}</h3>
        </div>
        <div class="box-body">
          <div class="row">
            <div v-if="flash" class="flash-message col-md-4 col-md-offset-4 text-center">
              <div class="alert" :class="'alert-' + flashType">{{ flashMessage }}</div>
            </div>
          </div>

          <ul class="nav nav-tabs">
            <li class="active"><a data-toggle="tab" href="#details">Details</a></li>
            <li><a data-toggle="tab" href="#users">Users</a></li>
            <li><a data-toggle="tab" href="#permissions">Permissions</a></li>
          </ul>

          <div class="tab-content content">
            <div id="details" class="tab-pane fade in active">
              <vue-form :state="formstate" class="row" @submit.prevent="onSubmit">
                <div class="col-sm-4 col-sm-offset-4">
                  <validate auto-label class="form-group" :class="fieldClassName(formstate.name)">
                    <vue-form-input
                      v-model="newGroup.name"
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
                    class="form-group"
                    :class="fieldClassName(formstate.description)"
                  >
                    <vue-form-input
                      v-model="newGroup.description"
                      :formstate="formstate"
                      :type="'text'"
                      :label="'Description:'"
                      :name="'desription'"
                    />
                  </validate>
                </div>

                <!--This is a dummy field to facilitate updating the formstate programmatically-->
                <validate class="hide"
                  ><input v-model="groupUsersUpdated" type="text" name="groupUsersUpdated"
                /></validate>
                <validate class="hide"
                  ><input
                    v-model="groupPermissionsUpdated"
                    type="text"
                    name="groupPermissionsUpdated"
                /></validate>
              </vue-form>

              <div class="py-2 text-center row" style="margin-top: 10px">
                <button
                  v-permission.enable="['group', 'updateGroup']"
                  class="btn btn-primary"
                  type="submit"
                  :disabled="formstate.$pristine || formstate.$invalid"
                  @click="updateGroup"
                >
                  Update Group
                </button>
              </div>

              <div class="py-2 text-center row" style="margin-top: 10px">
                <button
                  v-permission.enable="['group', 'deleteGroup']"
                  class="btn btn-danger"
                  @click="deleteGroupModal"
                >
                  Delete Group
                </button>
                <button
                  class="btn btn-primary"
                  type="submit"
                  :disabled="formstate.$pristine"
                  @click="clearChanges"
                >
                  Clear Changes
                </button>
              </div>
            </div>
            <div id="users" class="tab-pane fade">
              <group-users v-if="!loading" :group="newGroup" />
            </div>
            <div id="permissions" class="tab-pane fade">
              <group-permissions v-if="!loading" :group="newGroup" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import GroupPermissions from './GroupPermissions.vue';
import GroupUsers from './GroupUsers.vue';
import { groupService, formService, eventBus } from '../../../services';
import { EVENTS } from '../../../config';

import _ from 'lodash';
import swal from 'sweetalert2';

export default {
  name: 'GroupDetails',
  components: {
    GroupUsers,
    GroupPermissions,
  },
  data() {
    return {
      ready: false,
      loading: false,
      flash: false,
      flashType: null,
      flashMessage: '',
      groupUsersUpdated: null,
      groupPermissionsUpdated: null,
      EVENTS: EVENTS,
      newGroup: {},
      oldGroup: {},
      groups: [],
      permissions: [],
      formstate: {},
    };
  },
  created() {
    const promises = [];
    this.loading = true;
    promises.push(this.getGroup());
    Promise.all(promises)
      .then(() => {
        this.loading = false;
        this.ready = true;
      })
      .catch(() => {
        this.loading = false;
      });
    eventBus.$on(EVENTS.GROUP_USERS_UPDATED, this.updateUsers);
    eventBus.$on(EVENTS.GROUP_USERS_SAVED, this.clearUsers);
    eventBus.$on(EVENTS.GROUP_PERMISSIONS_UPDATED, this.updatePermissions);
    eventBus.$on(EVENTS.GROUP_PERMISSIONS_SAVED, this.clearPermissions);
  },
  beforeDestroy() {
    eventBus.$off(EVENTS.GROUP_USERS_UPDATED, this.updateUsers);
    eventBus.$off(EVENTS.GROUP_USERS_SAVED, this.clearUsers);
    eventBus.$off(EVENTS.GROUP_PERMISSIONS_UPDATED, this.updatePermissions);
    eventBus.$off(EVENTS.GROUP_PERMISSIONS_SAVED, this.clearPermissions);
  },
  methods: {
    fieldClassName: formService.fieldClassName,
    getGroup() {
      const params = {
        $embed: ['permissions', 'users'],
      };

      return this.$groupRepository
        .find(this.$route.params._id, params)
        .then(response => {
          this.newGroup = response.data;
          this.oldGroup = _.cloneDeep(this.newGroup);
          this.$store.dispatch('setBreadcrumbTitle', this.newGroup.name);
        })
        .catch(error => {
          console.error('GroupDetails.getGroup-error:', error);
          this.$snotify.error('Get group failed', 'Error!');
        });
    },
    clearChanges() {
      this.newGroup = _.cloneDeep(this.oldGroup);
      this.formstate._reset();
    },
    updateGroup() {
      this.loading = true;
      return groupService
        .updateGroup(this.newGroup, this.oldGroup)
        .then(() => {
          this.loading = false;
          this.flash = false;
          this.formstate._reset();
          this.oldGroup = _.cloneDeep(this.newGroup);
          this.$snotify.success('Group updated', 'Success!');
        })
        .catch(error => {
          this.loading = false;
          console.error('GroupDetails.updateGroup-error:', error);
          this.$snotify.error('Update group failed', 'Error!');
        });
    },
    deleteGroupModal() {
      swal({
        title: 'Are you sure?',
        text: 'This will permanently delete this group!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then(result => {
        if (result.value) {
          this.deleteGroup();
        }
      });
    },
    deleteGroup() {
      this.loading = true;
      return this.$groupRepository
        .deleteOne(this.newGroup._id)
        .then(() => {
          this.loading = false;
          return swal('Deleted!', 'Group has been deleted.', 'success');
        })
        .then(() => {
          this.loading = false;
          this.$router.push('/groups');
        })
        .catch(error => {
          this.loading = false;
          console.error('GroupDetails.deleteGroup-error:', error);
          this.$snotify.error('Delete group failed', 'Error!');
        });
    },
    updateUsers(newUsers) {
      this.newGroup.users = newUsers;
      this.formstate.groupUsersUpdated._setDirty();
    },
    clearUsers() {
      this.formstate.groupUsersUpdated._setPristine();
    },
    updatePermissions(newPermissions) {
      this.newGroup.permissions = newPermissions;
      this.formstate.groupPermissionsUpdated._setDirty();
    },
    clearPermissions() {
      this.formstate.groupPermissionsUpdated._setPristine();
    },
  },
};
</script>
