<template>
  <div class="app-container">
    <el-container>
      <el-header>设备管理
        <el-button @click="add"> 添加设备</el-button>

      </el-header>
      <el-main>
        <!-- 查询项 -->
        <div class="input">
          <div>
            <el-select
              v-model="search.device_type"
              clearable
              placeholder="设备类型"
            >
              <el-option
                v-for="item in device_type"
                :key="item.ID"
                :label="item.CODEMEAN"
                :value="item.CODENAME"
              />
            </el-select>
            <el-select v-model="search.tunnel" clearable placeholder="隧道">
              <el-option
                v-for="item in tunnel_options"
                :key="item.value"
                :label="item.CODELABEL"
                :value="item.ID"
              />
            </el-select>
            <el-select v-model="search.place" clearable placeholder="位置">
              <el-option
                v-for="item in place_options"
                :key="item.value"
                :label="item.CODELABEL"
                :value="item.ID"
              />
            </el-select>

            <span>设备编号:</span>
            <el-input v-model="search.device_number" placeholder="请输入内容" />
          </div>
          <el-button type="success" @click="Search">查询</el-button>
        </div>
        <!-- 表格 -->
        <div class="table">
          <el-table
            ref="table"
            v-loading="listLoading"
            :data="tableData"
            style="width: 100%"
            row-key="ID"
          >
            <el-table-column
              v-if="false"
              prop="ID"
              label="ID"
              width="60px"
              align="center"
            />
            <el-table-column
              type="selection"
              width="55"
              align="center"
              reserve-selection=""
            />
            <el-table-column
              prop="DEVICE_NUMBER"
              label="设备编号"
              min-width="90px"
              align="center"
            />
            <el-table-column
              label="隧道"
              min-width="120px"
              align="center"
            >
              <template slot-scope="{row}">
                {{ zGetCode('train', row.TUNNEL) }}
              </template>
            </el-table-column>

            <el-table-column
              label="设备类型"
              min-width="120px"
              align="center"
            >
              <template slot-scope="{row}">
                {{ zGetCodeValue(row.DEVICE_TYPE) }}
              </template>
            </el-table-column>

            <el-table-column
              prop="PLACE"
              label="位置"
              min-width="120px"
              align="center"
            />

            <el-table-column
              prop="STATE"
              label="状态"
              min-width="120px"
              align="center"
            />
            <el-table-column
              prop="IP"
              label="设备IP"
              min-width="120px"
              align="center"
            />
            <el-table-column
              prop="PORT_NUMBER"
              label="端口"
              min-width="120px"
              align="center"
            />
            <el-table-column
              label="所在车道"
              min-width="120px"
              align="center"
              prop="LANE"
            />
            <el-table-column
              label="备注"
              min-width="120px"
              align="center"
              prop="DEVICE_DESC"
            />
            <el-table-column label="操作" min-width="200px" align="center">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="查看"
                  placement="top"
                >
                  <el-button
                    type="warning"
                    icon="el-icon-search"
                    size="small"
                    @click="check(scope.row.ID)"
                  />
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="修改"
                  placement="top"
                >
                  <el-button
                    type="success"
                    icon="el-icon-edit"
                    size="small"
                    @click="edit(scope.row.ID)"
                  />
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <el-popconfirm
                    confirm-button-text="好的"
                    cancel-button-text="不用了"
                    icon="el-icon-info"
                    icon-color="red"
                    title="这是一段内容确定删除吗？"
                    @onConfirm="def(scope.row.ID)"
                  >
                    <el-button
                      slot="reference"
                      type="danger"
                      icon="el-icon-delete"
                      size="small"
                    />
                  </el-popconfirm>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
      <!-- 分页 -->
      <el-footer>
        <div class="block">
          <pagination
            :total="total"
            :page.sync="listQuery.pageno"
            :limit.sync="listQuery.pagesize"
            @pagination="getList"
          />
        </div>
      </el-footer>
    </el-container>

    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="1000px"
      :close-on-click-modal="false"
    >
      <el-container>
        <el-main>
          <el-form label-width="110px" :inline="true">
            <el-row>
              <el-col :span="12">
                <el-form-item label="设备编号">
                  <el-input
                    v-model="input.DEVICE_NUMBER"
                    :readonly="readonly"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备类型">
                  <el-select
                    v-model="input.DEVICE_TYPE"
                    clearable
                    placeholder="请选择"
                    :disabled="disabled"
                    @change="change_type($event)"
                  >
                    <el-option
                      v-for="item in device_type"
                      :key="item.ID"
                      :label="item.CODEMEAN"
                      :value="item.CODENAME"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="隧道">
                  <el-select
                    v-model="input.TUNNEL"
                    clearable
                    placeholder="请选择"
                    :disabled="disabled"
                    @change="change_tunnel"
                  >
                    <el-option
                      v-for="item in tunnel_options"
                      :key="item.ID"
                      :label="item.CODELABEL"
                      :value="item.CODEVALUE"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所在车道">
                  <el-input v-model="input.LANE" :readonly="readonly" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="位置">
                  <el-select
                    v-model="input.POSITION"
                    clearable
                    placeholder="请选择"
                    :disabled="disabled"
                    @change="change"
                  >
                    <el-option
                      v-for="item in place_options"
                      :key="item.ID"
                      :label="item.CODELABEL"
                      :value="item.CODEVALUE"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="桩号">
                  <el-input
                    v-model="input.PILE_NUM1"
                    placeholder="YYY"
                    :readonly="readonly"
                    maxlength="3"
                    class="pile_input"
                  >
                    <template slot="prepend">K</template>
                  </el-input>
                  <el-input
                    v-model="input.PILE_NUM2"
                    placeholder="XXX"
                    :readonly="readonly"
                    maxlength="3"
                    class="pile_input"
                  >
                    <template slot="prepend">+</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="设备IP">
                  <el-input v-model="input.IP" :readonly="readonly" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="端口号">
                  <el-input v-model="input.PORT_NUMBER" :readonly="readonly" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="关联设备">
                  <deviceManage :device-list="devices" :sql="device_type_sql" :tunnel="input.TUNNEL" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="备注">
              <el-input
                v-model="input.DEVICE_DESC"
                type="textarea"
                :rows="6"
                placeholder="请输入内容"
                class="last_input"
                resize="none"
                :readonly="readonly"
              />
            </el-form-item>
          </el-form>
        </el-main>

        <el-footer>
          <el-button
            v-show="add_flag"
            type="warning"
            @click="Continue"
          >提交并继续添加</el-button>
          <el-button
            v-show="add_flag"
            type="success"
            @click="Add"
          >提交</el-button>
          <el-button
            v-show="edit_flag"
            type="warning"
            @click="update"
          >保存</el-button>
          <el-button v-show="clear_flag" @click="clear">重置</el-button>
        </el-footer>
      </el-container>
    </el-dialog>
  </div>
</template>
<script>
import { getSql, setSql } from '@/api/sql'
import Pagination from '@/components/Pagination' //  secondary package based on el-pagination
import { zGetCodeAll, zGetCode, zGetDir, zGetCodeValue } from '@/utils/common' // 数据字典
import deviceManage from './component/deviceManage'
// import { param } from '../../utils'

export default {
  components: { Pagination, deviceManage },
  data() {
    return {
      devices: [],
      sels: [],
      add_flag: '',
      edit_flag: '',
      clear_flag: true,
      dialogFormVisible: false,
      readonly: false,
      disabled: false,
      device_type_sql: '',
      title: '',
      listLoading: true,
      total: 0,
      zGetCodeValue: zGetCodeValue,
      zGetCode: zGetCode,
      relation: [],
      CHARACTERISTIC_ID: '',
      listQuery: {
        pageno: 1,
        pagesize: 5,
        sql: 401
      },
      tableData: [],
      device_type: zGetDir('equipmentType'),
      place_options: zGetCodeAll('tunnelType'),
      tunnel_options: zGetCodeAll('train'),
      //  查询条件
      search: {
        sql: 402,
        device_type: '',
        place: '',
        tunnel: '',
        device_number: ''
      },
      input: {
        DEVICE_NUMBER: '',
        TUNNEL: '',
        DEVICE_TYPE: '',
        POSITION: '',
        PILE_NUM1: '',
        PILE_NUM2: '',
        LANE: '',
        IP: '',
        PORT_NUMBER: '',
        DEVICE_DESC: '',
        PARENT_ID: ''
      },
      pile_num1: '',
      pile_num2: '',
      pile_v1: 'K',
      pile_v2: '+'
    }
  },
  mounted() {},
  created() {
    this.getList()
    // this.gettype()
  },
  methods: {
    //  获取数据
    getList() {
      this.listLoading = true
      getSql(this.listQuery).then(response => {
        this.total = response.total
        this.tableData = response.rows
        for (const i in this.tableData) {
          this.tableData[i].PLACE = zGetCode('tunnelType', this.tableData[i].POSITION).concat(this.pile_v1, this.tableData[i].PILE_NUM1, this.pile_v2, this.tableData[i].PILE_NUM2)
        }
        console.log(this.tableData)
        this.listLoading = false
      })
    },

    //  条件查询
    Search() {
      getSql(this.search).then(response => {
        this.tableData = response.rows
        this.total = response.total
      })
      this.listQuery.pageno = 1
    },
    // 添加设备
    add() {
      this.clear()
      this.CHARACTERISTIC_ID = ''
      this.title = '添加设备'
      this.dialogFormVisible = true
      this.add_flag = true
      this.edit_flag = false
      this.clear_flag = true
      this.readonly = false
      this.disabled = false
    },
    // 保存
    Add() {
      this.Continue()
      this.back()
    },

    clear() {
      this.devices = []
      for (var i in this.input) {
        this.input[i] = ''
      }
      this.pile_num = ''
      this.position = ''
    },
    // 保存并继续
    Continue() {
      this.input.sql = 403
      console.log(this.input)
      setSql(this.input).then(response => {
        this.set_relation(response.msg)
      }).then(() => {
        this.clear()
      })
    },
    // 打开编辑弹出框
    edit(id) {
      this.add_flag = false
      this.edit_flag = true
      this.clear_flag = true
      this.dialogFormVisible = true
      this.title = '修改设备信息'
      this.readonly = false
      this.disabled = false
      this.getmessage(id)
    },
    // 查看弹出框
    check(id) {
      this.add_flag = false
      this.edit_flag = false
      this.clear_flag = false
      this.dialogFormVisible = true
      this.title = '查看设备信息'
      this.disabled = true
      this.readonly = true
      this.getmessage(id)
    },
    // 获取设备信息
    getmessage(id) {
      const params = {
        sql: 407,
        id: id
      }
      getSql(params).then(response => {
        this.input = response.rows[0]
        console.log(this.input)
        this.relation_fun()
      })
    },
    // 修改设备信息
    update() {
      this.input.sql = '408'
      console.log(this.input)
      setSql(this.input).then(() => {
        this.back()
      })
    },
    // 返回列表
    back() {
      this.dialogFormVisible = false
      this.getList()
    },
    // 单个删除
    def(id) {
      const params = {
        sql: 411,
        id: id
      }
      setSql(params).then(() => {
        this.getList()
      })
    },
    // selsChange(sels) {
    //   this.sels = sels
    // },
    change_relation(event) {
      this.input.PARENT_ID = event
      console.log(this.input.PARENT_ID, '关联设备')
      this.relation_fun()
    },
    change_type(event) {
      this.relation = []
      this.input.PARENT_ID = ''
      this.input.DEVICE_TYPE = event
      console.log(this.input.DEVICE_TYPE, '设备类型')
      this.relation_fun()
    },
    change_tunnel() {
      this.relation = []
      this.input.PARENT_ID = ''

      console.log(this.input.TUNNEL, '隧道')
      this.relation_fun()
    },
    change() {
      console.log(this.input.POSITION)
    },
    relation_fun() {
      this.devices = []
      const params = {
        sql: 421,
        DEVICE_TYPE: this.input.DEVICE_TYPE
      }

      getSql(params).then(response => {
        this.CHARACTERISTIC_ID = response.rows[0].CHARACTERISTIC_ID
        console.log(this.CHARACTERISTIC_ID, '设备类别')
      }).then(() => {
        if (this.CHARACTERISTIC_ID === '1') {
          this.getrelation(422)
        } else if (this.CHARACTERISTIC_ID === '2') {
          this.getrelation(423)
        }
      })
    },
    getrelation(sql) {
      this.device_type_sql = sql
      const params = {
        sql: sql,
        TUNNEL: this.input.TUNNEL
      }
      getSql(params).then(response => {
        this.relation = response.rows
        console.log(this.relation)
      }).then(() => {
        var arr = []
        var that = this
        if (sql === 422) {
          arr = this.relation.filter(function(data) {
            return data.PARENT_ID === that.input.ID
          })
        } else if (sql === 423) {
          arr = this.relation.filter(function(data) {
            return data.ID === that.input.PARENT_ID
          })
        }
        this.devices = arr.map(function(data) {
          return {
            PLACE: zGetCode('tunnelType', data.POSITION).concat(that.pile_v1, data.PILE_NUM1, that.pile_v2, data.PILE_NUM2),
            DEVICE_NUMBER: data.DEVICE_NUMBER,
            DEVICE_TYPE: zGetCodeValue(data.DEVICE_TYPE)
          }
        })
        console.log(this.devices)
      })
    }
    // // 设置关联设备
    // set_relation(id) {
    //   if (this.CHARACTERISTIC_ID === '1') {
    //     for (const i in this.input.PARENT_ID) {
    //       const params = {
    //         sql: 430,
    //         ID: this.input.PARENT_ID[i],
    //         PARENT_ID: id
    //       }
    //       setSql(params)
    //     }
    //   } else if (this.CHARACTERISTIC_ID === '2') {
    //     const params = {
    //       sql: 430,
    //       PARENT_ID: this.input.PARENT_ID,
    //       ID: id
    //     }
    //     setSql(params)
    //   }
    // }

  }
}
</script>
<style lang="scss" scoped>
* {
  margin: 0px;
}
.app-container {
  .el-container {
    border: 1px solid #dfdfdf;

    .el-header {
      background-color: #eceff1;
      height: 60px;
      line-height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-button {
        height: 40px;
      }
    }
    .el-main {
      .input {
        width: 100%;
        padding: 5px;
        border-bottom: 1px solid #e6ebf5;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          font-size: 14px;
        }
        .el-select {
          margin-right: 20px;
          width: 150px;
        }
        .el-input {
          width: 200px;
          margin: 8px;
        }
        .el-button {
          width: 100px;
          height: 40px;
          border: none;
        }
      }
    }
    .el-footer {
      .block {
     display: flex;
        height: 50px;
       justify-content: flex-end;
        align-items: center;
      }
    }
  }
  .el-dialog {
    .el-container {
      min-width: 100%;
      border: 1px solid #dfdfdf;
      .el-header {
        background-color: #eceff1;
        height: 60px;
        line-height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-button {
          height: 40px;
        }
      }
      .el-main {
        width: 90%;
        margin: 0 auto;
        .el-form {
          .el-row {
            margin-bottom: 10px;
            &:last-child {
              margin-bottom: 0;
            }
          }
          .el-form-item {
            .el-input {
              width: 250px;
              margin-right: 0px;
            }
            .pile_input {
              width: 125px;
            }
            .last_input {
              width: 600px;
            }

            .el-select {
              width: 250px;
            }
          }
        }
      }
      .el-footer {
        border-top: 1px solid #d0d3d6;
        display: flex;
        justify-content:center;
        height: 80px;
        align-items: center;
        .el-button {
          height: 40px;
        }
      }
    }
  }
}
</style>
