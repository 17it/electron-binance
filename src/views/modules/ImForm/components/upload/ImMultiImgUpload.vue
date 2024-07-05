<template>
  <el-upload
    ref="upload"
    action
    class="customUploadArea"
    :class="{ hide: hideUpload }"
    :file-list="fileList"
    v-bind="attrs"
    accept=".png,.jpg,.jpeg,.gif,.svg"
    list-type="picture-card"
    :http-request="fnUploadRequest"
    :on-success="handleSuccess"
    :on-remove="handleRemove"
    :before-upload="onBeforeUpload"
    v-on="listeners"
  >
    <div slot="file" slot-scope="{file}">
      <div v-if="file" class="imageHolder" @click.stop="stopClick">
        <el-image style="width: 146px; height: 146px" :src="file.url" fit="cover"></el-image>
        <div class="operate">
          <i class="el-icon-view" @click="showImgView(file)"></i>
          <i v-if="!attrs.disabled" class="el-icon-delete" @click="deleteImg(file)"></i>
        </div>
      </div>
    </div>
    <i class="el-icon-plus avatar-uploader-icon"></i>
    <div slot="tip" class="el-upload__tip !mt-0">{{ attrs.tipText || '请上传.png,.jpg,.jpeg,.gif,.svg格式文件，且不超过20M' }}</div>
  </el-upload>
</template>
<script>
import { beforeUpload, fnUploadRequest } from './upload'
import emitter from 'element-ui/src/mixins/emitter'
export default {
  name: 'ImMultiImgUpload',
  mixins: [emitter],
  props: {
    value: {
      type: Array,
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
  computed: {
    hideUpload() {
      if (this.attrs.limit) {
        return this.fileList.length >= this.attrs.limit
      } else {
        return false
      }
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
    stopClick() {
      return false
    },

    showImgView(file) {
      const index = this.fileList.findIndex(i => i.url === file.url)
      this.$viewerApi({
        options: {
          navbar: false,
          initialViewIndex: index
        },
        images: this.fileList.map(i => i.url)
      })
    },

    deleteImg(file) {
      const index = this.fileList.findIndex(i => i.url === file.url)
      this.fileList.splice(index, 1)
      this.handleRemove(file, this.fileList)
    },

    setMyValue() {
      try {
        if ((!this.value || this.value.length === 0) && this.$refs.upload) {
          this.$refs.upload.clearFiles()
        }
        this.fileList = JSON.parse(JSON.stringify(this.value))
      } catch (error) {
        this.fileList = []
        if (this.$refs.upload) {
          this.$refs.upload.clearFiles()
        }
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
      }
    },

    onUpdate() {
      this.$emit('input', this.fileList)
      this.dispatch('ElFormItem', 'el.form.change', this.fileList)
    },

    onBeforeUpload(file) {
      return beforeUpload(file, this.attrs.maxSize)
    },

    fnUploadRequest
  }
}
</script>

<style lang="scss" scoped>
.hide {
  /deep/ .el-upload--picture-card {
    display: none;
  }
}

.imageHolder {
  position: relative;
  width: 100%;
  height: 100%;

  .operate {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
    opacity: 0;
    transition: all 0.2s;
    height: 146px;
    line-height: 146px;

    i {
      padding:4px;
      color: white;
      font-size: 24px;
    }
  }

  &:hover {
    .operate{
      display: block;
      background: rgba(0, 0, 0, 0.5);
      opacity: 1;
    }
  }
}
</style>
