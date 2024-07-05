<template>
  <el-upload action class="videoUpload" accept=".mp4,.ogg,.flv,.avi,.wmv,.rmvb" :show-file-list="false" :http-request="fnUploadRequest" :before-upload="beforeUpload">
    <el-button v-if="videoUploadPercent === 0" size="small" type="primary">点击上传</el-button>
    <el-button v-if="videoUploadPercent > 0" size="small" type="primary" @click.stop="cancelUpload">取消上传</el-button>
    <div class="list-area">
      <div v-if="myValue" @click.stop="stopClick">
        {{ myValue }}
        <el-popconfirm class="customPopConfirm" icon="el-icon-warning" icon-color="#f56c6c" title="确定要删除当前资源吗? " @confirm="deleteItem">
          <el-button slot="reference" style="color: #f56c6c; font-size: 14px;" type="text" icon="el-icon-delete"></el-button>
        </el-popconfirm>
      </div>
      <el-progress v-if="videoUploadPercent > 0" :percentage="videoUploadPercent" :colors="colors"></el-progress>
    </div>
    <div slot="tip" class="el-upload__tip">请上传不超过3GB的文件</div>
  </el-upload>
</template>
<script>
import { findAliVideoToken } from '@/api/common'
import emitter from 'element-ui/src/mixins/emitter'
export default {
  name: 'ImVideoUpload',
  mixins: [emitter],
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      myValue: '',
      uploader: null,
      videoUploadPercent: 0,
      colors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ]
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
    if (!this.uploader) {
      this.initUploader()
    }
  },
  methods: {
    stopClick() {
      return false
    },

    deleteItem() {
      this.myValue = ''
      this.onUpdate()
    },

    cancelUpload() {
      if (this.uploader) {
        this.uploader.cleanList()
        this.uploader.cancelFile(this.uploader._curIndex)
      }
    },

    customColorMethod(percentage) {
      if (percentage < 30) {
        return '#909399'
      } else if (percentage < 70) {
        return '#e6a23c'
      } else {
        return '#67c23a'
      }
    },

    setMyValue() {
      this.myValue = this.value
    },

    onUpdate() {
      this.$emit('input', this.myValue)
      this.dispatch('ElFormItem', 'el.form.change', this.myValue)
    },

    beforeUpload(file) {
      if (file) {
        if (file.size > 3 * 1024 * 1024 * 1024) {
          this.$message.error('上传文件大小不能超过3GB!')
          return false
        }
        this.uploader.addFile(file, null, null, null, '{"Vod":{}}')
        return true
      } else {
        return false
      }
    },

    fnUploadRequest() {
      this.uploader.startUpload()
    },

    async initUploader() {
      const self = this
      const res = await findAliVideoToken()
      const resData = res.data
      this.uploader = new AliyunUpload.Vod({
        timeout: 60000,
        // 断点续传相关功能
        partSize: 1048576,
        parallel: 5,
        retryCount: 3,
        retryDuration: 2,
        region: resData.region,
        userId: resData.userId,
        // // 添加文件成功
        // addFileSuccess(uploadInfo) {
        //   findAliVideoToken().then(res => {
        //     const resData = res.data
        //     const accessKeyId = resData.accessKeyId
        //     const accessKeySecret = resData.accessKeySecret
        //     const secretToken = resData.securityToken
        //     self.uploader.resumeUploadWithSTSToken(accessKeyId, accessKeySecret, secretToken)
        //   })
        // },
        // 开始上传
        onUploadstarted(uploadInfo) {
          // 如果是 STSToken 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
          // 用户需要自己获取 accessKeyId, accessKeySecret,secretToken
          // 下面的 URL 只是测试接口, 用于获取 测试的 accessKeyId, accessKeySecret,secretToken
          const accessKeyId = resData.accessKeyId
          const accessKeySecret = resData.accessKeySecret
          const secretToken = resData.securityToken
          self.uploader.setSTSToken(uploadInfo, accessKeyId, accessKeySecret, secretToken)
        },
        // 文件上传成功
        onUploadSucceed(uploadInfo) {
          self.myValue = uploadInfo.videoId
          self.videoUploadPercent = 0
          self.onUpdate()
        },
        // 文件上传失败
        onUploadFailed(uploadInfo, code, message) {
          self.videoUploadPercent = 0
        },
        // 取消文件上传
        onUploadCanceled(uploadInfo, code, message) {
          self.videoUploadPercent = 0
          console.log('Canceled file: ' + uploadInfo.file.name + ', code: ' + code + ', message:' + message)
        },
        // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
        onUploadProgress(uploadInfo, totalSize, progress) {
          const progressPercent = Math.ceil(progress * 100)
          self.videoUploadPercent = progressPercent
        },
        // 上传凭证超时
        onUploadTokenExpired(uploadInfo) {
          // 如果是上传方式二即根据 STSToken 实现时，从新获取STS临时账号用于恢复上传
          // 上传文件过大时可能在上传过程中 sts token 就会失效, 所以需要在 token 过期的回调中调用 resumeUploadWithSTSToken 方法
          // 这里是测试接口, 所以我直接获取了 STSToken
          findAliVideoToken().then((res) => {
            const resData = res.data
            const accessKeyId = resData.accessKeyId
            const accessKeySecret = resData.accessKeySecret
            const secretToken = resData.securityToken
            self.uploader.resumeUploadWithSTSToken(accessKeyId, accessKeySecret, secretToken)
          })
        }
        // // 全部文件上传结束
        // onUploadEnd(uploadInfo) {
        //   console.log('uploadInfo', uploadInfo)
        // }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.videoUpload {
  /deep/ .el-upload--text {
    text-align: left;
  }

  .list-area {
    width: 340px;
  }
}
</style>
