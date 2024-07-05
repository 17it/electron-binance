<template>
  <div :class="!isView ? 'w-full' : 'inline'">
    <span v-if="isView" :title="plantText">{{ plantText }}</span>
    <el-select
      v-else
      ref="select"
      v-model="myValue"
      class="w-full"
      :placeholder="placeholder"
      :multiple="multiple"
      :filterable="filterable"
      :allow-create="allowCreate"
      clearable
      remote
      :remote-method="remoteMethod"
      :loading="loading"
      popper-class="select-class"
      :collapse-tags="collapseTags"
      v-bind="$attrs"
      @change="onChange"
      @visible-change="visibleChange"
    >
      <el-option v-for="item in options" :key="item[prop.value]" :label="item.name || item.employeeNo" :value="item[prop.value]">
        <!--可以传入自定义的展示模板-->
        <slot name="item" :item="item">
          <div class="flex items-center gap-2">
            <span>{{ item.name || item.employeeNo }}<span v-if="item.departmentName">（{{ item.departmentName }}）</span></span>
          </div>
        </slot>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { employeeSelectOption } from '@/api/common'
import utils from '@/utils/utils'
export default {
  name: 'QuestionFormSelect',
  props: {
    prop: {
      type: Object,
      default() {
        return {
          value: 'objectCode'
        }
      }
    },
    value: {
      type: [Number, String, Array],
      default: undefined
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: true
    },
    allowCreate: {
      type: Boolean,
      default: false
    },
    collapseTags: {
      type: Boolean,
      default: false
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
      loading: true,
      selectName: undefined,
      options: []
    }
  },
  computed: {
    plantText() {
      const list = []
      const vals = [].concat(this.myValue) // 单选的时候也转成数组
      vals.map(i => {
        list.push(utils.getLabelByValue(this.options, i, { labelKey: 'name', valueKey: 'objectCode' }))
        return i
      })
      return list.join(',')
    }
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        if (JSON.stringify(this.value) !== JSON.stringify(this.myValue)) {
          this.getOptions()
        }
        this.setMyValue()
      }
    }
  },
  created() {
    this.getOptions()
  },
  methods: {
    maskPhoneNumber(phoneNumber) {
      // 假设手机号格式为11位数字
      const maskedNumber = phoneNumber.substring(0, 3) + '****' + phoneNumber.substring(7)
      return maskedNumber
    },

    setMyValue() {
      try {
        this.myValue = JSON.parse(JSON.stringify(this.value))
      } catch (error) {
        this.myValue = undefined
      }
    },

    remoteMethod(query) {
      this.loading = true
      this.selectName = query
      this.getOptions()
    },

    visibleChange(val) {
      if (!val) {
        this.selectName = ''
        this.getOptions()
      }
    },
    getOptions() {
      const params = {
        name: this.selectName,
        ...this.extra
      }
      if (!this.selectName && this.value) {
        params.objectCodeList = Array.isArray(this.value) ? this.value : [this.value]
        params.selectStatus = !this.value || !this.value.length ? '0' : '1'
      }
      this.loading = true
      employeeSelectOption(params).then((res) => {
        if (res.code === 200) {
          this.options = res.data || []
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      })
    },

    onChange() {
      // 发生变化的时候把filter输入值清空
      if (this.$refs.select) {
        this.$refs.select.inputValue = ''
      }
      this.$emit('input', this.myValue, this.plantText)
      this.$emit('change', this.myValue, this.plantText)
    }
  }
}
</script>
