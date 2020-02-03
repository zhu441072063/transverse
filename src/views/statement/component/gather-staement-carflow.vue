<template>
  <div>
    <!-- 查询项 -->
    <div class="input">
      <el-row>
        <span>设备编号：</span>
        <el-input v-model="userlist.USERNAME" placeholder="请输入内容"/>
        <span>报表格式：</span>
        <el-select v-model="userlist.USERSTATE" clearable placeholder="用户状态">
<!--          <el-option-->
<!--            v-for="item in user_USERSTATE"-->
<!--            :key="item.CODEVALUE"-->
<!--            :label="item.CODELABEL"-->
<!--            :value="item.CODEVALUE"-->
<!--          />-->
        </el-select>

        <span>查询时间：</span>
        <el-date-picker
          v-model="userlist.end_time"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        <el-button type="primary" @click="Search">查询</el-button>
        <a href="http://127.0.0.1:8080/dbsql.jsp?mode=pdf&sql=240"><el-button type="primary">PDF--打印当前页</el-button></a>
        <a href="http://127.0.0.1:8080/dbsql.jsp?mode=excel&sql=240"><el-button type="primary">excel--打印当前页</el-button></a>
      </el-row>
    </div>
    <!--表格-->
      <el-table
        :data="tableData1"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="日期"
          width="150">
        </el-table-column>
        <el-table-column label="上行">
          <el-table-column
            prop="name"
            label="小型车数"
            >
          </el-table-column>
            <el-table-column
              prop="province"
              label="小型车速"
              >
            </el-table-column>
            <el-table-column
              prop="city"
              label="中型车数"
              >
            </el-table-column>
            <el-table-column
              prop="address"
              label="中型车速"
              >
            </el-table-column>
            <el-table-column
              prop="zip"
              label="大型车数"
             >
            </el-table-column>
          <el-table-column
            prop="name"
            label="大型车速"
          >
          </el-table-column>
          <el-table-column
            prop="province"
            label="车头间距"
          >
          </el-table-column>
          <el-table-column
            prop="city"
            label="车头时距"
          >
          </el-table-column>
          <el-table-column
            prop="address"
            label="占有率"
          >
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="zip"
          label="下行"
          width="120">
          <el-table-column
            prop="name"
            label="小型车数"
          >
          </el-table-column>
          <el-table-column
            prop="province"
            label="小型车速"
          >
          </el-table-column>
          <el-table-column
            prop="city"
            label="中型车数"
          >
          </el-table-column>
          <el-table-column
            prop="address"
            label="中型车速"
          >
          </el-table-column>
          <el-table-column
            prop="zip"
            label="大型车数"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="大型车速"
          >
          </el-table-column>
          <el-table-column
            prop="province"
            label="车头间距"
          >
          </el-table-column>
          <el-table-column
            prop="city"
            label="车头时距"
          >
          </el-table-column>
          <el-table-column
            prop="address"
            label="占有率"
          >
          </el-table-column>

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
        //查全部用户信息--分页
        listQuery: {
          pageno: 1,
          pagesize: 5,
          sql:'220'
        },
        // 条件查询用户信息--分页
        userlist: {
          pageno: 1,
          pagesize: 5,
          sql:'222',
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

  .el-input {
    width: 200px;
    margin: 8px;
  }

</style>
