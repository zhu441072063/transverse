<template>
  <div class="app-container">
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
          <el-row v-for="(item,index) in timeList">
            <el-col :span="24">
              <el-form-item :label="'时间'+(index+1)">
                <el-time-picker
                  v-model="item.time"
                  placeholder="选择时间点"
                />
              </el-form-item>
              <el-form-item label="模式">
                <el-select v-model="item.patternId" clearable placeholder="选着模式">
                  <el-option v-for="(item, index) in patternList" :key="index" :label="item.TYPE_NAME" :value="item.ID" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-main>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveData()">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getSql, setSql } from '@/api/sql'
import { zGetCodeAll } from '@/utils/common' // 数据字典
import { util } from '@/utils/util'
export default {
  name: 'BackToTop',
  components: {},
  data() {
    return {
      isShow: false,
      rowData: '',
      tunnel_options: zGetCodeAll('train'),
      devices: [],
      boxInfo: {
        title: '',
        tunnel: ''
      },
      timeList: [],
      patternList: [],
      allPageData: []
    }
  },
  mounted() {},
  created() {
    var obj = {
      time: '',
      patternId: ''
    }
    for (var i = 0; i < 8; i++) {
      var data = JSON.parse(JSON.stringify(obj))
      this.timeList.push(data)
    }
    this.gettype()
    // 获取照明模式所有关联设备
    this.getAllData()
  },
  methods: {
    getAllData(callback) {
      var that = this
      setSql({
        sql: '1405'
      }).then(response => {
        that.allPageData = response.rows
        if (callback) {
          callback()
        }
      })
    },
    changeTunnel() {
      var tunnelId = this.boxInfo.tunnel // 隧道ID
      var obj = this.allPageData.find(function(data) {
        return data.TUNNEL == tunnelId
      })
      obj = obj || {}
      if (typeof obj.TIMECONTROLTEXT === 'string') {
        this.timeList = JSON.parse(obj.TIMECONTROLTEXT)
      } else {
        this.timeList.forEach(function(data) {
          for (var i in data) {
            data[i] = ''
          }
        })
      }
    },
    // 保存数据
    saveData() {
      var date = new Date()
      var tunnelId = this.boxInfo.tunnel
      var that = this
      date = util.dateFormat('YYYY-mm-dd HH:MM:SS', date)
      var index = this.allPageData.findIndex(function(obj) {
        return obj.TUNNEL == tunnelId
      })
      var obj = {
        sql: 1403,
        TIMECONTROLTEXT: JSON.stringify(this.timeList), //,
        UPDATE_TIME: date
      }
      if (index == -1) { // 库里没有新增
        obj.TUNNEL = tunnelId
        obj.CREATE_TIME = date
      } else { // 库里有
        obj.sql = 1404
        obj.ID = that.allPageData[index].ID
      }
      setSql(obj).then(response => {
          that.isShow = false
          that.getAllData()
          that.$message({
            type: 'success',
            message: '保存成功!'
          })
      })
    },
    initPageData() {
      var that = this
      this.getAllData(function() {
        that.changeTunnel()
      })
    },
    //  获取模式类型
    gettype() {
      var that = this
      getSql({
        sql: 1402,
        FIXD_FLAG: 0
      }).then(response => {
        that.patternList = response.rows
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
.app-container{
  border: 1px solid #ddd;
}
</style>
