<template>
  <el-cascader ref="cascaderRef" v-model="myValue" :props="props" :options="options" :placeholder="placeholder" clearable filterable v-bind="$attrs" @change="handleChange"></el-cascader>
</template>

<script>
import { getRegionData } from '@/api/common'

export default {
  name: 'RegionCascader',
  props: {
    value: {
      type: [String, Array],
      default: undefined
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    level: {
      type: String,
      default: undefined
    },
    props: {
      type: Object,
      default() {
        return {
          label: 'name',
          value: 'numberCode',
          children: 'subRegin',
          expandTrigger: 'hover',
          // checkStrictly: true,
          emitPath: false
        }
      }
    }
  },
  data() {
    return {
      myValue: undefined,
      options: []
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
  created() {
    this.getOptions()
  },
  methods: {
    setMyValue() {
      try {
        this.myValue = JSON.parse(JSON.stringify(this.value))
      } catch (error) {
        this.myValue = undefined
      }
    },

    getOptions() {
      getRegionData({}).then((res) => {
        if (res.code === 200) {
          this.options = res.data || []
          this.formatData(this.options)
        }
      })
    },

    formatData(regionData) {
      for (let i = 0; i < regionData.length; i++) {
        const item = regionData[i]
        if (this.level && this.level === item.level) {
          delete item.subRegin
          continue
        }
        if (item.subRegin && item.subRegin.length === 0) {
          delete item.subRegin
        }
        if (item.subRegin && item.subRegin.length > 0) {
          this.formatData(item.subRegin)
        }
      }
    },

    handleChange() {
      let pathNodes = []
      const checkedNodes = this.$refs.cascaderRef.getCheckedNodes()
      if (checkedNodes && checkedNodes.length > 0) {
        pathNodes = checkedNodes[0].pathNodes
      }
      this.$emit('input', this.myValue, pathNodes)
      this.$emit('change', this.myValue, pathNodes)
    }
  }
}
</script>
