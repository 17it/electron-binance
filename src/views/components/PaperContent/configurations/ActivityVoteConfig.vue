<template>
  <div class="activity">
    <div class="activityItem">
      <span style="margin-bottom: 10px;">关联活动及阶段</span>
      <el-cascader v-model="myValue" :props="cascaderProps" :options="options" @change="handleChange"></el-cascader>
    </div>
  </div>
</template>

<script>
import { getActivityList } from '@/api/activity'
export default {
  components: {},
  props: {
    question: {
      type: Object,
      default() {
        return {
          extend: '{}'
        }
      }
    }
  },
  data() {
    return {
      myValue: undefined,
      options: [],
      cascaderProps: {
        value: 'objectCode',
        label: 'stageName',
        children: 'activityStageList'
      }
    }
  },
  watch: {
    'question.extend': {
      immediate: true,
      handler() {
        this.setMyValue()
        this.getOptions()
      }
    }
  },
  methods: {
    setMyValue() {
      try {
        this.myValue = JSON.parse(this.question.extend.activityStage)
      } catch (error) {
        this.myValue = {}
      }
    },

    getOptions() {
      getActivityList().then((res) => {
        console.log('res', res)
        if (res.code === 200) {
          this.options = res.data && res.data.length
            ? res.data.map((item) => {
              return {
                ...item,
                stageName: item.name
              }
            })
            : []
        }
      })
    },

    handleChange(val) {
      console.log('val', val)
    },

    onUpdate() {
      this.$set(this.question, 'extend', JSON.stringify(this.myValue))
    }
  }
}
</script>
<style lang="scss" scoped>
.activity {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .activityItem {
    display: flex;
    flex-direction: column;
  }
}
</style>
