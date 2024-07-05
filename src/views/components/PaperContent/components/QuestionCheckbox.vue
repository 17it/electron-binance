<template>
  <div class="question">
    <el-checkbox-group :value="myValue" @change="onUpdate">
      <el-checkbox v-for="item in checkboxOptions" :key="item" class="question-item" :label="item">
        <!-- <span class="idx">{{ indexMap[idx] }}. </span> -->
        <span class="content">{{ item }}</span>
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'QuestionRadiobox',
  inject: ['isEdit', 'isDetail', 'type'],
  props: {
    value: {
      type: [String, Array],
      default() {
        return []
      }
    },
    options: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      indexMap: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
      myValue: [],
      checkboxOptions: []
    }
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        this.setMyValue()
      }
    },
    options: {
      immediate: true,
      handler() {
        this.setOptions()
      }
    }
  },
  methods: {
    setMyValue() {
      try {
        this.myValue = this.value
      } catch (error) {
        this.myValue = []
      }
    },
    setOptions() {
      this.checkboxOptions = this.options.map((item) => {
        return item.content
      })
    },
    onUpdate() {
      this.$emit('input', this.myValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.question {
  .question-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 18px;
    color: #000;
    font-weight: 400;

    .idx {
      font-weight: 500;
      font-size: 18px;
      line-height: 25px;
    }

    .content {
      font-weight: 400;
      font-size: 16px;
      line-height: 22px;
    }
  }

  /deep/ .el-checkbox__input {
    transform: translate(0, 6px);
  }

  /deep/ .el-checkbox__label {
    white-space: break-spaces;
  }
}
</style>
