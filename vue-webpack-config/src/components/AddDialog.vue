<template>
    <el-dialog
            :title="controlType === 'add' ? '新增' : '编辑'"
            :visible.sync="visible"
            width="80%"
            :before-close="handleClose">
        <div class="flex-row mb-3">
            <div class="flex-row align-center">
                <span style="width: 110px;margin-right: 20px;">caseName:</span>
                <el-input v-model="casename"
                          placeholder="请输入内容"></el-input>
            </div>
            <div class="flex-row align-center ml-3">
                <span style="width: 70px;margin-right: 20px;">project:</span>
                <el-select v-model="projectId"
                           clearable
                           placeholder="请选择" @change="projectIdChange">
                    <el-option
                            v-for="item in projectData"
                            :key="item.projectId"
                            :label="item.projectName"
                            :value="item.projectId">
                    </el-option>
                </el-select>
            </div>

            <div class="flex-row align-center ml-3">
                <span style="width: 70px;margin-right: 20px;">run_env:</span>
                <el-select v-model="environment"
                           clearable
                           :disabled="!projectId"
                           placeholder="请选择" @change="projectEnvChange">
                    <el-option
                            v-for="item in envData"
                            :key="item.environment"
                            :label="`${item.site} --- ${item.environment}`"
                            :value="item.environment">
                    </el-option>
                </el-select>
            </div>

            <div class="flex-row align-center ml-3">
                <span style="width: 70px;margin-right: 20px;">interface:</span>
                <el-select v-model="interfaceId"
                           clearable
                           filterable
                           :disabled="!projectId"
                           placeholder="请选择">
                    <el-option
                            v-for="item in selectData"
                            :key="item.interfaceId"
                            :label="`${item.desc} --- ${item.interfaceName}`"
                            :value="item.interfaceId">
                    </el-option>
                </el-select>
            </div>

        </div>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="header" name="first">
                <el-button type="primary" @click="addData">新增</el-button>
                <ul class="mt-1">
                    <li v-for="(item, index) in firstData"
                        :key="'firstData' + index" class="flex-row mt-1">
                        <div>
                            <el-input v-model="item.key" class="ml-3"></el-input>
                        </div>
                        <div>
                            <el-input v-model="item.value"></el-input>
                        </div>
                        <div>
                            <el-button type="text" @click="deleteData(index)">删除</el-button>
                        </div>
                    </li>
                </ul>
            </el-tab-pane>
            <el-tab-pane label="params" name="second">
                <el-button type="primary" @click="addData">新增</el-button>
                <ul class="mt-1">
                    <li v-for="(item, index) in secondData"
                        :key="'firstData' + index" class="flex-row mt-1">
                        <div>
                            <el-input v-model="item.key" class="ml-3"></el-input>
                        </div>
                        <div>
                            <el-input v-model="item.value"></el-input>
                        </div>
                        <div>
                            <el-button type="text" @click="deleteData(index)">删除</el-button>
                        </div>
                    </li>
                </ul>
            </el-tab-pane>
            <el-tab-pane label="expect" name="three">
                <div class="mt-1">
                    <el-input v-model="expect" class="ml-3"></el-input>
                </div>
            </el-tab-pane>
        </el-tabs>
        <el-input
                v-if="textarea"
                v-model="textarea"
                type="textarea"
                class="mt-3"
                :rows="4"
                placeholder="请输入内容">
        </el-input>

        <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="handleSure(1)">运行</el-button>
    <el-button @click="handleClose()">取 消</el-button>
    <el-button type="primary" @click="handleSure(2)">保 存</el-button>
  </span>
    </el-dialog>
</template>

<script>
    import {
        getInterfaceList,
        getProjectEnvList,
        getProjectList,
        addTestcase,
        runNow,
    } from './../service/apiService'

    export default {
        name: "AddDialog",
        props: {
            dataSource: {
                type: Object,
                default: null
            },
            controlType: {
                type: String,
                default: 'add'
            },
            dialogVisible: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                visible: this.dialogVisible,
                textarea: '',
                expect: '',
                casename: '',
                firstData: [],
                secondData: [],
                activeName: 'first',
                interfaceId: null,
                projectId: null,
                environment: null,
                selectData: [],
                envData: [],
                projectData: []
            }
        },
        watch: {
            dialogVisible(val) {
                this.visible = val
            },
            dataSource: {
                deep: true,
                handler(val) {
                    if (val && this.controlType === 'edit') {
                        this.initData()
                    }
                }
            }
        },
        mounted() {
            if (this.dataSource && this.controlType === 'edit') {
                this.initData()
            }
            this.getProjectList()
        },
        methods: {
            initData() {
                console.log(this.dataSource)
                this.casename = this.dataSource.casename
                this.firstData = this.dataSource.header ? JSON.parse(JSON.stringify(this.dataSource.header)) : []
                this.secondData = this.dataSource.params ? JSON.parse(JSON.stringify(this.dataSource.params)) : []
                this.interfaceId = this.dataSource.interfaceId ? this.dataSource.interfaceId : ''
                this.expect = this.dataSource.expect ? this.dataSource.expect : ''
                this.projectId = this.dataSource.projectId ? this.dataSource.projectId : ''
                this.environment = this.dataSource.environment ? this.dataSource.environment : ''
                if (this.projectId) {
                    this.getProjectEnvList()
                    this.getInterfaceList()
                }
            },
            getProjectList() {
                getProjectList().then(res => {
                    let _data = res.data && res.data.result;
                    if (_data) {
                        this.projectData = [];
                        this.projectData = _data
                    }
                })
            },
            getProjectEnvList() {
                getProjectEnvList(this.projectId).then(res => {
                    let _data = res.data && res.data.result;
                    if (_data) {
                        this.envData = [];
                        this.envData = _data
                    }
                })
            },
            getInterfaceList() {
                getInterfaceList(this.projectId).then(res => {
                    let _data = res.data && res.data.result;
                    if (_data) {
                        this.selectData = [];
                        this.selectData = _data
                    }
                })
            },

            projectIdChange() {
                this.getProjectEnvList()
            },
            projectEnvChange() {
                this.getInterfaceList()
            },
            addData() {
                if (this.activeName === 'first') {
                    this.firstData.push({key: null, value: null})
                } else if (this.activeName === 'second') {
                    this.secondData.push({key: null, value: null})
                }
            },
            deleteData(index) {
                if (this.activeName === 'first') {
                    this.firstData.splice(index, 1)
                } else if (this.activeName === 'second') {
                    this.secondData.splice(index, 1)
                }
            },
            handleSure(type) {
                let sendData = {
                    header: this.firstData && this.firstData.length > 0 ? this.firstData : null,
                    params: this.secondData && this.secondData.length > 0 ? this.secondData : null,
                    expect: this.expect,
                    casename: this.casename,
                    interfaceId: this.interfaceId,
                    projectId: this.projectId,
                    environment: this.environment
                }
                if (type === 1) {
                    runNow(sendData).then(res => {
                        let _data = res.data && res.data.result;
                        if (_data) {
                            console.log('runNow', _data)
                            this.textarea = _data
                        }
                    })
                } else {
                    if (this.controlType === 'add') {
                        addTestcase(sendData).then(res => {
                            let _data = res.data && res.data.result;
                            if (_data) {
                                this.$message({
                                    type: 'success',
                                    message: _data
                                })
                                this.$emit('refreshPage')
                            } else {
                                this.$message({
                                    message: res.data.msg
                                })
                            }
                        })
                    } else {
                        this.$emit('refreshPage', Object.assign(this.dataSource, sendData))
                    }
                }
            },
            handleClose() {
                this.$emit('refreshPage')
            }
        }
    }
</script>

<style scoped>

</style>