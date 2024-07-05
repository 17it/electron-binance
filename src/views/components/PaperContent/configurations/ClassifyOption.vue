<template>
  <div>
    <p class="header-wrap" style="margin-bottom: 8px">
      分类描述
      <el-switch v-model="showClassifyDesc" active-value="1" inactive-value="2" @change="onUpdate"> </el-switch>
    </p>
    <div class="inputArea">
      <el-input v-model="myValue" class="input" size="medium" type="textarea" placeholder="请输入" :maxlength="100" show-word-limit @input="onUpdate"></el-input>
    </div>
    <p class="header-wrap" style="margin-bottom: 15px; margin-top: 25px">
      设置选项
      <el-switch v-model="showOptions" active-value="1" inactive-value="2" @change="onUpdate"> </el-switch>
    </p>
    <div class="selectArea">
      <el-form ref="optionsForm" :model="form">
        <draggable v-model="form.options" v-bind="dragOptions" handle=".icon-sort" @end="onDropEnd">
          <transition-group>
            <el-form-item
              v-for="(item, index) in form.options"
              :key="`${index}-sort`"
              :prop="'options.' + index + '.label'"
              :class="['options-item']"
            >
              <div class="item-top">
                <img class="icon-sort" src="https://udstatic.imeik.com/pcUploads/1677482029480/icon-sort.png" />
                <span class="item-value">选项{{ index + 1 }}</span>
                <img class="icon-delete" src="https://udstatic.imeik.com/pcUploads/1678762606866/icon-delete.png" @click="deleteOptionsItem(item, index)" />
              </div>
              <el-input v-model="item.label" placeholder="请输入选项内容" @input="onUpdate"></el-input>
            </el-form-item>
          </transition-group>
        </draggable>
      </el-form>
      <el-button style="width: 100%; border: 1px dashed #8e98a4" icon="el-icon-plus" @click="addOptionsItem()">添加选项</el-button>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  props: {
    question: {
      type: Object,
      default() {
        return {
          subject: ''
        }
      }
    }
  },
  data() {
    return {
      myValue: undefined,
      showClassifyDesc: '1',
      showOptions: '1',
      form: {
        options: []
      },
      dragOptions: {
        animation: 150,
        group: 'dragContainer',
        ghostClass: 'ghost'
      }
    }
  },
  watch: {
    'question.extend.classifyDesc': {
      immediate: true,
      handler() {
        this.setClassifyDesc()
      }
    },
    'question.extend.showClassifyDesc': {
      immediate: true,
      handler() {
        this.setShowClassifyDesc()
      }
    },
    'question.extend.showOptions': {
      immediate: true,
      handler() {
        this.setShowOptions()
      }
    },
    'question.extend.optionsForm': {
      immediate: true,
      handler() {
        this.setOptions()
      }
    }
  },
  methods: {
    setClassifyDesc() {
      this.myValue = this?.question?.extend?.classifyDesc
    },
    setShowClassifyDesc() {
      this.showClassifyDesc = this?.question?.extend?.showClassifyDesc
    },
    setShowOptions() {
      this.showOptions = this?.question?.extend?.showOptions
    },
    setOptions() {
      if (this.question && this.question.extend && this.question.extend.optionsForm) {
        this.$set(this.form, 'options', JSON.parse(JSON.stringify(this.question.extend.optionsForm)))
      }
    },

    onUpdate() {
      this.$set(this.question.extend, 'classifyDesc', this.myValue)
      this.$set(this.question.extend, 'showClassifyDesc', this.showClassifyDesc)
      this.$set(this.question.extend, 'showOptions', this.showOptions)
      this.$set(this.question.extend, 'optionsForm', this.form.options)
    },

    onDropEnd() {
      this.onUpdate()
    },

    addOptionsItem() {
      this.form.options.push({
        label: ''
      })
    },

    // 删除选项
    deleteOptionsItem(item, index) {
      this.form.options.splice(index, 1)
      this.onUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
.header-wrap {
  display: flex;
  justify-content: space-between;
}
.inputArea {
  display: flex;
  gap: 4px;
  align-items: center;

  .input {
    flex: 1;
  }
}
.selectArea {
  .item-top {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .icon-sort {
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }

    .item-value {
      flex: 1;
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #000000;
      line-height: 20px;
    }

    .el-radio {
      margin-right: 8px;
      height: 20px;
      display: flex;
      align-items: center;
    }

    .el-checkbox {
      margin-right: 8px;
      height: 20px;
      display: flex;
      align-items: center;
    }

    .icon-delete {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
