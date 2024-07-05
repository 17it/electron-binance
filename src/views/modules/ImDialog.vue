<template>
  <el-dialog :modal-append-to-body="false" v-bind="$attrs" :visible="visible" :width="width" @close="closeDialog">
    <div slot="title">
      <slot name="title">{{ title }}</slot>
    </div>
    <el-scrollbar class="dialog-content" :style="`height: ${height};${containerStyle}`">
      <div class="pl-2 pr-2 pt-6">
        <slot></slot>
      </div>
    </el-scrollbar>
    <slot name="footer">
      <div v-if="!hideFooter" slot="footer">
        <el-button @click="cancel">{{ cancelText }}</el-button>
        <el-button :loading="saveLoading" type="primary" @click="submit">{{ submitText }}</el-button>
      </div>
    </slot>
  </el-dialog>
</template>

<script>
export default {
  name: 'ImDialog',
  props: {
    title: {
      type: String,
      default: '添加'
    },

    visible: {
      type: Boolean,
      default: false
    },

    hideFooter: {
      type: Boolean,
      default: false
    },

    width: {
      type: String,
      default: '850px'
    },

    height: {
      type: String,
      default: '325px'
    },

    containerStyle: {
      type: String,
      default: ''
    },

    saveLoading: {
      type: Boolean,
      default: false
    },

    submitText: {
      type: String,
      default: '保 存'
    },

    cancelText: {
      type: String,
      default: '取 消'
    }
  },
  methods: {
    submit() {
      this.$emit('submit')
    },
    cancel() {
      this.$emit('cancel')
      this.closeDialog()
    },
    closeDialog() {
      this.$emit('update:visible', false)
      this.$emit('closeDialog')
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding-top: 0;
  padding-bottom: 16px;
}
</style>
