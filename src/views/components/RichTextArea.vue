<template>
  <div class="__RichTextArea" style="border: 1px solid #ccc">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :default-config="toolbarConfig" :mode="mode" />
    <Editor v-model="myValue" :style="{ height: height + 'px' }" :default-config="editorConfig" :mode="mode" @onChange="onChange" @onCreated="onCreated" />
  </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { findAliToken } from '@/api/fileupload'
import emitter from 'element-ui/src/mixins/emitter'
const OSS = require('ali-oss')

export default {
  name: 'RichTextArea',
  components: {
    Editor,
    Toolbar
  },
  mixins: [emitter],
  props: {
    value: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      editor: null,
      myValue: undefined,
      toolbarConfig: {
        excludeKeys: ['fullScreen']
      },
      editorConfig: {
        placeholder: '',
        MENU_CONF: {
          uploadImage: {
            server: '/', // 上传图片地址
            timeout: 5 * 1000, // 5s
            maxFileSize: 10 * 1024 * 1024, // 10M
            base64LimitSize: 5 * 1024, // 5kb 以下插入 base64
            // // 用户自定义上传图片
            customUpload: this.customUpload
          },
          uploadVideo: {
            server: '/', // 上传图片地址
            timeout: 5 * 1000, // 5s
            maxFileSize: 1024 * 1024 * 1024, // 1G
            // // 用户自定义上传图片
            customUpload: this.customUpload
          },
          color: {
            colors: [
              '#000000', '#262626', '#595959', '#8C8C8C', '#BFBFBF', '#D9D9D9', '#E9E9E9', '#F5F5F5', '#FAFAFA', '#ffffff',
              '#E13C39', '#E75F33', '#FF8616', '#F5DB4D', '#72C040', '#59BFC0', '#4290F7', '#005DBE', '#6A39C9', '#D84493',
              '#FBE9E6', '#FCEDE1', '#FCEFD4', '#FCFBCF', '#E7F6D5', '#DAF4F0', '#D9EDFA', '#E0E8FA', '#EDE1F8', '#F6E2EA',
              '#FFA39E', '#FFBB96', '#FFD591', '#FFFB8F', '#B7EB8F', '#87E8DE', '#91D5FF', '#ADC6FF', '#D3ADF7', '#FFADD2',
              '#FF4D4F', '#FF7A45', '#FFA940', '#FFEC3D', '#73D13D', '#36CFC9', '#40A9FF', '#597EF7', '#9254DE', '#F759AB',
              '#CF1322', '#D4380D', '#D46B08', '#D4B106', '#389E0D', '#089B9C', '#096DD9', '#1D39C4', '#531DAB', '#C41D7F',
              '#820014', '#871400', '#873800', '#614700', '#135200', '#00474F', '#003A8C', '#061178', '#22075E', '#780650'
            ]
          }
        }
      },
      mode: 'default' // 'simple' or 'default'
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
    customUpload(file, insertFn) {
      return new Promise((resolve) => {
        findAliToken().then(res => {
          const resData = res.data
          const client = new OSS({
            accessKeyId: resData.accessKeyId, // 查看你自己的阿里云KEY
            accessKeySecret: resData.accessKeySecret, // 查看自己的阿里云KEYSECRET
            stsToken: resData.securityToken,
            bucket: resData.bucket, // 你的 OSS bucket 名称
            region: 'oss-cn-beijing', // bucket 所在地址，我的是 华北2 北京
            endpoint: 'oss-cn-beijing.aliyuncs.com' // 自己的域名
          })

          const fileName = file.name // .substr(0, file.name.lastIndexOf('.'))
          if (encodeURIComponent(fileName).length > 300) {
            this.$message.warning('文件名称长度太长可能导致错误,请重新命名!')
          }
          const date = new Date().getTime()
          const fileNames = `${date}/${fileName}` // 拼接文件名，保证唯一，这里使用时间戳+原文件名

          // 上传文件,这里是上传到OSS的 uploads文件夹下
          client.put('pcUploads/' + fileNames, file).then(res => {
            if (res.res.statusCode === 200) {
              res.url = res.url.replace('http://imeikud.oss-cn-beijing.aliyuncs.com', process.env.VUE_APP_CDN_DOMAIN)
              res.url = res.url.replace('https://imeikud.oss-cn-beijing.aliyuncs.com', process.env.VUE_APP_CDN_DOMAIN)
              const url = res.url
              insertFn(url, 'url', url)
              resolve('ok')
            } else {
              console.log('上传失败')
            }
          })
        })
      })
    },
    onCreated(editor) {
      // 一定要用 Object.seal() ，否则会报错
      this.editor = Object.seal(editor)
    },
    onChange() {
      // 该组件有个bug: 初始化的时候会自动把myValue赋值'<p><br></p>'
      // 所以这里加个判断，不然会导致新增表单时，非空校验不准
      if (this.myValue === '<p><br></p>') {
        this.myValue = ''
      }
      this.$emit('input', this.myValue)
      this.dispatch('ElFormItem', 'el.form.change', this.myValue)
    },
    beforeDestroy() {
      const editor = this.editor
      if (editor == null) return
      editor.destroy()
    }
  }
}
</script>
<style lang="scss" scoped>
.__RichTextArea {
  /deep/ .w-e-text-container {
    //标题
    h1 {
      margin: 0.67em 0;
      font-size: 2em;
    }

    h2 {
      margin: 0.75em 0;
      font-size: 1.5em;
    }

    h3 {
      margin: 0.83em 0;
      font-size: 1.17em;
    }

    h4 {
      margin: 1.12em 0;
    }

    h5 {
      margin: 1.5em 0;
      font-size: 0.83em;
    }

    h6 {
      margin: 1.67em 0;
      font-size: 0.75em;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    b,
    strong {
      font-weight: bolder;
    }

    ul,
    ul li {
      list-style-position: inside;
      list-style-type: disc;
    }

    ol,
    ol li {
      list-style-position: inside;
      list-style-type: decimal;
    }

    em {
      font-style: italic;
    }
  }
}
</style>
