<template>
  <el-tree
    ref="tree"
    class="custom-class"
    :default-checked-keys="value"
    :data="attrs.options"
    v-bind="attrs"
    :node-key="attrs.nodeKey || 'value'"
    :props="attrs.props || defaultProps"
    v-on="listeners"
    @check-change="onUpdate"
  />
</template>

<script>
export default {
  name: 'ImTree',
  props: {
    value: {
      type: [String, Array, Number, Boolean],
      default: undefined
    },
    attrs: {
      type: Object,
      default() {
        return {}
      }
    },
    listeners: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label',
        value: 'value'
      }
    }
  },
  methods: {
    onUpdate() {
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.$emit('input', checkedKeys)
      this.$emit('change', checkedKeys)
    }
  }
}
</script>

<style scoped>
.custom-class {
  transform: translate(0, 7px);
}
</style>
