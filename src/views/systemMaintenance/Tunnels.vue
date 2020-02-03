<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <!-- 查询项 -->
        <div class="input">
          <div><span>隧道管理</span></div>
          <el-button type="success" @click="addTunnel">添加隧道</el-button>
        </div>
        <div class="table">
          <el-table
            ref="table"
            v-loading="listLoading"
            row-key="id"
            :data="pageData"
            style="width: 100%"
            @row-click="handleCurrentChange"
            @selection-change="selsChange"
          >
            <el-table-column type="selection" width="55" align="center" reserve-selection="" />
            <el-table-column prop="TUNNEL_NUMBER" label="隧道编号" min-width="90px" align="center" />
            <el-table-column prop="TUNNEL_NAME" label="隧道名" align="center" />
            <el-table-column prop="UP_NUM" label="上行车道数" align="center" />
            <el-table-column prop="UP_START" label="上行起始位置" align="center" />
            <el-table-column prop="UP_OVER" label="上行起始位置" align="center" />
            <el-table-column prop="DOWN_NUM" label="下行车道数" align="center" />
            <el-table-column prop="DOWN_START" label="下行起始位置" align="center" />
            <el-table-column prop="DOWN_OVER" label="下行结束位置" align="center" />
            <el-table-column prop="REMARK" label="备注" align="center" />
            <el-table-column label="操作" min-width="200px" align="center">
              <template slot-scope="scope">
              <!--  <el-tooltip class="item" effect="dark" content="关联设备" placement="top">
                  <el-button type="warning" icon="el-icon-setting" size="small" @click="relevanceDevice(scope.row.ID)" />
                </el-tooltip> -->
                <el-tooltip class="item" effect="dark" content="修改" placement="top">
                  <el-button type="success" icon="el-icon-edit" size="small" @click="edit(scope.row)" />
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <el-button type="danger" icon="el-icon-delete" size="small" @click="def(scope.row.ID)" />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
      <!-- 分页 -->
      <el-footer>
        <div class="block">
          <el-button :disabled="this.sels.length === 0" @click="delGroup">批量删除</el-button>
          <pagination :total="total" :page.sync="listQuery.pageno" :limit.sync="listQuery.pagesize" @pagination="getList" />
        </div>
      </el-footer>
    </el-container>
    <!--弹窗1-->
    <el-dialog
      :visible.sync="isShow"
      :close-on-click-modal="false"
      class="dialog-them1"
      title="关联设备"
    >
      <el-container class="z-sjadd">
        <el-header style="text-align: right;">
          <el-button>添加关联设备</el-button>
        </el-header>
        <el-main>
          <div class="block">
            <el-tag
              v-for="tag in tags"
              :key="tag.name"
              closable
              @close="handleClose(tag)">
              {{tag.name}}
            </el-tag>
          </div>
        </el-main>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">
          取消
        </el-button>
        <el-button type="primary" @click="selectData()">
          提交
        </el-button>
      </div>
    </el-dialog>
    <!--弹窗2-->
    <el-dialog class="dialog-them1" :title="windowInfo.title" width="1000px" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-container class="z-sjadd">
        <el-main>
          <el-form label-width="110px" :inline="true">
            <el-row>
              <el-col :span="12">
                <el-form-item label="隧道编号"><el-input v-model="tunnelInfo.TUNNEL_NUMBER" /></el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="隧道名"><el-input v-model="tunnelInfo.TUNNEL_NAME" /></el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="上行车道数"><el-input v-model="tunnelInfo.UP_NUM" /></el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="下行车道数"><el-input v-model="tunnelInfo.DOWN_NUM" /></el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="上行起始位置"><el-input v-model="tunnelInfo.UP_START" /></el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="下行结束位置"><el-input v-model="tunnelInfo.UP_OVER" /></el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="下行起始位置"><el-input v-model="tunnelInfo.DOWN_START" /></el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="下行结束位置"><el-input v-model="tunnelInfo.DOWN_OVER" /></el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="备注"><el-input v-model="tunnelInfo.REMARK" /></el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-main>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveData()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getSql, setSql } from '@/api/sql'
import Pagination from '@/components/Pagination' //  secondary package based on el-pagination
export default {
  components: { Pagination },
  data() {
    return {
      sels: [], // 多选参数    windowInfo.type
      windowInfo: {
        type: 2, // 1:查看，2修改，3，新增
        title: '查看'
      },
      tags: [
        { name: '标签一' },
        { name: '标签二' },
        { name: '标签三' },
        { name: '标签四' },
        { name: '标签五' }
      ],
      isShow: false, // 关联弹窗
      dialogFormVisible: false, // 弹窗控制
      listLoading: true, // 加载
      select_val: '',
      total: 0,
      //  查询条件
      listQuery: {
        pageno: 1,
        pagesize: 5,
        mode: 'get',
        sql: 1002
      },
      options: [
        {
          value: 'zhinan',
          label: '指南',
          children: [
            {
              value: 'shejiyuanze',
              label: '设计原则',
              children: [
                {
                  value: 'yizhi',
                  label: '一致'
                },
                {
                  value: 'fankui',
                  label: '反馈'
                },
                {
                  value: 'xiaolv',
                  label: '效率'
                },
                {
                  value: 'kekong',
                  label: '可控'
                }
              ]
            },
            {
              value: 'daohang',
              label: '导航',
              children: [
                {
                  value: 'cexiangdaohang',
                  label: '侧向导航'
                },
                {
                  value: 'dingbudaohang',
                  label: '顶部导航'
                }
              ]
            }
          ]
        }
      ],
      pageData: [],
      tunnelInfo: {
        ID: '', // id
        TUNNEL_NUMBER: '', // 隧道编号
        TUNNEL_NAME: '', // 隧道名
        UP_NUM: '', // 上行车道数
        UP_START: '', // 上行起始位置
        UP_OVER: '', // 上行结束位置
        DOWN_NUM: '',
        DOWN_START: '', // 下行起始位置
        DOWN_OVER: '', // 下行结束位置
        REMARK: ''// 备注
      },
      position: '',
      pile_num: ''
    }
  },
  mounted() {},
  created() {
    this.getList()
  },
  methods: {
    // 添加隧道
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    },
    addTunnel() {
      this.clear()
      this.windowInfo.type = 3
      this.windowInfo.title = '新建隧道'
      this.dialogFormVisible = true
    },
    // 编辑
    edit(row) {
      this.dialogFormVisible = true
      this.windowInfo.type = 2
      this.windowInfo.title = '修改隧道信息'
      for (var key in this.tunnelInfo) {
        this.tunnelInfo[key] = row[key]
      }
    },
    dateFormat(fmt, date) {
      let ret
      const opt = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      }
      for (const k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt)
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
        }
      }
      return fmt
    },
    // 保存隧道信息
    saveData() {
      var type = this.windowInfo.type
      var tunnelInfo = this.tunnelInfo
      // type:3 新建，2，修改  sql 1001新建  1004更新
      var date = new Date()
      date = this.dateFormat('YYYY-mm-dd HH:MM', date)
      var obj = {
        sql: 1001,
        TUNNEL_NUMBER: tunnelInfo.TUNNEL_NUMBER, // 隧道编号
        TUNNEL_NAME: tunnelInfo.TUNNEL_NAME, // 隧道名
        UP_NUM: tunnelInfo.UP_NUM, // 上行车道数
        UP_START: tunnelInfo.UP_START, // 上行起始位置
        UP_OVER: tunnelInfo.UP_OVER, // 上行结束位置
        DOWN_NUM: tunnelInfo.DOWN_NUM, // 下行车道数
        DOWN_START: tunnelInfo.DOWN_START, // 下行起始位置
        DOWN_OVER: tunnelInfo.DOWN_OVER, // 下行结束位置
        REMARK: tunnelInfo.REMARK, // 备注
        UPDATE_TIME: date
      }
      if (type == '3') {
        obj.sql = 1001
        obj.CREATE_TIME = date
      } else if (type == '2') {
        obj.sql = 1004
        obj.ID = tunnelInfo.ID
      }
      setSql(obj).then(() => {
        this.back()
      })
    },
    // 关联设备
    relevanceDevice(id) {
      this.isShow = true
    },
    //  获取数据
    getList() {
      this.listLoading = true
      var that = this
      getSql(this.listQuery).then(response => {
        that.total = response.total
        that.pageData = response.rows

        that.listLoading = false
      })
    },
    clear() {
      var tunnelInfo=this.tunnelInfo
      for (var i in tunnelInfo) {
        tunnelInfo[i] = ''
      }
      this.pile_num = ''
      this.position = ''
    },
    // 获取设备信息
    getmessage(id) {
      const params = {
        mode: 'get',
        sql: 407,
        id: id
      }
      getSql(params).then(response => {
        this.input = response.rows[0]
      })
    },
    // 修改设备信息
    update() {
      this.concat()
      this.tunnelInfo.mode = 'exec'
      this.tunnelInfo.sql = '408'
      console.log(this.input)
      setSql(this.input).then(() => {
        this.back()
      })
    },
    // 返回列表
    back() {
      this.dialogFormVisible = false
      this.select_val = ''
      this.getList()
    },
    // 单个删除
    def(id) {
      var obj = {
        sql: 1003, // 删除
        ID: id
      }
      this.$confirm('此操作将删除隧道, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setSql(obj).then(() => {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
      }).catch(() => {

      });
    },
    // 多选列表
    selsChange(sels) {
      this.sels = sels
    },
    delGroup() {
      var ids = this.sels.map(item => item.ID) // 获取所有选中行的id组成的字符串，以逗号分隔
      for (const i in ids) {
        this.def(ids[i])
      }
    },
    handleCurrentChange(row, event, column) {
      this.$refs.table.toggleRowSelection(row)
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  .el-container {
    border: 1px solid #dfdfdf;

    .el-header {
      background-color: #eceff1;
      height: 60px;
      line-height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-button {
        height: 40px;
      }
    }
    .el-main {
      .input {
        width: 100%;
        padding: 5px;
        border-bottom: 1px solid #e6ebf5;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          font-size: 14px;
        }
        .el-select {
          margin-right: 20px;
          width: 150px;
        }
        .el-input {
          width: 200px;
          margin: 8px;
        }
        .el-button {
          width: 100px;
          height: 40px;
          border: none;
        }
      }
    }
    .el-footer {
      .block {
        display: flex;
        height: 50px;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  .el-dialog {
    .el-container {
      min-width: 100%;
      border: 1px solid #dfdfdf;
      .el-header {
        background-color: #eceff1;
        height: 60px;
        line-height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-button {
          height: 40px;
        }
      }
      .el-main {
        width: 90%;
        margin: 0 auto;
        .el-form {
          .el-row {
            margin-bottom: 10px;
            &:last-child {
              margin-bottom: 0;
            }
          }
          .el-form-item {
            .el-input {
              width: 250px;
            }
            .last_input {
              width: 600px;
            }

            .el-select {
              width: 250px;
            }
          }
        }
      }
      .el-footer {
        border-top: 1px solid #d0d3d6;
        display: flex;
        justify-content: center;
        height: 80px;
        align-items: center;
        .el-button {
          height: 40px;
        }
      }
    }
  }
}
</style>
