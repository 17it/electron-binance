<template>
  <div :class="!isView ? 'w-full' : 'inline'">
    <span v-if="isView" :title="plantText">{{ plantText }}</span>
    <el-cascader
      v-else
      ref="select"
      v-model="myValue"
      popper-class="loading"
      class="w-full"
      v-bind="$attrs"
      :props="cascaderProps"
      :options="options"
      :placeholder="$attrs.placeholder || (optionsLoading ? '加载中...' : '请选择')"
      :collapse-tags="$attrs.collapseTags || collapseTags"
      :clearable="$attrs.clearable !== false"
      :filterable="$attrs.filterable !== false"
      @visible-change="visibleChange"
      @change="handleChange"
    ></el-cascader>
  </div>
</template>

<script>
import { qxcollegeDepartmentList } from '@/api/common'
import utils from '@/utils/utils'

export default {
  name: 'DepartmentSelect',
  props: {
    value: {
      type: [String, Number, Array],
      default: undefined
    },
    multiple: {
      type: Boolean,
      default: false
    },
    collapseTags: {
      type: Boolean,
      default: false
    },
    emitPath: {
      type: Boolean,
      default: false
    },
    propValue: {
      type: String,
      default: 'objectCode'
    },
    expandTrigger: {
      type: String,
      default: 'hover'
    },
    checkStrictly: {
      type: Boolean,
      default: true
    },
    extra: {
      type: Object,
      default() {
        return {}
      }
    },
    // 是否仅展示文字
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      myValue: undefined,
      options: [],
      cascaderLoading: null,
      optionsLoading: false
    }
  },
  computed: {
    cascaderProps() {
      return {
        multiple: this.multiple,
        label: 'departmentName',
        value: this.propValue,
        children: 'childList',
        emitPath: this.emitPath,
        expandTrigger: this.expandTrigger,
        checkStrictly: this.checkStrictly
      }
    },
    plantText() {
      const arr = utils.tree2Array(this.options, { key: 'childList' })
      const vals = [].concat(this.myValue) // 单选的时候也转成数组
      const list = []

      vals.map((i) => {
        list.push(utils.getLabelByValue(arr, i, { labelKey: 'departmentName', valueKey: 'objectCode' }))
        return i
      })

      return list.join(', ')
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
        this.myValue = this.value
      }
    },

    getOptions() {
      const params = {
        ...this.extra
      }
      this.optionsLoading = true
      qxcollegeDepartmentList(params)
        .then((res) => {
          this.optionsLoading = false
          if (res.code === 200) {
            if (!res.data) {
              return
            }
            // orgCode:"201" 爱美客技术发展股份有限公司
            const imeikData = res.data.find(item => item.orgCode === '201')
            if (!imeikData) {
              return
            }
            const imeikDataList = imeikData.childList
            this.options = this.dealList(imeikDataList || [])
            this.cascaderLoading.close() // 关掉loading 遮罩层
          }
        })
        .catch((_) => {
          this.optionsLoading = false
        })
    },

    dealList(arr) {
      return arr.map((i) => {
        if (i.childList && i.childList.length) {
          this.dealList(i.childList)
        } else {
          delete i.childList
        }
        return i
      })
    },

    handleChange() {
      // 发生变化的时候把filter输入值清空
      if (this.$refs.select) {
        this.$refs.select.inputValue = ''
      }
      this.$emit('input', this.myValue)
      this.$emit('change', this.myValue)
    },

    /**
     * cascader增加loading效果，防止从没有数据突然变成有数据
     */
    visibleChange() {
      const options = {
        target: '.loading', // 你自定义的类名
        lock: true,
        text: '加载中...'
      }
      this.$nextTick(() => {
        if (this.options.length === 0) {
          this.cascaderLoading = this.$loading(options)
          setTimeout(() => {
            this.cascaderLoading.close()
          }, 15000) // 设置遮罩层关闭时间 一般为接口超时时间
        }
      })
    }
  }
}
</script>
