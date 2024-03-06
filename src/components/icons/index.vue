<!-- YourVueComponent.vue -->
<template>
  <div
    :class="class"
    :style="{
      WebkitMaskImage: 'url(' + getImgUrl(item) + ')',
      height: size + 'px',
      width: size + 'px',
      'mask-size': 'contain',
      'mask-repeat': 'no-repeat',
      'mask-position': 'center',
    }"
  />
</template>

<script>
export default {
  props: {
    item: {
      type: String,
    },
    size: {
      type: Number,
    },
    class: {
      type: String,
    },
  },

  methods: {
    getImgUrl(title) {
      return 'assets/images/' + title + '.svg';
    },
  },
};
</script>

<style scoped>
/* Define your mask CSS class here */

.my-mask-class {
}
</style>
