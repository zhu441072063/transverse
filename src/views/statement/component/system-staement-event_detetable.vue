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
        <a href="http://localhost:9527/dbsql.jsp?mode=pdf&sql=282"><el-button type="primary">PDF--打印当前页</el-button></a>
        <a href="http://localhost:9527/dbsql.jsp?mode=excel&sql=282"><el-button type="primary">excel--打印当前页</el-button></a>
      </el-row>
    </div>
    <!--表格-->
    <el-table
      class="user_stament"
      :data="tableData1"
      border
      style="width: 100%"
      v-loading="listLoading"
    >
      <el-table-column
        prop="EVENT_TIME"
        label="时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="TYPE"
        label="事件类型"
        width="180">
        <template slot-scope="{row}">
          {{ zGetCode('eventType', row.TYPE) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="DEF_POSITION"
        label="具体位置">
      </el-table-column>
      <el-table-column
        prop="HAPPEN_POSITION1"
        label="方向">
        <template slot-scope="{row}">
          {{ zGetCode('tunnelType', row.HAPPEN_POSITION1) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="CAMERA_EVENT"
        label="摄像机"
      >
        <a href="">1</a>
      </el-table-column>

    </el-table>
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
  import { getSql, setSql } from '@/api/sql'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import { zGetCodeAll, zGetCode } from '@/utils/common'
  export default {
    components: {Pagination},
    data(){
      return{
        //分页数
        total: 0,
        //加载图标
        listLoading:true,
        //获取字典
        zGetCode: zGetCode,

        // 表格数据
        tableData1: [],
        //位置拼接
        pile_v1: 'K',
        pile_v2: '+',
        //查全部用户信息--分页
        listQuery: {
          pageno: 1,
          pagesize: 5,
          sql:'223'
        },
        // 条件查询用户信息--分页
        userlist: {
          pageno: 1,
          pagesize: 5,
          sql:'',
          start_time:'',
          end_time:''
        },
        //按照id条件查询信息
        idselect: {
          sql:'' ,
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
          for (const i in this.tableData1) {
            this.tableData1[i].DEF_POSITION =this.pile_v1.concat(this.tableData1[i].HAPPEN_POSITION2, this.pile_v2, this.tableData1[i].HAPPEN_POSITION3)
          }
          this.listLoading = false
        })
      },
      //根据id查全部
      getID(){
        this.idselect.ID = ID
        getSql(this.idselect).then(response => {
          this.tableData = response.rows[0]
        })
      },
      // 条件查询
      Search() {
        getSql(this.userlist).then(response => {
          this.tableData1 = response.rows
          this.total = response.total
        })
      },
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
