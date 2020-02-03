<template>
  <div class="app-container">
    <el-header>
      <div style="text-align: right;">
        <el-button type="success" @click="addPattern()">新建</el-button>
      </div>
    </el-header>
    <el-table ref="table" v-loading="Loading" row-key="id" :data="pageData" border style="width: 100%">
      <el-table-column prop="ID" label="模式序号" min-width="90px" align="center" />
      <el-table-column prop="TYPE_NAME" label="模式名称" min-width="120px" align="center" />
      <el-table-column label="操作" min-width="200px" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="设置" placement="top">
            <el-button type="warning" icon="el-icon-setting" size="small" @click="setPattern(scope.row)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="success" icon="el-icon-edit" size="small" @click="editPattern(scope.row)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" size="small" @click="delPattern(scope.row.ID)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="boxInfo.title"
      :visible.sync="isShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      class="dialog-them1"
      width="650px"
    >
      <el-container class="z-sjadd">
        <el-main>
          <el-form label-width="84px" >
            <el-row>
              <el-col :span="12">
                <el-form-item label="隧道">
                  <el-select v-model="boxInfo.tunnel" clearable placeholder="选择隧道" @change="changeTunnel">
                    <el-option v-for="item in tunnel_options" :key="item.value" :label="item.CODELABEL" :value="item.CODEVALUE" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="位置">
                  <el-select v-model="boxInfo.typeRoute" clearable placeholder="选择位置" @change="changeTunnel">
                    <el-option v-for="item in typeRoute_options" :key="item.value" :label="item.CODELABEL" :value="item.CODEVALUE" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="关联设备">
                  <deviceManage :device-list="devices" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-main>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取消</el-button>
        <el-button type="primary" @click="saveData()">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="pattern.title"
      :visible.sync="isShowPattern"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      class="dialog-them1"
      width="650px"
    >
      <el-container class="z-sjadd">
        <el-main>
          <el-form label-width="84px" :inline="true">
            <el-row>
              <el-col :span="24">
                <el-form-item label="模式名称">
                  <el-input v-model="pattern.patternName" placeholder="模式名称" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注">
                  <el-input v-model="pattern.remark" style="width: 250px;" type="textarea" autosize placeholder="备注" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-main>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowPattern = false">取消</el-button>
        <el-button type="primary" @click="savePatternData()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSql, setSql } from '@/api/sql'
import { zGetCodeAll } from '@/utils/common' // 数据字典
import deviceManage from './deviceManage'
import { util } from '@/utils/util'
export default {
  name: 'BackToTop',
  components: { deviceManage },
  props: {
    transitionName: {
      type: String,
      default: 'fade'
    }
  },
  data() {
    return {
      isShow: false,
      isShowPattern: false,
      rowData: '',
      tunnel_options: zGetCodeAll('train'),
      typeRoute_options: zGetCodeAll('tunnelType'),
      devices: [],
      boxInfo: {// 关联设备的弹窗
        title: '',
        tunnel: '',
        typeRoute: ''
      },
      pattern: {//
        title: '新建',
        patternName: '',
        remark: ''
      },
      pageData: [],
      Loading: false,
      listQuery: {
        pageno: 1,
        pagesize: 1000,
        mode: 'get',
        sql: 401
      },
      allLightDevices: []
    }
  },
  mounted() {

  },
  created() {
    this.gettype()
    // 获取照明模式所有关联设备
    this.getAllDevices()
  },
  methods: {
    initAllData() { // 初始化所有数据
      this.isShow = false
      this.isShowPattern = false
      this.gettype()
    },
    savePatternData() { // 新建模式
      var date = new Date()
      var that = this
      date = util.dateFormat('YYYY-mm-dd HH:MM:SS', date)
      if (this.pattern.title == '新建') {
        setSql({
          sql: 1506,
          TYPE_NAME: this.pattern.patternName,
          FIXD_FLAG: 0,
          REMARK: this.pattern.remark,
          CREATE_TIME: date,
          UPDATE_TIME: date
        }).then(response => {
          that.$message({
            type: 'success',
            message: '新建成功!'
          })
          that.initAllData()
        })
      } else { // 修改
        setSql({
          sql: 1507,
          TYPE_NAME: this.pattern.patternName,
          REMARK: this.pattern.remark,
          UPDATE_TIME: date,
          ID: this.rowData.ID
        }).then(response => {
          that.$message({
            type: 'success',
            message: '修改成功!'
          })
          that.initAllData()
        })
      }
    },
    // 新建分类
    addPattern() {
      this.isShowPattern = true
      this.pattern.title = '新建'
      this.pattern.remark = ''
      this.pattern.patternName = ''
    },
    // 编辑分类
    editPattern(row) {
      this.rowData = row
      this.isShowPattern = true
      this.pattern.title = '修改'
      this.pattern.remark = row.REMARK
      this.pattern.patternName = row.TYPE_NAME
    },
    delPattern(id) {
      var that = this
      setSql({
        sql: 1508,
        ID: id
      }).then(response => {
        that.initAllData()
      })
    },
    getAllDevices() {
      var that = this
      setSql({
        sql: '1503'
      }).then(response => {
        that.allLightDevices = response.rows
      })
    },
    changeTunnel() {
      var that = this
      var tunnelId = this.boxInfo.tunnel // 隧道ID
      var typeRoute = this.boxInfo.typeRoute// 位置
      var arr = this.allLightDevices.filter(function(data) {
        return data.TUNNEL == tunnelId && data.POSITION == typeRoute && data.PATTERN_ID == that.rowData.ID
      })
      arr = arr || []
      this.devices = arr.map(function(data) {
        return {
          PLACE: data.PLACE,
          DEVICE_ID: data.DEVICE_ID
        }
      })
    },
    getList() {
      this.listLoading = true
      var that = this
      getSql(this.listQuery).then(response => {
        that.listLoading = false
      })
    },
    edit() {},
    setPattern(data) {
      this.rowData = data
      this.boxInfo.title = data.TYPE_NAME
      this.isShow = true
      this.boxInfo.tunnel = ''
      this.boxInfo.typeRoute = ''
      this.devices = []
    },
    // 保存数据
    saveData() {
      var rowData = this.rowData
      var date = new Date()
      var boxInfo = this.boxInfo
      date = util.dateFormat('YYYY-mm-dd HH:MM:SS', date)
      var that = this
      // 先删除后插入
      setSql({
        sql: 1504,
        TUNNEL: boxInfo.tunnel,
        PATTERN_ID: rowData.ID
      }).then(response => {
        that.devices.forEach(function(data) {
          var obj = {
            sql: 1505,
            PATTERN_ID: rowData.ID,
            PATTERN_NAME: rowData.TYPE_NAME, //
            TUNNEL: boxInfo.tunnel,
            DEVICE_ID: data.DEVICE_ID,
            PLACE: data.PLACE,
            POSITION: boxInfo.typeRoute,
            FIXD_FLAG: 0,
            CREATE_TIME: date,
            UPDATE_TIME: date
          }
          setSql(obj).then(response => {
            if (that.devices.length == (index + 1)) {
              that.$message({
                type: 'success',
                message: '保存成功!'
              })
              that.initAllData()
            }
          })
        })
      })
    },
    //  获取模式类型
    gettype() {
      var that = this
      setSql({
        sql: 1401,
        FIXD_FLAG: "0"
      }).then(response => {
        that.pageData = response.rows
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .el-dialog {
    .el-dialog__header {
      border-bottom: 1px solid #ddd;
    }
  }
  .demonstration {
    display: inline-block;
    width: 80px;
    text-align: right;
    padding-right: 4px;
  }
  .dialog-them1 .el-textarea__inner{
    width: 250px;
  }
}
.dialog-them1 .el-container .el-main .el-form .el-form-item >>> .el-input{
    width: 180px;
  }
.app-container{
  padding: 0;
}
</style>
