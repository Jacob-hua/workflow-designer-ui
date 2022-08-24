<template>
  <div class="wrapper">
    <el-tooltip :style="contentStyle" :content="content" :placement="placement" effect="light">
      <span class="text-hidden">{{ content }}</span>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      required: true
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    contentStyle: {
      type: String,
      default: 'width: 180px'
    },
    lineClamp: {
      type: Number,
      default: 1
    },
  },
}
</script>

<style scoped lang="scss">
.text-hidden {
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 1;
}

.wrapper {
  display: inline-flex;
}

</style>



