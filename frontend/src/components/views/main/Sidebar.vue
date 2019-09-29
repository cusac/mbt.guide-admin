<template>
  <aside class="main-sidebar">
    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">
      <!-- Sidebar user panel (optional) -->
      <div class="user-panel">
        <div class="pull-left image">
          <img :src="pictureUrl" />
        </div>
        <div class="pull-left info">
          <div>
            <p class="white">{{ displayName }}</p>
          </div>
          <a href="javascript:;"> <i class="fa fa-circle text-success" /> Online </a>
        </div>
      </div>

      <!-- search form (Optional) -->
      <form class="sidebar-form" @submit.prevent>
        <div class="input-group">
          <input
            id="search"
            type="text"
            name="search"
            class="search form-control"
            data-toggle="hideseek"
            placeholder="Search Menus"
            data-list=".sidebar-menu"
          />
          <span class="input-group-btn">
            <button id="search-btn" type="submit" name="search" class="btn btn-flat">
              <i class="fa fa-search" />
            </button>
          </span>
        </div>
      </form>
      <!-- /.search form -->

      <!-- Sidebar Menu -->
      <sidebar-menu />
      <!-- /.sidebar-menu -->
    </section>
    <!-- /.sidebar -->
  </aside>
</template>

<script>
import SidebarMenu from './SidebarMenu';

export default {
  name: 'Sidebar',
  components: { SidebarMenu },
  props: ['displayName', 'pictureUrl'],
  mounted: function() {
    window
      .jQuery('[data-toggle="hideseek"]')
      .off()
      .hideseek();
  },
};
</script>
