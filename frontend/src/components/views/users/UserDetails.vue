<template>
  <section>
    <div v-if="loading" class="content content-centered">
      <pulse-loader />
    </div>

    <div v-show="!loading" v-if="ready" class="content">
      <div class="box box-primary box-solid">
        <div class="box-header">
          <h3 class="box-title">{{ newUser.firstName }} {{ newUser.lastName }}</h3>
        </div>
        <div class="box-body">
          <div class="row content-centered">
            <div class="col-md-4">
              <div class="box box-success box-solid">
                <div class="box-header">
                  <h3 class="box-title">User Scope</h3>
                </div>
                <div class="box-body">
                  <select
                    ref="computedScope"
                    multiple
                    size="10"
                    style="width: 100%;"
                    disabled="true"
                  >
                    <option v-for="scope in computedUserScope" :key="scope">
                      {{ scope }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <ul class="nav nav-tabs">
            <li class="active"><a data-toggle="tab" href="#details">Details</a></li>
            <li><a data-toggle="tab" href="#groups">Groups</a></li>
            <li><a data-toggle="tab" href="#permissions">Permissions</a></li>
            <li>
              <a v-permission.enable="['resetPasswordNoPin']" data-toggle="tab" href="#password"
                >Password</a
              >
            </li>
          </ul>

          <div class="tab-content content">
            <div id="details" class="tab-pane fade in active">
              <vue-form :state="formstate" class="row" @submit.prevent="onSubmit">
                <div class="col-sm-6">
                  <validate
                    auto-label
                    class="form-group"
                    :class="fieldClassName(formstate.firstName)"
                  >
                    <vue-form-input
                      v-model="newUser.firstName"
                      required
                      :formstate="formstate"
                      :type="'text'"
                      :label="'First Name:'"
                      :name="'firstName'"
                      :messages="{ required: 'This field is required' }"
                    />
                  </validate>

                  <validate
                    auto-label
                    class="form-group"
                    :class="fieldClassName(formstate.lastName)"
                  >
                    <vue-form-input
                      v-model="newUser.lastName"
                      required
                      :formstate="formstate"
                      :type="'text'"
                      :label="'Last Name:'"
                      :name="'lastName'"
                      :messages="{ required: 'This field is required' }"
                    />
                  </validate>

                  <validate
                    auto-label
                    class="form-group"
                    :class="fieldClassName(formstate.email)"
                    :debounce="250"
                    :custom="{ email: emailValidator, notUnique: emailUniqueValidator }"
                  >
                    <vue-form-input
                      v-model="newUser.email"
                      required
                      :formstate="formstate"
                      :type="'email'"
                      :label="'Email:'"
                      :name="'email'"
                      :messages="{
                        email: 'Please input a valid email',
                        required: 'This field is required',
                        notUnique: 'That email is already in use.',
                      }"
                    />
                  </validate>
                </div>

                <div class="col-sm-6">
                  <validate auto-label class="form-group" :class="fieldClassName(formstate.role)">
                    <label>Role:</label>
                    <select v-model="newUser.role" name="role" class="form-control">
                      <option
                        v-for="role in roles"
                        :key="role._id"
                        :selected="role._id === newUser.role._id"
                        :value="role"
                      >
                        {{ role.name }}
                      </option>
                    </select>
                  </validate>

                  <div class="form-group">
                    <label>Active Status:</label>
                    <input
                      class="form-control"
                      :disabled="true"
                      :placeholder="newUser.isActive ? 'Activated' : 'Deactivated'"
                    />
                  </div>

                  <div class="form-group">
                    <label>Enabled Status:</label>
                    <input
                      class="form-control"
                      :disabled="true"
                      :placeholder="newUser.isEnabled ? 'Enabled' : 'Disabled'"
                    />
                  </div>
                </div>

                <!--This is a dummy field to facilitate updating the formstate programmatically-->
                <validate class="hide"
                  ><input v-model="userGroupsUpdated" type="text" name="userGroupsUpdated"
                /></validate>
                <validate class="hide"
                  ><input v-model="userPermissionsUpdated" type="text" name="userPermissionsUpdated"
                /></validate>
              </vue-form>

              <div class="py-2 text-center row" style="margin-top: 10px">
                <button
                  v-if="newUser.isActive"
                  v-permission.enable="['deactivateUser']"
                  class="btn btn-primary"
                  @click="deactivateUser"
                >
                  Deactivate User
                </button>
                <button
                  v-else
                  v-permission.enable="['activateUser']"
                  class="btn btn-primary"
                  @click="activateUser"
                >
                  Activate User
                </button>
                <button
                  v-if="newUser.isEnabled"
                  v-permission.enable="['disableUser']"
                  class="btn btn-primary"
                  @click="disableUser"
                >
                  Disable User
                </button>
                <button
                  v-else
                  v-permission.enable="['enableUser']"
                  class="btn btn-primary"
                  @click="enableUser"
                >
                  Enable User
                </button>
                <button
                  v-permission.enable="['user', 'updateUser']"
                  class="btn btn-primary"
                  type="submit"
                  :disabled="formstate.$pristine || formstate.$invalid"
                  @click="updateUser"
                >
                  Update User
                </button>
              </div>

              <div class="py-2 text-center row" style="margin-top: 10px">
                <button
                  v-permission.enable="['user', 'deleteUser']"
                  class="btn btn-danger"
                  @click="deleteUserModal"
                >
                  Delete User
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
            <div id="groups" class="tab-pane fade">
              <user-groups v-if="!loading" :user="newUser" />
            </div>
            <div id="permissions" class="tab-pane fade">
              <user-permissions v-if="!loading" :user="newUser" />
            </div>
            <div id="password" class="tab-pane fade">
              <user-password v-if="!loading" :user="newUser" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import UserGroups from './UserGroups.vue';
import UserPermissions from './UserPermissions.vue';
import UserPassword from './UserPassword.vue';
import { userService, formService, eventBus } from '../../../services';
import { EVENTS } from '../../../config';

import _ from 'lodash';
import swal from 'sweetalert2';

export default {
  name: 'UserDetails',
  components: {
    UserGroups,
    UserPermissions,
    UserPassword,
  },
  data() {
    return {
      ready: false,
      loading: false,
      userGroupsUpdated: null,
      userPermissionsUpdated: null,
      EVENTS: EVENTS,
      newUser: {},
      oldUser: {},
      roles: [],
      permissions: [],
      formstate: {},
    };
  },
  computed: {
    computedUserScope() {
      return userService.computeUserScope(this.newUser);
    },
  },
  created() {
    const promises = [];
    this.loading = true;
    promises.push(this.getUser());
    promises.push(this.getRoles());
    Promise.all(promises)
      .then(() => {
        this.loading = false;
        this.ready = true;
      })
      .catch(() => {
        this.loading = false;
      });
    eventBus.$on(EVENTS.USER_GROUPS_UPDATED, this.updateGroups);
    eventBus.$on(EVENTS.USER_GROUPS_SAVED, this.clearGroups);
    eventBus.$on(EVENTS.USER_PERMISSIONS_UPDATED, this.updatePermissions);
    eventBus.$on(EVENTS.USER_PERMISSIONS_SAVED, this.clearPermissions);
  },
  beforeDestroy() {
    eventBus.$off(EVENTS.USER_GROUPS_UPDATED, this.updateGroups);
    eventBus.$off(EVENTS.USER_GROUPS_SAVED, this.clearGroups);
    eventBus.$off(EVENTS.USER_PERMISSIONS_UPDATED, this.updatePermissions);
    eventBus.$off(EVENTS.USER_PERMISSIONS_SAVED, this.clearPermissions);
  },
  methods: {
    fieldClassName: formService.fieldClassName,
    emailValidator: formService.emailValidator,
    emailUniqueValidator(email) {
      return formService.emailUniqueValidator(email, this.oldUser.email);
    },
    getUser() {
      const params = {
        $embed: ['role.permissions', 'groups.permissions', 'permissions'],
      };

      return this.$userRepository
        .find(this.$route.params._id, params)
        .then(response => {
          this.newUser = response.data;
          this.oldUser = _.cloneDeep(this.newUser);
          this.$store.dispatch(
            'setBreadcrumbTitle',
            this.newUser.firstName + ' ' + this.newUser.lastName
          );
        })
        .catch(error => {
          console.error('UserDetails.getUser-error:', error);
          this.$snotify.error('Get user failed', 'Error!');
        });
    },
    getRoles() {
      return this.$roleRepository
        .list({ $embed: ['permissions'], $sort: '-rank' })
        .then(response => {
          this.roles = response.data.docs;
        })
        .catch(error => {
          console.error('UserDetails.getRoles-error:', error);
          this.$snotify.error('Get roles failed', 'Error!');
        });
    },
    clearChanges() {
      this.newUser = _.cloneDeep(this.oldUser);
      this.formstate._reset();
    },
    updateUser() {
      this.loading = true;
      return userService
        .updateUser(this.newUser, this.oldUser)
        .then(() => {
          this.loading = false;
          this.formstate._reset();
          this.oldUser = _.cloneDeep(this.newUser);
          this.$snotify.success('User updated', 'Success!');
        })
        .catch(error => {
          this.loading = false;
          console.error('UserDetails.updateUser-error:', error);
          this.$snotify.error('Update user failed', 'Error!');
        });
    },
    deleteUserModal() {
      swal({
        title: 'Are you sure?',
        text: 'This will permanently delete this account!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then(result => {
        if (result.value) {
          this.deleteUser();
        }
      });
    },
    deleteUser() {
      this.loading = true;
      return this.$userRepository
        .deleteOne(this.newUser._id)
        .then(() => {
          this.loading = false;
          return swal('Deleted!', 'User account has been deleted.', 'success');
        })
        .then(() => {
          this.loading = false;
          this.$router.push('/users');
        })
        .catch(error => {
          this.loading = false;
          console.error('UserDetails.deleteUser-error:', error);
          this.$snotify.error('Delete user failed', 'Error!');
        });
    },
    disableUser() {
      this.loading = true;
      return userService
        .disableUser(this.newUser._id)
        .then(() => {
          this.newUser.isEnabled = false;
          this.loading = false;
          this.$snotify.success('User disabled', 'Success!');
        })
        .catch(error => {
          this.loading = false;
          console.error('UserDetails.disableUser-error:', error);
          this.$snotify.error('Disable user failed', 'Error!');
        });
    },
    enableUser() {
      this.loading = true;
      return userService
        .enableUser(this.newUser._id)
        .then(() => {
          this.newUser.isEnabled = true;
          this.loading = false;
          this.$snotify.success('User enabled', 'Success!');
        })
        .catch(error => {
          this.loading = false;
          console.error('UserDetails.enableUser-error:', error);
          this.$snotify.error('Enable user failed', 'Error!');
        });
    },
    deactivateUser() {
      this.loading = true;
      return userService
        .deactivateUser(this.newUser._id)
        .then(() => {
          this.newUser.isActive = false;
          this.loading = false;
          this.$snotify.success('User deactivated', 'Success!');
        })
        .catch(error => {
          this.loading = false;
          console.error('UserDetails.deactivateUser-error:', error);
          this.$snotify.error('Deactivate user failed', 'Error!');
        });
    },
    activateUser() {
      this.loading = true;
      return userService
        .activateUser(this.newUser._id)
        .then(() => {
          this.newUser.isActive = true;
          this.loading = false;
          this.$snotify.success('User activated', 'Success!');
        })
        .catch(error => {
          this.loading = false;
          console.error('UserDetails.activateUser-error:', error);
          this.$snotify.error('Activate user failed', 'Error!');
        });
    },
    updateGroups(newGroups) {
      this.newUser.groups = newGroups;
      this.formstate.userGroupsUpdated._setDirty();
    },
    clearGroups() {
      this.formstate.userGroupsUpdated._setPristine();
    },
    updatePermissions(newPermissions) {
      this.newUser.permissions = newPermissions;
      this.formstate.userPermissionsUpdated._setDirty();
    },
    clearPermissions() {
      this.formstate.userPermissionsUpdated._setPristine();
    },
  },
};
</script>
