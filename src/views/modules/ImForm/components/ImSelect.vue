<!-- 我们把ele组件常用属性放在这里，如果会用到更多其他属性可以进行扩展 -->
<template>
  <span>
    <span v-if="attrs.isView">{{ selectLabel }}</span>
    <el-select
      v-else
      v-model="myValue"
      v-bind="attrs"
      :placeholder="attrs.placeholder || `请选择`"
      v-on="listeners"
      @change="onUpdate"
    >
      <el-option
        v-for="opt in attrs.options"
        :key="opt[attrs.value] || opt.value"
        :disabled="opt.disabled"
        :label="opt[attrs.label] || opt.label"
        :value="opt[attrs.value] || opt.value"
      >
        <slot name="label" :item="opt">
          {{ opt[attrs.label] || opt.label }}
        </slot>
      </el-option>
    </el-select>
  </span>
</template>

<script>
export default {
  name: 'ImSelect',
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
    },
    label: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      myValue: undefined
    }
  },
  computed: {
    selectLabel() {
      if (!this.myValue) {
        return '-'
      }
      const item = this.attrs.options.find((item) => {
        return item.value === this.myValue
      })
      return item.label || '-'
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
