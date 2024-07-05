<template>
  <div>
    <el-input
      v-model="myValue"
      :style="attrs.style || inputStyle"
      :placeholder="attrs.placeholder"
    >
      <el-color-picker
        slot="append"
        v-model="myValue"
        class="custom-color-picker"
        :show-alpha="attrs.alpha"
        :disabled="attrs.disabled"
        size="mini"
        @change="onChange"
      />
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'ImColorPicker',
  props: {
    value: {
      type: String,
      default: undefined
    },
    attrs: {
      type: Object,
      default() {
        return {}
      }
    },
    listeners: {
      type: Object,
      default() {
        return {}
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
      this.myValue = this.value
    },

    onChange() {
      this.$emit('input', this.myValue)
    }
  }
}
</script>

<style scoped lang="scss">
.custom-color-picker {
  transform: translate(0, 1px);
}

/deep/.el-color-picker--mini .el-color-picker__trigger {
  width: 26px;
  height: 26px;
}
</style>
