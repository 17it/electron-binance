<template>
  <div class="paperContainer">
    <div class="paperTitle">
      <div class="title-text">
        {{ paperConfig.name }}
      </div>
    </div>
    <div class="paperQuestions">
      <div v-if="questionList && questionList.length > 0" class="question-list">
        <draggable v-model="myQuestionList" v-bind="dragOptions" handle=".editCover" @end="onDropEnd">
          <transition-group>
            <div v-for="(item, idx) in questionList" :key="'question'+idx" :class="{ editable: isEdit, actived: idx === current }" class="question-item">
              <div class="editCover" @click="onQuestionClicked(idx)">
                <div class="topHandle">
                  <svg-icon icon-class="handle-icon"></svg-icon>
                </div>
                <div class="leftHandle">
                  <svg-icon icon-class="handle-icon"></svg-icon>
                </div>
              </div>
              <div class="item-main-area">
                <div class="question">
                  <span v-if="item.isMustAnswer === '1'" class="text-red-400"> *</span>
                  <div v-if="item.type != 12 && item.type != 13" v-html="item.subject"></div>
                </div>
                <div v-if="getInfo(item.extend).showStemInfo === '1'" class="stem-info" v-html="getInfo(item.extend).stemInfo"></div>
                <div class="main">
                  <component :is="questionType[item.type].type" v-model="item.fillInAnswerfil" :options="getInfo(item.extend).options" :extend="getInfo(item.extend)" :is-detail="isDetail"></component>
                </div>
              </div>
              <div class="editTools">
                <el-button type="text" @click="onCopy(idx)">
                  <svg-icon icon-class="icon-copy"></svg-icon>
                  复制
                </el-button>
                <el-popconfirm class="customPopConfirm" icon="el-icon-warning" icon-color="#f56c6c" title="确定要删除当前表单吗? " @confirm="onDelete(idx)">
                  <el-button slot="reference" type="text" icon="el-icon-delete"> 删除 </el-button>
                </el-popconfirm>
              </div>
            </div>
          </transition-group>
        </draggable>
      </div>
      <div v-else class="empty-area">{{ isEdit ? '请在左侧选择并添加表单' : '表单为空' }}</div>
    </div>
    <div v-if="isEdit && type === '2'" style="margin-top: 12px; color: #000; font-size: 16px; text-align: center">
      {{ paperConfig.completionPrompt }}
    </div>
  </div>
</template>

<script>
import components from './components/index'
import { questions } from './const'
import draggable from 'vuedraggable'

export default {
  name: 'PaperContent',
  components: {
    draggable,
    ...components
  },
  provide() {
    return {
      isEdit: this.isEdit,
      isDetail: this.isDetail,
      type: this.type
    }
  },
  props: {
    paperConfig: {
      type: Object,
      default() {
        return {}
      }
    },
    questionList: {
      type: Array,
      default() {
        return []
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isDetail: {
      type: Boolean,
      default: false
    },
    isReview: {
      type: Boolean,
      default: false
    },
    // 当查看答卷的时候,显示是否答对和得分,方便理解为什么得了多少分
    // 但是这时候跟isReview阅卷又不一样,这种情况得分和正确与否是只读
    showDisabledReview: {
      type: Boolean,
      default: false
    },
    current: {
      type: Number,
      default: -1
    },
    type: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      questionType: questions,
      myQuestionList: [],
      dragOptions: {
        animation: 150,
        group: 'dragContainer',
        ghostClass: 'ghost'
      }
    }
  },
  watch: {
    questionList: {
      deep: true,
      immediate: true,
      handler() {
        this.setMyQuestionList()
      }
    }
  },
  methods: {
    getInfo(val) {
      if (val && typeof val === 'string') {
        return JSON.parse(val)
      } else if (val && typeof val === 'object') {
        return val
      }
      return {}
    },
    setMyQuestionList() {
      try {
        this.myQuestionList = JSON.parse(JSON.stringify(this.questionList))
      } catch (error) {
        this.myQuestionList = []
      }
    },

    onQuestionClicked(idx) {
      this.$emit('update:current', idx)
    },

    onCopy(idx) {
      this.$emit('copy', idx)
    },

    onDelete(idx) {
      this.$emit('delete', idx)
    },

    onDropEnd(item) {
      const newIndex = item.newIndex
      this.$emit('update:current', newIndex)
      this.$emit('update:questionList', this.myQuestionList)
    }
  }
}
</script>

<style lang="scss" scoped>
.ghost {
  outline: 2px dashed gray;
  opacity: 0.2;
}

.paperContainer {
  max-width: 800px;
  min-height: 500px;
  margin: 0 auto;
  padding: 89px 40px 24px 40px;
  background: url('./img/pager-header.svg') no-repeat;
  background-color: white;
  background-position: top;
  background-size: 100% auto;
  border: 1px solid #e9e9e9;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.09);

  .paperTitle {
    position: relative;
    min-height: 66px;
    margin-bottom: 16px;
    text-align: center;

    .title-text {
      max-width: 400px;
      margin: 0 auto;
      margin-bottom: 17px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      font-size: 28px;
      line-height: 40px;
    }

    .title-desc {
      color: rgba(0, 0, 0, 0.65);
      font-weight: 400;
      font-size: 14px;
      line-height: 24px;
    }

    .title-score {
      position: absolute;
      top: 0;
      right: 0;
      width: 80px;
      height: 80px;
      text-align: center;
      background: #fff;
      border: 2px solid #f1f1f1;
      border-radius: 4px;

      .score {
        height: 50px;
        color: #005dbe;
        font-weight: 500;
        font-size: 24px;
        line-height: 50px;
      }

      .text {
        height: 30px;
        color: #000;
        font-weight: 500;
        font-size: 14px;
        line-height: 30px;
        background: #f1f1f1;
        border-radius: 0 0 4px 4px;
      }
    }
  }

  .paperQuestions {
    margin-top: 24px;

    .empty-area {
      height: 400px;
      color: rgba(0, 0, 0, 0.25);
      font-size: 14px;
      line-height: 400px;
      text-align: center;
      border: 1px dashed #cecece;
    }

    .question-list {
      .question-item {
        position: relative;
        min-height: 150px;
        margin-bottom: 16px;
        // padding-top: 50px;
        border-bottom: 1px solid #e4e4e4;

        .reviewArea {
          position: absolute;
          top: 5px;
          display: flex;
          align-items: center;
          color: #000;
          font-size: 14px;

          .radioAndCheckbox {
            display: flex;
            align-items: center;

            .icon {
              display: flex;
              align-items: center;
              margin-right: 24px;

              .text {
                margin-left: 4px;
              }
            }

            .correct {
              color: #52c41a;

              .svg {
                font-size: 18px;
              }
            }

            .wrong {
              color: #e1251b;
            }
          }

          .needInput {
            color: #000;
            font-size: 14px;

            .setScore {
              &::before {
                color: red;
                content: '*';
              }
            }
          }
        }

        .item-type-area {
          position: absolute;
          top: 8px;
          right: 0;
          display: flex;
          align-items: center;
          padding: 7px 15px;
          color: #000;
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          background: #fafafa;
          border: 1px solid #e4e4e4;
          border-radius: 4px;

          .type {
            position: relative;
            display: flex;
            align-items: center;
            margin-right: 8px;
            padding-right: 8px;

            &::after {
              position: absolute;
              top: 2px;
              right: 0;
              display: inline-block;
              width: 1px;
              height: 17px;
              background: #e4e4e4;
              content: '';
            }

            .icon {
              margin-right: 5px;
              font-size: 21px;
            }
          }

          .score {
            .num {
              padding: 0 4px;
              color: #005dbe;
            }
          }
        }

        .item-main-area {
          // padding-bottom: 16px;
          color: #000;

          .question {
            display: inline-flex;
            // margin-bottom: 14px;
            // font-weight: 500;
            // font-size: 20px;
            // line-height: 30px;
            .stem-info {
              width: 100%;
              margin-top: 10px;
            }
          }

          .main {
            padding-bottom: 12px;
          }

          .desc {
            margin-bottom: 14px;
            font-weight: 400;
            font-size: 16px;
            line-height: 22px;
          }
        }

        .editCover,
        .editTools {
          display: none;
        }
      }

      .actived {
        &::before {
          position: absolute;
          top: -8px;
          left: -40px;
          z-index: 3;
          width: 4px;
          height: calc(100% + 16px);
          background-color: #409eff;
          content: '';
        }
      }

      .editable {
        border-bottom: 0 solid #e4e4e4;

        .editCover {
          position: absolute;
          top: -8px;
          left: -40px;
          z-index: 1;
          display: block;
          width: calc(100% + 80px);
          height: calc(100% + 16px);
          background-color: rgba(0, 0, 0, 0);
          cursor: pointer;
          transition: all 0.3s;

          .topHandle {
            position: absolute;
            top: 10px;
            left: 50%;
            font-size: 24px;
            transform: translate(-50%, 0);
            transform: rotate(90deg);
            opacity: 0;
            transition: all 0.3s;
          }

          .leftHandle {
            position: absolute;
            top: 50%;
            left: 0;
            // 先隐藏掉
            display: none;
            font-size: 24px;
            transform: translate(0, -50%);
            opacity: 0;
            transition: all 0.3s;
          }
        }

        .editTools {
          box-sizing: border-box;
          position: relative;
          bottom: -8px;
          left: -40px;
          z-index: 2;
          display: block;
          width: calc(100% + 80px);
          height: 40px;
          padding: 0 16px;
          line-height: 40px;
          text-align: right;
          background: #fafafa;
        }

        &:hover {
          .editCover {
            background-color: rgba(0, 0, 0, 0.03);
            box-shadow: 0 1px 10px 0 rgba(0, 21, 41, 0.08);
          }

          .topHandle,
          .leftHandle {
            cursor: move;
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
