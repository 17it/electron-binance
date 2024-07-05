<template>
  <el-form ref="form" :class="{formView: isView}" :model="form.props" v-bind="form.attrs" @submit.native.prevent>
    <el-row :gutter="form.gutter">
      <template v-for="(item, idx) in formList">
        <div v-if="item.notInCol" :key="item.prop || idx">
          <FormComponents :form="form" :item="item">
            <template v-for="value in item.slots" :slot="value">
              <slot :name="value" />
            </template>
          </FormComponents>
        </div>
        <el-col v-else-if="item.notInForm" :key="item.prop || idx" :span="item.span || 24">
          <FormComponents :form="form" :item="item">
            <template v-for="value in item.slots" :slot="value">
              <slot :name="value" />
            </template>
          </FormComponents>
        </el-col>
        <el-col
          v-else
          :key="idx"
          :xl="typeof item.span !== 'undefined' ? item.span : columnConfig.xl"
          :lg="typeof item.span !== 'undefined' ? item.span : columnConfig.lg"
          :md="typeof item.span !== 'undefined' ? item.span : columnConfig.md"
          :sm="typeof item.span !== 'undefined' ? item.span : columnConfig.sm"
          :xs="typeof item.span !== 'undefined' ? item.span : columnConfig.xs"
        >
          <el-form-item :key="item.prop || idx" :prop="item.prop" :label-width="item.attrs&&item.attrs.labelWidth" :rules="getRules(item.rules)" :style="item.style" :required="item.required">
            <span v-if="item.label || item.labelSlot" slot="label" style="display: inline-block">
              <slot :name="item.labelSlot">
                {{ item.label }}
              </slot>
            </span>
            <FormComponents :form="form" :item="item">
              <template v-for="value in item.slots" :slot="value">
                <slot :name="value" :item="item" />
              </template>
            </FormComponents>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>

<script>
import FormComponents from './FormComponents.vue'

const isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

export default {
  name: 'ImForm',
  components: {
    FormComponents
  },
  props: {
    form: {
      type: Object,
      default() {
        return {}
      }
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      required: { required: true, message: '此处为必填值' },
      email: { type: 'email', message: '请输入正确的邮箱地址' },
      phone: {
        validator: function(rule, value, callback) {
          const regex = /^1\d{10}$/g
          if (regex.test(value) || value === '' || value === null || value === undefined) {
            callback()
          } else {
            callback(new Error('请正确填写手机号'))
          }
        }
      },
      password: {
        validator: function(rule, value, callback) {
          const regex = /^(?![^a-zA-Z]+$)(?!\D+$).{6,20}$/
          if (regex.test(value) || value === '' || value === null || value === undefined) {
            callback()
          } else {
            callback(new Error('请输入6-20位包含字母、数字的密码'))
          }
        }
      },
      numandlatter: {
        validator: function(rule, value, callback) {
          const regex = /^[A-Za-z0-9]+$/
          if (regex.test(value) || value === '' || value === null || value === undefined) {
            callback()
          } else {
            callback(new Error('只能由数字和字母组成!'))
          }
        }
      },
      number: {
        validator: function(rule, value, callback) {
          if (isNumeric(value) || value === '' || value === null || value === undefined) {
            callback()
          } else {
            callback(new Error('该项须填写数字类型值'))
          }
        }
      },
      int: {
        validator: function(rule, value, callback) {
          if (parseInt(value, 10) === value || value === '' || value === undefined) {
            callback()
          } else {
            callback(new Error('请输入整数类型值'))
          }
        }
      },
      url: { type: 'url', message: '请输入正确网址类型值' },
      idcard: {
        validator: function(rule, value, callback) {
          const regIdCard = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
          if (regIdCard.test(value)) {
            return callback()
          }
          callback(new Error('您输入的身份证号码不是有效格式'))
        }
      }
    }
  },
  computed: {
    formList() {
      return this.form.formItems.filter((item) => {
        return !item.hidden
      })
    },
    columnConfig() {
      const columnConfigMap = {
        1: {
          xl: 24,
          lg: 24,
          md: 24,
          sm: 24,
          xs: 24
        },
        2: {
          xl: 12,
          lg: 12,
          md: 12,
          sm: 24,
          xs: 24
        },
        3: {
          xl: 8,
          lg: 8,
          md: 12,
          sm: 12,
          xs: 24
        },
        4: {
          xl: 6,
          lg: 6,
          md: 8,
          sm: 12,
          xs: 24
        },
        6: {
          xl: 4,
          lg: 6,
          md: 8,
          sm: 12,
          xs: 24
        }
      }
      return columnConfigMap[this.form.column] || columnConfigMap[1]
    }
  },
  methods: {
    getRules(ruleArr) {
      if (!ruleArr) {
        return []
      }
      const rules = []
      for (let i = 0; i < ruleArr.length; i++) {
        const item = ruleArr[i]
        if (typeof item === 'string' && this[item]) {
          rules.push(this[item])
        } else if (typeof item === 'object') {
          rules.push(item)
        }
      }
      return rules
    },
    validate(callback) {
      this.$refs.form.validate((valid, obj) => {
        callback && callback(valid, obj)
      })
    },
    resetFields() {
      this.$refs.form.resetFields()
    },
    clearValidate() {
      this.$refs.form.clearValidate()
    },
    reset() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-col.el-col-24 {
  line-height: 0;
}

.formView {
  ::v-deep .el-form-item__label {
    position: relative;
    &::after {
      position: absolute;
      right: -2px;
      top: 6px;
      content: '：';
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
    }
  }
}

</style>
