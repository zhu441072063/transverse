<template>
  <div class="app-container">
    <!-- 查询项 -->
    <div class="input"><el-button class="addPattern" type="success" @click="addTunnel">新增</el-button></div>
    <el-table ref="table" v-loading="Loading" row-key="id" :data="pageData" border style="width: 100%">
      <el-table-column prop="tunnelName" label="隧道名称" align="center" />
      <el-table-column prop="collectors" label="采集设备编号" min-width="200px" align="center" />
      <el-table-column prop="strength1" label="晴天模式" align="center" />
      <el-table-column prop="strength2" label="云天模式" align="center" />
      <el-table-column prop="strength3" label="阴天模式" align="center" />
      <el-table-column prop="strength4" label="重阴天模式" align="center" />
      <el-table-column prop="strength5" label="夜间模式" align="center" />
      <el-table-column prop="strength6" label="深夜模式" align="center" />
      <el-table-column prop="default" label="应急模式" align="center" />
      <el-table-column label="操作" min-width="200px" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top"><el-button type="success" icon="el-icon-edit" size="small" @click="edit(scope.row)" /></el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--弹窗1-->
    <el-dialog :title="title+'照明设置'" :visible.sync="isShowBox" :close-on-click-modal="false" class="dialog-them1">
      <el-container class="z-sjadd">
        <el-main style="height: 500px;overflow: auto;">
          <el-form label-width="110px" style="height:300px;" :inline="true">
            <el-row>
              <el-col :span="24">
                <el-form-item label="隧道">
                  <el-select v-model="pageJson.tunnel" :disabled="title=='修改'" clearable placeholder="选择隧道" @change="changeTunnel">
                    <el-option v-for="item in tunnel_options" :key="item.value" :label="item.CODELABEL" :value="item.CODEVALUE" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="洞外光强采集器">
                  <div class="collectors">{{ pageJson.collectors }}</div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="光强值1"><el-input v-model="list.strength1" /></el-form-item>
                晴天模式
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="光强值2"><el-input v-model="list.strength2" /></el-form-item>
                云天模式
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="光强值3"><el-input v-model="list.strength3" /></el-form-item>
                阴天模式
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="光强值4"><el-input v-model="list.strength4" /></el-form-item>
                重阴天模式
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="光强值5"><el-input v-model="list.strength5" /></el-form-item>
                夜间模式
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="光强值6"><el-input v-model="list.strength6" /></el-form-item>
                深夜模式
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="默认值"><el-input v-model="list.default" /></el-form-item>
                应急模式
              </el-col>
            </el-row>
          </el-form>
        </el-main>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowBox = false">取消</el-button>
        <el-button type="primary" @click="saveData()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { setSql } from '@/api/sql'
import { zGetCodeAll, zGetCode } from '@/utils/common' // 数据字典
import { util } from '@/utils/util'
export default {
  name: 'BackToTop',
  data() {
    return {
      isShowBox: false,
      tunnel_options: zGetCodeAll('train'),
      devices: [],
      title: '新建',
      pageJson: {
        tunnel: '',
        collectors: ''
      },
      list: {
        strength1: '',
        strength2: '',
        strength3: '',
        strength4: '',
        strength5: '',
        strength6: '',
        default: ''
      },
      pageData: [],
      Loading: false,
      allPageData: [],
      collectorDevices: []
    }
  },
  mounted() {
    this.getAllPageData()
  },
  created() {
    var that = this
    // 获取洞外光强采集器
    util.getDeviceList('co_intensity', function(data) {
      that.collectorDevices = data
    })
  },
  beforeDestroy() {},
  methods: {
    changeTunnel() {
      var tunnel = this.pageJson.tunnel
      this.pageJson.collectors = this.getTunnelDevices(tunnel)
    },
    getTunnelDevices(id) {
      var filterArr = this.collectorDevices.filter(function(data) {
        return data.TUNNEL == id
      })
      var arr = filterArr.map(function(data) {
        return data.PLACE
      })
      var str = arr.join(',')
      return str
    },
    getAllPageData(callback) {
      var that = this
      setSql({
        sql: '1406'
      }).then(response => {
        var arr = response.rows
        that.allPageData = arr
        for (var i = 0; i < arr.length; i++) {
          var list = arr[i].INTENSITYTEXT
          if (list && typeof list === 'string') {
            var obj = JSON.parse(list)
            arr[i]['collectors'] = that.getTunnelDevices(arr[i].TUNNEL)
            arr[i]['tunnelName'] = zGetCode('train', arr[i].TUNNEL)
            arr[i]['strength1'] = obj.strength1
            arr[i]['strength2'] = obj.strength2
            arr[i]['strength3'] = obj.strength3
            arr[i]['strength4'] = obj.strength4
            arr[i]['strength5'] = obj.strength5
            arr[i]['strength6'] = obj.strength6
            arr[i]['default'] = obj.default
          }
        }

        that.pageData = arr
        if (callback) {
          callback()
        }
      })
    },
    initData() {
      var obj = this.pageJson
      var list = this.list
      for (var key in obj) {
        obj[key] = ''
      }
      for (var key in list) {
        list[key] = ''
      }
    },
    addTunnel() {
      this.initData()
      this.title = '新建'
      this.isShowBox = true
    },
    closeBox() {
      this.isShowBox = false
    },
    // 保存数据
    saveData() {
      var date = new Date()
      var tunnelId = this.pageJson.tunnel
      var that = this
      date = util.dateFormat('YYYY-mm-dd HH:MM:SS', date)
      var allPageData = this.allPageData
      var index = allPageData.findIndex(function(obj) {
        return obj.TUNNEL == tunnelId
      })
      var obj = {
        sql: 1407,
        INTENSITYTEXT: JSON.stringify(this.list), //,
        UPDATE_TIME: date
      }
      if (index == -1) { // 库里没有新增
        obj.TUNNEL = tunnelId
        obj.CREATE_TIME = date
      } else { // 库里有
        obj.sql = 1408
        obj.ID = allPageData[index].ID
      }
      setSql(obj).then(response => {
        that.isShowBox = false
        that.getAllPageData()
        that.$message({
          type: 'success',
          message: '保存成功!'
        })
      })
    },
    edit(data) { // 编辑光照采集器
      this.isShowBox = true
      this.title = '修改'
      this.pageJson.tunnel = data.TUNNEL
      this.pageJson.collectors = data.collectors
      this.list.strength1 = data.strength1
      this.list.strength2 = data.strength2
      this.list.strength3 = data.strength3
      this.list.strength4 = data.strength4
      this.list.strength5 = data.strength5
      this.list.strength6 = data.strength6
      this.list.default = data.default
    }
  }
}
</script>

<style scoped>
.input {
  text-align: right;
  margin-right: 15px;
  margin-bottom: 15px;
}
.el-col-24 {
  line-height: 36px;
}
.el-dialog__header {
  border-bottom: 1px solid #ddd;
}
.el-dialog__body {
  padding: 30px 20px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
  height: 500px !important;
  overflow: auto;
}
.collectors{
  width: 250px;
  /* min-height: 40px; */
  height: 80px;
  border: 1px solid #ddd;
  padding: 0 5px;
  overflow: auto;
}
</style>
