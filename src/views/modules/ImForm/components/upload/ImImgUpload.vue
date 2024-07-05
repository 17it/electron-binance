<template>
  <el-upload
    action
    v-bind="attrs"
    :show-file-list="false"
    :accept="attrs.accept || '.png,.jpg,.jpeg,.gif,.svg'"
    list-type="picture-card"
    :http-request="doFnUploadRequest"
    :on-success="handleSuccess"
    :on-error="handleError"
    :on-remove="handleRemove"
    :before-upload="onBeforeUpload"
    v-on="listeners"
  >
    <div v-if="myValue" class="imageHolder" @click.stop="stopClick">
      <el-image style="width: 146px; height: 146px" :src="myValue" fit="cover"></el-image>
      <div class="operate">
        <i class="el-icon-view" @click="showImgView"></i>
        <i v-if="!attrs.disabled" class="el-icon-delete" @click.stop="deleteImg"></i>
      </div>
    </div>
    <i v-else v-loading="startLoading" element-loading-spinner="el-icon-loading" class="el-icon-plus avatar-uploader-icon"></i>
    <div v-if="!attrs.disabled" slot="tip" class="el-upload__tip">
      {{ attrs.tipText || '请上传.png,.jpg,.jpeg,.gif,.svg格式文件，且不超过20M' }}
    </div>
  </el-upload>
</template>
<script>
import { beforeUpload, fnUploadRequest } from './upload'
import emitter from 'element-ui/src/mixins/emitter'

export default {
  name: 'ImImgUpload',
  mixins: [emitter],
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
      startLoading: false,
      myValue: ''
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

    showImgView() {
      this.$viewerApi({
        options: {
          navbar: false
        },
        images: [this.myValue]
      })
    },

    deleteImg() {
      this.handleRemove()
    },

    setMyValue() {
      this.myValue = this.value
    },

    handleRemove() {
      this.myValue = ''
      this.onUpdate()
    },

    // 图片上传成功回调
    handleSuccess(res) {
      this.startLoading = false
      if (res) {
        this.myValue = res.url
        this.onUpdate()
      }
    },

    // 上传失败
    handleError() {
      this.startLoading = false
    },

    onUpdate() {
      this.$emit('input', this.myValue)
      this.dispatch('ElFormItem', 'el.form.change', this.myValue)
    },

    onBeforeUpload(file) {
      return beforeUpload(file, this.attrs.maxSize)
    },

    doFnUploadRequest(options) {
      this.startLoading = true
      // 增加一分钟超时逻辑，防止因为某些原因导致上传失败，但是loading一直存在
      setTimeout(() => {
        if (this.startLoading) {
          this.startLoading = false
        }
      }, 60000)
      fnUploadRequest(options)
    }
  }
}
</script>

<style lang="scss" scoped>
.imageHolder {
  position: relative;
  width: 100%;
  height: 100%;

  .operate {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    opacity: 0;
    transition: all 0.2s;

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
