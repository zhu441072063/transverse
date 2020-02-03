<template>
  <div>
    <!--备忘录列表-->
    <el-dialog
      :title="'备忘录列表'"
      :visible.sync="dialogBwlList"
      v-loading="bwlListLoading"
      width="1000px"
      :close-on-click-modal="false"
      class="dialog-them2"
    >
      <el-container>
        <el-main>
          <el-form label-width="110px" :inline="true">
            <!-- 表格 -->
            <div class="table">
              <el-table
                ref="table"
                :data="bwlListData"
                style="width: 100%"
                row-key="ID"
              >
                <el-table-column
                  v-if="false"
                  prop="ID"
                  label="ID"
                  width="60px"
                  align="center"
                />
                <el-table-column
                  prop="CREATE_TIME"
                  label="添加时间"
                  min-width="120px"
                  align="center"
                />
                <el-table-column
                  prop="CREATE_TIME"
                  label="操作人"
                  min-width="120px"
                  align="center"
                >
                  {{ name }}
                </el-table-column>
                <el-table-column label="操作" min-width="180px" align="center">
                  <template slot-scope="{row}">
                    <el-button
                      type="primary"
                      size="small"
                      @click="showInfo(row)"
                    >
                      详情
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form>
        </el-main>
        <el-footer>
          <div class="block">
            <pagination
              :total="total"
              :page.sync="bwlListQuery.pageno"
              :limit.sync="bwlListQuery.pagesize"
              @pagination="showList"
            />
          </div>
        </el-footer>
      </el-container>
    </el-dialog>
    <!--备忘录添加-->
    <el-dialog
      :title="'备忘录'"
      :visible.sync="dialogShowBwl"
      width="700px"
      :close-on-click-modal="false"
      v-loading="bwlLoading"
    >
      <el-row>
        <el-col :span="24">
          <div class="row_list">
            <el-col :span="12" class="tLeft">{{ name }}——{{ time }}</el-col>
            <el-col :span="12" class="tRight" ><div @click="showList()">备忘录记录</div></el-col>
            <div class="clear"></div>
          </div>
        </el-col>
      </el-row>
      <el-container class="z-bwl">
        <el-main>
          <el-form ref="dataForm" :rules="rules" :model="bwlInfo">
            <el-row>
              <el-col :span="24">
                <el-form-item prop="CONTENT">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6}"
                    placeholder="请输入内容"
                    v-model="bwlInfo.CONTENT">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-main>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowBwl = false">
          取消
        </el-button>
        <el-button type="primary" @click="showBwlStatus==='create'?create2Data():update2Data()">
          提交
        </el-button>
      </div>
    </el-dialog>
    <!--备忘录详情-->
    <el-dialog
      :title="'备忘录'"
      :visible.sync="dialogShowBwl2"
      width="700px"
      :close-on-click-modal="false"
      v-loading="bwlLoading"
    >
      <el-row>
        <el-col :span="24">
          <div class="row_list">
            <el-col :span="12" class="tLeft">{{ name }}——{{ time }}</el-col>
            <div class="clear"></div>
          </div>
        </el-col>
      </el-row>
      <el-container class="z-bwl">
        <el-main>
          <el-form ref="dataForm2" :model="bwlInfo2">
            <el-row>
              <el-col :span="24">
                <el-form-item prop="CONTENT">
                  <el-input
                    type="textarea"
                    readonly
                    :autosize="{ minRows: 4, maxRows: 6}"
                    placeholder="请输入内容"
                    v-model="bwlInfo2.CONTENT">
                  </el-input>
                </el-form-item>
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
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' //  secondary package based on el-pagination
export default {
  name: 'DialogBwl',
  props: {
  },
  components: {
    Pagination
  },
  data() {
    return {
      name: this.$store.getters.name,
      time: parseTime(new Date()),
      rules: {
        CONTENT: [{ required: true, message: '请填写内容', trigger: 'blur' }]
      },
      bwlInfo: {
        sql: 701,
        ID: 0,
        UID: 1,
        CONTENT: ''
      },
      bwlInfo2: {
        CONTENT: ''
      },
      bwlLoading: false,
      dialogShowBwl: false, // 备忘录弹窗
      showBwlStatus: 'create', // 备忘录-保存还是提交

      dialogShowBwl2: false, // 备忘录-详情弹窗

      dialogBwlList: false,
      bwlListLoading: false,
      bwlListData: [],
      total: 0,
      bwlListQuery: { // 事件列表查询
        sql: 702,
        pageno: 1,
        pagesize: 5
      }
    }
  },
  mounted() {
    // this.getList()
    console.log()
  },
  methods: {
    // 备忘录
    showBwl() {
      this.dialogShowBwl = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].resetFields()
      }
    },
    // 备忘录
    showBwl2() {
      this.dialogShowBwl2 = true
      this.$nextTick(() => {
        this.$refs['dataForm2'].clearValidate()
      })
    },
    // 备忘录-提交
    create2Data() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.bwlLoading = true
          var postData = this.bwlInfo
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
            this.dialogShowBwl = false
          }).finally(response => {
            this.bwlLoading = false
          })
        }
      })
    },
    // 备忘录列表
    showList() {
      this.dialogBwlList = true
      this.bwlListLoading = true
      getSql(this.bwlListQuery).then(response => {
        this.total = response.total
        this.bwlListData = response.rows
      }).finally(response => {
        this.bwlListLoading = false
      })
    },
    // 查看详情
    showInfo(row) {
      this.bwlInfo2.CONTENT = row.CONTENT
      this.showBwl2()
    }
  }
}
</script>

<style lang="scss" scoped>
  .row_list{
    margin-bottom: 20px;
    .tRight {
      color: #46a6ff;
      text-align: right;
      cursor: pointer;
    }
  }
</style>
