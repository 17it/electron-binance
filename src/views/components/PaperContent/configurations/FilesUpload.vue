<template>
  <div>
    <p class="header-wrap" style="margin-bottom: 8px">
      上传文件
    </p>
    <div class="file-upload-show">
      <div class="file-upload-wrap">
        <el-upload
          ref="upload"
          class="upload-demo"
          action
          :multiple="true"
          :limit="10"
          :file-list="fileListNew"
          :show-file-list="false"
          :http-request="fnUploadRequest"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-remove="handleRemove"
          :before-upload="onBeforeUpload"
          :on-exceed="onExceed"
        >
          <el-button :class="['upload-btn']" size="small" type="primary">
            <img class="icon-upload" src="https://udstatic.imeik.com/pcUploads/1704856625294/shangchuan%402x.png" />
            点击上传附件，限制每个500M以内
          </el-button>
        </el-upload>
        <div class="file-list">
          <div v-for="(item, index) in fileList" :key="index" class="file-item">
            <img class="icon-link" src="https://udstatic.imeik.com/pcUploads/1704857467592/%E9%99%84%E4%BB%B6%402x.png" />
            <span class="file-text">{{ item.name }}</span>
            <img class="icon-success" :src="iconPic" @click="deleteFile(index)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { beforeUpload, fnUploadRequest } from '../components/upload/upload'
export default {
  props: {
    question: {
      type: Object,
      default() {
        return {
          subject: ''
        }
      }
    }
  },
  data() {
    return {
      iconPic: 'https://udstatic.imeik.com/pcUploads/1712053287718/delete%402x.png',
      fileList: []
    }
  },
  computed: {
    fileListNew() {
      return JSON.parse(JSON.stringify(this.fileList))
    }
  },
  watch: {
    'question.extend.fileList': {
      immediate: true,
      handler() {
        this.setFileList()
      }
    }
  },
  methods: {
    setFileList() {
      if (this.question.extend && this.question.extend.fileList) {
        this.fileList = this?.question?.extend?.fileList || []
        if (!this.fileList.length) {
          this.$nextTick(() => {
            this.$refs.upload.clearFiles()
          })
        }
      } else {
        this.fileList = []
      }
    },
    fnUploadRequest,

    onBeforeUpload(file) {
      // 上传文件限制2GB
      return beforeUpload(file, 500)
    },

    handleRemove(file, fileList) {
    },

    deleteFile(index) {
      if (this.fileList.length > 0) {
        const file = this.fileList[index]
        this.$refs.upload.handleRemove(file)
      }
      this.fileList.splice(index, 1)
      this.onUpdate()
    },

    // 上传成功回调
    handleSuccess(res, file, fileList) {
      console.log('res', res, file, fileList)
      if (this.hasAllUpload(fileList)) {
        fileList.forEach((item) => {
          if (item.raw) {
            this.fileList.push({
              name: item.name,
              url: item.url
            })
          }
        })
        this.onUpdate()
      }
    },
    hasAllUpload(fileList) {
      let valid = true
      fileList.forEach((item) => {
        if (item.raw && !item.response) {
          valid = false
        }
      })
      console.log('valid', valid)
      return valid
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

    onExceed(file, fileList) {
      this.$message.warning('超出上传个数')
    },

    onUpdate() {
      console.log('fileList', this.fileList)
      this.$set(this.question.extend, 'fileList', JSON.parse(JSON.stringify(this.fileList)))
    }
  }
}
</script>

<style lang="scss" scoped>
.file-upload-show {
  width: 100%;
  .file-upload-wrap {
    margin-top: 10px;
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
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .icon-success {
        width: 20px;
        height: 20px;
        margin-left: 9px;
      }
    }
  }
}
</style>
