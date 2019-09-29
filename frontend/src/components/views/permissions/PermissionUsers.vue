<template>
  <section>
    <h3 class="text-center">Add/Remove Users</h3>

    <div>
      <input
        v-model="userSearchText"
        type="text"
        class="form-control input-lg"
        placeholder="Search for users to add"
        @input="getAvailableUsers()"
      />
    </div>

    <div v-if="loading" class="content content-centered">
      <pulse-loader />
    </div>

    <div v-show="!loading">
      <div class="row content-centered" style="margin-top: 15px;">
        <div class="col-sm-5">
          <div class="box box-info box-solid">
            <div class="box-header">
              <h3 class="box-title" style="text-align: center;">Available Users</h3>
            </div>
            <div class="box-body">
              <select
                ref="availablelist"
                v-model="selectedAvailableUsers"
                multiple
                size="10"
                style="width: 100%;"
                @change="selectedPermissionUsers = []"
              >
                <option v-for="obj in availableUsers" :key="obj" :value="obj">
                  {{ (obj.user || {}).lastName }}, {{ (obj.user || {}).firstName }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="col-sm-2 content-centered">
          <div>
            <a @click="addUsers()">
              <i class="fa fa-arrow-circle-right fa-3x icon-btn icon-btn-primary" />
            </a>
            <br />
            <br />
            <a @click="removeUsers()">
              <i class="fa fa-arrow-circle-left fa-3x icon-btn icon-btn-info" />
            </a>
          </div>
        </div>

        <div class="col-sm-5">
          <div class="box box-primary box-solid">
            <div class="box-header">
              <h3 class="box-title">Current Users</h3>
            </div>
            <div class="box-body">
              <select
                ref="permissionlist"
                v-model="selectedPermissionUsers"
                multiple
                size="10"
                style="width: 100%;"
                @change="selectedAvailableUsers = []"
              >
                <option v-for="obj in newPermission.users" :key="obj" :value="obj">
                  {{ obj.user.lastName }}, {{ obj.user.firstName }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div>
        <input
          class="form-control"
          style="margin-top: 15px"
          :disabled="true"
          :placeholder="userDescription"
        />
      </div>

      <div class="row content-centered" style="margin-top: 15px">
        <div class="col-sm-4">
          <div class="box box-success box-solid">
            <div class="box-header">
              <h3 class="box-title">Included</h3>
            </div>
            <div class="box-body">
              <select
                ref="includedlist"
                v-model="selectedIncludedUsers"
                multiple
                size="10"
                style="width: 100%;"
              >
                <option v-for="obj in includedUsers" :key="obj" :value="obj">
                  {{ (obj.user || {}).lastName }}, {{ (obj.user || {}).firstName }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="col-sm-4 content-centered">
          <div class="box box-warning box-solid">
            <div class="box-header">
              <h3 class="box-title">Excluded</h3>
            </div>
            <div class="box-body">
              <select
                ref="excludedlist"
                v-model="selectedExcludedUsers"
                multiple
                size="10"
                style="width: 100%;"
              >
                <option v-for="obj in excludedUsers" :key="obj" :value="obj">
                  {{ obj.user.lastName }}, {{ obj.user.firstName }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="col-sm-4">
          <div class="box box-danger box-solid">
            <div class="box-header">
              <h3 class="box-title">Forbidden</h3>
            </div>
            <div class="box-body">
              <select
                ref="forbiddenlist"
                v-model="selectedForbiddenUsers"
                multiple
                size="10"
                style="width: 100%;"
              >
                <option v-for="obj in forbiddenUsers" :key="obj" :value="obj">
                  {{ obj.user.lastName }}, {{ obj.user.firstName }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="row content-centered">
        <div class="col-sm-4" style="margin-top: 15px">
          <div class="row content-centered">
            <div class="col-sm-6 text-right pull-right">
              <button
                class="btn btn-primary"
                :disabled="lodash.isEmpty(selectedIncludedUsers)"
                @click="applyStateToIncluded"
              >
                Apply
              </button>
            </div>
            <div class="col-sm-6">
              <div class="radio radio-success">
                <input
                  id="includedToState_included"
                  v-model="includedToState"
                  type="radio"
                  :value="PERMISSION_STATES.INCLUDED"
                />
                <label for="includedToState_included">{{ PERMISSION_STATES.INCLUDED }}</label>
              </div>
              <div class="radio radio-warning">
                <input
                  id="includedToState_excluded"
                  v-model="includedToState"
                  type="radio"
                  :value="PERMISSION_STATES.EXCLUDED"
                />
                <label for="includedToState_excluded">{{ PERMISSION_STATES.EXCLUDED }}</label>
              </div>
              <div class="radio radio-danger">
                <input
                  id="includedToState_forbidden"
                  v-model="includedToState"
                  type="radio"
                  :value="PERMISSION_STATES.FORBIDDEN"
                />
                <label for="includedToState_forbidden">{{ PERMISSION_STATES.FORBIDDEN }}</label>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-4" style="margin-top: 15px">
          <div class="row content-centered">
            <div class="col-sm-6 text-right pull-right">
              <button
                class="btn btn-primary"
                :disabled="lodash.isEmpty(selectedExcludedUsers)"
                @click="applyStateToExcluded"
              >
                Apply
              </button>
            </div>

            <div class="col-sm-6">
              <div class="radio radio-success">
                <input
                  id="excludedToState_included"
                  v-model="excludedToState"
                  type="radio"
                  :value="PERMISSION_STATES.INCLUDED"
                />
                <label for="excludedToState_included">{{ PERMISSION_STATES.INCLUDED }}</label>
              </div>
              <div class="radio radio-warning">
                <input
                  id="excludedToState_excluded"
                  v-model="excludedToState"
                  type="radio"
                  :value="PERMISSION_STATES.EXCLUDED"
                />
                <label for="excludedToState_excluded">{{ PERMISSION_STATES.EXCLUDED }}</label>
              </div>
              <div class="radio radio-danger">
                <input
                  id="excludedToState_forbidden"
                  v-model="excludedToState"
                  type="radio"
                  :value="PERMISSION_STATES.FORBIDDEN"
                />
                <label for="excludedToState_forbidden">{{ PERMISSION_STATES.FORBIDDEN }}</label>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-4" style="margin-top: 15px">
          <div class="row content-centered">
            <div class="col-sm-6 text-right pull-right">
              <button
                class="btn btn-primary"
                :disabled="lodash.isEmpty(selectedForbiddenUsers)"
                @click="applyStateToForbidden"
              >
                Apply
              </button>
            </div>
            <div class="col-sm-6">
              <div class="radio radio-success">
                <input
                  id="forbiddenToState_included"
                  v-model="forbiddenToState"
                  type="radio"
                  :value="PERMISSION_STATES.INCLUDED"
                />
                <label for="forbiddenToState_included">{{ PERMISSION_STATES.INCLUDED }}</label>
              </div>
              <div class="radio radio-warning">
                <input
                  id="forbiddenToState_excluded"
                  v-model="forbiddenToState"
                  type="radio"
                  :value="PERMISSION_STATES.EXCLUDED"
                />
                <label for="forbiddenToState_excluded">{{ PERMISSION_STATES.EXCLUDED }}</label>
              </div>
              <div class="radio radio-danger">
                <input
                  id="forbiddenToState_forbidden"
                  v-model="forbiddenToState"
                  type="radio"
                  :value="PERMISSION_STATES.FORBIDDEN"
                />
                <label for="forbiddenToState_forbidden">{{ PERMISSION_STATES.FORBIDDEN }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="newPermission._id" class="py-2 text-center row" style="margin-top: 10px">
        <button
          class="btn btn-primary"
          type="submit"
          :disabled="!dirty"
          @click="updatePermissionUsers"
        >
          Update Permission Users
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import _ from 'lodash';
import { eventBus, permissionService } from '../../../services';
import { PERMISSION_STATES, EVENTS } from '../../../config';

export default {
  name: 'PermissionUsers',
  props: ['permission'],
  data() {
    return {
      lodash: _,
      loading: null,
      dirty: false,
      newPermission: _.cloneDeep(this.permission),
      oldPermission: null,
      PERMISSION_STATES: PERMISSION_STATES,
      userSearchText: null,
      availableUsers: [],
      selectedAvailableUsers: [],
      selectedPermissionUsers: [],
      selectedIncludedUsers: [],
      selectedExcludedUsers: [],
      selectedForbiddenUsers: [],
      includedToState: PERMISSION_STATES.INCLUDED,
      excludedToState: PERMISSION_STATES.EXCLUDED,
      forbiddenToState: PERMISSION_STATES.FORBIDDEN,
    };
  },
  computed: {
    userDescription() {
      const user =
        (this.selectedAvailableUsers[0] || {}).user || (this.selectedPermissionUsers[0] || {}).user;
      if (user) {
        return user.email + ', ' + user.roleName;
      }

      return 'Select a user to see their email and role.';
    },
    includedUsers() {
      return this.newPermission.users.filter(user => {
        return user.state === PERMISSION_STATES.INCLUDED;
      });
    },
    excludedUsers() {
      return this.newPermission.users.filter(user => {
        return user.state === PERMISSION_STATES.EXCLUDED;
      });
    },
    forbiddenUsers() {
      return this.newPermission.users.filter(user => {
        return user.state === PERMISSION_STATES.FORBIDDEN;
      });
    },
  },
  watch: {
    selectedIncludedUsers(val) {
      this.selectedPermissionUsers = [].concat(
        val,
        this.selectedExcludedUsers,
        this.selectedForbiddenUsers
      );
    },
    selectedExcludedUsers(val) {
      this.selectedPermissionUsers = [].concat(
        val,
        this.selectedIncludedUsers,
        this.selectedForbiddenUsers
      );
    },
    selectedForbiddenUsers(val) {
      this.selectedPermissionUsers = [].concat(
        val,
        this.selectedExcludedUsers,
        this.selectedIncludedUsers
      );
    },
    permission(val) {
      this.newPermission = _.cloneDeep(val);
      this.newPermission.users = this.newPermission.users || [];
      this.getAvailableUsers();
      this.dirty = false;
    },
  },
  created() {
    this.newPermission.users = this.newPermission.users || [];
    this.oldPermission = _.cloneDeep(this.newPermission);
    this.getAvailableUsers();
  },
  methods: {
    getAvailableUsers() {
      this.loading = true;
      const permissionUserIds = this.newPermission.users.map(object => {
        return object.user._id;
      });
      const params = {};
      if (this.userSearchText) {
        params.$term = this.userSearchText;
        params.$searchFields = ['firstName', 'lastName', 'email'];
      }
      if (!_.isEmpty(permissionUserIds)) {
        // Exclude the current permission users from the list of available users
        params.$exclude = permissionUserIds;
      }
      return this.$userRepository
        .list(params)
        .then(response => {
          this.loading = false;
          this.availableUsers = response.data.docs.map(user => {
            return { user, state: this.PERMISSION_STATES.INCLUDED };
          });
          this.sortLists();
        })
        .catch(error => {
          this.loading = false;
          console.error('PermissionUsers.getAvailableUsers-error:\n', error);
          this.$snotify.error('There was an error loading the users', 'Error!');
        });
    },
    addUsers() {
      this.dirty = true;
      this.newPermission.users = this.newPermission.users.concat(this.selectedAvailableUsers);

      this.availableUsers = this.availableUsers.filter(object => {
        return !this.selectedAvailableUsers.find(selectedObject => {
          return selectedObject.user._id === object.user._id;
        });
      });

      this.selectedAvailableUsers = [];
      this.sortLists();
      eventBus.$emit(EVENTS.PERMISSION_USERS_UPDATED, this.newPermission.users);
    },
    removeUsers() {
      this.dirty = true;
      this.availableUsers = this.availableUsers.concat(this.selectedPermissionUsers);

      this.newPermission.users = this.newPermission.users.filter(object => {
        return !this.selectedPermissionUsers.find(selectedObject => {
          return selectedObject.user._id === object.user._id;
        });
      });

      this.selectedPermissionUsers = [];
      this.sortLists();
      eventBus.$emit(EVENTS.PERMISSION_USERS_UPDATED, this.newPermission.users);
    },
    sortLists() {
      this.newPermission.users.sort((a, b) => {
        return a.user.lastName.localeCompare(b.user.lastName);
      });

      this.availableUsers.sort((a, b) => {
        return a.user.lastName.localeCompare(b.user.lastName);
      });
    },
    applyStateToIncluded() {
      this.dirty = true;
      for (let user of this.selectedIncludedUsers) {
        user.state = this.includedToState;
      }
      this.selectedIncludedUsers = [];
      eventBus.$emit(EVENTS.PERMISSION_USERS_UPDATED, this.newPermission.users);
    },
    applyStateToExcluded() {
      this.dirty = true;
      for (let user of this.selectedExcludedUsers) {
        user.state = this.excludedToState;
      }
      this.selectedExcludedUsers = [];
      eventBus.$emit(EVENTS.PERMISSION_USERS_UPDATED, this.newPermission.users);
    },
    applyStateToForbidden() {
      this.dirty = true;
      for (let user of this.selectedForbiddenUsers) {
        user.state = this.forbiddenToState;
      }
      this.selectedForbiddenUsers = [];
      eventBus.$emit(EVENTS.PERMISSION_USERS_UPDATED, this.newPermission.users);
    },
    updatePermissionUsers() {
      permissionService
        .updatePermissionUsers(
          this.newPermission._id,
          this.newPermission.users,
          this.oldPermission.users
        )
        .then(() => {
          this.loading = false;
          this.dirty = false;
          this.oldPermission = _.cloneDeep(this.newPermission);
          eventBus.$emit(EVENTS.PERMISSION_USERS_SAVED);
          this.$snotify.success('Permission users updated', 'Success!');
        })
        .catch(error => {
          this.loading = false;
          console.error('PermissionUsers.updatePermissionUsers-error:', error);
          this.$snotify.error('Update permission users failed', 'Error!');
        });
    },
  },
};
</script>
