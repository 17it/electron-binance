<template>
  <span>
    <template v-for="slot in slots">
      <slot :name="slot" />
    </template>
  </span>
</template>

<script>
export default {
  name: 'ImSlot',
  props: {
    slots: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
