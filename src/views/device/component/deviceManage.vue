<template>
  <div class="app-container">
    <div class="relationDevices">
      <el-tag
        v-for="(tag,index) in deviceList"
        :key="index"
        closable
        @close="handleClose(index)"
      >
        {{ tag.DEVICE_TYPE }} {{ tag.PLACE }}
      </el-tag>
    </div>
    <el-button class="updateBtn" type="warning" @click="relevanceDevices">添加</el-button>
    <el-dialog
      class="dialog-them1"
      :append-to-body="true"
      :modal-append-to-body="true"
      width="1050px"
      title="添加设备"
      :visible.sync="isShow"
      :close-on-click-modal="false"
    >
      <el-container>
        <el-main>
          <!-- 查询项 -->
          <el-form label-width="84px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="设备类型">
                  <el-select v-model="search.device_type" clearable placeholder="设备类型">
                    <el-option v-for="(item, index) in device_options" :key="index" :label="item.CODEMEAN" :value="item.CODENAME" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="隧道">
                  <el-select v-model="search.tunnel" clearable placeholder="隧道">
                    <el-option v-for="item in tunnel_options" :key="item.value" :label="item.CODELABEL" :value="item.ID" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="位置">
                  <el-select v-model="search.place" clearable placeholder="位置">
                    <el-option v-for="item in place_options" :key="item.value" :label="item.CODELABEL" :value="item.ID" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-form-item label="隧道">
                  <el-input v-model="search.device_number" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-button type="success" @click="Search">查询</el-button>
              </el-col>
            </el-row>
          </el-form>
          <!-- 表格 -->
          <div ref="selectDatas" class="table">
            <el-table
              ref="table"
              v-loading="listLoading"
              :data="tableData"
              style="width: 100%"
              row-key="ID"
              @row-click="handleCurrentChange"
              @selection-change="selsChange"
            >
              <el-table-column v-if="false" prop="ID" label="ID" width="60px" align="center" />
              <el-table-column type="selection" width="55" align="center" reserve-selection="" />
              <el-table-column prop="DEVICE_NUMBER" label="设备编号" align="center" />
              <el-table-column label="隧道" align="center">
                <template slot-scope="{row}">
                  {{ row.TUNNEL|getcodeName(1) }}
                </template>
              </el-table-column>
              <el-table-column
                label="设备类型"
                align="center"
              >
                <template slot-scope="{row}">
                  {{ row.DEVICE_TYPE|getcodeName(2) }}
                </template>
              </el-table-column>
              <el-table-column prop="PLACE" label="位置" align="center" />
              <el-table-column prop="STATE" label="状态" align="center" />
              <el-table-column label="所在车道" min-width="120px" align="center" prop="LANE" />
              <el-table-column label="备注" min-width="120px" align="center" prop="DEVICE_DESC" />
            </el-table>
          </div>
        </el-main>
        <!-- 分页 -->
        <el-footer>
          <div class="block"><pagination :total="total" :page.sync="listQuery.pageno" :limit.sync="listQuery.pagesize" @pagination="getList" /></div>
        </el-footer>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取消</el-button>
        <el-button type="primary" @click="selectDevicesData()">选择</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getSql } from '@/api/sql'
import Pagination from '@/components/Pagination' //  secondary package based on el-pagination
import { zGetCodeAll, zGetCode, zGetDir, zGetCodeValue } from '@/utils/common' // 数据字典
export default {
  name: 'DeviceManage',
  components: { Pagination },
  filters: {
    /*
      type {number} {
        1:zGetCode
        2:zGetCodeValue
      }
    */
    getcodeName(code, type) {
      if (type === 1) {
        return zGetCode('train', code)
      } else if (type === 2) {
        return zGetCodeValue(code)
      }
    }
  },
  props: [
    'deviceList',
    // : {
    //   type: Array
    //    default: []
    // },
    'sql',
    'tunnel'
  ],
  data() {
    return {
      sels: [],
      isShow: false,
      disabled: false,
      title: '',
      listLoading: true,
      select_val: '',
      total: 0,
      listQuery: {
        pageno: 1,
        pagesize: 5,
        sql: '',
        TUNNEL: ''
      },

      tableData: [],
      device_options: zGetDir('equipmentType'),
      place_options: zGetCodeAll('tunnelType'),
      device_type: zGetDir('equipmentType'),
      tunnel_options: zGetCodeAll('train'),
      //  查询条件
      search: {
        sql: 402,
        device_type: '',
        place: '',
        tunnel: '',
        device_number: ''
      },
      pile_v1: 'K',
      pile_v2: '+'
    }
  },
  watch: {
    sql: function(newVal, oldVal) {
      this.listQuery.sql = newVal
      this.getList()
    },
    tunnel: function(newVal, oldVal) {
      this.listQuery.TUNNEL = newVal
    }
  },
  mounted() {
    this.search.device_type = this.deviceType
  },
  created() {
    this.yesno = zGetCodeAll('yesno')
  },
  methods: {
    getCode(a, b) {
      zGetCode(a, b)
    },
    handleClose(index) {
      this.deviceList.splice(index, 1)
    },
    relevanceDevices() {
      this.isShow = true
      // this.getList()
    },
    handleCurrentChange(row, event, column) {
      this.$refs.table.toggleRowSelection(row)
    },
    selectDevicesData() { // 选着关联设备数据
      var devices = this.$refs.table.selection
      var arr = this.deviceList || []// 当前设备列表
      this.isShow = false
      var that = this
      devices.filter(function(data1) {
        var flag = arr.findIndex(function(data2) {
          return data1.ID === data2.ID
        })
        if (flag === -1) {
          arr.push({
            DEVICE_TYPE: zGetCodeValue(data1.DEVICE_TYPE),
            PLACE: zGetCode('tunnelType', data1.POSITION).concat(that.pile_v1, data1.PILE_NUM1, that.pile_v2, data1.PILE_NUM2),
            DEVICE_ID: data1.ID
          })
        }
      })
    },
    //  获取数据
    getList() {
      this.listLoading = true
      getSql(this.listQuery).then(response => {
        this.total = response.total
        this.tableData = response.rows
        for (const i in this.tableData) {
          this.tableData[i].PLACE = zGetCode('tunnelType', this.tableData[i].POSITION).concat(this.pile_v1, this.tableData[i].PILE_NUM1, this.pile_v2, this.tableData[i].PILE_NUM2)
        }
        this.listLoading = false
      })
      console.log(this.tunnel_options)
    },
    // 多选列表
    selsChange(sels) {
      this.sels = sels
    },
    //  条件查询
    Search() {
      this.listLoading = true
      getSql(this.search).then(response => {
        this.tableData = response.rows
        this.total = response.total
        this.listLoading = false
      })
      this.listQuery.pageno = 1
    }
  }
}
</script>
<style lang="scss" scoped>
.relationDevices{
  width: 380px;
  height: 120px;
  overflow: auto;
  border: 1px solid #ddd;
  padding: 5px;
  display: inline-block;
}
.updateBtn{
  position: absolute;
  transform: translateX(10px);
}
.el-form-item{
  margin-bottom: 5px;
}
.dialog-them1 .el-container .el-main .el-form .el-form-item >>> .el-input{
  width: 180px;
}
</style>
