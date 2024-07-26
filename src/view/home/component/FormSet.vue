<template>
    <div>
      <el-dialog
        title="表单配置"
        :close-on-click-modal="false"
        :visible.sync="visible"
        @close="onCancel"
        width="1300px"
        :modal-append-to-body="false"
        :append-to-body="true"
      >
        <div class="form-data-list">
            <div class="data-list-item" v-for="(item, index) in formDataList" :key="index">
                <el-row>
                    <el-button type="danger" size="mini" icon="el-icon-delete" circle style="float: right; margin-bottom: 10px;" @click="handlerToDelete(index)"></el-button>
                </el-row>
                <el-form
                    label-position="right"
                    label-width="80px"
                    :ref="'formData' + index"
                    :rules="formRules"
                    :model="item"
                    >
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="取值组件" prop="consumerComponentId">
                                <el-select
                                    v-model="item.consumerComponentId"
                                    @change="changeConsumerCom(item, index)"
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in optionsConCom"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="取值用途" prop="consumerComponentPurpose">
                                <el-select
                                    v-model="item.consumerComponentPurpose"
                                    @change="changeConsumerPurpose(item, index)"
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in optionsConUse"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if="item.consumerComponentPurpose === 'apiParameter'">
                            <el-form-item label="用值接口" prop="consumerComponentApiId">
                                <el-select
                                    v-model="item.consumerComponentApiId"
                                    @change="changeConsumerApi(item, index)"
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in optionsConApiList[index]"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if="item.consumerComponentPurpose === 'apiParameter'">
                            <el-form-item label="接口参数">
                                <el-select
                                    v-model="item.consumerComponentApiParam"
                                    @change="changeConsumerApiParam"
                                    placeholder="请选择"
                                    clearable
                                >
                                    <el-option
                                        v-for="item in optionsConApiParamsList[index]"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="供值任务" prop="producerComponentTaskDefKey">
                                <el-select
                                    v-model="item.producerComponentTaskDefKey"
                                    @change="changeProdTask(item, index)"
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in optionsProdTask"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="供值组件" prop="producerComponentId">
                                <el-select
                                    v-model="item.producerComponentId"
                                    @change="changeProdCom(item, index)"
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in optionsProdComList[index]"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if="item.producerComponentId !== '' && optionsProdQueryList[index] && optionsProdQueryList[index].length">
                            <el-form-item label="供值字段">
                                <el-select
                                    v-model="item.producerComponentField"
                                    @change="changeProdApi"
                                    clearable
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in optionsProdQueryList[index]"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
        <el-row>
            <el-button style="float: right;margin-top: 10px;" type="primary" size="mini" @click="handlerToAdd">增加配置</el-button>
        </el-row>
        <span slot="footer">
          <el-button class="submit" @click="onSubmit">保存</el-button>
          <el-button class="cancel" @click="onCancel">取消</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { fetchTaskNodeList, getDictData } from '@/api/workflow.js';
  import { fetchFormVersion } from '@/api/workflowForm.js';
  const consumerComList = [
        {
            label: 'Input',
            apiList: [],
            paramsList: []
        },
        {
            label: 'TextArea',
            apiList: [],
            paramsList: []
        },
        {
            label: 'NumberPicker',
            apiList: [],
            paramsList: []
        },
        {
            label: 'DatePicker',
            apiList: [],
            paramsList: []
        },
        {
            label: 'Switch',
            apiList: [],
            paramsList: []
        },
        {
            label: 'Checkbox',
            apiList: [],
            paramsList: []
        },
        {
            label: 'Radio',
            apiList: [],
            paramsList: []
        },
        {
            label: 'RangePicker',
            apiList: [],
            paramsList: []
        },
        {
            label: 'ChooseEq',
            apiList: {
                api: [
                    { label: '获取设备实例树', value: '/zhyw/sec/get/ins/tree' }
                ],
                params: []
            }
        },
        {
            label: 'Abnormal',
            apiList: {
                api: [
                    { label: '获取设备实例树', value: '/zhyw/sec/get/ins/tree' }
                ],
                params: []
            }
        },
        {
            label: 'Display',
            apiList: {
                api: [
                    { label: '获取实例知识细项-pc', value: '/zhyw/pc/common/instance/knowledge' },
                    { label: '获取实例知识细项-app', value: '/zhyw/app/common/instance/knowledge' }
                ],
                params: [
                    { label: '实例编码', value: 'instanceCode' }
                ]
            }
        }
    ]
  const productComList = [
    {
            label: 'Input',
            paramsList: []
        },
        {
            label: 'TextArea',
            paramsList: []
        },
        {
            label: 'NumberPicker',
            paramsList: []
        },
        {
            label: 'DatePicker',
            paramsList: []
        },
        {
            label: 'Switch',
            paramsList: []
        },
        {
            label: 'Checkbox',
            paramsList: []
        },
        {
            label: 'Radio',
            paramsList: []
        },
        {
            label: 'RangePicker',
            paramsList: []
        },
        {
            label: 'ChooseEq',
            paramsList: [
                { label: '设备/设施', value: 'eqCode' }
            ]
        },
        {
            label: 'Abnormal',
            paramsList: [
                { label: '异常设备', value: 'abnEqData' },
                { label: '异常类型', value: 'abnTypeData' },
                { label: '异常时间', value: 'abnDate' },
                { label: '异常描述', value: 'abnDesc' },
                { label: '备注', value: 'abnRemark' },
            ]
        },
  ]
  export default {
    name: 'FormSet',
    data() {
      return {
        timer: null,
        visible: false,
        formDataList: [{
            consumerComponentApiId: '',
            consumerComponentApiParam: '',
            consumerComponentId: '',
            consumerComponentPurpose: '',
            producerComponentField: '',
            producerComponentId: '',
            producerComponentTaskDefKey: ''
        }],
        formRules: {
            consumerComponentApiId: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
            // consumerComponentApiParam: [{ required: true, message: '内容不能为空', trigger: 'change' }],
            consumerComponentId: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
            consumerComponentPurpose: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
            producerComponentField: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
            producerComponentId: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
            producerComponentTaskDefKey: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
        },
        optionsConCom: [],
        optionsConUse: [],
        optionsConApiList: [],
        optionsConApiParamsList: [],
        optionsProdTask: [],
        optionsProdComList: [],
        optionsProdQueryList: [],
        allTaskList: [],
        beforeTask: []
      };
    },
    mounted() {},
    methods: {
        async _getDictData() {
            const result = await getDictData({
                code: 'consumerValueUse'
            })
            if (result?.code === '200') {
                this.optionsConUse = []
                result?.data.forEach(item => {
                    this.optionsConUse.push({
                        label: item.name,
                        value: item.code,
                    })
                })
            }
        },
        async _fetchFormVersion(params, item, index, lastHavIdx) {
            const result = await fetchFormVersion(params)
            if (result?.code === '200') {
                this.allTaskList[index] = {
                    id: item.taskDefKey,
                    file: result.data.formVersionFile
                }
                this.setDataList()
            }
        },
        async _fetchTaskNodeList(params, ctData, lastHavIdx) {
            const result = await fetchTaskNodeList(params)
            const startTask = {
                taskFormVersionId: this.$parent.$parent.$parent.startFormVersionId,
                taskDefKey: "start_task",
                file: ''
            }
            const allTaskList = [startTask, ...this.$parent.$parent.$parent.modelTaskConfigs]
            if (result?.code === '200') {
                this.beforeTask = [...result.data, ctData]
                allTaskList.forEach((item, index) => {
                    if (item.taskFormVersionId && item.taskFormVersionId !== '') {
                        this._fetchFormVersion({
                            formVersionId: item.taskFormVersionId
                        }, item, index, lastHavIdx)
                    } else {
                        this.allTaskList[index] = {
                            id: item.taskDefKey,
                            file: ''
                        }
                    }
                })
            }
        },
        insertData(data, st, arr) {
            if (data[st]['x-component'] === 'ArrayCards') {
                // this.insertData()
                // Object.keys(data[st].items.properties).forEach(item => {
                //     this.insertData(data[st].items.properties, item, arr)
                // })
            } else {
                if (
                        data[st]['x-component'] !== 'ArrayCards.Remove' &&
                        data[st]['x-component'] !== 'ArrayCards.MoveDown' &&
                        data[st]['x-component'] !== 'ArrayCards.Index' &&
                        data[st]['x-component'] !== 'DataTranscription' &&
                        data[st]['x-component'] !== 'CheckIn'
                    ) {
                    if (data[st]['x-component'] === 'Abnormal') {
                        arr.push({
                            label: '异常报修',
                            value: st
                        })
                    } else if (data[st]['x-component'] === 'ChooseEq') {
                        arr.push({
                            label: '设备选择',
                            value: st
                        })
                    } else if (data[st]['x-component'] === 'Display') {
                        arr.push({
                            label: '知识库组件',
                            value: st
                        })
                    } else {
                        arr.push({
                            label: data[st].title,
                            value: st
                        })
                    }
                }
            }
        },
        setDataList() {
            if (this.timer) {
                clearTimeout(this.timer)
                this.optionsProdTask = []
                this.timer = null
            }
            this.timer = setTimeout(() => {
                const len = this.beforeTask.length
                this.beforeTask.forEach((item) => {
                    this.optionsProdTask.push({
                        label: item.taskName,
                        value: item.taskDefKey
                    })
                })
                this.allTaskList.forEach((item) => {
                    item.com = []
                    if (item.file !== '') {
                        const data = JSON.parse(item.file)?.schema?.properties ?? {}
                        Object.keys(data).forEach(st => {
                            this.insertData(data, st, item.com)
                        })
                    }
                })
                this.optionsConCom = this.allTaskList.filter(item => item.id === this.beforeTask[len - 1].taskDefKey)[0]?.com ?? []
                this.formDataList.forEach((item, index) => {
                    this.optionsConApiList[index] = consumerComList.filter(st => item.consumerComponentId.indexOf(st.label) > 0)[0]?.apiList.api ?? []
                    this.optionsConApiParamsList[index] = consumerComList.filter(st => item.consumerComponentId.indexOf(st.label) > 0)[0]?.apiList.params ?? []
                    this.optionsProdComList[index] = this.allTaskList.filter(st => st.id === item.producerComponentTaskDefKey)[0]?.com
                    // this.optionsProdQueryList = []
                    const newLabel = item.producerComponentId.split('_')[1]
                    productComList.forEach(st => {
                        if (st.label === newLabel) {
                            this.optionsProdQueryList[index] = st.paramsList
                        }
                    })
                })
            }, 100);
        },
        opOpen(data, id) {
            this.visible = true
            this.optionsProdTask = []
            this.optionsConCom = []
            this.optionsConUse = []
            this.optionsConApiList = []
            this.optionsConApiParamsList = []
            this.optionsProdComList = []
            this.optionsProdQueryList = []
            const taskFormValueRels = this.$parent.$parent.$parent.modelTaskConfig?.taskFormValueRels ?? []
            this.formDataList =  taskFormValueRels && taskFormValueRels.length ? taskFormValueRels : [{
                consumerComponentApiId: '',
                consumerComponentApiParam: '',
                consumerComponentId: '',
                consumerComponentPurpose: '',
                producerComponentField: '',
                producerComponentId: '',
                producerComponentTaskDefKey: ''
            }]
            const currentId = data.id
            const parentNode = data.parent.businessObject.flowElements
            const startTask = {
                taskFormVersionId: this.$parent.$parent.$parent.startFormVersionId,
                taskDefKey: "start_task",
                file: ''
            }
            const allTaskList = [startTask, ...this.$parent.$parent.$parent.modelTaskConfigs]
            let lastHavIdx = null
            allTaskList.forEach((item, index) => {
                if (item.taskFormVersionId && item.taskFormVersionId !== '') {
                    lastHavIdx = index
                }
            })
            this._fetchTaskNodeList({
                taskDefKey: currentId,
                processId: id
            }, {
                taskDefKey: data.type === 'bpmn:StartEvent' ? 'start_task' : currentId,
                taskName: data.businessObject.name,
                taskType: data.type
            }, lastHavIdx)
            this._getDictData()
        },
        handlerToAdd() {
            this.formDataList.push({
                consumerComponentApiId: '',
                consumerComponentApiParam: '',
                consumerComponentId: '',
                consumerComponentPurpose: '',
                producerComponentField: '',
                producerComponentId: '',
                producerComponentTaskDefKey: ''
            })
        },
        handlerToDelete(index) {
            this.formDataList.splice(index, 1)
        },
        changeConsumerCom(item, index) {
            // console.log(1)
            item.consumerComponentApiParam = ''
            item.consumerComponentApiId = ''
            if (item.consumerComponentPurpose === '') return
            this.optionsConApiList[index] = consumerComList.filter(st => item.consumerComponentId.indexOf(st.label) > 0)[0]?.apiList.api ?? []
            // this.optionsConApiParams = consumerComList.filter(st => item.consumerComponentId.indexOf(st.label) > 0)[0]?.paramsList ?? []
        },
        changeConsumerPurpose(item, index) {
            item.consumerComponentApiParam = ''
            item.consumerComponentApiId = ''
            if (item.consumerComponentId === '') return
            this.optionsConApiList[index] = consumerComList.filter(st => item.consumerComponentId.indexOf(st.label) > 0)[0]?.apiList.api ?? []
            // this.optionsConApiParams = consumerComList.filter(st => item.consumerComponentId.indexOf(st.label) > 0)[0]?.paramsList ?? []
        },
        changeConsumerApi(item, index) {
            this.optionsConApiParamsList[index] = consumerComList.filter(st => item.consumerComponentId.indexOf(st.label) > 0)[0]?.apiList.params ?? []
            item.consumerComponentApiParam = ''
        },
        changeConsumerApiParam() {},
        changeProdTask(item, index) {
            this.optionsProdComList[index] = this.allTaskList.filter(st => st.id === item.producerComponentTaskDefKey)[0]?.com
            item.producerComponentId = ''
            item.producerComponentField = ''
        },
        changeProdCom(item, index) {
            const newLabel = item.producerComponentId.split('_')[1]
            productComList.forEach(st => {
                if (st.label === newLabel) {
                    this.optionsProdQueryList[index] = st.paramsList
                }
            })
            item.producerComponentField = ''
        },
        changeProdApi() {},
        onSubmit() {
            // this.$refs
            const len = this.formDataList.length
            let num = 0
            this.formDataList.forEach((_, index) => {
                this.$refs['formData' +  index][0]?.validate(val => {
                    if (val) {
                        num += 1
                    }
                })
            })
            if (num === len) {
                this.visible = false
                this.$emit('setData', this.formDataList)
            }
        },
        onCancel() {
            this.visible = false
        },
    },
  };
  </script>
  
  <style scoped lang="scss">
  /deep/ .el-dialog {
    @include formDialog;
  }
  
  .submit {
    @include primaryBtn;
  }
  
  .cancel {
    @include cancelBtn;
  }
  .form-data-list {
    max-height: 500px;
    overflow: hidden;
    overflow-y: auto;
    .data-list-item {
        padding: 10px 10px;
        box-sizing: border-box;
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 6px 6px;
    }
  }
  </style>
  