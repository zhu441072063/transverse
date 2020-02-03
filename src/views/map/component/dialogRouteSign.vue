<template>
  <div>
    <!--交通模式控制-->
    <el-dialog
      :title="'交通模式控制'"
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
                <div class="g-list">
                  <div class="group-title">
                    <div class="name">下行</div>
                  </div>
                  <div class="list bbn">
                    <el-col :span="6"><div class="list_name">车道4</div></el-col>
                    <el-col :span="14" style="height: 70px;padding-top: 10px">
                      <el-form-item prop="SOURCE4">
                        <el-select
                          v-model="dialogInfo.SOURCE4"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="item in zhishibiaozhi"
                            :key="item.ID"
                            :label="item.CODELABEL"
                            v-model="item.CODEVALUE"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <img src="../../assets/img/lane-no.png" alt="" v-if="dialogInfo.SOURCE4==2">
                      <img :class="{'tf1 ':dialogInfo.SOURCE4=='0'}"  src="../../assets/img/lane.png" alt="" v-else>
                    </el-col>
                  </div>
                  <div class="list ">
                    <el-col :span="6"><div class="list_name">车道2</div></el-col>
                    <el-col :span="14" style="height: 70px;padding-top: 10px">
                      <el-form-item prop="SOURCE2">
                        <el-select
                          v-model="dialogInfo.SOURCE2"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="item in zhishibiaozhi"
                            :key="item.ID"
                            :label="item.CODELABEL"
                            v-model="item.CODEVALUE"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <img src="../../assets/img/lane-no.png" alt="" v-if="dialogInfo.SOURCE2==2">
                      <img :class="{'tf1 ':dialogInfo.SOURCE2=='0'}"  src="../../assets/img/lane.png" alt="" v-else>
                    </el-col>
                  </div>
                </div>
                <div class="g-list">
                  <div class="group-title">
                    <div class="name">上行</div>
                  </div>
                  <div class="list bbn">
                    <el-col :span="6"><div class="list_name">车道1</div></el-col>
                    <el-col :span="14" style="height: 70px;padding-top: 10px">
                      <el-form-item prop="SOURCE1">
                        <el-select
                          v-model="dialogInfo.SOURCE1"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="item in zhishibiaozhi"
                            :key="item.ID"
                            :label="item.CODELABEL"
                            v-model="item.CODEVALUE"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <img src="../../assets/img/lane-no.png" alt="" v-if="dialogInfo.SOURCE1==2">
                      <img :class="{'tf1 ':dialogInfo.SOURCE1=='1'}"  src="../../assets/img/lane.png" alt="" v-else>
                    </el-col>
                  </div>
                  <div class="list ">
                    <el-col :span="6"><div class="list_name">车道3</div></el-col>
                    <el-col :span="14" style="height: 70px;padding-top: 10px">
                      <el-form-item prop="SOURCE3">
                        <el-select
                          v-model="dialogInfo.SOURCE3"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="item in zhishibiaozhi"
                            :key="item.ID"
                            :label="item.CODELABEL"
                            v-model="item.CODEVALUE"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <img src="../../assets/img/lane-no.png" alt="" v-if="dialogInfo.SOURCE3==2">
                      <img :class="{'tf1 ':dialogInfo.SOURCE3=='1'}"  src="../../assets/img/lane.png" alt="" v-else>
                    </el-col>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </el-main>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">
          取消
        </el-button>
        <el-button type="primary" @click="addAction()">
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
  name: 'DialogRouteSign',
  props: {
  },
  components: {
  },
  data() {
    return {
      zhishibiaozhi: zGetCodeAll('TRAFFIC_MARK'),
      zGetCode: zGetCode,
      dialogLoading: false, // 加载
      rules: { // 提交验证
        SOURCE1: [{ required: true, message: '请选择', trigger: 'change' }],
        SOURCE2: [{ required: true, message: '请选择', trigger: 'change' }],
        SOURCE3: [{ required: true, message: '请选择', trigger: 'change' }],
        SOURCE4: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      dialogInfo: { // 事件处理提交表单
        ID: 0,
        sql: 603,
        SOURCE1: '',
        SOURCE2: '',
        SOURCE3: '',
        SOURCE4: ''
      },
      dialogList: { // 分机列表
        sql: 1399
      },
      dialogShow: false, // 是否弹出
    }
  },
  mounted() {
  },
  methods: {
    // 显示列表
    showList() {
      this.dialogShow = true
      // this.dialogLoading = true
      this.$nextTick(() => {
        this.$refs['dialogForm'].clearValidate()
      })
      if (this.$refs['dialogForm']) { // 重置表单
        this.$refs['dialogForm'].resetFields()
      }
    },
    // 下发
    addAction() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          var postData = this.dialogInfo
          console.log(postData)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-main{
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
        line-height: 40px;
        text-align: center;
        position: relative;
        border-bottom: solid 1px #cccccc;
        background: #eeeeee !important;
      }
      .list{
         height: 70px;
         line-height: 60px;
         .list_name{
           text-align: center;
         }
         .el-select{
           width: 100%;
         }
        img{
          width: 40px;
          height: 40px;
          display: block;
          margin: 10px auto;
        }
       }
      .bbn{
       border-bottom: solid 1px #cccccc;
      }
      .tf1{
        transform:rotate(180deg);
      }
    }
  }
</style>
