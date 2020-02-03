<template>
  <div>
    <!--防火门-->
    <el-dialog
      :title="'防火门控制'"
      :visible.sync="dialogShow"
      width="700px"
      :close-on-click-modal="false"
      class="dialog-them1"
      v-loading="dialogLoading"
    >
      <el-container class="z-sjadd">
        <el-main>
          <el-form label-width="110px" ref="dialogForm" :rules="rules" :model="modialogInfo" :inline="true">
            <el-row>
              <el-col :span="24">
                <el-collapse :accordion="false" v-model="collapse" prop="CHECK">
                  <template v-for="(item,index) in eqList" >
                    <div :key="index" class="g-list">
                      <el-collapse-item :name="item.name">
                        <template slot="title">
                          <div class="group-title">
                            <el-checkbox :indeterminate="isIndeterminate[index]" v-model="checkAll[index]" @change="handleCheckAllChange(index, $event)">本组全选</el-checkbox>
                            <div class="name">{{item.name}}</div>
                          </div>
                        </template>
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox-group v-model="checkedCities[index]" @change="handleCheckedCitiesChange(index, $event)">
                          <el-checkbox v-for="city in item.val" :label="city.value" :key="city.name">{{city.name}}</el-checkbox>
                        </el-checkbox-group>
                      </el-collapse-item>
                    </div>
                  </template>
                </el-collapse>
              </el-col>
            </el-row>
          </el-form>
        </el-main>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-checkbox :indeterminate="isAll" v-model="cAll" @change="handleAll">全选</el-checkbox>
        <el-button type="primary" @click="openGroup()">
          展开组
        </el-button>
        <el-button type="primary" @click="closeGroup()">
          关闭组
        </el-button>
        <template v-for="item in actionList">
          <el-button type="success" @click="addAction(item.CODEVALUE)">
            {{item.CODELABEL}}
          </el-button>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSql, setSql } from '@/api/sql'
import { zGetCodeAll, zGetCode } from '@/utils/common'
import { parseTime } from '@/utils'
export default {
  name: 'DialogFireDoor',
  props: {
  },
  components: {
  },
  data() {
    return {
      code: 'FIRE_DOOR',
      actionList: zGetCodeAll('FIRE_DOOR'),
      collapse: [],
      isAll: false,
      cAll: false,
      checkAll: [],
      checkAllID: [],
      checkedCities: [],
      eqList: [],
      eqList2: {},
      isIndeterminate: [],
      zGetCode: zGetCode,
      dialogLoading: false, // 加载
      modialogInfo: {
      },
      rules: { // 提交验证
      },
      dialogInfo: { // 事件处理提交表单
        ID: 0,
        sql: 603,
        STATUS: 1,
        HANDLE_TIME: '',
        HANDLE_MEMBER: '',
        HANDLE_STATUS: '',
        HANDLE_CONTENT: '',
        radio: '1'
      },
      dialogList: { // 列表
        sql: 499,
        DEVICE_TYPE: 'FIRE_DOOR', // 防火门类型ID
        TUNNEL: 1 // 隧道ID
      },
      dialogShow: false, // 是否弹出
      raList: {
        0: '上行防火门设置',
        1: '下行防火门设置'
      }
    }
  },
  mounted() {
  },
  methods: {
    // 显示列表
    showList() {
      this.dialogShow = true
      this.dialogLoading = true
      var eqList = []
      getSql(this.dialogList).then(response => {
        for (const v of response.rows) {
          this.eqList2[v.EQUIP_ID] = v.DEVICE_NUMBER
          if (!eqList[v.POSITION]) {
            eqList[v.POSITION] = {
              name: this.raList[v.POSITION],
              id: v.POSITION,
              val: []
            }
          }
          eqList[v.POSITION].val.push({
            name: v.DEVICE_NUMBER,
            value: v.EQUIP_ID
          })
        }
        this.eqList = []
        for (const v of eqList) {
          if (v) this.eqList.push(v)
        }
        this.Initialization()
      }).finally(response => {
        this.dialogLoading = false
      })
    },
    // 初始化复选框
    Initialization() {
      for (const val of this.eqList) {
        this.checkAll.push(false)
        this.isIndeterminate.push(false)
        this.checkedCities.push([])
        var Ids = []
        for (const v of val.val) {
          Ids.push(v.value)
        }
        this.checkAllID.push(Ids)
      }
    },
    // 下发
    addAction(value) {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          // this.dialogLoading = true
          var checkedCities = this.checkedCities
          var list = []
          for (const val of checkedCities) {
            for (const v of val) {
              list.push({
                aoType: value,
                equipId: v,
                id: v,
                equipName: this.eqList2[v]
              })
            }
          }
          if (list.length == 0) {
            this.$message({
              message: '请至少选择一个',
              type: 'error'
            })
            return
          }
          var agentData = {
            equipType: this.code,
            inFrom: 'Web',
            transType: '3',
            list: list
          }
          var st = JSON.stringify(agentData)
          this.$parent.$parent.websocketsend(st)
        }
      })
    },
    // 全部全选
    handleAll(val) {
      for (let i = 0; i < this.eqList.length; i++) {
        this.checkedCities[i] = val ? this.checkAllID[i] : []
        this.isIndeterminate[i] = false
        this.checkAll[i] = val ? true : false
      }
    },
    // 本组全选
    handleCheckAllChange(index, val) {
      this.checkedCities[index] = val ? this.checkAllID[index] : []
      this.isIndeterminate[index] = false
    },
    // 单个选择
    handleCheckedCitiesChange(index, value) {
      let checkedCount = value.length
      this.checkAll[index] = checkedCount === this.eqList[index].val.length
      this.isIndeterminate[index] = checkedCount > 0 && checkedCount < this.eqList[index].val.length
      this.$forceUpdate()
    },
    // 展开组
    openGroup() {
      for (const val of this.eqList) {
        this.collapse.push(val.name)
      }
    },
    // 关闭组
    closeGroup() {
      this.collapse = []
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-main{
    max-height: 500px;
    overflow-y: scroll;
    .el-collapse{
      border: none;
    }
    .g-list{
      border: solid 1px #cccccc;
      margin-bottom: 10px;
      border-radius: 3px;
      .el-checkbox{
        z-index: 999;
      }
      .group-title{
        width: 100%;
        height: 40px;
        position: relative;
        /*border-bottom: solid 1px #cccccc;*/
        .el-checkbox{
          margin-left: 10px;
        }
        .name{
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 40px;
          text-align: center;
          line-height: 40px;
        }
      }
      .el-checkbox-group{
        padding: 20px;
        .el-checkbox{
          margin-bottom: 10px;
        }
      }
    }
    .el-collapse-item>div:first-child{
      background: #eeeeee !important;
    }
  }
</style>
