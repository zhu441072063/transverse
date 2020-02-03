<template>
  <div class="app-container">
    <el-container>
      <el-header>角色管理</el-header>
      <el-main>
        <!-- 表格 -->
        <div class="table">
          <el-table
            ref="table"
            v-loading="listLoading"
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column
              prop="ID"
              label="功能编号"
              min-width="60px"
              align="center"
            />
            <el-table-column
              prop="TEXT"
              label="功能名称"
              min-width="120"
              align="center"
            />
            <el-table-column
              prop="DESCRIPTION"
              label="功能描述"
              min-width="120"
              align="center"
            />
          </el-table>
        </div>
      </el-main>
      <!-- 分页 -->
      <el-footer>
        <div class="block">
          <pagination
            :total="total"
            :page.sync="listQuery.pageno"
            :limit.sync="listQuery.pagesize"
            @pagination="getList"
          />
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getSql } from '@/api/sql'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  components: { Pagination },
  data() {
    return {
      total: 0,
      listLoading: true,
      listQuery: {
        pageno: 1,
        pagesize: 5,
        sql: 311
      },
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getSql(this.listQuery).then(response => {
        this.total = response.total
        this.tableData = response.rows
        this.listLoading = false
      })
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
      .table {
        .el-table-column {

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
