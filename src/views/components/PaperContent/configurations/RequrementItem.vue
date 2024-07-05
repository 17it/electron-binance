<template>
  <div class="flex gap-2">
    <span>本题必答</span>
    <el-switch v-model="myValue" active-value="1" inactive-value="2" @change="onUpdate"> </el-switch>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    question: {
      type: Object,
      default() {
        return {
          isMustAnswer: '2'
        }
      }
    }
  },
  data() {
    return {
      myValue: undefined
    }
  },
  watch: {
    'question.isMustAnswer': {
      immediate: true,
      handler() {
        this.setMyValue()
      }
    }
  },
  methods: {
    setMyValue() {
      this.myValue = this.question.isMustAnswer
    },

    onUpdate() {
      this.$set(this.question, 'isMustAnswer', this.myValue)
    }
  }
}
</script>
