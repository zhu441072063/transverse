<template>
  <div class="app-container">
    <el-container>
      <el-header>角色管理
        <el-button icon="el-icon-plus" @click="add">添加角色</el-button>
      </el-header>
      <el-main>
        <!-- 查询项 -->
        <div class="input">
          <div>
            <el-row :gutter="20">
              <el-col :span="100">
                角色名称：<el-input v-model="inlist.ROLE_NAME" style="width: 200px;" class="filter-item" />
              </el-col>
              <el-col :span="100">
                角色标识：<el-input v-model="inlist.PERMISSION" style="width: 200px;" class="filter-item" /><br>
              </el-col>
              <el-col :span="100">
                角色描述：<el-input v-model="inlist.ROLE_DESC" style="width: 200px;" class="filter-item" />
              </el-col>
            </el-row>
          </div>
          <el-button type="primary" @click="Search">查询</el-button>
        </div>
        <!-- 表格 -->
        <div class="table">
          <el-table
            ref="table"
            v-loading="listLoading"
            :data="tableData"
            style="width: 100%"
            row-key="ID"
            @selection-change="selsChange"
          >
            <el-table-column
              v-if="false"
              prop="ID"
              label="ID"
              width="60px"
              align="center"
            />
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
              prop="ROLE_NAME"
              label="角色名称"
              min-width="120"
              align="center"
            />
            <el-table-column
              prop="PERMISSION"
              label="角色标识"
              min-width="120"
              align="center"
            />
            <el-table-column
              prop="MAIN_URL"
              label="主页URL"
              min-width="120"
              align="center"
            />
            <el-table-column
              prop="ROLE_DESC"
              label="角色描述"
              min-width="120"
              align="center"
            />
            <el-table-column
              prop="CREATE_TIME"
              label="创建时间"
              min-width="120"
              align="center"
            />
            <el-table-column
              prop="UPDATE_TIME"
              label="更新时间"
              min-width="120"
              align="center"
            />
            <el-table-column label="操作" min-width="200" align="center">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="修改" placement="top">
                  <el-button type="success" icon="el-icon-edit" size="small" @click="edit(scope.row.ID)" />
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <el-popconfirm
                    confirm-button-text="确定"
                    cancel-button-text="取消"
                    icon="el-icon-info"
                    icon-color="red"
                    title="确定删除吗？"
                    @onConfirm="del(scope.row.ID)"
                  >
                    <el-button slot="reference" type="danger" icon="el-icon-delete" size="small" />
                  </el-popconfirm>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
      <!-- 分页 -->
      <el-footer>
        <div class="block">
          <el-button :disabled="sels.length === 0" @click="delGroup">批量删除</el-button>
          <pagination
            :total="total"
            :page.sync="listQuery.pageno"
            :limit.sync="listQuery.pagesize"
            @pagination="getList"
          />
        </div>
      </el-footer>
    </el-container>

    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="1000px"
      :close-on-click-modal="false"
    >
      <el-container>
        <el-main>
          <el-form
            label-width="80px"
            :inline="true"
          >
            <el-form-item label="角色名称">
              <el-input v-model="addList.ROLE_NAME" />
            </el-form-item>
            <el-form-item label="角色标识">
              <el-input v-model="addList.PERMISSION" />
            </el-form-item>
            <el-form-item label="功能授权">
              <el-checkbox-group v-model="checkList">
                <el-checkbox v-for="item in funs" :key="item.ID" :label="item.TEXT" @change="changeCheck(item)" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input
                v-model="addList.ROLE_DESC"
                type="textarea"
                :rows="7"
                style="width: 470px;"
              />
            </el-form-item>
          </el-form>
        </el-main>

        <el-footer>
          <el-button v-show="add_flag" type="warning" @click="Continue">提交并继续添加</el-button>
          <el-button v-show="add_flag" type="success" @click="sub">提交</el-button>
          <el-button v-show="edit_flag" type="warning" @click="update">保存</el-button>
          <el-button type="" @click="clear">重置</el-button>
        </el-footer>
      </el-container>
    </el-dialog>
  </div>
</template>
<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
// import { zGetCodeAll, zGetCode } from '@/utils/common'
import { getSql, setSql } from '@/api/sql'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { parseTime } from '@/utils'

export default {
  components: { Pagination },
  data() {
    return {
      total: 0,
      sels: [],
      listLoading: true,
      listQuery: {
        pageno: 1,
        pagesize: 5,
        sql: 301
      },

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      tableData: [],
      // 查询条件
      inlist: {
        sql: 302,
        ROLE_NAME: '',
        PERMISSION: '',
        ROLE_DESC: ''
      },
      // 添加弹框
      add_flag: '',
      edit_flag: '',
      dialogFormVisible: false,
      title: '',
      funs: '',
      checkList: [],
      idList: [],
      // 角色表添加
      addList: {
        sql: 303,
        ROLE_NAME: '',
        PERMISSION: '',
        ROLE_DESC: ''
      },
      // 角色功能关系表添加
      funList: {
        sql: 304,
        ROLE_ID: '',
        FUNCTION_ID: ''
      },
      // 查询所有功能
      fList: {
        sql: 305
      }
    }
  },
  created() {
    this.getList()
  },

  mounted() {
    this.getFuns()
  },
  methods: {

    getList() {
      this.listLoading = true
      getSql(this.listQuery).then(response => {
        this.total = response.total
        this.tableData = response.rows
        this.listLoading = false
      })
    },
    handleSizeChange: function(size) {
      this.pagesize = size
      console.log(this.pagesize) // 每页下拉显示数据
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
      console.log(this.currentPage) // 点击第几页
    },
    add() {
      this.clear()
      this.title = '添加设备'
      this.dialogFormVisible = true
      this.add_flag = true
      this.edit_flag = false
    },
    // 删除
    del(id) {
      console.log(123)
      const params = {
        sql: 310,
        ID: id
      }
      setSql(params).then(() => {
        this.getList()
      })
    },
    selsChange(sels) {
      this.sels = sels
    },
    delGroup() {
      var ids = this.sels.map(item => item.ID) // 获取所有选中行的id组成的字符串，以逗号分隔
      for (const i in ids) {
        this.del(ids[i])
      }
    },
    // 打开编辑弹出框
    edit(id) {
      this.clear()
      this.addList.ID = id
      this.funList.ROLE_ID = id
      this.add_flag = false
      this.edit_flag = true
      this.dialogFormVisible = true
      this.title = '修改设备信息'
      this.getmessage(id)
    },
    // 获取角色信息
    getmessage(id) {
      const params1 = {
        sql: 306,
        ID: id
      }
      const params2 = {
        sql: 307,
        'rf.ROLE_ID': id
      }
      getSql(params1).then(response => {
        this.addList.ROLE_NAME = response.rows[0].ROLE_NAME
        this.addList.PERMISSION = response.rows[0].PERMISSION
        this.addList.ROLE_DESC = response.rows[0].ROLE_DESC
      })
      getSql(params2).then(response => {
        let list = []
        list = response.rows
        for (let i = 0; i < list.length; i++) {
          this.idList.push(list[i].ID)
          this.checkList.push(list[i].TEXT)
        }
      })
    },
    // 修改
    update() {
      this.addList.sql = 308
      this.addList.UPDATE_TIME = parseTime(new Date())
      setSql(this.addList)
      const params = {
        sql: 309,
        ID: this.addList.id
      }
      setSql(params).then(() => {
        this.xh()
        this.back()
        this.getList()
      })
    },
    Search() {
      const s1 = this.inlist.ROLE_NAME
      const s2 = this.inlist.PERMISSION
      const s3 = this.inlist.ROLE_DESC
      this.inlist.ROLE_NAME = '%' + this.inlist.ROLE_NAME + '%'
      this.inlist.PERMISSION = '%' + this.inlist.PERMISSION + '%'
      this.inlist.ROLE_DESC = '%' + this.inlist.ROLE_DESC + '%'
      getSql(this.inlist).then(response => {
        this.tableData = response.rows
        this.total = response.total
        this.listQuery.pageno = 1
        this.inlist.ROLE_NAME = s1
        this.inlist.PERMISSION = s2
        this.inlist.ROLE_DESC = s3
      })
    },

    // 多选框点击事件，将已选id存入idList
    changeCheck(item) {
      let id = ''
      let flag = 0
      id = item.ID
      for (let i = 0; i < this.idList.length; i++) {
        if (this.idList[i] === item.ID) {
          this.idList.splice(i, 1)
          flag++
        }
      }
      if (flag === 0) {
        this.idList.push(id)
      }
    },
    back() {
      this.dialogFormVisible = false
    },
    clear() {
      this.addList.ROLE_NAME = ''
      this.addList.PERMISSION = ''
      this.addList.ROLE_DESC = ''
      this.idList = []
      this.checkList = []
    },
    // 获取所有功能
    getFuns() {
      getSql(this.fList).then(response => {
        this.funs = response.rows
      })
    },
    sub() {
      this.Continue()
      this.back()
      this.getList()
    },
    // 增加角色
    Continue() {
      this.addList.CREATE_TIME = parseTime(new Date())
      this.addList.UPDATE_TIME = this.addList.CREATE_TIME
      setSql(this.addList).then(response => {
        this.funList.ROLE_ID = response.msg
        this.xh()
        this.clear()
      })
    },
    // 循环获取功能id
    xh() {
      for (let i = 0; i < this.idList.length; i++) {
        this.subfun(this.idList[i])
      }
    },
    // 增加角色功能关系
    subfun(id) {
      const params = {
        sql: 304,
        ROLE_ID: this.funList.ROLE_ID,
        FUNCTION_ID: id
      }
      setSql(params)
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  .el-container {
    border: 1px solid #dfdfdf;
    max-width: 1420px;
    .el-header {
      background-color: #eceff1;
      height: 60px;
      line-height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-button{
        height: 40px;
      }
    }
    .el-main {
      .input {
        width: 100%;
        padding: 5px;
        border-bottom:1px solid #E6EBF5;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          font-size: 14px;
        }
        .el-select {
          margin-right: 10px;
        }
        .el-input {
          width: 200px;
          margin: 8px;
        }
        .el-button {
          width: 100px;
          height: 40px;
          border: none;
          background-color: #1ab394;

        }

      }

    }
    .el-footer{
      .block{
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1367px;

      }
      .el-pagination{
        display: inline-block;
      }
    }
  }
}
</style>
