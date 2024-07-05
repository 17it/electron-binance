<template>
  <div class="question">
    <el-radio-group :value="myValue" @change="onUpdate">
      <el-radio v-for="item in radioOptions" :key="item" class="question-item" :label="item">
        <!-- <span class="idx">{{ indexMap[idx] }}. </span> -->
        <span class="content">{{ item }}</span>
      </el-radio>
    </el-radio-group>
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
      myValue: undefined,
      radioOptions: []
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
      console.log('value', this.value)
      if (Array.isArray(this.value)) {
        this.myValue = this.value[0]
      } else {
        this.myValue = this.value
      }
    },
    setOptions() {
      this.radioOptions = this.options.map((item) => {
        return item.content
      })
    },
    onUpdate() {
      this.$emit('input', [this.myValue])
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

  /deep/ .el-radio__input {
    transform: translate(0, 6px);
  }

  /deep/ .el-radio__label {
    white-space: break-spaces;
  }
}
</style>
