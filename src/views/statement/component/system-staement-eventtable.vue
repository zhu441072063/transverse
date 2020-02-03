
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
        <a href="http://localhost:9527/dbsql.jsp?mode=pdf&sql=281" target="_blank"><el-button type="primary">PDF--打印当前页</el-button></a>
        <a href="http://localhost:9527/dbsql.jsp?mode=excel&sql=281" target="_blank"><el-button type="primary">excel--打印当前页</el-button></a>
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
        v-if="false"
        prop="ID"
        label="ID"
        width="60px"
        align="center"
      />
      <el-table-column
        prop="HAPPEN_TIME"
        label="时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="HAPPEN_POSITION"
        label="事件位置"
        width="180">
      </el-table-column>
      <el-table-column
        prop="SOURCE"
        label="报警源">
        <template slot-scope="{row}">
          {{ zGetCode('source', row.SOURCE) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="LEVEL"
        label="事件等级">
        <template slot-scope="{row}">
          {{ zGetCode('eventLevel', row.LEVEL) }}
        </template>
      </el-table-column>


      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="查看"
            placement="top"
          >
            <el-button
              type="warning"
              icon="el-icon-search"
              size="small"
              @click="getID(scope.row.ID)"
            >查看</el-button>
          </el-tooltip>
        </template>
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
    <!-- 弹窗 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="1100px"
      :close-on-click-modal="false"
    >
      <el-container>
        <el-header>事件详情
        </el-header>
        <el-main>
          <el-form ref="useraddForm" label-width="100px" class="demo-ruleForm">
            <div style="width: 1000px;"id="dialog">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="事件编号">
                  <el-input v-model="tableData.ID"readonly/>
                </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="事件发生时间">
                    <el-input v-model="tableData.HAPPEN_TIME"readonly/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="事件结束时间">
                    <el-input v-model="tableData.HANDLE_TIME"readonly/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="事件来源">
                    <el-input v-model="tableData.SOURCE"readonly>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="报警位置">
                    <el-input v-model="tableData.CALL_POSITION"readonly/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="事件位置">
                    <el-input v-model="tableData.HAPPEN_POSITION"readonly/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="事件类型">
                    <el-input v-model="tableData.TYPE"readonly>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="事件级别">
                    <el-input v-model="tableData.LEVEL" readonly>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="通知对象">
                    <el-input v-model="tableData.NOTICE_OBJECT" readonly/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="轻伤人数">
                    <el-input v-model="tableData.NUM1" readonly/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="重伤人数">
                    <el-input v-model="tableData.NUM2" readonly/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="死亡数">
                    <el-input v-model="tableData.NUM3"readonly />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="事件内容">
                    <el-input v-model="tableData.CONTENT"readonly />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="处理人">
                    <el-input v-model="tableData.HANDLE_MEMBER" readonly/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="处理结果">
                    <el-input v-model="tableData.HANDLE_STATUS"readonly />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="处理说明">
                    <el-input v-model="tableData.HANDLE_CONTENT" readonly/>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <el-form-item>
              <el-button type="" @click="fetchData">打印</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </el-dialog>

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
        total:0,
        //加载图标
        listLoading:true,
        //获取字典
        zGetCode: zGetCode,
        //位置拼接
        pile_v1: 'K',
        pile_v2: '+',
        //事件是否可以编辑
        eventReadonly: false,
        // 表格数据
        tableData1: [],
        tableData:{},
        //弹窗
        dialogFormVisible: false,
        title: '',
        //查全部事件信息--分页
        listQuery: {
          pageno: 1,
          pagesize: 5,
          sql:'220'
        },
        // 条件查询事件信息--分页
        userlist: {
          pageno: 1,
          pagesize: 5,
          sql:'222',
          start_time:'',
          end_time:''
        },
        //按照id条件查询事件信息
        idselect: {
          sql:'221' ,
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
            this.tableData1[i].HAPPEN_POSITION = zGetCode('tunnelType', this.tableData1[i].HAPPEN_POSITION1).concat(this.pile_v1, this.tableData1[i].HAPPEN_POSITION2, this.pile_v2, this.tableData1[i].HAPPEN_POSITION3)
          }
          this.listLoading = false
        })
      },
      //根据id查全部
      getID(ID){
        this.dialogFormVisible = true
        this.idselect.ID = ID
        getSql(this.idselect).then(response => {
          this.tableData = response.rows[0]
          this.tableData.SOURCE=zGetCode('source', this.tableData.SOURCE)
          this.tableData.HAPPEN_POSITION = zGetCode('tunnelType', this.tableData.HAPPEN_POSITION1).concat(this.pile_v1, this.tableData.HAPPEN_POSITION2, this.pile_v2, this.tableData.HAPPEN_POSITION3)
          this.tableData.TYPE=zGetCode('eventType', this.tableData.TYPE)
          this.tableData.LEVEL=zGetCode('eventLevel', this.tableData.LEVEL)
          this.tableData.HANDLE_STATUS=zGetCode('handleStatus', this.tableData.HANDLE_STATUS)
          this.tableData.NOTICE_OBJECT=zGetCode('noticeObject', this.tableData.NOTICE_OBJECT)
        })
      },
      // 条件查询
      Search() {
        getSql(this.userlist).then(response => {
          this.tableData1 = response.rows
          this.total = response.total
        })
      },

      // 打印PDF
      fetchData() {
         window.print();
          // var newstr = document.getElementById("dialog").innerHTML;
          // var oldstr = document.body.innerHTML;
          // document.body.innerHTML = newstr;
          // window.print();
          // document.body.innerHTML = oldstr;
          // return false;
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

