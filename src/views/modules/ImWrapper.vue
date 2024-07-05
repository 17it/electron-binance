<template>
  <div v-loading="loading" class="p-4 pb-0">
    <div class="-m-4 mb-4">
      <slot name="header"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ImWrapper',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>
