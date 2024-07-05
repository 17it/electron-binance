<template>
  <component
    :is="item.type"
    v-bind="item.attrs"
    v-model="form.props[item.prop]"
    :attrs="item.attrs"
    :listeners="item.listeners"
    :slots="item.slots"
    :label="item.label"
    v-on="item.listeners"
  >
    <template v-for="value in item.slots" :slot="value">
      <slot :name="value" />
    </template>
    <!-- 删除可能无用代码 -->
    <!-- <template v-for="(value, key) in item.slots" :slot="key">
      <slot :name="value" />
    </template> -->
  </component>
</template>
<script>
import components from './components/index.js'

export default {
  name: 'FormComponents',
  components: components,
  props: {
    form: {
      type: Object,
      default() {
        return {}
      }
    },
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
