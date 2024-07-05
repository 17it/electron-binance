<template>
  <span>
    <span v-if="attrs.isView">{{ selectLabel }}</span>
    <el-select
      v-else
      v-model="myValue"
      v-bind="attrs"
      :filterable="attrs.filterable!==false"
      :placeholder="attrs.placeholder||'请选择'"
      :clearable="attrs.clearable === false ? false : true"
      v-on="listeners"
      @change="onUpdate"
    >
      <el-option
        v-for="item in options"
        :key="item.key"
        :label="item.label"
        :value="item.value"
      >
        <slot name="label" :item="item">
          {{ item.label }}
        </slot>
      </el-option>
    </el-select>
  </span>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ImEnumSelect',
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
      myValue: undefined,

      enumObject: {},
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['enums', 'enumsObjectCodes']),
    originOptions() {
      return this.enums[this.attrs.enumKey]
    },
    options() {
      if (!this.attrs.enumKey) {
        console.log('ImEnumSelect 组件需要在attrs里增加enumKey字段,表明使用哪个枚举值')
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
      const item = this.originOptions.find((item) => {
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
