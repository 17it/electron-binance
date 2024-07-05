<template>
  <el-upload
    action
    v-bind="attrs"
    drag
    :http-request="fnUploadRequest"
    :file-list="fileList"
    :on-success="handleSuccess"
    :on-remove="handleRemove"
    :before-upload="onBeforeUpload"
    :on-exceed="onExceed"
    v-on="listeners"
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    <div v-if="!attrs.hideTip" slot="tip" class="el-upload__tip">{{ attrs.tip || '请上传不超过20M的文件' }}</div>
  </el-upload>
</template>
<script>
import { beforeUpload, fnUploadRequest } from './upload'
import emitter from 'element-ui/src/mixins/emitter'
export default {
  name: 'ImDragUpload',
  mixins: [emitter],
  props: {
    value: {
      type: [Array],
      default() {
        return []
      }
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
    },
    slots: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      fileList: []
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
        this.fileList = JSON.parse(JSON.stringify(this.value))
      } catch (error) {
        this.fileList = []
      }
    },

    handleRemove(file, fileList) {
      this.fileList = JSON.parse(JSON.stringify(fileList))
      this.onUpdate()
    },

    // 上传成功回调
    handleSuccess(res) {
      if (res) {
        this.fileList.push(res)
        this.onUpdate()
        this.$message.success('上传成功')
      }
    },

    onUpdate() {
      this.$emit('input', this.fileList)
      this.dispatch('ElFormItem', 'el.form.change', this.fileList)
    },

    onBeforeUpload(file) {
      return beforeUpload(file, this.attrs.maxSize)
    },

    onExceed() {
      this.attrs.limit && this.$message.info(`最多支持上传${this.attrs.limit}个文件`)
    },

    fnUploadRequest
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-upload {
  width: 100%;

  .el-upload-dragger {
    width: 100%;
  }
}

/deep/ .el-upload__tip {
  margin-top: -7px;
}
</style>
