<template>
  <section>
    <div v-if="loading" class="content content-centered">
      <pulse-loader />
    </div>

    <div v-show="!loading" class="content">
      <div class="box box-primary box-solid">
        <div class="box-body">
          <div class="row">
            <div v-if="flash" class="flash-message col-md-4 col-md-offset-4 text-center">
              <div class="alert" :class="'alert-' + flashType">{{ flashMessage }}</div>
            </div>
          </div>

          <ul class="nav nav-tabs">
            <li class="active"><a data-toggle="tab" href="#details">Details</a></li>
            <li><a data-toggle="tab" href="#permissions">Permissions</a></li>
          </ul>

          <div class="tab-content content">
            <div id="details" class="tab-pane fade in active">
              <vue-form :state="formstate" class="row" @submit.prevent="onSubmit">
                <div class="col-sm-4 col-sm-offset-4">
                  <validate auto-label class="form-group" :class="fieldClassName(formstate.name)">
                    <vue-form-input
                      v-model="role.name"
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
                      v-model="role.description"
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
                  @click="createRole"
                >
                  Create Role
                </button>
              </div>
            </div>
            <div id="permissions" class="tab-pane fade">
              <role-permissions v-if="!loading" :role="role" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import RolePermissions from './RolePermissions.vue';
import { roleService, formService, eventBus } from '../../../services';
import { EVENTS } from '../../../config';

export default {
  name: 'RoleCreate',
  components: {
    RolePermissions,
  },
  data() {
    return {
      loading: false,
      flash: false,
      flashType: null,
      flashMessage: '',
      EVENTS: EVENTS,
      role: {},
      roles: [],
      permissions: [],
      formstate: {},
    };
  },
  created() {
    eventBus.$on(EVENTS.PERMISSIONS_UPDATED, newPermissions => {
      this.role.permissions = newPermissions;
    });
  },
  methods: {
    fieldClassName: formService.fieldClassName,
    createRole() {
      this.loading = true;
      return roleService
        .createRole(this.role)
        .then(() => {
          this.loading = false;
          this.flash = false;
          this.$snotify.success('Role created', 'Success!');
          this.$router.push('/roles');
        })
        .catch(error => {
          this.loading = false;
          console.error('RoleCreate.createRole-error:', error);
          this.$snotify.error('Create role failed', 'Error!');
          if (error.data.message.includes('must be one of')) {
            this.flash = true;
            this.flashType = 'error';
            this.flashMessage =
              'That role name is not allowed. You must first update the list of allowed role names' +
              ' in the mbt.guide server config.';
          }
        });
    },
  },
};
</script>
