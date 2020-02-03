<template>
  <div class="app-container">
    <el-container>
      <el-header>设备配置
        <el-button @click="add">添加设备信息</el-button>
      </el-header>
      <el-main>
        <!-- 查询项 -->
        <div class="input">
          <div>
            <el-select
              v-model="search.communication"
              clearable
              placeholder="通讯方式"
            >
              <el-option
                v-for="item in communication_options"
                :key="item.ID"
                :label="item.CODELABEL"
                :value="item.ID"
              />
            </el-select>
            <el-select
              v-model="search.type"
              clearable
              placeholder="类型"
            >
              <el-option
                v-for="item in type"
                :key="item.ID"
                :label="item.CODELABEL"
                :value="item.CODEVALUE"
              />
            </el-select>
            <span>设备类型：</span>
            <el-select
              v-model="search.device_type"
              clearable
              placeholder="设备类型"
            >
              <el-option
                v-for="(item) in device_options"
                :key="item.DEVICE_TYPE"
                :label="item.label"
                :value="item.DEVICE_TYPE"
              />
            </el-select>
            <span>生产厂家：</span>
            <el-input v-model="search.device_number" placeholder="请输入内容" />
          </div>
          <el-button type="success">查询</el-button>
        </div>
        <!-- 表格 -->
        <div class="table">
          <el-table
            ref="table"
            :data="list"
            style="width: 100%"
            row-key="ID"

            @selection-change="selsChange"
          >
            <el-table-column
              v-if="false"
              prop="ID"
              label="ID"
              width="60px"
              align="center"
            />
            <el-table-column type="selection" width="55" align="center" reserve-selection="" />
            <el-table-column
              label="设备类型"
              min-width="120px"
              align="center"
            >
              <template slot-scope="{row}">
                {{ zGetCodeValue(row.DEVICE_TYPE) }}
              </template></el-table-column>
            <el-table-column
              label="通讯方式"
              min-width="120px"
              align="center"
            >
              <template slot-scope="{row}">
                {{ zGetCode('communication', row.COMMUNICATION) }}
              </template></el-table-column>
            <el-table-column
              label="类别"
              min-width="120px"
              align="center"
            >
              <template slot-scope="{row}">
                {{ zGetCode('type', row.TYPE_ID) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="CHARACTERISTIC_ID"
              label="特性"
              min-width="120px"
              align="center"
            >
              <template slot-scope="{row}">
                {{ zGetCode('Characteristic', row.CHARACTERISTIC_ID) }}
              </template></el-table-column>
            <el-table-column
              prop="FACTORY"
              label="生产厂家"
              min-width="120px"
              align="center"
            />
            <el-table-column
              prop="MODEL"
              label="产品型号"
              min-width="120px"
              align="center"
            />

            <el-table-column
              prop="PHONE"
              label="联系电话"
              min-width="120px"
              align="center"
            />
            <el-table-column label="操作" min-width="200px" align="center">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="设置" placement="top">
                  <el-button type="warning" icon="el-icon-setting" size="small" @click="set(scope.row.ID)" />
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="修改" placement="top">
                  <el-button type="success" icon="el-icon-edit" size="small" @click="edit(scope.row.ID)" />
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <el-button type="danger" icon="el-icon-delete" size="small" @click="def(scope.row.ID)" />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
      <!-- 分页 -->
      <el-footer><div class="block">

        <pagination
          :total="total"
          :page.sync="listQuery.pageno"
          :limit.sync="listQuery.pagesize"
          @pagination="getList"
        /></div></el-footer>
    </el-container>

    <!-- 弹出框 -->
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
                <el-form-item label="设备类型">
                  <!-- <el-input v-model="input.DEVICE_TYPE" :readonly="readonly" /> -->
                  <el-select
                    v-model="input.DEVICE_TYPE"
                    clearable
                    placeholder="请选择"
                    :disabled="disabled"
                    @change="change_device_type($event)"
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
              <el-col :span="12">
                <el-form-item label="通讯方式">
                  <el-select
                    v-model="input.COMMUNICATION"
                    clearable
                    placeholder="请选择"
                    :disabled="disabled"
                    @change="change_communication($event)"
                  >
                    <el-option
                      v-for="item in communication_options"
                      :key="item.ID"
                      :label="item.CODELABEL"
                      :value="item.CODEVALUE"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="类别">
                  <el-select
                    v-model="input.TYPE_ID"
                    clearable
                    placeholder="类型"
                    @change="change_type($event)"
                  >
                    <el-option
                      v-for="item in type"
                      :key="item.ID"
                      :label="item.CODELABEL"
                      :value="item.CODEVALUE"
                    />
                  </el-select>
                </el-form-item></el-col>

            </el-row>
            <el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="特性">
                    <el-select
                      v-model="input.CHARACTERISTIC_ID"
                      clearable
                      placeholder="设备特性"
                      @change="change_Ch($event)"
                    >
                      <el-option
                        v-for="item in Characteristic"
                        :key="item.ID"
                        :label="item.CODELABEL"
                        :value="item.CODEVALUE"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="生产厂家">
                    <el-input v-model="input.FACTORY" :readonly="readonly" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="产品型号">
                    <el-input v-model="input.MODEL" :readonly="readonly" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系电话">
                    <el-input v-model="input.PHONE" :readonly="readonly" />
                  </el-form-item>
                </el-col></el-row>
              <el-row>
                <el-form-item label="备注">
                  <el-input
                    v-model="input.TYPE_DESC"
                    type="textarea"
                    :rows="6"
                    placeholder="请输入内容"
                    class="last_input"
                    resize="none"
                    :readonly="readonly"
                  />
                </el-form-item>
              </el-row></el-row></el-form>
        </el-main>

        <el-footer>
          <el-button v-show="add_flag" type="warning" @click="Continue">提交并继续添加</el-button>
          <el-button v-show="add_flag" type="success" @click="Add_type">提交</el-button>
          <el-button v-show="edit_flag" type="warning" @click="update">保存</el-button>
          <el-button v-show="clear_flag" @click="clear">重置</el-button>
        </el-footer>
      </el-container>

    </el-dialog>
    <el-dialog
      :visible.sync="dialogWarning"
      width="1000px"
      height="800px"
      :close-on-click-modal="false"
    >
      <el-tabs type="border-card">
        <el-tab-pane label="报警配置">
          <el-button type="primary" icon="el-icon-plus" @click="add_alarm_tr(waring_list)">增加报警项</el-button>
          <el-table :data="waring_list">
            <el-table-column label="报警项" min-width="120">
              <template slot-scope="{row}">
                <el-input v-model="row.ALARM_ITEM" size="small" placeholder="请输入内容" />
              </template>
            </el-table-column>
            <el-table-column label="报警值" min-width="120">
              <template slot-scope="{row}">
                <el-input v-model="row.ALARM_VAL" size="small" placeholder="请输入内容" />
              </template>
            </el-table-column>
            <el-table-column label="报警等级" min-width="120">
              <template slot-scope="{row}">
                <el-input v-model="row.GRADE" size="small" placeholder="请输入内容" />
              </template>
            </el-table-column>
            <el-table-column label="颜色" min-width="120">
              <template slot-scope="{row}">
                <el-input v-model="row.COLOR" size="small" placeholder="请输入内容" />
              </template>
            </el-table-column>
            <el-table-column label="声音" min-width="120">
              <template slot-scope="{row}">
                <el-input v-model="row.SOUND" size="small" placeholder="请输入内容" />
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="120">
              <template scope="scope">
                <a href="#" @click="del_alarm(scope.$index, scope.row)">删除</a>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="操作配置"> <el-button type="primary" icon="el-icon-plus" @click="add_opreation_tr(opreation_list)">增加操作</el-button>
          <el-table :data="opreation_list">
            <el-table-column label="操作名" min-width="120">
              <template slot-scope="{row}">
                <el-input v-model="row.OPERATION_NAME" size="small" placeholder="请输入内容" />
              </template>
            </el-table-column>
            <el-table-column label="操作值" min-width="120">
              <template slot-scope="{row}">
                <el-input v-model="row.OPERATION_VAL" size="small" placeholder="请输入内容" />
              </template>
            </el-table-column>
            <el-table-column label="操作图片" min-width="120">
              <template slot-scope="{row}">
                <el-input v-model="row.IMG" size="small" placeholder="请输入内容" />
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="120">
              <template scope="scope">
                <a href="#" @click="del_opreation(scope.$index, scope.row)">删除</a>
              </template>
            </el-table-column>
          </el-table></el-tab-pane>

      </el-tabs>
      <div class="set">
        <el-button type="">关闭</el-button>
        <el-button type="danger" @click="next">下一步</el-button>
      </div>
    </el-dialog>

  </div>

</template>
<script>
import { getSql, setSql } from '@/api/sql'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { zGetCodeAll, zGetCode, zGetDir, zGetCodeValue } from '@/utils/common' // 数据字典

export default {
  components: { Pagination },
  data() {
    return {
      zGetCodeValue: zGetCodeValue,
      zGetCode: zGetCode,
      type: zGetCodeAll('type'),
      Characteristic: zGetCodeAll('Characteristic'),
      device_type: zGetDir('equipmentType'),
      zGetDir: zGetDir,
      add_flag: '',
      edit_flag: '',
      clear_flag: true,
      sels: [],
      dialogFormVisible: false,
      dialogWarning: false,
      readonly: false,
      disabled: false,
      title: '',
      input: {
        DEVICE_TYPE: '',

        COMMUNICATION: '',
        TYPE_ID: '',
        CHARACTERISTIC_ID: '',
        FACTORY: '',
        MODEL: '',
        PHONE: '',
        TYPE_DESC: ''
      },
      search: {
        communication: '',
        device_type: '',
        type: '',
        Characteristic: ''
      },
      total: 0,
      listQuery: {
        pageno: 1,
        pagesize: 5,
        mode: 'get',
        sql: 405
      },
      list: [],
      device_options: [

      ],
      communication_options: zGetCodeAll('communication'),

      waring_list: [],
      opreation_list: [],
      DEVICE_TYPE_ID: '',
      alarm_del_id: [],
      opreation_del_id: []

    }
  },
  created() {
    this.getList()
    // this.gettype()
  },
  methods: {
    // 取表格数据
    getList() {
      getSql(this.listQuery).then(response => {
        this.total = response.total
        this.list = response.rows
      })
      console.log(this.type)
    },
    // 取设备类型
    // gettype() {
    //   const params = {
    //     mode: 'get',
    //     sql: 404
    //   }
    //   getSql(params).then(response => {
    //     this.device_options = response.rows
    //   })
    // },
    // /////////////////////////////////////////////////////////
    // 设置弹出框内容为添加
    add() {
      this.add_flag = true
      this.edit_flag = false
      this.title = '添加设备类型'
      this.dialogFormVisible = true
      this.readonly = false
      this.disabled = false
      this.clear()
      console.log(this.device_type)
    },
    Add_type() {
      this.Continue()
      this.back()
    },
    // 设置弹出框为编辑页面
    edit(id) {
      this.title = '修改设备类型'
      this.add_flag = false
      this.edit_flag = true
      this.dialogFormVisible = true
      this.readonly = false
      this.disabled = false
      const params = {
        mode: 'get',
        sql: 409,
        id: id
      }
      getSql(params).then(response => {
        this.input = response.rows[0]
        console.log(this.input)
      })
    },
    update() {
      this.input.mode = 'exec'
      this.input.sql = 410
      setSql(this.input).then(() => {
        this.back()
        this.getList()
      })
    },
    Continue() {
      this.input.mode = 'exec'
      this.input.sql = 406
      console.log(this.input)
      setSql(this.input).then(() => {
        this.clear()
      })
    },
    clear() {
      for (var i in this.input) {
        this.input[i] = ''
      }
    },
    // 删除
    def(id) {
      const params = {
        mode: 'exec',
        sql: 412,
        id: id
      }
      setSql(params).then(() => {
        this.getList()
      })
    },
    selsChange(sels) {
      this.sels = sels
    },

    back() {
      this.dialogFormVisible = false
      this.getList()
    },
    // 下拉框改变触发事件
    change_device_type(event) {
      this.input.DEVICE_TYPE = event
      console.log(this.input.DEVICE_TYPE)
    },
    change_communication(event) {
      this.input.COMMUNICATION = event
      console.log(this.input.COMMUNICATION)
    },
    change_type(event) {
      this.input.TYPE_ID = event
      console.log(this.input.TYPE_ID)
    },
    change_Ch(event) {
      this.input.CHARACTERISTIC_ID = event
      console.log(this.input.CHARACTERISTIC_ID)
    },
    // 设备配置报警设置
    set(id) {
      this.alarm_del_id = []
      this.opreation_del_id = []
      this.waring_list = []
      this.opreation_list = []
      this.dialogWarning = true
      const param1 = {
        sql: 413,
        id: id
      }
      this.DEVICE_TYPE_ID = id
      getSql(param1).then(response => {
        this.waring_list = response.rows
      })
      const param2 = {
        sql: 414,
        id: id
      }
      getSql(param2).then(response => {
        this.opreation_list = response.rows
        console.log(this.opreation_list)
      })
    },
    add_alarm_tr(waring_list) {
      waring_list.push({ DEVICE_TYPE_ID: this.DEVICE_TYPE_ID, ALARM_ITEM: '', COLOR: '', GRADE: '', SOUND: '', ALARM_VAL: '' })
      console.log(this.waring_list)
    },
    add_opreation_tr(opreation_list) {
      opreation_list.push({ DEVICE_TYPE_ID: this.DEVICE_TYPE_ID, OPERATION_NAME: '', OPERATION_VAL: '', IMG: '' })
      console.log(this.opreation_list)
    },
    next() {
      for (const i in this.waring_list) {
        if (this.waring_list[i].hasOwnProperty('ID')) {
          console.log(this.waring_list[i])
          this.update_set(this.waring_list[i], 415)
        } else {
          this.add_set(this.waring_list[i], 416)
        }
      }
      for (const i in this.opreation_list) {
        console.log('进来了')
        if (this.opreation_list[i].hasOwnProperty('ID')) {
          console.log(this.opreation_list[i])
          this.update_set(this.opreation_list[i], 418)
        } else {
          this.add_set(this.opreation_list[i], 419)
        }
      }
      for (const i in this.alarm_del_id) {
        const params = {
          sql: 417,
          id: this.alarm_del_id[i].id
        }
        setSql(params)
      }
      for (const i in this.opreation_del_id) {
        const params = {
          sql: 420,
          id: this.opreation_del_id[i].id
        }
        setSql(params)
      }
      this.dialogWarning = false
    },
    update_set(list, sql) {
      console.log(sql)
      list.sql = sql
      console.log(list.sql)

      setSql(list)
    },
    add_set(list, sql) {
      console.log(sql)

      list.sql = sql
      console.log(list.sql)
      setSql(list)
    },
    del_alarm(index, row) {
      if (row.hasOwnProperty('ID')) {
        this.alarm_del_id.push({ id: row.ID })
      }
      this.waring_list.splice(index, 1)
      console.log(index, row)
      console.log(this.alarm_del_id)
    },
    del_opreation(index, row) {
      if (row.hasOwnProperty('ID')) {
        this.opreation_del_id.push({ id: row.ID })
      }
      this.opreation_list.splice(index, 1)
      console.log(index, row)
      console.log(this.opreation_del_id)
    }

  }
}
</script>
<style lang="scss" scoped>
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
  .el-dialog{

  .el-container {
    min-width: 100%;
    border: 1px solid #ffffff;
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
      justify-content: center;
      height: 80px;
      align-items: center;
      .el-button {
        height: 40px;
      }
    }
  }
  .el-tabs{

      .el-input{
        border: none;
      }

  }
  .set{
    width:220px;
    margin:20px auto 0px ;

  }

  }

}
</style>
