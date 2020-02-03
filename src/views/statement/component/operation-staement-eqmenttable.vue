<template>
  <div>
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
        <a href="http://127.0.0.1:8080/dbsql.jsp?mode=pdf&sql=287" target="_blank"><el-button type="primary">PDF--打印当前页</el-button></a>
        <a href="http://127.0.0.1:8080/dbsql.jsp?mode=excel&sql=287" target="_blank"><el-button type="primary">excel--打印当前页</el-button></a>
      </el-row>
    </div>
    <!--表格-->
    <el-table
      class="user_stament"
      :data="tableData1"
      row-key="ID"
      border
      style="width: 100%"
      v-loading="listLoading"
    >
      <el-table-column
        prop="DEVICE_NUMBER"
        label="设备编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="CODEMEAN"
        label="设备类型"
        width="180">
      </el-table-column>
      <el-table-column
        prop="POSITION"
        label="位置">
      </el-table-column>
      <el-table-column
        prop="IP"
        label="设备IP">
      </el-table-column>

      <el-table-column
        prop="LANE"
        label="所在车道"
      >
      </el-table-column>
      <el-table-column
        prop="DEVICE_DESC"
        label="备注"
      >
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
  import { getSql, setSql} from '@/api/sql'
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
        //查全部设备信息--分页
        listQuery: {
          pageno: 1,
          pagesize: 5,
          sql:'240'
        },
        // 条件查询设备信息--分页
        userlist: {
          pageno: 1,
          pagesize: 5,
          sql:'241',
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
          for (const i in this.tableData1) {
            this.tableData1[i].POSITION = zGetCode('tunnelType', this.tableData1[i].POSITION).concat(this.pile_v1, this.tableData1[i].PILE_NUM1, this.pile_v2, this.tableData1[i].PILE_NUM2)
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

  .el-input {
    width: 200px;
    margin: 8px;
  }

</style>
