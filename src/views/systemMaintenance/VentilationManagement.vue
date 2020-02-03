<template>
  <div class="app-container">
    <el-container>
      <el-header>设备管理
        <div>
          <!-- <el-button type="success" @click="windowInfo3.isShow=true">风机控制</el-button> -->
          <el-button type="success" @click="addGroup()">添加通风组</el-button>
        </div>
      </el-header>
      <el-main>
        <!-- 查询项 -->
        <div class="input">
          <div>
            <span>隧道: </span>
            <el-select v-model="search.tunnel"  clearable placeholder="隧道">
              <el-option
                v-for="item in tunnel_options"
                :key="item.value"
                :label="item.CODELABEL"
                :value="item.CODEVALUE"
              />
            </el-select>
            <span>风机组名:</span>
            <el-input v-model="search.name" placeholder="请输入内容" />
          </div>
          <el-button type="success" @click="Search">查询</el-button>
        </div>
        <!-- 表格 -->
        <div class="table">
          <el-table
            ref="table"
            v-loading="listLoading"
            row-key="id"
            :data="pageData"
            style="width: 100%"
            @row-click="handleCurrentChange"
            @selection-change="selsChange"
          >
            <el-table-column type="selection" width="55" align="center" reserve-selection="" />
            <el-table-column prop="GROUP_NUMBER" label="风机组编号" min-width="90px" align="center" />
            <el-table-column prop="GROUP_NAME" label="风机组名" min-width="120px" align="center" />
            <el-table-column prop="TUNNEL" label="隧道" min-width="120px" align="center" />
            <el-table-column label="备注" min-width="120px" align="center" prop="REMARK" />
            <el-table-column label="操作" min-width="200px" align="center">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="关联风机" placement="top">
                  <el-button type="warning" icon="el-icon-setting" size="small" @click="handleDevice(scope.row)" />
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="修改" placement="top">
                  <el-button type="success" icon="el-icon-edit" size="small" @click="edit(scope.row)" />
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
      <el-footer>
        <div class="block">
          <el-button :disabled="this.sels.length === 0" @click="delGroup">批量删除</el-button>
          <pagination :total="total" :page.sync="listQuery.pageno" :limit.sync="listQuery.pagesize" @pagination="getList" />
        </div>
      </el-footer>
    </el-container>

    <el-dialog :title="windowInfo2.title" class="dialog-them1" :visible.sync="dialogFormVisible" width="800px" :close-on-click-modal="false">
      <el-container class="z-sjadd">
        <el-main>
          <el-form label-position="right" label-width="180px">
            <el-form-item label="风机组编号">
              <el-input v-model="fanInfo.GROUP_NUMBER" />
            </el-form-item>
            <el-form-item label="风机组名">
              <el-input v-model="fanInfo.GROUP_NAME" />
            </el-form-item>
            <el-form-item label="关联设备">
              <deviceManage :device-list="fanDevices" />
            </el-form-item>
            <el-form-item label="隧道">
              <el-select v-model="fanInfo.TUNNEL" clearable placeholder="隧道">
                <el-option
                  v-for="item in tunnel_options"
                  :key="item.value"
                  :label="item.CODELABEL"
                  :value="item.CODEVALUE"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="fanInfo.REMARK" />
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="saveFanInfoData()">
          提交
        </el-button>
      </div>
    </el-dialog>

    <!--弹窗3-->
    <el-dialog class="dialog-them1" width="1050px" :title="windowInfo3.title" :visible.sync="windowInfo3.isShow" :close-on-click-modal="false">
      <el-container>
        <template>
          <el-tabs v-model="windowInfo3.activeName" type="card" @tab-click="handleClick">
            <!--卡片1-->
            <el-tab-pane label="风机自控设置" name="first">
              <el-form label-width="100px" class="demo-form-inline">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="隧道">
                      <el-select v-model="fanControl.TUNNEL" :disabled="true" clearable placeholder="隧道">
                        <el-option
                          v-for="item in tunnel_options"
                          :key="item.value"
                          :label="item.CODELABEL"
                          :value="item.CODEVALUE"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="风机组名称">
                      <el-input v-model="fanControl.GROUP_NAME" :disabled="true" add-group />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12" style="text-align: left;">
                    <el-form-item label="CO采集器">
                      <el-select v-model="fanControl.CO" clearable placeholder="CO采集器" @change="changeCo">
                        <el-option
                          v-for="item in coList"
                          :key="item.ID"
                          :label="item.PLACE"
                          :value="item.ID"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-for="(item,index) in fanControl.CONCENTRATION_TEXT">
                  <el-col :span="8">
                    <el-form-item :label="'浓度值'+(index+1)">
                      <el-input v-model="item.concentration" add-group />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="开启台数">
                      <el-select
                        v-model="item.devices"
                        multiple
                        collapse-tags
                        style="margin-left: 20px;"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in fanList"
                          :key="item.ID"
                          :label="item.PLACE"
                          :value="item.ID"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="转向">
                      <el-select v-model="item.orientation" placeholder="请选择">
                        <el-option
                          v-for="obj in turnTo"
                          :key="obj.value"
                          :label="obj.text"
                          :value="obj.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-tab-pane>
            <!--卡片2-->
            <el-tab-pane label="风机时控设置" name="second">
              <el-form label-width="100px" style="padding:10px 20px 10px 0;" class="demo-form-inline">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="隧道">
                      <el-select v-model="fanControl.TUNNEL" :disabled="true" clearable placeholder="隧道">
                        <el-option
                          v-for="item in tunnel_options"
                          :key="item.value"
                          :label="item.CODELABEL"
                          :value="item.CODEVALUE"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="风机组名称">
                      <el-input v-model="fanControl.GROUP_NAME" :disabled="true" add-group />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <el-form label-width="75px" class="fanTimeControl demo-form-inline">
                <el-row v-for="(item,index) in fanTimeControl.FANCONTROL_TEXT">
                  <el-col :span="8">
                    <el-form-item :label="'时间'+(index+1)">
                      <el-time-picker
                        v-model="item.time"
                        placeholder="任意时间点"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item :label="'时长'+(index+1)">
                      <el-input v-model="item.timeLenth" add-group />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="转向">
                      <el-select v-model="item.orientation" placeholder="请选择">
                        <el-option
                          v-for="obj in turnTo"
                          :key="obj.value"
                          :label="obj.text"
                          :value="obj.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="开启台数">
                      <el-select
                        v-model="item.devices"
                        multiple
                        collapse-tags
                        style="margin-left: 20px;"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in fanList"
                          :key="item.ID"
                          :label="item.PLACE"
                          :value="item.ID"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="saveData()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getSql, setSql } from '@/api/sql'
import Pagination from '@/components/Pagination' //  secondary package based on el-pagination
import { zGetCodeAll, zGetCode } from '@/utils/common' // 数据字典
import deviceManage from './component/deviceManage'
import { util } from '@/utils/util'
export default {
  components: { Pagination, deviceManage },
  data() {
    return {
      sels: [], // 多选参数
      rowData: [], // 选中一行
      windowInfo1: {
        title: '风机组设置',
        isShow: false,
        checkAll: false,
        checkedCities: ['凤凰桥隧道'],
        isIndeterminate: true
      },
      windowInfo2: {
        type: 2, // 1:查看，2修改，3，新增
        title: '查看'
      },
      windowInfo3: {
        activeName: 'first', // 标签卡
        isShow: false,
        title: '风机控制'
      },
      dialogFormVisible: false, // 弹窗控制
      listLoading: true, // 加载
      select_val: '',
      total: 0,
      tunnel_options: zGetCodeAll('train'),
      timeControlData: // 时控设置对象
      {
        time: '',
        timeLenth: '',
        orientation: '',
        devices: []
      },
      controlData: // 自控设置对象
      {
        concentration: '',
        devices: [],
        orientation: ''
      },
      // 新建，修改风机
      fanInfo: {
        ID: '',
        GROUP_NUMBER: '',
        GROUP_NAME: '',
        devices: [],
        TUNNEL: '',
        REMARK: ''
      },
      fanDevices: [],
      // 风机控制弹窗
      fanControl: {
        TUNNEL: '',
        GROUP_NAME: '',
        CO: '',
        CONCENTRATION_TEXT: []// 浓度列表
      },
      // 风机时控弹窗
      fanTimeControl: {
        TUNNEL: '',
        GROUP_NAME: '',
        FANCONTROL_TEXT: []// 风机列表
      },
      // 所选数据
      selectDatas: {},
      //  查询条件
      listQuery: {
        pageno: 1,
        pagesize: 5,
        sql: 1106
      },
      pageData: [],
      search: {
        sql: 1108,
        device_type: '',
        tunnel: ''
      },
      position: '',
      pile_num: '',
      fanList: [], // 风机列表
      coList: [], // CO列表
      pile_v1: 'K',
      pile_v2: '+',
      turnTo: [
        {
          value: 0,
          text: '正转'
        }, {
          value: 1,
          text: '反转'
        }
      ],
      rowBoxData: {
        autoList: [], // 自控
        timeList: []// 时控
      }
    }
  },
  mounted() {
    this.getList()
  },
  created() {
    // 初始化数据，风机自控5条，风机时控  8条
    for (var i = 0; i < 8; i++) {
      var timeControlData = JSON.parse(JSON.stringify(this.timeControlData))
      var controlData = JSON.parse(JSON.stringify(this.controlData))
      this.fanTimeControl.FANCONTROL_TEXT.push(timeControlData)
      if (i < 5) {
        this.fanControl.CONCENTRATION_TEXT.push(controlData)
      }
    }
    var that = this
    // 所有风机设备
    util.getDeviceList('FAN', function(data) {
      that.fanList = data
    })
    // 所有CO设备
    util.getDeviceList('CO_CHECK', function(data) {
      that.coList = data
    })
  },
  methods: {
    // 切换CO采集器
    changeCo(id) {
      var list = this.rowBoxData.autoList
      if (typeof list === 'string') {
        list = this.rowBoxData.autoList = JSON.parse(this.rowBoxData.autoList)
      }
      var obj = list.find(function(data) {
        return data.DEVICE_ID == id
      })
      if (obj && typeof obj.CONCENTRATION_TEXT === 'string') {
        var arr = JSON.parse(obj.CONCENTRATION_TEXT)
        this.fanControl.CONCENTRATION_TEXT = arr
      } else {
        this.initBoxData()
      }
    },
    handleClose(index) {
      this.fanDevices.splice(index, 1)
    },
    selectDevicesData() { // 选着关联设备数据
      var devices = this.$refs.selectDatas.sels
      var arr = this.fanDevices// 当前设备列表
      this.windowInfo1.isShow = false
      var filterArr = devices.filter(function(data1) {
        var flag = arr.findIndex(function(data2) {
          return data1.ID == data2.ID
        })
        if (flag == -1) {
          arr.push({
            PLACE: data1.DEVICE_NUMBER + data1.PLACE,
            DEVICE_ID: data1.ID
          })
        }
      })
    },
    relevanceDevices(data) { // 关联设备
      this.windowInfo1.isShow = true
    },
    // 保存风机组
    saveFanInfoData() {
      var fanInfo = this.fanInfo
      // type:3 新建，2，修改
      var date = new Date()
      var type = this.windowInfo2.type
      var that = this
      var fanDevices = this.fanDevices
      date = util.dateFormat('YYYY-mm-dd HH:MM:SS', date)
      var obj = {
        GROUP_NUMBER: fanInfo.GROUP_NUMBER,
        GROUP_NAME: fanInfo.GROUP_NAME,
        // devices: '',
        TUNNEL: fanInfo.TUNNEL,
        REMARK: fanInfo.REMARK,
        UPDATE_TIME: date
      }
      if (type == '3') {
        obj.sql = '1101'
        obj.CREATE_TIME = date
      } else if (type == '2') {
        obj.sql = '1102'
        obj.ID = fanInfo.ID
      }
      // 保存风机组
      setSql(obj).then(() => {
        // that.dialogFormVisible = false
      })
      setSql({
        sql: '1204',
        GROUP_ID: fanInfo.ID
      }).then(() => {
        for (let i = 0; i < fanDevices.length; i++) {
          // 保存风机关联设备
          var fanobj = {
            sql: '1201',
            DEVICE_ID: fanDevices[i].DEVICE_ID,
            GROUP_ID: fanInfo.ID,
            PLACE: fanDevices[i].PLACE,
            CREATE_TIME: date,
            UPDATE_TIME: date
          }
          setSql(fanobj).then(() => {
            // that.dialogFormVisible = false
            if ((i + 1) == fanDevices.length) {
              that.dialogFormVisible = false
            }
          })
        }
      })
    },
    clear() {
      var fanInfo = this.fanInfo
      for (var i in fanInfo) {
        if (i == 'devices') {
          fanInfo[i] = []
        } else {
          fanInfo[i] = ''
        }
      }
      this.pile_num = ''
      this.position = ''
    },
    // 添加隧道
    addGroup() {
      this.clear()
      this.windowInfo2.title = '新建风机组'
      this.windowInfo2.type = 3
      this.dialogFormVisible = true
    },
    handleCheckAllChange(val) {
      var arr = this.tunnel_options.map(function(data) {
        return data.CODELABEL
      })
      this.windowInfo1.checkedCities = val ? arr : []
      this.windowInfo1.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.windowInfo1.checkAll = checkedCount === this.windowInfo1.checkedCities.length
      this.windowInfo1.isIndeterminate = checkedCount > 0 && checkedCount < this.tunnel_options.length
    },
    // 编辑
    edit(rowData) {
      var that = this
      this.windowInfo2.title = '修改隧道信息'
      this.windowInfo2.type = 2
      this.rowData = rowData
      for (var key in this.fanInfo) {
        this.fanInfo[key] = rowData[key]
      }
      this.getDevices(this.fanInfo.ID, function(data) {
        that.fanDevices = data.map(function(obj) {
          return {
            PLACE: obj.PLACE,
            DEVICE_ID: obj.DEVICE_ID
          }
        })
        that.dialogFormVisible = true
      })
    },
    saveData() {
      var fanControl = this.fanControl // 风机自控信息
      var rowData = this.rowData
      var fanTimeControl = this.fanTimeControl// 风机时控
      var date = new Date()
      var type = this.windowInfo2.type
      date = util.dateFormat('YYYY-mm-dd HH:MM:SS', date)
      var that = this
      if (this.windowInfo3.activeName == 'first') { // 自控
        // 先删除后插入
        setSql({
          sql: 1303,
          GROUP_ID: rowData.ID
        }).then(response => {
          var obj = {
            sql: 1301,
            DEVICE_ID: fanControl.CO,
            GROUP_ID: rowData.ID, //
            CONCENTRATION_TEXT: JSON.stringify(fanControl.CONCENTRATION_TEXT), // 浓度列表
            CREATE_TIME: date,
            UPDATE_TIME: date
          }
          setSql(obj).then(response => {
            that.$notify({
              title: '成功',
              message: '风机自控信息保存成功',
              type: 'success'
            })
          })
        })
      } else { // 时控
        var obj = {
          sql: 1104,
          ID: rowData.ID,
          FANCONTROL_TEXT: JSON.stringify(fanTimeControl.FANCONTROL_TEXT), // 浓度列表
          UPDATE_TIME: date
        }
        setSql(obj).then(response => {
          that.$notify({
            title: '成功',
            message: '风机时控信息保存成功',
            type: 'success'
          })
        })
      }
    },
    // 页面查询
    Search() {
      var that = this
      var search = this.search
      var obj = {
        sql: 1108,
        pageno: 1,
        pagesize: 5,
        GROUP_NAME: '%' + search.name + '%',
        TUNNEL: search.tunnel
      }
      debugger
      getSql(obj).then(response => {
        that.total = response.total
        that.pageData = response.rows || []
        that.listLoading = false
      })
    },
    // 切换选项卡
    handleClick(tab, event) {
      console.log(tab, event)
    },
    initBoxData() {
      var fanControl = this.fanControl
      for (var i in fanControl) {
        if (i == 'CONCENTRATION_TEXT') {
          fanControl[i].forEach(function(data, key) {
            data.concentration = ''
            data.orientation = ''
          })
        }
      }
      this.fanDevices = []
    },
    // 风机关联设备设置
    handleDevice(data) {
      this.rowData = data
      this.windowInfo3.isShow = true
      this.fanControl.TUNNEL = data.TUNNEL
      this.fanControl.GROUP_NAME = data.GROUP_NAME
      // 初始化弹窗数据
      this.initBoxData()
      // 自控,时控添加数据
      this.getAllGroup(data.ID)
    },
    // 获取所有group设备
    getAllGroup(id) {
      var that = this

      setSql({
        sql: '1302',
        GROUP_ID: id
      }).then(response => {
        that.rowBoxData.autoList = response.rows
      })
      // 时控
      setSql({
        sql: '1107',
        ID: id
      }).then(response => {
        // that.rowBoxData.timeList = response.rows
        that.setTimeControl(response.rows)
      })
    },
    setTimeControl(rows) {
      if (rows[0] && rows[0].FANCONTROL_TEXT) {
        this.fanTimeControl.FANCONTROL_TEXT = JSON.parse(rows[0].FANCONTROL_TEXT)
      }
    },
    searchData() { // 搜索
      var that = this
      var name = this.search.NAME
      var obj = JSON.parse(JSON.stringify(this.search))
      obj.NAME = '%' + name + '%'
      getSql(obj).then(response => {
        that.total = response.total
        that.pageData = response.rows
        that.listLoading = false
      })
    },
    //  获取数据
    getList() {
      this.listLoading = true
      var that = this
      getSql(this.listQuery).then(response => {
        that.total = response.total
        that.pageData = response.rows || []
        that.listLoading = false
      })
    },
    // 获取设备组关联设备
    getDevices(ID, callback) {
      var obj = {
        sql: 1203,
        GROUP_ID: ID
      }
      setSql(obj).then(response => {
        callback(response.rows)
      })
    },
    // 修改设备信息
    update() {
      this.concat()
      var that = this
      this.input.mode = 'exec'
      this.input.sql = '408'
      console.log(this.input)
      setSql(this.input).then(() => {
        that.$notify({
          title: '成功',
          message: '修改设备信息成功',
          type: 'success'
        })
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
      var that = this
      const params = {
        sql: 1105,
        ID: id
      }
      setSql(params).then(() => {
        that.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success'
        })
        that.getList()
      })
    },
    // 多选列表
    selsChange(sels) {
      this.sels = sels
    },
    delGroup() {
      var ids = this.sels.map(item => item.ID) // 获取所有选中行的id组成的字符串，以逗号分隔
      for (const i in ids) {
        this.def(ids[i])
      }
    },
    handleCurrentChange(row, event, column) {
      this.$refs.table.toggleRowSelection(row)
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
          width: 250px;
        }
        .el-input {
          width: 250px;
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
        justify-content: space-between;
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
        .el-input--medium .el-input__inner{
          width: 180px !important;
        }
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
            }
            .last_input {
              width: 250px;
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
  }
}
.el-tabs {
  padding: 30px 20px;
}
.el-form{
  padding-right: 20px;
}
.fanTimeControl{
  border: 1px solid rgb(221, 221, 221);
  padding: 20px;
  height: 328px;
  overflow: auto;
}
.relationDevices{
  width: 380px;
  height: 120px;
  overflow: auto;
  border: 1px solid #ddd;
  padding: 5px;
  display: inline-block;
}
.app-main .dialog-them1 .el-container .el-main .el-form .el-form-item .el-input{
  width:380px
}
.updateBtn{
  position: absolute;
  transform: translatex(10px);
}
</style>
