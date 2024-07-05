<template>
  <el-select
    v-model="myValue"
    v-bind="attrs"
    v-on="listeners"
    @change="onUpdate"
  >
    <el-option-group
      v-for="opt in attrs.options"
      :key="opt.label + Math.random()"
      :label="opt.label"
    >
      <el-option
        v-for="optItem in opt.options"
        :key="optItem.label + Math.random()"
        :disabled="optItem.disabled"
        :label="optItem.label"
        :value="optItem.value"
      />
    </el-option-group>
  </el-select>
</template>

<script>
export default {
  name: 'ImGroupSelect',
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
      myValue: undefined
    }
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        this.setMyValue()
      }
    }
  },
  methods: {
    setMyValue() {
      try {
        this.myValue = JSON.parse(JSON.stringify(this.value))
      } catch (error) {
        this.myValue = undefined
      }
    },
    onUpdate() {
      this.$emit('input', this.myValue)
    }
  }
}
</script>
