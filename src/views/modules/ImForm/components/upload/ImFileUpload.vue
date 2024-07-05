<template>
  <el-upload
    action
    v-bind="attrs"
    :class="{ achiveLimit: fileList.length >= attrs.limit }"
    :file-list="fileList"
    :http-request="fnUploadRequest"
    :on-success="handleSuccess"
    :on-remove="handleRemove"
    :before-upload="onBeforeUpload"
    :on-preview="openFile"
    v-on="listeners"
  >
    <slot name="uploadBtn">
      <el-button v-bind="buttonAttrs" :size="buttonAttrs.size || 'small'" :loading="uploading" :type="buttonAttrs.type || 'primary'">
        {{ uploading ? '上传中...' : '点击上传' }}
      </el-button>
    </slot>
    <slot name="tipSlot">
      <div slot="tip" class="el-upload__tip">{{ attrs.tip || '请上传不超过20M的文件' }}</div>
    </slot>
  </el-upload>
</template>
<script>
import { beforeUpload, fnUploadRequest } from './upload'
import emitter from 'element-ui/src/mixins/emitter'

export default {
  name: 'ImFileUpload',
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
    },
    buttonAttrs: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      uploading: false,
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
    openFile(e) {
      const a = document.createElement('a')
      const event = new MouseEvent('click')
      a.target = '_blank'
      a.download = e.name
      a.href = e.url// 路径前拼上前缀，完整路径
      a.dispatchEvent(event)
    },

    setMyValue() {
      try {
        // 如果前后值一样，则不重新赋值
        if (!this.isFileListEqual(this.fileList, this.value)) {
          this.fileList = JSON.parse(JSON.stringify(this.value))
        }
      } catch (error) {
        this.fileList = []
      }
    },

    // 根据url和name判断前后数组是否一样
    isFileListEqual(list, newList) {
      const arr = list.map((i) => ({
        url: i.url,
        name: i.name
      }))
      const arr2 = newList.map((i) => ({
        url: i.url,
        name: i.name
      }))

      return JSON.stringify(arr) === JSON.stringify(arr2)
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
        this.uploading = false
      }
    },

    onUpdate() {
      console.log('this.fileList', this.fileList)
      this.$emit('input', this.fileList)
      this.dispatch('ElFormItem', 'el.form.change', this.fileList)
    },

    onBeforeUpload(file) {
      const check = beforeUpload(file, this.attrs.maxSize)
      if (check) {
        this.uploading = true
      }
      return check
    },

    fnUploadRequest
  }
}
</script>

<style lang="scss" scoped>
.achiveLimit {
  /deep/ .el-upload.el-upload--text {
    display: none;
  }

  /deep/ .el-upload-list {
    transform: translate(0, 4px);
  }

  /deep/ .el-upload-list__item:first-of-type {
    margin-top: 0;
  }

  /deep/ .el-icon-close-tip {
    display: none !important;
  }

  /deep/ .el-upload__tip {
    display: none;
  }
}
</style>
