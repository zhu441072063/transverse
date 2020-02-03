<template>
  <div>
    <!--紧急预案-->
    <el-dialog
      :title="'横洞照明控制'"
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
                <template>
                  <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                  <div style="margin: 15px 0;"></div>
                  <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                  </el-checkbox-group>
                </template>
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
const cityOptions = ['上海', '北京', '广州', '深圳']
export default {
  name: 'DialogTransverseLighting',
  props: {
  },
  components: {
  },
  data() {
    return {
      checkAll: false,
      checkedCities: ['上海', '北京'],
      cities: cityOptions,
      isIndeterminate: true,
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
      if (this.$refs['dialogForm']) {
        this.$refs['dialogForm'].resetFields()
      }
    },
    // 下发
    addAction() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.dialogLoading = true
          this.dialogInfo.HANDLE_TIME = parseTime(new Date())
          var postData = this.dialogInfo
          console.log(postData)
          return
          setSql(postData).then(response => {
            if (response.count == 0) {
              this.$message({
                message: '提交失败',
                type: 'error'
              })
              return
            }
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.dialogShow = false
            this.showSjList()
          }).finally(response => {
            this.dialogLoading = false
          })
        }
      })
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    }
  }
}
</script>

<style lang="scss" scoped>
  .mst{
    width: 400px;
    height: 200px;
    background: #cccccc;
  }
  .r-radio{
    width: 470px;
  }
</style>
