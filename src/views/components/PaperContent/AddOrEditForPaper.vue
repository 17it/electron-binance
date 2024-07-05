<template>
  <div class="paper-editor mt-2">
    <div class="bg-white rounded">
      <div class="header-container">
        <div class="left-area">
          <svg-icon class="back-icon" icon-class="icon-back" @click="goListPage"></svg-icon>
          <el-divider direction="vertical"></el-divider>
          <span class="paper-title" :title="globalConfig.name">{{ globalConfig.name }}</span>
        </div>
        <div class="right-area">
          <el-button type="primary" :loading="loading" @click="saveFormData">保存</el-button>
        </div>
      </div>
    </div>
    <div class="main">
      <el-scrollbar>
        <div class="toolbox">
          <p class="title">通用表单项</p>
          <div class="type-container">
            <div v-for="(item, idx) in commonFormItems" :key="idx" class="type" @click="selectItem(item.defaultConfig)">
              <svg-icon class="icon" :icon-class="item.icon" alt="" />
              <span class="desc">{{ item.title }}</span>
            </div>
          </div>
        </div>
        <!-- 业务表单项 -->
        <div v-if="globalConfig.bizCodeType == 1" class="toolbox">
          <p class="title">业务表单项</p>
          <div class="type-container">
            <div v-for="(item, idx) in businessFormItems" :key="idx" class="type" @click="selectItem(item.defaultConfig)">
              <svg-icon class="icon" :icon-class="item.icon" alt="" />
              <span class="desc">{{ item.title }}</span>
            </div>
          </div>
        </div>
        <!-- 调查问卷表单项 -->
        <div v-if="globalConfig.bizCodeType == 2" class="toolbox">
          <p class="title">问卷表单项</p>
          <div class="type-container">
            <div v-for="(item, idx) in questionnaireFormItems" :key="idx" class="type" @click="selectItem(item.defaultConfig)">
              <svg-icon class="icon" :icon-class="item.icon" alt="" />
              <span class="desc">{{ item.title }}</span>
            </div>
          </div>
        </div>
        <!-- 图文发布表单项 -->
        <div v-if="globalConfig.bizCodeType == 3" class="toolbox">
          <p class="title">图文发布表单项</p>
          <div class="type-container">
            <div v-for="(item, idx) in imageTextFormItems" :key="idx" class="type" @click="selectItem(item.defaultConfig)">
              <svg-icon class="icon" :icon-class="item.icon" alt="" />
              <span class="desc">{{ item.title }}</span>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <el-scrollbar ref="questionBoxScrollArea" style="flex: 1">
        <div ref="questionBox" class="questionBox">
          <PaperContent is-edit :type="type" :current.sync="current" :paper-config="globalConfig" :question-list.sync="questionList" @copy="onCopy" @delete="onDelete"></PaperContent>
        </div>
      </el-scrollbar>
      <div class="configBox">
        <div class="header">
          <div class="paper" :class="{ active: configActive === 'paper' }" @click="configActive = 'paper'">全局设置</div>
          <div class="question" :class="{ active: configActive === 'question', disabled: !currentQuestion }" @click="tabCurrent('question')">表单设置</div>
        </div>
        <el-scrollbar class="paperWrapper">
          <div v-show="configActive === 'paper'" class="paperConfig">
            <div class="config-other config-name">
              <p style="margin-bottom: 8px">表单名称:</p>
              <el-input v-model="globalConfig.name" :maxlength="22" show-word-limit size="medium" placeholder="请输入"></el-input>
            </div>
            <div class="config-other">
              <p style="margin-bottom: 8px">表单简介:</p>
              <el-input v-model="globalConfig.description" :maxlength="100" show-word-limit size="medium" type="textarea" :rows="3" placeholder="请输入"></el-input>
            </div>
            <div class="config-other">
              <p style="margin-bottom: 8px">所属业务:</p>
              <el-select v-model="globalConfig.bizCodeType" class="w-full" :disabled="!!objectCode" :clearable="false" size="medium" placeholder="请选择" @change="changeBizCodeType">
                <el-option label="科研活动" value="1"></el-option>
                <el-option label="调查问卷" value="2"></el-option>
                <el-option label="图文发布" value="3"></el-option>
              </el-select>
            </div>
          </div>
          <div v-if="configActive === 'question' && currentConfigs" class="paperConfig">
            <div v-for="(item, idx) in currentConfigs" :key="idx" class="config-other">
              <component :is="item" :question="currentQuestion"></component>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import PaperContent from './index'
import { questions } from './const'
import moment from 'moment'
import configurations from './configurations'

export default {
  name: 'AddOrEditForPaper',
  components: {
    PaperContent,
    ...configurations
  },
  props: {
    type: {
      type: String,
      default: '1' // 类型 1考试
    },
    dataChanged: {
      type: Boolean,
      default: false
    },
    addItem: {
      type: Function,
      default() {}
    },
    getDetail: {
      type: Function,
      default() {}
    },
    updateItem: {
      type: Function,
      default() {}
    },
    objectCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      formAttr: {
        column: 1,
        gutter: 56,
        attrs: {
          labelWidth: '100px',
          labelPosition: 'top'
        }
      },
      total: 0,
      configActive: 'paper',
      questionList: [],
      current: -1,
      paperConfig: {
        bizCodeType: '1',
        name: '未命名表单'
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < moment().startOf('day')
        }
      }
    }
  },
  computed: {
    // 全局配置
    globalConfig() {
      return this.paperConfig
    },
    // 当前题目
    currentQuestion() {
      const currentItem = this.questionList[this.current] || null
      return currentItem
    },

    // 当前题目配置
    currentConfigs() {
      if (!this.currentQuestion) {
        return []
      }
      return questions[this.currentQuestion.type]?.defaultConfig?.configs || []
    },

    // 通用表单项
    commonFormItems() {
      const result = []
      for (const key in questions) {
        const question = questions[key]
        if (question.formCategory === 'General') {
          result.push(question)
        }
      }
      return result
    },
    // 业务表单项
    businessFormItems() {
      const result = []
      const BusinessType = ['Activity'] // 业务表单项包含科研活动业务专用表单项
      for (const key in questions) {
        const question = questions[key]
        if (BusinessType.indexOf(question.formCategory) > -1) {
          result.push(question)
        }
      }
      return result
    },
    // 问卷表单项
    questionnaireFormItems() {
      const result = []
      for (const key in questions) {
        const question = questions[key]
        if (question.formCategory === 'Questionnaire') {
          result.push(question)
        }
      }
      return result
    },
    // 图文发布表单项
    imageTextFormItems() {
      const result = []
      for (const key in questions) {
        const question = questions[key]
        if (question.formCategory === 'ImageText') {
          result.push(question)
        }
      }
      return result
    }
  },
  watch: {
    currentQuestion(val) {
      if (!val) {
        this.configActive = 'paper'
      }
    },
    current() {
      this.configActive = 'question'
    },
    questionList: {
      deep: true,
      handler() {
        this.$emit('update:dataChanged', true)
      }
    },
    globalConfig: {
      deep: true,
      handler() {
        this.$emit('update:dataChanged', true)
      }
    }
  },
  created() {
    this.$store.commit('app/CLOSE_SIDEBAR')
    if (this.objectCode) {
      this.getDetails()
    } else {
      this.current = -1
      this.paperConfig = {
        bizCodeType: '1',
        name: '未命名表单'
      }
    }
  },
  methods: {
    // 切换所属业务，清空表单项内容
    changeBizCodeType() {
      this.questionList = []
    },
    onTargetChange(val) {
      this.total = val
    },
    getDetails() {
      this.getDetail({ objectCode: this.objectCode }).then((res) => {
        if (res.code === 200) {
          const resData = res.data || {}
          this.paperConfig = {
            bizCodeType: resData.bizCodeType,
            name: resData.name,
            description: resData.description
          }
          // 返回数据如果在配置中没有，则过滤掉
          const avaliableKeys = Object.keys(questions)
          this.questionList = resData.formItemList.filter(item => {
            if (item.extend) {
              try {
                item.extend = JSON.parse(item.extend)
              } catch (error) {
                item.extend = {}
              }
            }
            return avaliableKeys.includes(item.type)
          }) || []
          this.$nextTick(() => {
            this.$emit('update:dataChanged', false)
          })
        }
      })
    },

    tabCurrent(item) {
      if (!this.currentQuestion) {
        return
      }
      this.configActive = item
    },

    selectItem(question) {
      const copyQuestion = JSON.parse(JSON.stringify(question))
      console.log('copyQuestion', copyQuestion)
      this.questionList.push(copyQuestion)
      this.current = this.questionList.length - 1
      this.configActive = 'question'
      this.$nextTick(() => {
        if (this.$refs.questionBox && this.$refs.questionBox.querySelector('.actived')) {
          this.$refs.questionBox.querySelector('.actived').scrollIntoView({
            top: 10000,
            left: 0,
            behavior: 'smooth'
          })
        }
      })
    },

    onCopy(idx) {
      const copyItem = JSON.parse(JSON.stringify(this.questionList[idx]))
      if (copyItem.objectCode) {
        delete copyItem.objectCode
      }
      this.questionList.splice(idx + 1, 0, copyItem)
    },

    onDelete(idx) {
      if (this.current === idx) {
        this.current = idx - 1 < 0 ? 0 : idx - 1
      }
      this.questionList.splice(idx, 1)
    },

    validateData() {
      const data = {
        ...this.globalConfig
      }
      // 检查标题
      if (!data.name) {
        return '请填写表单名称!'
      }

      // 检查表单是否为空
      if (this.questionList.length === 0) {
        return '请添加表单项!'
      }

      // 校验表单必填项
      if (this.validate(this.questionList)) {
        return this.validate(this.questionList)
      }

      // 所有检查都通过返回空
      return data
    },

    validate(list) {
      const arr = JSON.parse(JSON.stringify(list))
      let validMessage = ''
      arr.forEach((item) => {
        if (item.type === '19' && (!item.extend.fileList || !item.extend.fileList.length)) {
          validMessage = '请上传文件'
        }
      })
      console.log('validMessage', validMessage)
      return validMessage
    },

    getForms() {
      const data = {
        ...this.globalConfig
      }

      data.formItemList = this.questionList.map(item => {
        if (item.extend) {
          try {
            item.extend = JSON.stringify(item.extend)
          } catch (error) {
            item.extend = '{}'
          }
        }
        delete item.configs
        return item
      })
      return data
    },

    /**
     * 保存
     */
    saveFormData() {
      const errorMessage = this.validateData()
      if (typeof errorMessage === 'string') {
        this.$message.warning(errorMessage)
        return
      }
      const data = this.getForms()
      this.doSave(data)
    },

    doSave(data) {
      if (this.objectCode) {
        data.objectCode = this.objectCode
        this.updateItem(data).then((res) => {
          if (res.code === 200) {
            this.$message.success('更新成功!')
            this.$emit('update:dataChanged', false)
            this.goListPage()
            this.loading = false
          } else {
            this.$message.error(res.message)
            this.loading = false
          }
        })
      } else {
        this.addItem(data).then((res) => {
          if (res.code === 200) {
            this.$message.success('添加成功!')
            this.$emit('update:dataChanged', false)
            this.goListPage()
            this.loading = false
          } else {
            this.$message.error(res.message)
            this.loading = false
          }
        })
      }
    },

    goListPage() {
      this.$emit('goListPage')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/variables.scss';

$borderStyle: 1px solid #e9e9e9;

.paper-editor {
  position: absolute;
  width: 100%;
  min-width: 1100px;

  .header-container {
    display: flex;
    justify-content: space-between;
    height: 54px;
    padding: 0 20px;
    line-height: 54px;
    background: #fff;
    box-shadow: 0 1px 4px 0 rgba(0, 21, 41, 0.12);

    .left-area {
      display: flex;
      align-items: center;
      height: 54px;

      .back-icon {
        margin: 0 8px;
        font-size: 24px;
        cursor: pointer;
      }

      .paper-title {
        max-width: 180px;
        margin: 0 8px;
        overflow: hidden;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .save-tips {
        display: flex;
        align-items: center;
        margin: 0 8px;
        color: rgba(0, 0, 0, 0.45);
        font-weight: 400;
        font-size: 12px;

        i {
          margin-right: 4px;
        }
      }
    }
  }

  .main {
    display: flex;
    height: calc(100vh - 190px);
    padding-top: 1px;
    overflow: hidden;

    .toolbox {
      width: 200px;
      padding: 20px 0;
      overflow: auto;
      background: #fff;
      box-shadow: 1px 0 4px 0 rgba(0, 21, 41, 0.12);

      .title {
        margin-bottom: 14px;
        padding-left: 20px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
      }

      .type-container {
        .type {
          display: flex;
          align-items: center;
          height: 40px;
          margin-bottom: 8px;
          padding-left: 20px;
          line-height: 40px;
          background: #fff;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            background: rgba($mainColorBlue, 0.1);
          }

          .icon {
            margin-right: 8px;
          }
        }
      }

      .desc-box {
        margin: 16px 20px;
        padding-top: 24px;
        border-top: $borderStyle;

        .score-desc,
        .count-desc {
          color: #000;
          font-size: 14px;
        }

        .score-desc .point,
        .count-desc .point {
          color: $mainColorBlue;
          font-weight: 500;
          font-size: 18px;
        }
      }
    }

    .questionBox {
      padding: 16px 24px;
      overflow: hidden;
    }

    .configBox {
      width: 360px;
      overflow: hidden;
      background: #fff;
      box-shadow: -1px 0 4px 0 rgba(0, 21, 41, 0.12);

      .header {
        display: flex;
        align-items: center;
        height: 48px;
        border-bottom: $borderStyle;

        .paper,
        .question {
          width: 50%;
          font-weight: 500;
          font-size: 16px;
          text-align: center;
          cursor: pointer;
        }

        .disabled {
          color: #c3c3c3;
          cursor: not-allowed;
        }

        .active {
          color: $mainColorBlue;
        }

        .paper {
          border-right: $borderStyle;
        }
      }

      .paperWrapper {
        height: calc(100% - 60px);
      }

      .paperConfig {
        // height: calc(100% - 80px);
        // overflow: auto;
        color: #000;
        font-size: 14px;

        .config-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 64px;
          padding: 0 24px;
          line-height: 64px;
          border-bottom: $borderStyle;
        }

        .config-other {
          padding: 24px;
          border-bottom: $borderStyle;
        }
        .config-name {
          /deep/ .el-input__inner {
            padding-right: 55px;
          }
        }
      }

      .shareConfig {
        color: #000;

        .shareHeader {
          margin-bottom: 12px;
          font-weight: 600;
          font-size: 16px;
        }

        .shareItem {
          padding: 12px;
          border-bottom: 1px solid rgb(233, 233, 233);

          .shareTitle {
            margin-bottom: 8px;
            font-size: 14px;
          }

          .miniApp {
            width: 212px;
            margin: 0 auto;
            padding: 10px 16px;
            color: #000;
            background: #fff;
            border: 1px solid #e9e9e9;
            border-radius: 4px;
            box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.09);

            .miniTitle {
              display: flex;
              align-items: center;

              .logo {
                width: 32px;
                height: 32px;
                margin-right: 4px;
              }

              .title {
                font-size: 12px;
              }
            }

            .miniDesc {
              margin-top: 14px;
              margin-bottom: 12px;
              font-size: 14px;
            }

            .miniImg {
              width: 180px;
              height: 150px;
              margin: 0 auto;
              padding: 8px;
              background-color: #f3f3f3;
              background-repeat: no-repeat;
              background-size: auto 100%;
            }

            .miniFoot {
              display: flex;
              align-items: center;
              margin-top: 16px;
              padding-top: 6px;
              border-top: 1px solid #e9e9e9;

              .logo {
                width: 12px;
                height: 12px;
                margin-right: 8px;
                color: rgba(116, 133, 219, 1);
              }

              .title {
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
