<template>
  <div class="numberRange">
    <el-input-number v-model="minValue" class="flex-1" clearable :max="maxValue" :controls="false" :placeholder="placeholder[0]" @change="handleChange"></el-input-number>
    <span class="separator">~</span>
    <el-input-number v-model="maxValue" class="flex-1" clearable :min="minValue" :controls="false" :placeholder="placeholder[1]" @change="handleChange"></el-input-number>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default() {
        return [undefined, undefined]
      }
    },
    placeholder: {
      type: Array,
      default() {
        return ['最小值', '最大值']
      }
    }
  },
  data() {
    return {
      minValue: undefined,
      maxValue: undefined
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
      try {
        this.minValue = this.value[0] || undefined
        this.maxValue = this.value[1] || undefined
      } catch (error) {
        this.minValue = undefined
        this.maxValue = undefined
      }
    },

    handleChange() {
      const myValue = [this.minValue, this.maxValue]
      this.$emit('input', myValue)
      this.$emit('change', myValue)
    }
  }
}
</script>

<style scoped>
.numberRange {
  display: flex;
  align-items: center;

  .separator {
  margin: 0 5px;
  line-height: 32px;
}
}

</style>
