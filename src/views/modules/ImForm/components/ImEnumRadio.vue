<template>
  <span>
    <span v-if="attrs.isView">{{ selectLabel }}</span>
    <el-radio-group
      v-else
      v-model="myValue"
      v-bind="attrs"
      @change="onUpdate"
    >
      <el-radio
        v-for="opt in options"
        :key="opt.value"
        :disabled="opt.disabled"
        :label="opt.value"
      >
        {{ opt.label }}
      </el-radio>
    </el-radio-group>
  </span>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ImEnumRadio',
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
  computed: {
    ...mapGetters(['enums']),
    options() {
      if (!this.attrs.enumKey) {
        console.log('ImEnumRadio 组件需要在attrs里增加enumKey字段,表明使用哪个枚举值')
        return []
      }
      const list = this.enums[this.attrs.enumKey] || []
      // 支持传入filter进行自定义筛选
      return this.attrs.filter ? this.attrs.filter(list) : list
    },
    selectLabel() {
      if (!this.myValue) {
        return '-'
      }
      const item = this.options.find((item) => {
        return item.value === this.myValue
      })
      return (item && item.label) || '-'
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
      this.$emit('change', this.myValue)
    }
  }
}
</script>
