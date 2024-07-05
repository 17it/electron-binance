<template>
  <el-drawer
    :modal-append-to-body="false"
    v-bind="$attrs"
    :visible="visible"
    :size="`${width}px`"
    custom-class="imk-detail-drawer"
    :title="title"
    @close="closeDrawer"
  >
    <div class="drawer-content">
      <div class="bg-white rounded" :class="!hideFooter ? 'pb-[60px]' : ''">
        <slot></slot>
        <div
          v-if="!hideFooter"
          :style="{ width: width + 'px' }"
          class="fixed bottom-0 right-0 z-10 text-right p-4 bg-white shadow-dark-50 shadow-2xl"
        >
          <el-button @click="closeDrawer">取 消</el-button>
          <el-button type="primary" @click="submit">{{
            prop.btnName
          }}</el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'ImDrawer',
  props: {
    title: {
      type: String,
      default: '添加'
    },
    width: {
      type: Number,
      default: 620
    },
    visible: {
      type: Boolean,
      default: false
    },
    prop: {
      type: Object,
      default: () => {
        return {
          btnName: '保 存'
        }
      }
    },
    hideFooter: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    submit() {
      this.$emit('submit')
    },
    closeDrawer() {
      this.$emit('update:visible', false)
      this.$emit('closeDrawer')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/variables.scss';

/deep/.imk-detail-drawer {
  overflow: visible;

  .el-drawer__header {
    margin-bottom: 0;
    padding-bottom: 20px;
    color: #000;
    font-weight: 600;
    font-size: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
}

.imk-detail-drawer.el-drawer {
  overflow: visible;

  .drawer-content {
    // height: 100vh;
    padding: 12px 16px;
    overflow-x: auto;
    overflow-y: scroll;
  }
}
</style>
