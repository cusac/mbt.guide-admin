<template>
  <ul class="sidebar-menu" data-widget="tree">
    <div v-permission.if="[USER_ROLES.ADMIN]" class="sidebar-menu">
      <li class="header">ADMIN</li>
      <router-link v-permission.enable="['user', 'readUser']" tag="li" class="pageLink" to="/users">
        <a>
          <i class="fa fa-user" />
          <span class="page">Users</span>
        </a>
      </router-link>
      <router-link v-permission.enable="['role', 'readRole']" tag="li" class="pageLink" to="/roles">
        <a>
          <i class="fa fa-id-card" />
          <span class="page">Roles</span>
        </a>
      </router-link>
      <router-link
        v-permission.enable="['group', 'readGroup']"
        tag="li"
        class="pageLink"
        to="/groups"
      >
        <a>
          <i class="fa fa-users" />
          <span class="page">Groups</span>
        </a>
      </router-link>
      <router-link
        v-permission.enable="['permission', 'readPermission']"
        tag="li"
        class="pageLink"
        to="/permissions"
      >
        <a>
          <i class="fa fa-key" />
          <span class="page">Permissions</span>
        </a>
      </router-link>
      <router-link
        v-permission.enable="['auditLog', 'readAuditLog']"
        tag="li"
        class="pageLink"
        to="/audit-logs"
      >
        <a>
          <i class="fa fa-book" />
          <span class="page">Audit Logs</span>
        </a>
      </router-link>
      <router-link
        v-permission.enable="['tag', 'readTag']"
        tag="li"
        class="pageLink"
        to="/tags"
      >
        <a>
          <i class="fa fa-book" />
          <span class="page">Tags</span>
        </a>
      </router-link>
    </div>

    <div class="sidebar-menu">
      <li class="header">USER</li>
      <router-link tag="li" class="pageLink" to="/">
        <a>
          <i class="fa fa-dashboard" />
          <span class="page">Dashboard</span>
        </a>
      </router-link>
      <li v-permission.enable="['readMyConversations']" class="pageLink" @click="openNewMessageBox">
        <a>
          <i class="fa fa-comments" />
          <span class="page">Chat</span>
        </a>
      </li>
      <li v-tooltip="'Coming Soon!'" class="pageLink">
        <a>
          <i class="fa fa-envelope" />
          <span class="page">Mail</span>
        </a>
      </li>
    </div>

    <li class="header">PEOPLE</li>
    <router-link tag="li" class="pageLink" to="/connections">
      <a>
        <i class="fa fa-handshake-o" />
        <span class="page">Connections</span>
      </a>
    </router-link>
    <router-link v-permission.enable="['user', 'readUser']" tag="li" class="pageLink" to="/members">
      <a>
        <i class="fa fa-address-book" />
        <span class="page">Members</span>
      </a>
    </router-link>

    <li class="header">FILES</li>
    <router-link tag="li" class="pageLink" to="/documents">
      <a>
        <i class="fa fa-file-word-o" />
        <span class="page">Documents</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/images">
      <a>
        <i class="fa fa-file-picture-o" />
        <span class="page">Images</span>
      </a>
    </router-link>
    <li>
      <a v-tooltip="'Coming Soon!'" href="#"> <i class="fa fa-file-pdf-o" /> PDFs </a>
    </li>

    <li class="header">PAGES</li>
    <router-link tag="li" class="pageLink" to="/login">
      <a>
        <i class="fa fa-circle-o text-yellow" />
        <span class="page"> Login</span>
      </a>
    </router-link>
  </ul>
</template>

<script>
import { USER_ROLES, EVENTS } from '../../../config';
import { eventBus } from '../../../services';
export default {
  name: 'SidebarName',
  data() {
    return {
      role: '',
      USER_ROLES: USER_ROLES,
    };
  },
  created() {
    this.user = this.$store.state.auth.user;
    this.role = this.$store.state.auth.user.roleName.toUpperCase();
  },
  methods: {
    openNewMessageBox() {
      eventBus.$emit(EVENTS.OPEN_CHAT, { new: true });
    },
  },
};
</script>

<style lang="scss">
/* override default */
.sidebar-menu > li > a {
  padding: 12px 15px 12px 15px;
}

/*.sidebar-menu {*/
/*div {*/
/*li {*/
/*a {*/
/*padding: 12px 15px 12px 15px;*/
/*}*/
/*}*/
/*}*/
/*}*/

.sidebar-menu li.active > a > .fa-angle-left,
.sidebar-menu li.active > a > .pull-right-container > .fa-angle-left {
  animation-name: rotate;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-90deg);
  }
}
</style>
