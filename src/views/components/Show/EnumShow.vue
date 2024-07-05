<template>
  <span>{{ enumLabel }}</span>
</template>
<script>
import { mapGetters } from 'vuex'
import utils from '@/utils/utils'
export default {
  name: 'EnumShow',
  props: {
    enumKey: {
      required: true,
      type: String,
      default: ''
    },
    enumValue: {
      required: true,
      type: [String, Array, Number],
      default: ''
    }
  },
  computed: {
    ...mapGetters(['enums']),
    enumLabel() {
      if (!this.enumValue) {
        return '-'
      }
      if (Array.isArray(this.enumValue)) {
        const lables = []
        for (let i = 0; i < this.enumValue.length; i++) {
          const value = this.enumValue[i]
          const label = this.getLabelByValue(this.enumKey, value)
          lables.push(label)
        }
        return lables.join(',') || '-'
      } else {
        return this.getLabelByValue(this.enumKey, this.enumValue)
      }
    }
  },
  methods: {
    getLabelByValue(key, value) {
      const item = utils.getOptionsItemByValue(key, value)
      return item.label || '-'
    }
  }
}
</script>
