<template>
  <div class="optionArea">
    <p class="label">
      设置选项
    </p>
    <draggable v-model="myValue" v-bind="dragOptions" handle=".handle" @end="onDropEnd">
      <transition-group>
        <div v-for="(item, idx) in myValue" :key="idx + 1" class="optionItemParent">
          <div class="optionItem">
            <el-button :disabled="myValue.length === 1" class="icon" icon="el-icon-delete" type="text" @click="deleteItem(idx)"></el-button>
            <el-input v-model="myValue[idx].content" class="input" @input="onUpdate"></el-input>
            <svg-icon class="handle" icon-class="icon-move"></svg-icon>
          </div>
          <el-checkbox-group v-model="myValue[idx].optionsConfig" @change="myConfigArrChange($event, idx)">
            <el-checkbox class="radio" label="1">允许填空</el-checkbox>
            <el-checkbox v-show="myValue[idx].optionsConfig.indexOf('1') > -1" class="radio" label="2">必填项</el-checkbox>
          </el-checkbox-group>
        </div>
      </transition-group>
    </draggable>
    <a class="addBtn noAnswer" href="javascript:;" @click="addItem">
      <span> <i class="el-icon-plus"></i>添加 </span>
    </a>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'checkboxOptions',
  components: {
    draggable
  },
  props: {
    question: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      myValue: [],
      dragOptions: {
        animation: 150,
        group: 'dragContainer',
        ghostClass: 'ghost'
      },
      indexMap: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'Z']
    }
  },
  watch: {
    'question.extend.options': {
      immediate: true,
      handler() {
        this.setMyValue()
      }
    }
  },
  methods: {
    setMyValue() {
      try {
        this.myValue = JSON.parse(JSON.stringify(this?.question?.extend?.options))
      } catch (error) {
        this.myValue = []
      }
    },

    addItem() {
      this.myValue.push({
        content: `选项${this.myValue.length + 1}`,
        optionsConfig: []
      })
      this.onUpdate()
    },

    deleteItem(idx) {
      this.myValue.splice(idx, 1)
      this.onUpdate()
    },

    myConfigArrChange(e, idx) {
      this.myValue[idx].optionsConfig = e
      this.onUpdate()
    },

    onUpdate() {
      this.$set(this.question.extend, 'options', this.myValue)
    },

    onDropEnd() {
      this.onUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/variables.scss';

.ghost {
  outline: 2px dashed gray;
  opacity: 0.2;
}

.optionArea {
  .label {
    margin-bottom: 16px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
  }

  .optionItemParent {
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
    .optionItem {
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      .icon {
        position: absolute;
        left: -16px;
        font-size: 12px;
        cursor: pointer;
      }

      .input {
        position: relative;
        flex: 1;
        margin-right: 8px;
      }

      .handle {
        cursor: move;
        width: 16px;
        font-size: 16px;
      }
    }

  }

  .addBtn {
    display: block;
    width: calc(100% - 60px);
    text-align: center;
    border: 1px #ccc dashed;
    border-radius: 4px;
    transition: all 0.3s;

    &.noAnswer {
      width: calc(100% - 24px);
    }
  }
}
</style>
