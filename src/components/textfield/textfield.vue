<!-- write reusable textfield component -->
<!-- with label, placeholder and value props -->

<template>
  <div class="textfield">
    <el-form-item :prop="inputfor">
      <el-input v-model="vmodel" :placeholder="placeholder" clearable />
    </el-form-item>
  </div>
</template>

<script setup lang="ts" name="Textfield">
import { defineProps } from 'vue';

const props = defineProps({
  inputfor: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  value: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  maxlength: {
    type: Number,
    default: 255,
  },
  vmodel: {
    type: String,
    default: '',
  },
});

const { placeholder, value, inputfor, vmodel } = toRefs(props);

console.log(value);
</script>

<style lang="scss" scoped>
.textfield {
  display: flex;
  flex-direction: column;

  width: 100%;
}
</style>
