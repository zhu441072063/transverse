<template>
  <div>
    <el-container class="z-sjadd">
      <el-main>
        <!-- 查询项 -->
        <div class="input">
          <div>
            <span>符合:</span>
            <el-select v-model="status" clearable placeholder="设备类型"><el-option v-for="(item, index) in pageSet" :key="index" :label="item.key" :value="item.value" /></el-select>
            <span>以前下条件:</span>
            <el-button type="success" @click="clearAll">清除全部</el-button>
            <el-button type="success" @click="addPlan">添加条件</el-button>
          </div>
        </div>
        <div class="addPlanBox">
          <el-row v-for="(team, index) in planList">
            <el-col :span="4">
              <el-select v-model="team.tunnel" clearable placeholder="隧道" @change="changeDeviceType">
                <el-option v-for="item in tunnel_options" :key="item.value" :label="item.CODELABEL" :value="item.CODEVALUE" />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select v-model="team.deviceType" clearable placeholder="设备类型" @change="changeDeviceType">
                <el-option v-for="item in device_type" :key="item.value" :label="item.DEVICE_TYPE|getcodeName(2)" :value="item.DEVICE_TYPE" />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select v-model="team.property" clearable placeholder="车道占有" @change="changeTunnel">
                <el-option v-for="item in propertyList" :key="item.value" :label="item.CODELABEL" :value="item.CODEVALUE" />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select v-model="team.condition" clearable placeholder="条件判断" @change="changeTunnel">
                <el-option v-for="item in conditionList" :key="item.value" :label="item.CODELABEL" :value="item.CODEVALUE" />
              </el-select>
            </el-col>
            <!--            <el-col :span="4">
              <el-select v-model="team.valueType" clearable placeholder="值" @change="changeTunnel">
                <el-option v-for="item in valueTypeList" :key="item.value" :label="item.CODELABEL" :value="item.CODEVALUE" />
              </el-select> -->
            </el-col>
            <el-col :span="4"><el-input v-model="team.value" /></el-col>
            <el-col :span="4">
              <el-button type="warning" @click="delPlan(index)"><i class="el-icon-close" /></el-button>
            </el-col>
          </el-row>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getSql, setSql } from '@/api/sql'
import { zGetCodeAll, zGetCode, zGetDir, zGetCodeValue } from '@/utils/common' // 数据字典
export default {
  name: 'BackToTop',
  filters: {
    /*
    type {number}
    */
    getcodeName(code, type) {
      if (type == 1) {
        return zGetCode('train', code)
      } else if (type == 2) {
        return zGetCodeValue(code)
      }
    }
  },
  props: {
    planList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      tunnel: '1',
      //planList: [],
      device_type: [], // 设备类型
      propertyList: zGetCodeAll('propertyList'), // 属性
      conditionList: zGetCodeAll('conditionList'), // 条件
      valueTypeList: zGetCodeAll('valueTypeList'), // 值属性
      tunnel_options: zGetCodeAll('train'),
      rowData: '',
      pageSet: [
        {
          key: '全部',
          value: '1'
        },
        {
          key: '任何',
          value: '2'
        }
      ],
      status: '1', // 状态
      Loading: false,
      listQuery: {
        pageno: 1,
        pagesize: 5,
        mode: 'get',
        sql: 401
      },
      planSelectInfo: {
        deviceType: '',
        property: '',
        condition: '',
        valueType: '',
        value: '',
        tunnel: ''
      },
      planInfo: [

      ]
    }
  },
  mounted() {
    // this.getList()
    this.getDeviceType()
  },
  beforeDestroy() {},
  methods: {
    getList() {
      this.listLoading = true
      var that = this
      getSql(this.listQuery).then(response => {
        that.listLoading = false
      })
    },
    clearAll() {
      this.planList = []
    },
    changeDeviceType() {

    },
    addPlan() {
      var obj = JSON.parse(JSON.stringify(this.planSelectInfo))
      this.planList.push(obj)
    },
    savePlan() {
      var that = this
    },
    delPlan(index) {
      this.planList.splice(index, 1)
    },
    changeTunnel() {},
    getDeviceType() {
      var that = this
      setSql({
        sql: 1199
      }).then(response => {
        that.device_type = response.rows
      })
    }
  }
}
</script>

<style scoped>
.el-dialog__body {
  border: 1px solid #ddd;
}
.addPlanBox {
  margin-top: 15px;
  height: 300px;
  text-align: center;
  border: 1px solid #ddd;
  overflow: auto;
}
.el-col {
  padding: 0 5px;
}
.el-row {
  padding: 4px;
}
.dialog-footer{
  text-align: right;
}
</style>
