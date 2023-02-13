<template>
  <div>
    <el-form :model="documentationForm" label-position="right" label-width="130px">
      <el-form-item :label="labels.documentation">
        <el-radio-group v-model="documentationForm.documentation">
          <el-radio label="">普通任务</el-radio>
          <el-radio label="approval-task">审批任务</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import zh from '../../../i18n/zh'

export default {
  name: 'Documentation',
  props: {
    namespace: {
      type: String,
      required: true,
      default: '',
    },
  },
  data() {
    return {
      documentationForm: {
        documentation: '',
      },
    }
  },
  computed: {
    documentation() {
      return this.$store.state[this.namespace].panel.documentation
    },
    shapeType() {
      return this.$store.state[this.namespace].panel.shapeType
    },
    listeners() {
      return this.$store.state[this.namespace].panel.listeners
    },
    labels() {
      return {
        documentation: `${zh[this.shapeType] ?? '流程'}类型`,
      }
    },
  },
  watch: {
    documentation: {
      immediate: true,
      handler(value) {
        this.documentationForm = { documentation: value }
      },
    },
    documentationForm: {
      deep: true,
      immediate: true,
      handler(value) {
        if (value.documentation === this.documentation) {
          return
        }
        this.updateDocumentation({ documentation: value.documentation })
      },
    },
  },
  mounted() {
    this.documentationForm = {
      documentation: this.documentation,
    }
  },
  methods: {
    updateDocumentation(payload) {
      this.$store.commit(`${this.namespace}/panel/updateDocumentation`, payload)
    },
  },
}
</script>

<style></style>
