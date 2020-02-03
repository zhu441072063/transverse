<template>
  <div>
    <!--紧急预案-->
    <el-dialog
      :title="'紧急预案'"
      :visible.sync="dialogShowEplan"
      width="700px"
      :close-on-click-modal="false"
      class="dialog-them1"
      v-loading="listLoading"
    >
      <el-container class="z-sjadd">
        <el-main>
          <el-form label-width="110px" ref="EplanForm" :rules="eventHandleRules" :model="EplanInfo" :inline="true">
            <el-row>
              <el-col :span="24">
                <el-form-item label="紧急预案模型" prop="preplan">
                  <el-radio-group v-model="EplanInfo.preplan" class="r-radio">
                    <el-radio
                      v-for="item in list"
                      :key="item.ID"
                      :label="item.ID" >
                      {{item.NAME}}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="隧道模式图">
                  <div class="mst"></div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="预案原因" prop="HANDLE_STATUS">
                  <el-select
                    v-model="EplanInfo.HANDLE_STATUS"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in emergencyPlanReason"
                      :key="item.ID"
                      :label="item.CODELABEL"
                      v-model="item.CODEVALUE"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="事件发生位置">
                  <el-form-item prop="HAPPEN_POSITION1">
                    <el-select
                      v-model="EplanInfo.HAPPEN_POSITION1"
                      placeholder="请选择"
                      class="small_input"
                    >
                      <el-option
                        v-for="item in tunnelType"
                        :key="item.value"
                        :label="item.CODELABEL"
                        :value="item.CODEVALUE"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="HAPPEN_POSITION2">
                    <el-input
                      placeholder="YYY"
                      v-model="EplanInfo.HAPPEN_POSITION2"
                      maxlength="3"
                      class="small_input"
                    >
                      <template slot="prepend">K</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="HAPPEN_POSITION3">
                    <el-input
                      placeholder="XXX"
                      v-model="EplanInfo.HAPPEN_POSITION3"
                      maxlength="3"
                      class="small_input"
                    >
                      <template slot="prepend">+</template>
                    </el-input>
                  </el-form-item>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-main>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowEplan = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateEventHandleData()">
          下发
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSql, setSql } from '@/api/sql'
import { zGetCodeAll, zGetCode } from '@/utils/common'
import { parseTime } from '@/utils'
export default {
  name: 'DialogEmergencyPlan',
  props: {
  },
  components: {
  },
  data() {
    return {
      emergencyPlanReason: zGetCodeAll('emergencyPlanReason'), // 预案原因
      tunnelType: zGetCodeAll('tunnelType'), // 隧道位置
      zGetCode: zGetCode,
      listLoading: false, // 加载
      eventHandleRules: { // 事件处理提交验证
        preplan: [{ required: true, message: '请选择预案模型', trigger: 'change' }],
        HANDLE_STATUS: [{ required: true, message: '请选择预案原因', trigger: 'change' }],
        HAPPEN_POSITION1: [{ required: true, message: '请选择位置', trigger: 'change' }],
        HAPPEN_POSITION2: [{ required: true, message: '请填写', trigger: 'blur' }],
        HAPPEN_POSITION3: [{ required: true, message: '请填写', trigger: 'blur' }]
      },
      listQuery: { // 查询条件
        sql: 1799,
        ISROUTINES: 0 // 紧急
      },
      EplanInfo: {
        preplan: '', // 预案ID
        HANDLE_STATUS: '',
        HAPPEN_POSITION1: '',
        HAPPEN_POSITION2: '',
        HAPPEN_POSITION3: ''
      },
      list: [], // 查询列表
      dialogShowEplan: false // 弹出
    }
  },
  mounted() {
  },
  methods: {
    // 事件处理
    showEPlanList() {
      this.$nextTick(() => {
        this.$refs['EplanForm'].clearValidate()
      })
      this.dialogShowEplan = true
      this.listLoading = true
      getSql(this.listQuery).then(response => {
        this.list = response.rows
      }).finally(() => {
        this.listLoading = false
      })
    },
    // 事件处理-提交
    updateEventHandleData() {
      this.$refs['EplanForm'].validate((valid) => {
        if (valid) {
          // this.listLoading = true
          console.log(this.EplanInfo)
        }
      })
    }
  }
}
</script>

<style scoped>
  .mst{
    width: 400px;
    height: 200px;
    background: #cccccc;
  }
  .r-radio{
    width: 470px;
  }
</style>
