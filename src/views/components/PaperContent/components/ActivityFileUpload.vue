<template>
  <div class="file-upload-show">
    <div v-if="extendInfo.showClassifyDesc === '1'" class="select-decs-wrap">
      <div>{{ extendInfo.classifyDesc }}</div>
    </div>
    <div v-if="extendInfo.showOptions === '1'" class="select-wrap">
      <el-select v-model="myValue" placeholder="请选择分类" class="w-full" @change="onSelectChange">
        <el-option v-for="item in extendInfo.optionsForm" :key="item.label" :label="item.label" :value="item.label">
        </el-option>
      </el-select>
    </div>
    <div class="file-upload-wrap">
      <el-upload
        class="upload-demo"
        action
        v-bind="params"
        :multiple="multiple"
        :limit="extendInfo.limit"
        :show-file-list="false"
        :http-request="fnUploadRequest"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-remove="handleRemove"
        :before-upload="onBeforeUpload"
      >
        <el-button :class="['upload-btn']" size="small" type="primary">
          <img class="icon-upload" src="https://udstatic.imeik.com/pcUploads/1704856625294/shangchuan%402x.png" />
          {{ `点击上传附件，限制每个${extendInfo.fileSize}M以内` }}
        </el-button>
      </el-upload>
      <div class="file-list">
        <div v-for="(item, index) in fileList" :key="index" class="file-item">
          <img class="icon-link" src="https://udstatic.imeik.com/pcUploads/1704857467592/%E9%99%84%E4%BB%B6%402x.png" />
          <a class="file-text" @click="onFileClick(item)">{{ item.name }}</a>
          <img class="icon-success" :src="iconPic" @click="deleteFile(index)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { beforeUpload, fnUploadRequest } from './upload/upload'
export default {
  name: 'QuestionFile',
  props: {
    extend: {
      type: [String, Object],
      default: undefined
    },
    // 是否为详情页
    isDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      iconPic: 'https://udstatic.imeik.com/pcUploads/1712053287718/delete%402x.png',
      myValue: undefined,
      fileList: [],
      extendInfo: {},
      params: {}
    }
  },
  computed: {
    multiple() {
      return !!(this.extendInfo.limit && this.extendInfo.limit > 1)
    },
    disabled() {
      if (this.extendInfo.showOptions === '1' && !this.myValue) {
        return true
      }
      return false
    }
  },
  watch: {
    extend: {
      deep: true,
      immediate: true,
      handler(val) {
        if (this.isDetail) {
          this.extendInfo = JSON.parse(val)
          if (this.extendInfo && this.extendInfo.fileAccept) {
            this.params.accept = this.extendInfo.fileAccept
          }
        } else {
          this.extendInfo = val
          if (this.extendInfo && this.extendInfo.fileAccept) {
            this.params.accept = this.extendInfo.fileAccept
          }
        }
      }
    }
  },
  methods: {
    fnUploadRequest,

    onBeforeUpload(file) {
      // 上传文件限制2GB
      return beforeUpload(file, this.extendInfo.fileSize || 2048)
    },

    onSelectChange(val) {
      this.onUpdate()
    },

    handleRemove(file, fileList) {
      this.fileList = JSON.parse(JSON.stringify(fileList))
      this.onUpdate()
    },

    deleteFile(index) {
      this.fileList.splice(index, 1)
    },

    // 上传成功回调
    handleSuccess(res) {
      console.log('res', res)
      if (res) {
        if (this.multiple) {
          this.fileList.push(res)
        } else {
          this.fileList = [res]
        }
        this.onUpdate()
      }
    },
    // 上传失败
    handleError(res, file, fileList) {
      if (res.message) {
        this.$message.error(res.message)
      }
      this.loading = false
      this.fileList = JSON.parse(JSON.stringify(fileList))
      this.onUpdate()
      console.log('error', res, file, fileList)
    },

    onUpdate() {
      this.$emit('input', this.fileList, this.myValue)
    }
  }
}
</script>
<style lang="scss" scoped>
.file-upload-show {
  max-width: 473px;
  .select-decs-wrap {
    width: 100%;
    margin-bottom: 10px;
  }
  .select-wrap {
    width: 100%;
    height: 40px;
    margin-bottom: 20px;
    /deep/ .el-input__inner {
      height: 40px;
      font-size: 14px;
      line-height: 40px;
    }
  }
  .file-upload-wrap {
    .upload-demo {
      width: 100%;
      /deep/ .el-upload {
        width: 100%;
        .upload-btn {
          width: 100%;
          height: 60px;
          background: #005DBE;
          border-radius: 6px;
          font-size: 14px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #FFFFFF;
          .icon-upload {
            width: 23px;
            height: 16px;
            margin-right: 10px;
          }
        }
        .disabled-btn {
          opacity: 0.6;
        }
      }
    }
  }
  .file-list {
    margin-top: 18px;
    width: 100%;
    display: flex;
    flex-direction: column;
    .file-item {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 7px;
      box-sizing: border-box;
      .icon-link {
        width: 14px;
        height: 14px;
        margin-right: 9px;
      }
      .file-text {
        flex: 1;
        height: 21px;
        font-size: 15px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #005DBE;
        line-height: 21px;
        text-decoration: underline;
      }
      .icon-success {
        width: 20px;
        height: 20px;
        margin-left: 9px;
      }
      .file-item:hover {
        .icon-success {
          content: url('https://udstatic.imeik.com/pcUploads/1704857467592/%E9%99%84%E4%BB%B6%402x.png');
        }
      }
    }
  }
}
</style>
