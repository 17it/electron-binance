<template>
  <div>
    <ImageShow v-if="myValue" :src="myValue"></ImageShow>
    <div v-else class="imageContent">
      <p class="icon"><i class="el-icon-plus"></i></p>
      <span class="text">点击上传</span>
    </div>
  </div>
</template>

<script>
import ImageShow from '@/views/components/Show/ImageShow'
export default {
  name: 'QuestionImage',
  components: {
    ImageShow
  },
  props: {
    value: {
      type: [Number, String, Array],
      default: ''
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
    }
  }
}
</script>

<style lang="scss" scoped>
$size: 124px;
$mainColor: #005dbe;

.imageContent {
  width: $size;
  height: $size;
  box-sizing: border-box;
  padding-top: 38px;
  text-align: center;
  border: 1px dashed #dcdfe6;
  border-radius: 3px;

  .icon {
    color: rgba(0, 0, 0, 0.45);
    font-size: 18px;
  }

  .text {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }

  &:hover {
    border: 1px dashed $mainColor;

    .icon,
    .text {
      color: $mainColor;
    }
  }
}
</style>
