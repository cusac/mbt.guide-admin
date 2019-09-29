<template>
  <section>
    <div v-if="loading" class="content content-centered">
      <pulse-loader />
    </div>

    <div v-show="!loading" v-if="ready" class="content">
      <div class="box box-primary box-solid">
        <div class="box-body">
          <div class="row">
            <div v-if="flash" class="flash-message col-md-4 col-md-offset-4 text-center">
              <div class="alert" :class="'alert-' + flashType">{{ flashMessage }}</div>
            </div>
          </div>

          <div class="row content-centered">
            <div class="col-sm-4">
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
                      v-model="user.firstName"
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
                      v-model="user.lastName"
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
                    :custom="{ email: emailValidator }"
                  >
                    <vue-form-input
                      v-model="user.email"
                      required
                      :formstate="formstate"
                      :type="'email'"
                      :label="'Email:'"
                      :name="'email'"
                      :messages="{
                        email: 'Please input a valid email',
                        required: 'This field is required',
                      }"
                    />
                  </validate>
                </div>

                <div class="col-sm-6">
                  <validate auto-label class="form-group" :class="fieldClassName(formstate.role)">
                    <label>Role:</label>
                    <select v-model="user.role" name="role" class="form-control">
                      <option
                        v-for="role in roles"
                        :key="role._id"
                        :selected="role._id === user.role._id"
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
                      :placeholder="user.isActive ? 'Activated' : 'Deactivated'"
                    />
                  </div>

                  <div class="form-group">
                    <label>Enabled Status:</label>
                    <input
                      class="form-control"
                      :disabled="true"
                      :placeholder="user.isEnabled ? 'Enabled' : 'Disabled'"
                    />
                  </div>
                </div>
              </vue-form>

              <div class="py-2 text-center row" style="margin-top: 10px">
                <button
                  class="btn btn-primary"
                  type="submit"
                  :disabled="!(formstate.$dirty && formstate.$valid)"
                  @click="createUser"
                >
                  Create User
                </button>
              </div>

              <div class="text-center row" style="margin-top: 10px">
                <span
                  ><strong>Note</strong>: An invitation will be sent to the user's email
                  address.</span
                >
              </div>
            </div>
            <div id="groups" class="tab-pane fade">
              <user-groups v-if="!loading" :user="user" />
            </div>
            <div id="permissions" class="tab-pane fade">
              <user-permissions v-if="!loading" :user="user" />
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
import { userService, authService, formService, eventBus } from '../../../services';
import { EVENTS, USER_ROLES } from '../../../config';

export default {
  name: 'UserCreate',
  components: {
    UserGroups,
    UserPermissions,
  },
  data() {
    return {
      ready: false,
      loading: false,
      flash: false,
      flashType: null,
      flashMessage: '',
      EVENTS: EVENTS,
      USER_ROLES: USER_ROLES,
      user: null,
      roles: [],
      permissions: [],
      formstate: {},
    };
  },
  computed: {
    computedUserScope() {
      return userService.computeUserScope(this.user);
    },
  },
  created() {
    const promises = [];
    this.loading = true;
    promises.push(this.getRoles());
    Promise.all(promises)
      .then(() => {
        this.loading = false;
        this.ready = true;
        this.user = {
          isActive: false,
          isEnabled: true,
          role: this.roles.find(role => {
            return role.name === USER_ROLES.USER;
          }),
          groups: [],
          permissions: [],
        };
        if (!this.user.role) {
          this.flash = true;
          this.flashType = 'error';
          this.flashMessage =
            'User role not found, please make sure the role values in the client and ' +
            'server configs are the same.';
          this.user.role = { permissions: [] };
        }
      })
      .catch(() => {
        this.loading = false;
      });
    eventBus.$on(EVENTS.USER_GROUPS_UPDATED, this.updateGroups);
    eventBus.$on(EVENTS.USER_PERMISSIONS_UPDATED, this.updatePermissions);
  },
  beforeDestroy() {
    eventBus.$off(EVENTS.USER_GROUPS_UPDATED, this.updateGroups);
    eventBus.$off(EVENTS.USER_PERMISSIONS_UPDATED, this.updatePermissions);
  },
  methods: {
    emailValidator: formService.emailValidator,
    fieldClassName: formService.fieldClassName,
    getRoles() {
      return this.$roleRepository
        .list({ $embed: ['permissions'] })
        .then(response => {
          this.roles = response.data.docs;
        })
        .catch(error => {
          console.error('UserCreate.getRoles-error:', error);
          this.$snotify.error('Get roles failed', 'Error!');
        });
    },
    createUser() {
      this.loading = true;
      return authService
        .inviteUser(this.user)
        .then(() => {
          this.loading = false;
          this.$snotify.success('User created', 'Success!');
          this.$router.push('/users');
        })
        .catch(error => {
          this.loading = false;
          console.error('UserCreate.createUser-error:', error);
          this.$snotify.error('Create user failed', 'Error!');
        });
    },
    updateGroups(groups) {
      this.user.groups = groups;
    },
    updatePermissions(permissions) {
      this.user.permissions = permissions;
    },
  },
};
</script>
