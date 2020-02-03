<template>
  <div class="app-container">
    <el-table ref="table" v-loading="Loading" row-key="id" :data="pageData" border style="width: 100%">
      <el-table-column prop="ID" label="模式序号" min-width="90px" align="center" />
      <el-table-column prop="TYPE_NAME" label="模式名称" min-width="120px" align="center" />
      <el-table-column label="操作" min-width="200px" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="设置" placement="top">
            <el-button type="success" icon="el-icon-edit" size="small" @click="setPattern(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="boxInfo.title+'分类'"
      :visible.sync="isShow"
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
                <el-form-item label="隧道">
                  <el-select v-model="boxInfo.tunnel" clearable placeholder="选着隧道" @change="changeTunnel">
                    <el-option v-for="item in tunnel_options" :key="item.value" :label="item.CODELABEL" :value="item.CODEVALUE" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="照明分类">
                  <el-input v-model="boxInfo.type" :disabled="true" clearable placeholder="照明分类" />
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
        <el-button type="primary" @click="saveData()">提交</el-button>
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
      rowData: '',
      tunnel_options: zGetCodeAll('train'),
      devices: [],
      boxInfo: {
        title: '',
        tunnel: '',
        type: ''
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
  mounted() {},
  created() {
    this.gettype()
    // 获取照明模式所有关联设备
    this.getAllPageData()
  },
  methods: {
    getAllPageData() {
      var that = this
      setSql({
        sql: '1603'
      }).then(response => {
        that.allLightDevices = response.rows
      })
    },
    changeTunnel() {
      var that = this
      var tunnelId = this.boxInfo.tunnel // 隧道ID
      var arr = this.allLightDevices.filter(function(data) {
        return data.TUNNEL == tunnelId && data.PATTERN_ID == that.rowData.ID
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
    // 保存设置
    setPattern(data) {
      this.rowData = data
      this.boxInfo.title = data.TYPE_NAME
      this.isShow = true
      this.boxInfo.type = data.TYPE_NAME
      this.boxInfo.tunnel = this.tunnel_options[0].CODEVALUE
      this.changeTunnel()
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
        sql: 1604,
        TUNNEL: boxInfo.tunnel,
        PATTERN_ID: rowData.ID
      }).then(response => {
        that.devices.forEach(function(data, index) {
          var obj = {
            sql: 1602,
            PATTERN_ID: rowData.ID,
            PATTERN_NAME: rowData.TYPE_NAME, //
            TUNNEL: boxInfo.tunnel,
            DEVICE_ID: data.DEVICE_ID,
            PLACE: data.PLACE,
            FIXD_FLAG: 0,
            CREATE_TIME: date,
            UPDATE_TIME: date
          }
          setSql(obj).then(response => {
            if ((index + 1) == that.devices.length) {
              that.isShow = false
              that.getAllPageData()
              that.$message({
                type: 'success',
                message: '保存成功!'
              })
            }
          })
        })
      })
    },
    //  获取模式类型
    gettype() {
      var that = this
      getSql({
        sql: 1509,
        FIXD_FLAG: 0
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
}
</style>
