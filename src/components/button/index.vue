<template>
  <div class="custom-button">
    <div>{{ text }}</div>
  </div>
</template>
<script setup lang="ts">
const text = 'Custom Button';
</script>
<style lang="scss" scoped>
.button {
  background: #07b5bc;
  color: #fff;
  padding: 10px 20px;
  border-radius: 7px;
  cursor: pointer;
}
</style>
