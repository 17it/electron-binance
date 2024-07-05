<template>
  <div>
    <el-upload
      action
      v-bind="attrs"
      :show-file-list="false"
      :accept="attrs.accept || '.png,.jpg,.jpeg,.gif,.svg'"
      list-type="picture-card"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      v-on="listeners"
    >
      <div v-if="myValue" class="imageHolder" @click.stop="stopClick">
        <el-image style="width: 146px; height: 146px" :src="myValue" fit="cover"></el-image>
        <div class="operate">
          <i class="el-icon-view" @click="showImgView"></i>
          <i class="el-icon-delete" @click="deleteImg"></i>
        </div>
      </div>
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <div slot="tip" class="el-upload__tip">{{ attrs.tip || '请上传.png,.jpg,.jpeg,.gif,.svg格式文件，且不超过20M' }}</div>
    </el-upload>

    <!-- 图片裁剪-->
    <el-dialog :visible.sync="rotateModalShow" width="453px" title="图片裁剪" append-to-body>
      <div style="position: relative;">
        <vue-cropper
          ref="cropperimage"
          style="width: 420px;height: 360px;"
          mode="contain"
          :img="fileBlob"
          :output-size="option.size"
          :output-type="option.outputType"
          :info="true"
          :full="option.full"
          :fixed="option.fixed"
          :fixed-number="option.fixedNumber"
          :can-move="option.canMove"
          :can-move-box="option.canMoveBox"
          :fixed-box="option.fixedBox"
          :original="option.original"
          :auto-crop="option.autoCrop"
          :auto-crop-width="option.autoCropWidth"
          :auto-crop-height="option.autoCropHeight"
          :center-box="option.centerBox"
          :high="option.high"
          :max-img-size="option.max"
        ></vue-cropper>
        <img style="position: absolute;top:7px;left: 4px;width: 35px;height: 35px;" src="@/assets/icons/northpath.svg" alt="">
        <div class="rotateBtnCon">
          <img style="cursor: pointer;" width="15px" height="15px" src="@/assets/icons/rotate.svg" alt="" @click="rotateImage">
          <a style="padding-left: 1px;font-size: 12px;color: #fff;" @click="rotateImage">旋转90°</a>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rotateModalShow = false">取消</el-button>
        <el-button type="primary" @click="cropImage">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import emitter from 'element-ui/src/mixins/emitter'
import { fnUploadRequest } from './upload'
import { VueCropper } from 'vue-cropper'

export default {
  name: 'ImCropImgUpload',
  components: { VueCropper },
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
      myValue: '',
      rotateModalShow: false,
      fileBlob: null,
      tmpFile: null,
      option: {
        size: 1,
        full: true, // 是否输出原图比例的截图
        outputType: 'png', // 裁剪生成图片的格式
        canMove: true, // 上传图片是否可以移动
        fixedBox: false, // 固定截图框大小 不允许改变
        original: false, // 上传图片按照原始比例渲染
        canMoveBox: true, // 截图框能否拖动
        autoCrop: true, // 是否默认生成截图框
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [16, 9], // 截图框的宽高比例
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 160, // 默认生成截图框宽度
        autoCropHeight: 90, // 默认生成截图框高度
        centerBox: true, // 截图框是否被限制在图片里面
        high: true, // 是否按照设备的 dpr 输出等比例图片
        max: 99999
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
  created() {
    if (this.attrs.option) {
      Object.assign(this.option, this.attrs.option)
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

    beforeUpload(file, maxSize = 5) {
      if (file.size > maxSize * 1024 * 1024) {
        this.$message.error(`上传文件大小不能超过 ${maxSize}MB!`)
        return false
      }

      this.tmpFile = file
      const reader = new FileReader()
      reader.onload = (e) => {
        this.fileBlob = e.target.result
        this.rotateModalShow = true
      }
      reader.readAsDataURL(file)
      return false
    },

    // 裁剪完成
    cropImage() {
      const that = this
      this.$refs.cropperimage.getCropBlob((blobData) => {
        blobData.uid = that.tmpFile.uid
        blobData.name = that.tmpFile.name
        blobData.lastModified = that.tmpFile.lastModified
        blobData.lastModifiedDate = that.tmpFile.lastModifiedDate
        that.tmpFile = null
        fnUploadRequest({
          file: blobData,
          onSuccess: that.handleSuccess
        })
      })
    },

    // 旋转图片
    rotateImage() {
      this.$refs.cropperimage.rotateRight()
    },

    // 图片上传成功回调
    handleSuccess(res) {
      if (res) {
        this.rotateModalShow = false
        this.myValue = res.url
        this.onUpdate()
      }
    },

    onUpdate() {
      this.$emit('input', this.myValue)
      this.dispatch('ElFormItem', 'el.form.change', this.myValue)
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
      padding: 4px;
      color: white;
      font-size: 24px;
    }
  }

  &:hover {
    .operate {
      display: block;
      background: rgba(0, 0, 0, 0.5);
      opacity: 1;
    }
  }
}

.rotateBtnCon {
  position: absolute;
  bottom: 1px;
  right: 6px;
  width: 75px;
  height: 23px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
