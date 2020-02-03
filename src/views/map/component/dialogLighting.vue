<template>
  <div>
    <!--照明群控-->
    <el-dialog
      :title="'照明群控'"
      :visible.sync="dialogShow"
      width="700px"
      :close-on-click-modal="false"
      class="dialog-them1"
      v-loading="dialogLoading"
    >
      <el-container class="z-sjadd">
        <el-main>
          <el-form label-width="110px" ref="dialogForm" :rules="rules" :model="dialogInfo" :inline="true">
            <el-row>
              <el-col :span="24">
                <template v-for="(item,index) in eqList">
                  <div :key="'eqList'+index" class="list">
                    <el-col :span="6">{{item.TYPE_NAME}}</el-col>
                    <el-col :span="14">12</el-col>
                    <el-col :span="4">
                      <el-button type="success" @click="addAction(item.ID)">
                        下发
                      </el-button>
                    </el-col>
                  </div>
                </template>
              </el-col>
            </el-row>
          </el-form>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
import { getSql, setSql } from '@/api/sql'
import { zGetCodeAll, zGetCode } from '@/utils/common'
import { parseTime } from '@/utils'
export default {
  name: 'DialogLighting',
  props: {
  },
  components: {
  },
  data() {
    return {
      code: 'LIGHTING', // 设备编码
      eqList: [],
      zGetCode: zGetCode,
      dialogLoading: false, // 加载
      rules: { // 提交验证
        HANDLE_MEMBER: [{ required: true, message: '请填写紧急原因', trigger: 'blur' }]
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
        sql: 1401,
        FIXD_FLAG: 1
      },
      dialogShow: false, // 是否弹出
      raList: [
        { ID: 1, name: 'A', value: '0' },
        { ID: 2, name: 'B', value: '1' },
        { ID: 3, name: 'C', value: '2' }
      ]
    }
  },
  mounted() {
  },
  methods: {
    // 显示列表
    showList() {
      this.dialogShow = true
      this.dialogLoading = true
      getSql(this.dialogList).then(response => {
        this.eqList = response.rows
      }).finally(() => {
        this.dialogLoading = false
      })
    },
    // 下发
    addAction() {
      var list = []
      // list.push({
      //   aoType: value,
      //   equipId: v,
      //   id: v,
      //   equipName: this.eqList2[v]
      // })
      var agentData = {
        equipType: this.code,
        inFrom: 'Web',
        transType: '3',
        list: list
      }
      var st = JSON.stringify(agentData)
      this.$parent.$parent.websocketsend(st)
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-main{
    .list{
      line-height: 60px;
      border-bottom: 1px solid #eeeeee;
      display: flex;
      text-align: center;
    }
  }
</style>
