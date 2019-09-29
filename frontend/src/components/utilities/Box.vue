<template>
  <div ref="box" class="box" :class="classes">
    <div v-if="!disableHeader" class="box-header" :class="headerBorder ? 'with-border' : ''">
      <div class="box-tools">
        <slot name="box-tools" />
        <button
          v-if="canCollapse && !collapsed"
          v-tooltip="'Collapse'"
          class="btn btn-box-tool"
          @click="collapse"
        >
          <i class="fa fa-minus" />
        </button>
        <button
          v-if="canCollapse && collapsed"
          v-tooltip="'Expand'"
          class="btn btn-box-tool"
          @click="expand"
        >
          <i class="fa fa-plus" />
        </button>
        <button v-if="canClose" v-tooltip="'Close'" class="btn btn-box-tool" @click="close">
          <i class="fa fa-times" />
        </button>
      </div>

      <slot name="header" />
    </div>

    <div
      v-if="!disableBody"
      ref="body"
      class="box-body"
      :class="[collapsed ? 'collapsed' : '', noPadding ? 'no-padding' : '']"
    >
      <slot name="body" />
    </div>

    <div v-if="!disableFooter" ref="footer" class="box-footer">
      <slot name="footer" />
    </div>

    <slot />
  </div>
</template>

<script>
/* eslint-disable no-undef */
export default {
  name: 'Box',
  props: [
    'disableHeader',
    'disableBody',
    'disableFooter',
    'canCollapse',
    'canClose',
    'classes',
    'noPadding',
    'headerBorder',
  ],
  data() {
    return {
      collapsed: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  beforeDestroy() {},
  methods: {
    collapse() {
      this.collapsed = true;
      $(this.$refs.body).slideToggle(500);
      $(this.$refs.footer).slideToggle(500);
    },
    expand() {
      this.collapsed = false;
      $(this.$refs.body).slideToggle(500);
      $(this.$refs.footer).slideToggle(500);
    },
    close() {
      $(this.$refs.box).slideToggle(500);
    },
  },
};
</script>

<style lang="scss"></style>
