<template>
  <div class="question">
    <el-select v-model="myValue" @change="onUpdate">
      <el-option v-for="(item, idx) in options" :key="idx" class="question-item" :label="item" :value="item"></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'QuestionSelect',
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
      myValue: undefined
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
  methods: {
    setMyValue() {
      if (Array.isArray(this.value)) {
        this.myValue = this.value[0]
      } else {
        this.myValue = this.value
      }
    },
    onUpdate() {
      this.$emit('input', this.myValue)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
