<template>
  <div class="p-3">
    <div class="flex-row justify-between mb-3">
      <el-button type="primary" @click="addData">新增用例</el-button>
      <div class="flex-row align-center ml-3">
        <span style="width: 70px;margin-right: 20px;">project:</span>
        <el-select v-model="projectId"
                   clearable
                   placeholder="请选择" @change="changeProjectId">
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
      <div>
        <el-input v-model="tableParams.query"
                  placeholder="请输入内容"
                  class="input-with-select"
                  clearable
                  @keyup.enter.native="handleSearch"
                  @clear="handleSearch">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
      </div>
    </div>
    <el-table
        :data="tableData"
        border
        style="width: 100%">
      <el-table-column
          label="casename"
          prop="casename"
          width="240">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>{{ scope.row.casename }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.casename }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
          label="interfaceName"
          prop="interfaceName"
          width="300">
        <template slot-scope="scope">
          <div>
            {{scope.row.interfaceName ? scope.row.interfaceName : '--'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
          label="method"
          prop="httpmethod"
          width="75">
        <template slot-scope="scope">
          <div>
            {{scope.row.httpmethod ? scope.row.httpmethod : '--'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
          label="header"
          width="380">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.header && scope.row.header.length > 0" trigger="hover" placement="top">
            <ul>
              <li v-for="(item, index) in scope.row.header"
                  :key="'header' + index" class="flex-row justify-between">
                <span>{{item.key}}</span>
                <span> --- </span>
                <span>{{item.value}}</span>
              </li>
            </ul>
            <div slot="reference" class="name-wrapper">
              <div class="flex-row justify-between">
                <span>{{scope.row.header[0].key}}</span>
                <span>{{scope.row.header[0].value}}</span>
              </div>
            </div>
          </el-popover>
          <div v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column
          label="params"
          width="340">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.params && scope.row.params.length > 0" trigger="hover" placement="top">
            <ul>
              <li v-for="(item, index) in scope.row.params"
                  :key="'params' + index" class="flex-row justify-between">
                <span>{{item.key}}</span>
                <span>---</span>
                <span>{{item.value}}</span>
              </li>
            </ul>
            <div slot="reference" class="name-wrapper">
              <div class="flex-row justify-between">
                <span>{{scope.row.params[0].key}}</span>
                <span>{{scope.row.params[0].value}}</span>
              </div>
            </div>
          </el-popover>
          <div v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column
          label="response_latest"
          width="150">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>{{ scope.row.response ? scope.row.response : '--' }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.response ? scope.row.response : '--' }}</el-tag>
            </div>
          </el-popover>

        </template>
      </el-table-column>
      <el-table-column
          label="status"
          width="70">
        <template slot-scope="scope">
          <div>
            {{scope.row.status ? scope.row.status : '--'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="handle" width="300">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="primary"
              clearable
              :disabled="environment==null || environment==''?true:false"
              @click="handleRun(scope.row,projectId,environment)">运行
          </el-button>
          <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑
          </el-button>

          <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除
          </el-button>
          <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.interfaceName =='/token/acquire'?false:true"
              onclick="window.open('https://open-api.eqxiu.com/user/quick/login?redirectUrl=http%3A%2F%2Fwww.eqxiu.com%2F&appId=OVF6lKeb&token=token')">
            登录
          </el-button>
          <!--跳转自定义商城：https://open-api.eqxiu.com/user/quick/login?redirectUrl=https%3A%2F%2Fopen.eqxiu.com%2Fapplication%2Fstore&appId=OVF6lKeb&token=token-->
          <!--跳转易企秀主页：https://open-api.eqxiu.com/user/quick/login?redirectUrl=http%3A%2F%2Fwww.eqxiu.com%2F&appId=OVF6lKeb&token=token-->
        </template>
      </el-table-column>
    </el-table>
    <div class="flex-row justify-end mt-3">
      <el-pagination
          background
          layout="prev, pager, next"
          @size-change="handleSize"
          @current-change="handleSize"
          :total="total">
      </el-pagination>
    </div>
    <add-dialog v-if="dialogVisible"
                :data-source="editData"
                :control-type="controlType"
                :dialog-visible.sync="dialogVisible"
                @refreshPage="refreshPage"></add-dialog>
  </div>
</template>

<script>

  import AddDialog from "../components/AddDialog";
  import {
    getTestcaseList,
    runNow,
    getProjectList,
    getProjectEnvList,
    deleteById,
    editData
  } from './../service/apiService'

  export default {
    components: {AddDialog},
    data() {
      return {
        dialogVisible: false,
        controlType: 'add',
        projectId: null,
        environment: null,
        envData: [],
        projectData: [],
        editData: null,
        searchValue: null,
        tableParams: {
          pageNumber: 1,
          pageSize: 10,
          projectId: null,
          environment: null,
          query: ''
        },
        total: 0,
        tableData: []
      }
    },
    mounted() {
      this.getDataLists()
      this.getProjectData()
    },
    methods: {
      getProjectData() {
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
      changeProjectId() {
        this.tableParams.projectId = this.projectId
        this.getProjectEnvList()
        this.getDataLists()
      },
      projectEnvChange() {
        this.tableParams.environment = this.environment
        this.getDataLists()
      },
      addData() {
        this.dialogVisible = true
        this.controlType = 'add'
      },
      refreshPage(val) {
        this.dialogVisible = false
        this.tableParams = {
          pageNumber: 1,
          pageSize: 10,
          query: ''
        }
        if (this.controlType === 'edit' && val) {
          editData(val).then(res => {
            console.log('cccccc', res)
            let _data = res.data && res.data.result;
            if (_data) {
              this.$message({
                type: 'success',
                message: _data
              })
              this.getDataLists()
            }
          })
        } else {
          this.getDataLists()
        }
      },
      handleSize(val) {
        this.tableParams.pageNumber = val
        this.getDataLists()
      },
      handleEdit(row) {
        console.log('handleSize', row)
        this.editData = row
        this.controlType = 'edit'
        this.dialogVisible = true
      },
      handleRun(row, projectId, environment) {
        let sendData = {
          id: row.id,
          header: row.header,
          params: row.params,
          expect: row.expect,
          casename: row.casename,
          environment: environment,
          interfaceId: row.interfaceId,
          projectId: projectId
        }
        runNow(sendData).then(res => {
          let _data = res.data && res.data.result;
          if (_data) {
            this.$alert(_data, '运行结果', {
              confirmButtonText: '确定'
            });
          }
        })
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteById(row.id).then(res => {
            let _data = res.data && res.data.result;
            if (_data) {
              this.$message({
                type: 'success',
                message: _data
              })
              this.getDataLists()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleSearch() {
        this.getDataLists()
      },
      getDataLists() {
        let self = this
        getTestcaseList(self.tableParams)
            .then(res => {
              let _data = res.data && res.data.result;
              if (_data) {
                this.tableData = [];
                this.tableData = _data.records;
                this.total = _data.total;
                console.log('this.total ', this.total)
              }
            })
      }
    }
  }
</script>

<style lang="css" scoped>
  /*@import "./../assets/css/common.css";*/

  .timer-box {
    font-size: .65rem;
    box-shadow: 0 1px 4px #c8c8c8;
    border: 1px solid #dadada;
    padding: .3rem;
    color: #4e4d4d;
  }

  .timer-box .text {
    height: 1rem;
    line-height: 1rem;
  }

  .timer-box .time-tips,
  .timer-box .time-text {
    font-weight: bold;
    font-size: .85rem;
    height: 1rem;
    line-height: 1rem;
    min-width: .6rem;
    text-align: center;
    width: .6rem;
  }

  .timer-box .time-text {
    border: 1px solid #dadada;
    margin-right: .1rem;
  }

  .timer-box .time-tips {
    line-height: .9rem;
  }

  .vertical-line {
    width: 3px;
    height: .8rem;
    background: #d80011;
    margin: 0 .2rem;
  }

  .content-title {
    border: 1px solid #d80011;
    background: #ffc9c9;
    padding: .2rem;
    border-radius: .03rem;
  }

  .ball-content {
    -webkit-box-shadow: 0 1px 4px #c8c8c8;
    box-shadow: 0 1px 4px #c8c8c8;
    border: 1px solid #dadada;
    border-radius: 4px;
    background-color: #fff;
    padding: .3rem 0;
  }

  .kaijiang-table {
    box-shadow: 0 1px 4px #c8c8c8;
    border: 1px solid #dadada;
  }

  .table-lists .ball-item {
    padding: 0 .1rem;
  }

  /deep/ .el-table th > .cell {
    text-align: center;
  }

  /deep/ .my-pagination .el-pager li {
    min-width: .7rem;
  }

  .ball-item {
    width: 14%;
    padding: 0 .2rem;
    box-sizing: border-box;
  }

  .hm-img {
    width: 100%;
    height: 100%;
    max-width: 40px;
    max-height: 40px;
  }

  .ball-content .hm-img-pc {
    max-width: 88px;
    max-height: 88px;
  }

  .ball-add-item {
    width: .8rem;
    text-align: center;
    font-weight: bold;
    font-size: .5rem;
  }

  .ball-item .first-text-t {
    text-align: center;
    font-size: .34rem;
  }
</style>
