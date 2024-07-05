/**
 * 通用表单项： 10富文本
 * 业务表单项：（科研活动：12文件上传 13多行文本框）
 * 问卷表单项：14单行文本 15多行文本 16单项选择 17多项选择 18文件上传
 * 图文表单项：19文件上传展示
 * */
export const questions = {
  10: {
    formCategory: 'General', // 表单类型-通用表单项
    type: 'QuestionDescription',
    icon: 'question-icon-description',
    title: '富文本编辑器',
    defaultConfig: {
      type: '10',
      isMustAnswer: '2', // 本题是否必答（1：是，2：否）
      subject: '富文本编辑器', // 题目
      extend: { subjectType: 'richTextArea' },
      configs: ['SubjectEditor']
    }
  },
  12: {
    formCategory: 'Activity', // 表单类型-业务表单项-科研活动
    type: 'ActivityFileUpload',
    icon: 'question-icon-file',
    title: '科研活动文件上传',
    defaultConfig: {
      type: '12',
      isMustAnswer: '2', // 本题是否必答（1：是，2：否）
      subject: '科研活动文件上传', // 题目
      subjectLimit: 22,
      extend: {
        subjectType: 'input',
        classifyDesc: '分类说明',
        showClassifyDesc: '1', // 是否展示分类说明
        showOptions: '1', // 是否展示分类选项
        optionsForm: [], // 分类选项设置
        fileAccept: '.pdf', // 文件上传格式
        fileSize: 500, // 上传大小限制
        limit: 1 // 上传个数
      },
      configs: ['SubjectEditor', 'ClassifyOption', 'FilesConfig']
    }
  },
  13: {
    formCategory: 'Activity', // 表单类型-业务表单项-科研活动
    type: 'ActivityText',
    icon: 'question-icon-description',
    title: '科研活动多行文本框',
    defaultConfig: {
      type: '13',
      isMustAnswer: '2', // 本题是否必答（1：是，2：否）
      subject: '科研活动多行文本框', // 题目
      subjectLimit: 22,
      extend: {
        subjectType: 'input',
        classifyDesc: '分类说明',
        showClassifyDesc: '1', // 是否展示分类说明
        showOptions: '1', // 是否展示分类选项
        optionsForm: [], // 分类选项设置
        showTitle: '1', // 是否展示表单标题
        textSize: 500 // 文本字数限制
      },
      configs: ['SubjectEditor', 'ClassifyOption', 'TextConfig']
    }
  },
  14: {
    formCategory: 'Questionnaire', // 表单类型-问卷表单项
    type: 'QuestionInput',
    icon: 'question-icon-description',
    title: '单行文本',
    defaultConfig: {
      type: '14',
      isMustAnswer: '2', // 本题是否必答（1：是，2：否）
      subject: '单行文本', // 题目
      extend: {
        inputType: 'text',
        subjectLimit: 64, // 表单描述字数限制
        subjectType: 'text', // 表单描述格式 text文本 richTextArea富文本
        stemInfo: '题干说明',
        stemInfoLimit: 500, // 题干说明字数限制
        stemInfoType: 'text', // 题干说明格式 text文本 richTextArea富文本
        showStemInfo: '1', // 是否展示题干 1展示 2不展示
        minLimit: 1,
        maxLimit: 100,
        mixText: '最少填写字数',
        maxText: '最多填写字数',
        limitText: '字',
        formatType: ''
      },
      configs: ['DescribeEditor', 'RequrementItem', 'OptionsSetting']
    }
  },
  15: {
    formCategory: 'Questionnaire', // 表单类型-问卷表单项
    type: 'QuestionInput',
    icon: 'question-icon-description',
    title: '多行文本',
    defaultConfig: {
      type: '15',
      isMustAnswer: '2', // 本题是否必答（1：是，2：否）
      subject: '多行文本', // 题目
      extend: {
        inputType: 'textarea',
        subjectLimit: 64, // 表单描述字数限制
        subjectType: 'text', // 表单描述格式 text文本 richTextArea富文本
        stemInfo: '题干说明',
        stemInfoLimit: 500, // 题干说明字数限制
        stemInfoType: 'text', // 题干说明格式 text文本 richTextArea富文本
        showStemInfo: '1', // 是否展示题干 1展示 2不展示
        minLimit: 1,
        maxLimit: 100,
        mixText: '最少填写字数',
        maxText: '最多填写字数',
        limitText: '字',
        formatType: ''
      },
      configs: ['DescribeEditor', 'RequrementItem', 'OptionsSetting']
    }
  },
  16: {
    formCategory: 'Questionnaire', // 表单类型-问卷表单项
    type: 'QuestionRadiobox',
    icon: 'question-icon-radio',
    title: '单项选择',
    defaultConfig: {
      type: '16',
      isMustAnswer: '2', // 本题是否必答（1：是，2：否）
      subject: '单项选择', // 题目
      extend: {
        subjectLimit: 64, // 表单描述字数限制
        subjectType: 'text', // 表单描述格式 text文本 richTextArea富文本
        stemInfo: '题干说明',
        stemInfoLimit: 500, // 题干说明字数限制
        stemInfoType: 'text', // 题干说明格式 text文本 richTextArea富文本
        showStemInfo: '1', // 是否展示题干 1展示 2不展示
        options: [{
          content: '选项1',
          optionsConfig: []
        }, {
          content: '选项2',
          optionsConfig: []
        }] // 选项
      },
      configs: ['DescribeEditor', 'RequrementItem', 'Options']
    }
  },
  17: {
    formCategory: 'Questionnaire', // 表单类型-问卷表单项
    type: 'QuestionCheckbox',
    icon: 'question-icon-checkbox',
    title: '多项选择',
    defaultConfig: {
      type: '17',
      isMustAnswer: '2', // 本题是否必答（1：是，2：否）
      subject: '多项选择', // 表单描述
      extend: {
        subjectLimit: 64, // 表单描述字数限制
        subjectType: 'text', // 表单描述格式 text文本 richTextArea富文本
        stemInfo: '题干说明',
        stemInfoLimit: 500, // 题干说明字数限制
        stemInfoType: 'text', // 题干说明格式 text文本 richTextArea富文本
        showStemInfo: '1', // 是否展示题干 1展示 2不展示
        options: [{
          content: '选项1',
          optionsConfig: []
        }, {
          content: '选项2',
          optionsConfig: []
        }], // 选项
        minLimit: 1,
        maxLimit: 2,
        mixText: '最少选择个数',
        maxText: '最多选择个数',
        limitText: '个'
      },
      configs: ['DescribeEditor', 'RequrementItem', 'Options', 'OptionsSetting']
    }
  },
  18: {
    formCategory: 'Questionnaire', // 表单类型-问卷表单项
    type: 'QuestionFile',
    icon: 'question-icon-file',
    title: '文件上传',
    defaultConfig: {
      type: '18',
      isMustAnswer: '2', // 本题是否必答（1：是，2：否）
      subject: '文件上传', // 题目
      extend: {
        subjectLimit: 64, // 表单描述字数限制
        subjectType: 'text', // 表单描述格式 text文本 richTextArea富文本
        stemInfo: '题干说明',
        stemInfoLimit: 500, // 题干说明字数限制
        stemInfoType: 'text', // 题干说明格式 text文本 richTextArea富文本
        showStemInfo: '1', // 是否展示题干 1展示 2不展示
        fileAccept: ['.pdf'], // 文件上传格式
        fileSize: 500, // 上传大小限制
        limit: 1, // 上传个数
        limitDisabled: false,
        fileType: 'multiple'
      },
      configs: ['DescribeEditor', 'RequrementItem', 'FilesConfig']
    }
  },
  19: {
    formCategory: 'ImageText', // 表单类型-图文发布-文件上传
    type: 'FileUploadShow',
    icon: 'question-icon-file',
    title: '文件上传展示',
    defaultConfig: {
      type: '19',
      isMustAnswer: '2', // 本题是否必答（1：是，2：否）
      subject: '文件上传展示', // 题目
      subjectLimit: 22,
      extend: {
        fileList: [] // 上传文件
      },
      configs: ['SubjectEditor', 'FilesUpload']
    }
  }
}
