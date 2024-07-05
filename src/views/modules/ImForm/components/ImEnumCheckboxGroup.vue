<template>
  <el-checkbox-group
    v-model="myValue"
    v-bind="attrs"
    v-on="listeners"
    @change="onUpdate"
  >
    <el-checkbox
      v-for="item in options"
      :key="item.label + Math.random()"
      :label="item.value"
    >
      <slot name="label" :item="item">
        {{ item.label }}
      </slot>
    </el-checkbox>
  </el-checkbox-group>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ImEnumCheckboxGroup',
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
        console.log('ImEnumSelect 组件需要在attrs里增加enumKey字段,表明使用哪个枚举值')
        return []
      }

      const list = this.enums[this.attrs.enumKey] || []
      // 支持传入filter进行自定义筛选
      return this.attrs.filter ? this.attrs.filter(list) : list
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
