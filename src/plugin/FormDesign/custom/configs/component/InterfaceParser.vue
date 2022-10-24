<template>
  <div>
    <el-form-item label="第三方API">
      <seclect
          @clear="close"
        :requestConfig="currentField.requestConfig"
        :options="interFaceOption"
        key="id"
        label="name"
        value="id"
        @selectedChange="selectedChange"
      />
    </el-form-item>
    <div v-if="variables.length > 0" class="variable-wrapper">
      <el-row :gutter="24">
        <el-col :span="6"> 变量 </el-col>
        <el-col :span="10"> 关联 </el-col>
        <el-col :span="8"> 类型 </el-col>
      </el-row>
      <div v-for="({ variable }, index) in variables" :key="index">
        <el-row :gutter="24" class="variable">
          <el-col :span="6">
            <span>{{ variable }}</span>
          </el-col>
          <el-col :span="10">
            <el-input
              v-model="variables[index]['source']"
              @change="onVariableChange"
            />
          </el-col>
          <el-col :span="8">
            <el-select
              v-model="variables[index]['sourceType']"
              @change="onSourceTypeChange(index)"
            >
              <el-option
                v-for="{ id, label, value } in sourceTypeOptions"
                :key="id"
                :label="label"
                :value="value"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-form-item label="自定义解析">
      <el-switch v-model="customParser" @change="onCustomOptionPathChange" />
    </el-form-item>
    <template v-if="customParser">
      <el-form-item label="数据路径">
        <el-input v-model="parserProp.optionPath" />
      </el-form-item>
      <el-form-item label="label">
        <el-input v-model="parserProp.label" />
      </el-form-item>
      <el-form-item label="value">
        <el-input v-model="parserProp.value" />
      </el-form-item>
      <el-form-item v-if="hasChildren" label="children">
        <el-input v-model="parserProp.children" />
      </el-form-item>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { apiDetail } from "@/api/globalConfig";
import { variableFactory as variableParser } from "@/mixin/formDepMonitor";
import seclect from "@/component/Select.vue";

const defaultParserProp = () => ({
  optionPath: "",
  label: "label",
  value: "value",
  children: "children",
});

export default {
  components: {
    seclect,
  },
  name: "InterfaceParser",
  props: {
    currentField: {
      type: Object,
      default: () => ({}),
    },
    hasChildren: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      interfaceId: "",
      sourceTypeOptions: [
        {
          id: 0,
          label: "常量",
          value: "const",
        },
        {
          id: 1,
          label: "环境变量",
          value: "context",
        },
        {
          id: 2,
          label: "表单",
          value: "form",
        },
      ],
      customParser: false,
      parserProp: defaultParserProp(),
      requestConfig: {},
      variables: [],
    };
  },
  computed: {
    ...mapState("account", ["tenantId"]),
    ...mapState("form", ["interFaceOption"]),
    ...mapGetters("form", ["findInterfaceById"]),
  },
  watch: {
    currentField: {
      immediate: true,
      handler(currentField) {
        if (!currentField || !currentField.requestConfig) {
          return;
        }
        this.requestConfig = currentField.requestConfig;
        this.variables = currentField.requestConfig.variables;
        this.interfaceId = currentField.requestConfig.id;
        this.customParser = currentField.requestConfig.customParser;
        this.parserProp = currentField.requestConfig.parserProp;
      },
    },
    parserProp: {
      deep: true,
      handler() {
        this.onVariableChange();
      },
    },
    async interfaceId(interfaceId) {
      if (!interfaceId) {
        return;
      }
      const { errorInfo, result } = await apiDetail({
        ...this.findInterfaceById(interfaceId),
        tenantId: this.tenantId,
      });
      if (errorInfo.errorCode) {
        this.$message.error(errorInfo.errorMsg);
        return;
      }
      if (!Array.isArray(result) || result.length === 0) {
        return;
      }
      const { id, name, source, sourceMark, apiMark, method, parameter, body } =
        result.find(({ id }) => id === interfaceId);
      this.requestConfig = {
        id,
        name,
        source,
        sourceMark,
        apiMark,
        method,
        parameter,
        body,
      };
      this.variables = (variableParser(this.requestConfig) ?? []).map(
        (variable) => ({
          variable,
          sourceType: "const",
          source: "",
        })
      );
      this.onVariableChange();
    },
  },
  mounted() {
    this.refreshApiList();
  },
  methods: {
    ...mapActions("form", ["refreshApiList"]),
    onSourceTypeChange(index) {
      this.variables[index].source = "";
    },
    onCustomOptionPathChange() {
      this.parserProp = defaultParserProp();
    },
    onVariableChange() {
      const result = {
        ...this.requestConfig,
        variables: this.variables,
        customParser: this.customParser,
        parserProp: this.parserProp,
      };
      if (!this.hasChildren) {
        delete result.parserProp.children;
      }
      this.$emit("variableChange", result);
    },
    selectedChange(selected) {
      this.interfaceId = selected;
      this.currentField.requestConfig.id= selected
    },
    close() {
      this.$emit('close')
    }
  },
};
</script>

<style lang="scss" scoped>
.variable-wrapper {
  color: white;
}

.variable {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
