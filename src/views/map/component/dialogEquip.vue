<template>
  <div>
    <!--设备信息-->
    <el-dialog
      :title="'操作板'"
      :visible.sync="dialogShowEq"
      width="1000px"
      :close-on-click-modal="false"
    >
      <el-container>
        <el-main>
          <el-form label-width="110px" :inline="true">
            <!-- 表格 -->
            <div class="table">
              <el-table
                ref="table"
                v-loading="listLoading"
                :data="tableData"
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
                  prop="DEVICE_NUMBER"
                  label="设备编号"
                  min-width="120px"
                  align="center"
                />
                <el-table-column
                  prop="DEVICE_TYPE"
                  label="设备类型"
                  min-width="120px"
                  align="center"
                />
                <el-table-column
                  label="位置"
                  min-width="120px"
                  align="center">
                  <template slot-scope="{row}">
                    {{ zGetCode('tunnelType',row.POSITION) }}
                    {{ row.PILE_NUM1 }}+
                    {{ row.PILE_NUM2 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="STATE"
                  label="状态"
                  min-width="120px"
                  align="center"
                />
                <el-table-column
                  label="备注"
                  min-width="120px"
                  align="center"
                  prop="DEVICE_DESC"
                />
                <el-table-column label="操作" min-width="120px" align="center">
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
                        @click="eqInfo(scope.row)"
                      />
                    </el-tooltip>
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
              :page.sync="listQuery.pageno"
              :limit.sync="listQuery.pagesize"
              @pagination="showEq"
            />
          </div>
        </el-footer>
      </el-container>
    </el-dialog>
    <!--设备详情-->
    <el-dialog
      :title="'操作板'"
      :visible.sync="dialogShowInfo"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-container class="eq-info">
        <el-main>
          <el-col :span="10">
            <img src="" alt="" class="info-img">
          </el-col>
          <el-col :span="14">
            <div class="zall">
              <div class="zlist">
                设备状态：
                <el-button type="primary" size="mini">
                  历史
                </el-button>
              </div>
              <div class="zlist">
                当前状态：
              </div>
            </div>
            <div class="zall zalltwo">
              <div class="zlist ztitle">设备状态：</div>
              <template v-for="(item,index) in eqSetList">
                <div class="zlist">
                  {{item.CODELABEL}}
                  <el-button type="primary" size="mini" @click="addAction(item.CODEVALUE)">
                    下发
                  </el-button>
                </div>
              </template>
            </div>
          </el-col>
        </el-main>
        <el-footer>
          <el-col :span="12">
            设备编号：{{eqinfo.DEVICE_NUMBER}}
          </el-col>
          <el-col :span="12">
            位置：
            {{ zGetCode('tunnelType',eqinfo.POSITION) }} K{{eqinfo.PILE_NUM1}}+{{eqinfo.PILE_NUM1}}
          </el-col>
          <el-col :span="12">
            通讯方式：{{ zGetCode('communication',eqinfo.COMMUNICATION) }} {{eqinfo.IP}}
          </el-col>
          <el-col :span="12">
            链接：
          </el-col>
        </el-footer>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
import { getSql, setSql } from '@/api/sql'
import { zGetCodeAll, zGetCode, zGetDir } from '@/utils/common'
import Pagination from '@/components/Pagination' //  secondary package based on el-pagination
export default {
  name: 'DialogEquip',
  props: {
  },
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: false,
      equipmentTypeList: zGetDir('equipmentType'),
      zGetCode: zGetCode,
      listQuery: {
        pageno: 1,
        pagesize: 5,
        sql: 401
      },
      total: 0,
      tableData: [],
      dialogShowEq: false, // 查询设备弹窗
      dialogShowInfo: false, // 查询设备弹窗
      eqinfo: {
        DEVICE_NUMBER: '',
        TUNNEL: '',
        POSITION: '',
        PILE_NUM1: '',
        PILE_NUM2: '',
        IP: ''
      },
      eqSetList: []
    }
  },
  mounted() {
    // this.getList()
  },
  methods: {
    // 查询设备
    showEq: function() {
      this.dialogShowEq = true
      this.listLoading = true
      getSql(this.listQuery).then(response => {
        this.total = response.total
        this.tableData = response.rows
      }).finally(response => {
        this.listLoading = false
      })
    },
    //  设备详情
    eqInfo(row) {
      this.eqinfo = row
      this.dialogShowInfo = true
      console.log(row.DEVICE_TYPE)
      console.log(this.equipmentTypeList)
      let CODENAME = ''
      for (const v of this.equipmentTypeList) {
        if (v.CODEMEAN == row.DEVICE_TYPE) CODENAME = v.CODENAME
      }
      console.log(CODENAME)
      var bb = zGetCodeAll(CODENAME)
      console.log(bb)
      this.eqSetList = bb
      console.log()
    },
    // 下发
    addAction(val) {
      this.$parent.$parent.websocketsend(val)
    }
  }
}
</script>

<style scoped>

</style>
