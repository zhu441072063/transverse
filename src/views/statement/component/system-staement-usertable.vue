<template>
  <div id="header">
    <!-- 查询项 -->
    <div class="input">
      <el-row>
          <span>起始时间：</span>
          <el-date-picker
            v-model="userlist.start_time"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        <span>结束时间：</span>
        <el-date-picker
          v-model="userlist.end_time"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        <el-button type="primary" @click="Search">查询</el-button>
        <a href="http://localhost:9527/dbsql.jsp?mode=excel&sql=280" target="_blank"><el-button type="primary">PDF--打印当前页</el-button></a>
        <a href="http://localhost:9527/dbsql.jsp?mode=excel&sql=280" target="_blank"><el-button type="primary">excel--打印当前页</el-button></a>
      </el-row>
    </div>
    <!--表格-->
    <div id="table">
    <el-table
      class="user_stament"
      :data="tableData1"
      row-key="ID"
      border
      style="width: 100%"
      v-loading="listLoading"
    >
      <el-table-column
        prop="USERNAME"
        label="用户名"

        align="center"
      />
      <el-table-column
        prop="DISPLAYNAME"
        label="显示名"

        align="center"
      />
      <el-table-column
        prop="ROLE_NAME"
        label="角色"

        align="center"
      />
      <el-table-column
        prop="TEL"
        label="联系电话"

        align="center"
      />
      <el-table-column
        prop="LOGIN_TIME"
        label="登录时间"

        align="center"
      />

    </el-table>
    </div>
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
  </div>
</template>

<script>
  import { getSql, setSql} from '@/api/sql'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import { zGetCodeAll, zGetCode } from '@/utils/common'
  export default {
    components: {Pagination},
    data(){
      return{
        //分页页数
        total: 0,
        // 表格数据
        tableData1: [],
        //加载图标
        listLoading:true,
        //查全部用户信息--分页
        listQuery: {
          pageno: 1,
          pagesize: 5,
          sql: 201
        },
        // 条件查询用户信息--分页
        userlist: {
          pageno: 1,
          pagesize: 5,
          sql:212,
          start_time:'',
          end_time:''
        },
      };
    },
    mounted() {
      this.getList()
    },
    methods:{
      // 查全部
      getList() {
        this.listLoading = false
        getSql(this.listQuery).then(response => {
          this.tableData1 = response.rows
          this.total = response.total
          this.listLoading = false
        })
      },
      // 条件查询
      Search() {
        this.listLoading = false
        getSql(this.userlist).then(response => {
          this.tableData1 = response.rows
          this.total = response.total
          this.listLoading = false
        })
      },

      // 打印excel
      // excelData(){
      //   const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
      //   const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
      //   const list = this.tableData1
      //   const data = this.formatJson(filterVal, list)
      //
      // },
      // formatJson(filterVal, jsonData) {
      //   return jsonData.map(v => filterVal.map(j => {
      //     if (j === 'timestamp') {
      //       return parseTime(v[j])
      //     } else {
      //       return v[j]
      //     }
      //   }))
      // }
    }
  }
</script>


<style scoped lang="scss">
  #header{
    min-width: 1000px;
  }

  .el-input {
    width: 200px;
    margin: 8px;
  }

</style>
