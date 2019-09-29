<template>
  <section>
    <h3 class="text-center">Add/Remove Permissions</h3>

    <div>
      <input
        v-model="permissionSearchText"
        type="text"
        class="form-control input-lg"
        placeholder="Search for permissions to add"
        @input="getAvailablePermissions()"
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
              <h3 class="box-title" style="text-align: center;">Available Permissions</h3>
            </div>
            <div class="box-body">
              <select
                ref="availablelist"
                v-model="selectedAvailablePermissions"
                multiple
                size="10"
                style="width: 100%;"
                @change="selectedUserPermissions = []"
              >
                <option v-for="obj in availablePermissions" :key="obj" :value="obj">
                  {{ (obj.permission || {}).name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="col-sm-2 content-centered">
          <div>
            <a @click="addPermissions()">
              <i class="fa fa-arrow-circle-right fa-3x icon-btn icon-btn-primary" />
            </a>
            <br />
            <br />
            <a @click="removePermissions()">
              <i class="fa fa-arrow-circle-left fa-3x icon-btn icon-btn-info" />
            </a>
          </div>
        </div>

        <div class="col-sm-5">
          <div class="box box-primary box-solid">
            <div class="box-header">
              <h3 class="box-title">Current Permissions</h3>
            </div>
            <div class="box-body">
              <select
                ref="userlist"
                v-model="selectedUserPermissions"
                multiple
                size="10"
                style="width: 100%;"
                @change="selectedAvailablePermissions = []"
              >
                <option v-for="obj in newUser.permissions" :key="obj" :value="obj">
                  {{ obj.permission.name }}
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
          :placeholder="permissionDescription"
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
                v-model="selectedIncludedPermissions"
                multiple
                size="10"
                style="width: 100%;"
              >
                <option v-for="obj in includedPermissions" :key="obj" :value="obj">
                  {{ (obj.permission || {}).name }}
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
                v-model="selectedExcludedPermissions"
                multiple
                size="10"
                style="width: 100%;"
              >
                <option v-for="obj in excludedPermissions" :key="obj" :value="obj">
                  {{ obj.permission.name }}
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
                v-model="selectedForbiddenPermissions"
                multiple
                size="10"
                style="width: 100%;"
              >
                <option v-for="obj in forbiddenPermissions" :key="obj" :value="obj">
                  {{ obj.permission.name }}
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
                :disabled="lodash.isEmpty(selectedIncludedPermissions)"
                @click="applyStateToIncluded"
              >
                Apply
              </button>
            </div>
            <div class="col-sm-6">
              <div class="radio radio-success">
                <input
                  id="includedToState_includedPermission"
                  v-model="includedToState"
                  type="radio"
                  :value="PERMISSION_STATES.INCLUDED"
                />
                <label for="includedToState_includedPermission">{{
                  PERMISSION_STATES.INCLUDED
                }}</label>
              </div>
              <div class="radio radio-warning">
                <input
                  id="includedToState_excludedPermission"
                  v-model="includedToState"
                  type="radio"
                  :value="PERMISSION_STATES.EXCLUDED"
                />
                <label for="includedToState_excludedPermission">{{
                  PERMISSION_STATES.EXCLUDED
                }}</label>
              </div>
              <div class="radio radio-danger">
                <input
                  id="includedToState_forbiddenPermission"
                  v-model="includedToState"
                  type="radio"
                  :value="PERMISSION_STATES.FORBIDDEN"
                />
                <label for="includedToState_forbiddenPermission">{{
                  PERMISSION_STATES.FORBIDDEN
                }}</label>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-4" style="margin-top: 15px">
          <div class="row content-centered">
            <div class="col-sm-6 text-right pull-right">
              <button
                class="btn btn-primary"
                :disabled="lodash.isEmpty(selectedExcludedPermissions)"
                @click="applyStateToExcluded"
              >
                Apply
              </button>
            </div>
            <div class="col-sm-6">
              <div class="radio radio-success">
                <input
                  id="excludedToState_includedPermission"
                  v-model="excludedToState"
                  type="radio"
                  :value="PERMISSION_STATES.INCLUDED"
                />
                <label for="excludedToState_includedPermission">{{
                  PERMISSION_STATES.INCLUDED
                }}</label>
              </div>
              <div class="radio radio-warning">
                <input
                  id="excludedToState_excludedPermission"
                  v-model="excludedToState"
                  type="radio"
                  :value="PERMISSION_STATES.EXCLUDED"
                />
                <label for="excludedToState_excludedPermission">{{
                  PERMISSION_STATES.EXCLUDED
                }}</label>
              </div>
              <div class="radio radio-danger">
                <input
                  id="excludedToState_forbiddenPermission"
                  v-model="excludedToState"
                  type="radio"
                  :value="PERMISSION_STATES.FORBIDDEN"
                />
                <label for="excludedToState_forbiddenPermission">{{
                  PERMISSION_STATES.FORBIDDEN
                }}</label>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-4" style="margin-top: 15px">
          <div class="row content-centered">
            <div class="col-sm-6 text-right pull-right">
              <button
                class="btn btn-primary"
                :disabled="lodash.isEmpty(selectedForbiddenPermissions)"
                @click="applyStateToForbidden"
              >
                Apply
              </button>
            </div>
            <div class="col-sm-6">
              <div class="radio radio-success">
                <input
                  id="forbiddenToState_includedPermission"
                  v-model="forbiddenToState"
                  type="radio"
                  :value="PERMISSION_STATES.INCLUDED"
                />
                <label for="forbiddenToState_includedPermission">{{
                  PERMISSION_STATES.INCLUDED
                }}</label>
              </div>
              <div class="radio radio-warning">
                <input
                  id="forbiddenToState_excludedPermission"
                  v-model="forbiddenToState"
                  type="radio"
                  :value="PERMISSION_STATES.EXCLUDED"
                />
                <label for="forbiddenToState_excludedPermission">{{
                  PERMISSION_STATES.EXCLUDED
                }}</label>
              </div>
              <div class="radio radio-danger">
                <input
                  id="forbiddenToState_forbiddenPermission"
                  v-model="forbiddenToState"
                  type="radio"
                  :value="PERMISSION_STATES.FORBIDDEN"
                />
                <label for="forbiddenToState_forbiddenPermission">{{
                  PERMISSION_STATES.FORBIDDEN
                }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="newUser._id" class="py-2 text-center row" style="margin-top: 10px">
        <button
          v-permission.enable="[
            'user',
            'addUserPermissions',
            'removeUserPermissions',
            'addUserAssociations',
            'removeUserAssociations',
          ]"
          class="btn btn-primary"
          type="submit"
          :disabled="!dirty"
          @click="updateUserPermissions"
        >
          Update User Permissions
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import _ from 'lodash';
import { eventBus, userService } from '../../../services';
import { PERMISSION_STATES, EVENTS } from '../../../config';

export default {
  name: 'UserPermissions',
  props: ['user'],
  data() {
    return {
      lodash: _,
      loading: null,
      dirty: false,
      newUser: _.cloneDeep(this.user),
      oldUser: null,
      PERMISSION_STATES: PERMISSION_STATES,
      permissionSearchText: null,
      availablePermissions: [],
      selectedAvailablePermissions: [],
      selectedUserPermissions: [],
      selectedIncludedPermissions: [],
      selectedExcludedPermissions: [],
      selectedForbiddenPermissions: [],
      includedToState: PERMISSION_STATES.INCLUDED,
      excludedToState: PERMISSION_STATES.EXCLUDED,
      forbiddenToState: PERMISSION_STATES.FORBIDDEN,
    };
  },
  computed: {
    permissionDescription() {
      const permission =
        (this.selectedAvailablePermissions[0] || {}).permission ||
        (this.selectedUserPermissions[0] || {}).permission;
      if (permission) {
        return permission.name + ': ' + permission.description;
      }

      return 'Select a permission to see its description.';
    },
    includedPermissions() {
      return this.newUser.permissions.filter(permission => {
        return permission.state === PERMISSION_STATES.INCLUDED;
      });
    },
    excludedPermissions() {
      return this.newUser.permissions.filter(permission => {
        return permission.state === PERMISSION_STATES.EXCLUDED;
      });
    },
    forbiddenPermissions() {
      return this.newUser.permissions.filter(permission => {
        return permission.state === PERMISSION_STATES.FORBIDDEN;
      });
    },
  },
  watch: {
    selectedIncludedPermissions(val) {
      this.selectedUserPermissions = [].concat(
        val,
        this.selectedExcludedPermissions,
        this.selectedForbiddenPermissions
      );
    },
    selectedExcludedPermissions(val) {
      this.selectedUserPermissions = [].concat(
        val,
        this.selectedIncludedPermissions,
        this.selectedForbiddenPermissions
      );
    },
    selectedForbiddenPermissions(val) {
      this.selectedUserPermissions = [].concat(
        val,
        this.selectedExcludedPermissions,
        this.selectedIncludedPermissions
      );
    },
    user(val) {
      this.newUser = _.cloneDeep(val);
      this.newUser.permissions = this.newUser.permissions || [];
      this.getAvailablePermissions();
      this.dirty = false;
    },
  },
  methods: {
    getAvailablePermissions() {
      this.loading = true;
      const userPermissionIds = this.newUser.permissions.map(object => {
        return object.permission._id;
      });
      const params = {};
      if (this.permissionSearchText) {
        params.$term = this.permissionSearchText;
        params.$searchFields = ['name'];
      }
      if (!_.isEmpty(userPermissionIds)) {
        // Exclude the current user permissions from the list of available permissions
        params.$exclude = userPermissionIds;
      }
      return userService
        .getAvailablePermissions(params)
        .then(response => {
          this.loading = false;
          this.availablePermissions = response.data.docs.map(permission => {
            return { permission, state: this.PERMISSION_STATES.INCLUDED };
          });
          this.sortLists();
        })
        .catch(error => {
          this.loading = false;
          console.error('UserPermissions.getAvailablePermissions-error:\n', error);
          this.$snotify.error('There was an error loading the permissions', 'Error!');
        });
    },
    addPermissions() {
      this.dirty = true;
      this.newUser.permissions = this.newUser.permissions.concat(this.selectedAvailablePermissions);

      this.availablePermissions = this.availablePermissions.filter(object => {
        return !this.selectedAvailablePermissions.find(selectedObject => {
          return selectedObject.permission._id === object.permission._id;
        });
      });

      this.selectedAvailablePermissions = [];
      this.sortLists();
      eventBus.$emit(EVENTS.USER_PERMISSIONS_UPDATED, this.newUser.permissions);
    },
    removePermissions() {
      this.dirty = true;
      this.availablePermissions = this.availablePermissions.concat(this.selectedUserPermissions);

      this.newUser.permissions = this.newUser.permissions.filter(object => {
        return !this.selectedUserPermissions.find(selectedObject => {
          return selectedObject.permission._id === object.permission._id;
        });
      });

      this.selectedUserPermissions = [];
      this.sortLists();
      eventBus.$emit(EVENTS.USER_PERMISSIONS_UPDATED, this.newUser.permissions);
    },
    sortLists() {
      this.newUser.permissions.sort((a, b) => {
        return a.permission.name.localeCompare(b.permission.name);
      });

      this.availablePermissions.sort((a, b) => {
        return a.permission.name.localeCompare(b.permission.name);
      });
    },
    applyStateToIncluded() {
      this.dirty = true;
      for (let permission of this.selectedIncludedPermissions) {
        permission.state = this.includedToState;
      }
      this.selectedIncludedPermissions = [];
      eventBus.$emit(EVENTS.USER_PERMISSIONS_UPDATED, this.newUser.permissions);
    },
    applyStateToExcluded() {
      this.dirty = true;
      for (let permission of this.selectedExcludedPermissions) {
        permission.state = this.excludedToState;
      }
      this.selectedExcludedPermissions = [];
      eventBus.$emit(EVENTS.USER_PERMISSIONS_UPDATED, this.newUser.permissions);
    },
    applyStateToForbidden() {
      this.dirty = true;
      for (let permission of this.selectedForbiddenPermissions) {
        permission.state = this.forbiddenToState;
      }
      this.selectedForbiddenPermissions = [];
      eventBus.$emit(EVENTS.USER_PERMISSIONS_UPDATED, this.newUser.permissions);
    },
    updateUserPermissions() {
      userService
        .updateUserPermissions(this.newUser._id, this.newUser.permissions, this.oldUser.permissions)
        .then(() => {
          this.loading = false;
          this.dirty = false;
          this.oldUser = _.cloneDeep(this.newUser);
          eventBus.$emit(EVENTS.USER_PERMISSIONS_SAVED);
          this.$snotify.success('User permissions updated', 'Success!');
        })
        .catch(error => {
          this.loading = false;
          console.error('UserPermissions.updateUserPermissions-error:', error);
          this.$snotify.error('Update user permissions failed', 'Error!');
        });
    },
  },
};
</script>
