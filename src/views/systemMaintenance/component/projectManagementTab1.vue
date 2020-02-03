<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <!-- 查询项 -->
        <div class="input">
          <div>
            <span>预案名称:</span>
            <el-input v-model="search.NAME" placeholder="请输入内容" />
            <el-select v-model="search.TYPE" clearable placeholder="预案类型">
              <el-option v-for="item in planType" :key="item.value" :label="item.CODELABEL" :value="item.CODEVALUE" />
            </el-select>
            <el-select v-model="search.LEVEL" clearable placeholder="预案级别">
              <el-option v-for="item in planLevel" :key="item.value" :label="item.CODELABEL" :value="item.CODEVALUE" />
            </el-select>
            <el-select v-model="search.METHOD" clearable placeholder="执行方式">
              <el-option v-for="item in execution" :key="item.value" :label="item.CODELABEL" :value="item.CODEVALUE" />
            </el-select>
          </div>
          <div>
            <el-button type="success" @click="searchData">查询</el-button>
            <el-button type="success" @click="addPlan">添加预案</el-button>
          </div>
        </div>
        <!-- 表格 -->
        <div class="table">
          <el-table ref="table" row-key="id" :data="pageData" style="width: 100%" @row-click="handleCurrentChange" @selection-change="selsChange">
            <el-table-column type="selection" width="55" align="center" reserve-selection="" />
            <el-table-column prop="NUNBER" label="预案编号" min-width="90px" align="center" />
            <el-table-column prop="NAME" label="预案名称" min-width="120px" align="center" />
            <el-table-column prop="TYPE" label="预案类型" min-width="120px" align="center" />
            <el-table-column prop="LEVEL" label="预案级别" min-width="120px" align="center" />
            <el-table-column label="隧道模式图" min-width="120px" align="center" >
              <template slot-scope="scope">
                 <el-image
                      style="width: 100px; height: 50px"
                      :src="scope.row.SRC"
                      ></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="METHOD" label="执行方式" min-width="120px" align="center" />
            <el-table-column prop="ISUSE" label="预案状态" min-width="120px" align="center" />
            <el-table-column label="操作" min-width="200px" align="center">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="方案设置" placement="top">
                  <el-button type="warning" icon="el-icon-setting" size="small" @click="bluePrint" />
                </el-tooltip>
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
    <el-dialog title="方案设置" width="950px" :visible.sync="windowInfo1.isShow" :close-on-click-modal="false">
      <el-carousel
        ref="carousel"
        arrow="never"
        :autoplay="false"
        height="400px"
      >
        <el-carousel-item :key="1">
          <preplanSet :plan-list="measure" />
        </el-carousel-item>
        <el-carousel-item :key="2">
          <div style="padding-left: 20px;">
            <el-form label-width="84px">
              <el-row>
                <el-col :span="20">
                  <el-form-item label="绑定设备">
                    <deviceManage :device-list="devices" />
                  </el-form-item>
                </el-col>
                <el-col :span="20">
                  <el-form-item label="通知人员">
                    <el-checkbox-group v-model="informStaffList">
                      <el-checkbox
                        v-for="item in informStaff"
                        :label="item.CODELABEL"
                        :value="item.CODEVALUE"
                      />
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-carousel-item>
      </el-carousel>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="windowInfo1Switch">{{ windowInfo1.switchText1 }}</el-button>
        <el-button type="primary" @click="windowInfo1Control">{{ windowInfo1.switchText2 }}</el-button>
      </div>
    </el-dialog>
    <!--弹窗2-->
    <el-dialog :title="windowInfo.title" :visible.sync="dialogFormVisible" width="1000px" :close-on-click-modal="false">
      <el-container class="z-sjadd">
        <el-main>
          <el-form label-width="110px" :inline="true">
            <el-row>
              <el-col :span="12">
                <el-form-item label="方案编号"><el-input v-model="pageInfoData.number" /></el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="方案名称"><el-input v-model="pageInfoData.name" /></el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="方案类型">
                  <el-select v-model="pageInfoData.type" clearable placeholder="预案类型">
                    <el-option v-for="item in planType" :key="item.value" :label="item.CODELABEL" :value="item.CODEVALUE" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="方案级别">
                  <el-select v-model="pageInfoData.level" clearable placeholder="预案类型">
                    <el-option v-for="item in planLevel" :key="item.value" :label="item.CODELABEL" :value="item.CODEVALUE" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="隧道模式图">
                  <uploadpic :image-data="pageInfoData" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否启用">
                  <el-select v-model="pageInfoData.status" clearable placeholder="是否启用">
                    <el-option v-for="item in status" :key="item.key" :label="item.key" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注"><el-input v-model="pageInfoData.remark" /></el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-main>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="savePlanData()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getSql, setSql } from '@/api/sql'
import Pagination from '@/components/Pagination' //  secondary package based on el-pagination
import { zGetCodeAll } from '@/utils/common' // 数据字典
import preplanSet from './preplanSet'
import uploadpic from './uploadpic'
import { util } from '@/utils/util'
import deviceManage from './deviceManage'
export default {
  name: 'BackToTop',
  components: { Pagination, preplanSet, uploadpic, deviceManage },
  props: {
    transitionName: {
      type: String,
      default: 'fade'
    }
  },
  data() {
    return {
      devices: [], // 方案关联设备
      informStaffList: [], // 方案关联人员
      measure: [], // 具体措施
      sels: [], // 多选参数
      rowData: [],
      windowInfo: {
        type: 2, // 1:查看，2修改，3，新增
        title: '查看'
      },
      windowInfo1: {
        isShow: false,
        switchText1: '下一页',
        switchText2: '关闭'
      },
      dialogFormVisible: false, // 弹窗控制
      listLoading: false, // 加载
      select_val: '',
      total: 0,
      status: [{
        key: '是',
        value: 1
      }, {
        key: '否',
        value: 0
      }],
      informStaff: zGetCodeAll('InformStaff'), // 通知人员
      planType: zGetCodeAll('planType'), // 预案类型
      planLevel: zGetCodeAll('planLevel'), // 预案级别
      execution: zGetCodeAll('execution'), // 执行方式
      //  查询条件
      listQuery: {
        pageno: 1,
        pagesize: 5,
        mode: 'get',
        sql: 1704
      },
      pageData: [],
      search: {
        sql: 1705,
        NAME: '',
        TYPE: '',
        LEVEL: '',
        METHOD: ''
      },
      position: '',
      pile_num: '',
      pageInfoData: {
        number: '', // 编号
        name: '', // 名称
        type: '', // 类型
        level: '', // 级别
        src: '', // 图路径
        status: 1, // 是否启用 0.否 1是
        remark: ''// 备注
      },
      imageUrl: '',
      boxDataList: []// 页面列表
    }
  },
  mounted() {
    console.log(this.informStaff)
    var that = this
    setSql({
      sql: 1709
    }).then(response => {
      that.boxDataList = response.rows
    })
  },
  created() {
    this.getList()
  },
  methods: {
    windowInfo1Switch() {
      var obj = this.windowInfo1
      var carousel = this.$refs.carousel
      const index = carousel.activeIndex
      if (index == '1') {
        obj.switchText1 = '下一页'
        obj.switchText2 = '关闭'
        carousel.setActiveItem(2)
      } else {
        obj.switchText1 = '上一页'
        obj.switchText2 = '保存'
        carousel.setActiveItem(1)
      }
    },
    windowInfo1Control() {
      var text = this.windowInfo1.switchText2
      var date = new Date()
      var that = this
      date = util.dateFormat('YYYY-mm-dd HH:MM:SS', date)
      if (text == '保存') {
        setSql({
          sql: 1706,
          PREPLAN_ID: this.rowData.ID,
          TUNNEL: '',
          ISACCORD: '',
          DEVICETEXT: JSON.stringify(this.devices),
          PREPLANTEXT: JSON.stringify(this.informStaffList),
          PEOPLETEXT: JSON.stringify(this.measure),
          CREATE_TIME: date,
          UPDATE_TIME: date
        }).then(response => {
          that.$message({
            type: 'success',
            message: '保存成功!'
          })
        })
      } else {
        this.windowInfo1.isShow = false
      }
    },
    bluePrint() {
      this.windowInfo1.isShow = true
    },
    uploadpicData() {

    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {

    },
    initData() {
      this.pageInfoData.number = ''
      this.pageInfoData.name = ''
      this.pageInfoData.type = ''
      this.pageInfoData.level = ''
      this.pageInfoData.src = ''
      this.pageInfoData.status = 1
      this.pageInfoData.remark = ''
    },
    setActive() {
      console.log(111)
    },
    searchData() { // 搜索
      var that = this
      var name = this.search.NAME
      var obj = JSON.parse(JSON.stringify(this.search))
      obj.NAME = '%' + name + '%'
      getSql(obj).then(response => {
        that.total = response.total
        that.pageData = response.rows
        that.listLoading = false
      })
    },
    // 所选数据
    selectData() {

    },
    // 添加隧道
    addPlan() {
      this.clear()
      this.windowInfo.title = '新建方案'
      this.dialogFormVisible = true
      this.initData()
    },
    // 编辑
    edit(data) {
      this.dialogFormVisible = true
      this.rowData = data
      this.windowInfo.title = '修改方案'
      this.pageInfoData.number = data.NUNBER
      this.pageInfoData.name = data.NAME
      this.pageInfoData.type = data.TYPE
      this.pageInfoData.level = data.LEVEL
      this.pageInfoData.src = data.SRC
      this.pageInfoData.status = data.ISUSE
      this.pageInfoData.remark = data.REMARK
    },
    // 保存预案
    savePlanData() {
      var rowData = this.rowData
      var date = new Date()
      date = util.dateFormat('YYYY-mm-dd HH:MM:SS', date)
      var that = this
      var pageInfoData = this.pageInfoData
      // 保存预案信息
      var that = this
      var obj = {
        sql: '1701',
        NUNBER: pageInfoData.number,
        NAME: pageInfoData.name,
        TYPE: pageInfoData.type,
        LEVEL: pageInfoData.level,
        METHOD: pageInfoData.number,
        SRC: pageInfoData.src,
        ISROUTINES: 0,
        ISUSE: pageInfoData.status,
        REMARK: pageInfoData.remark,
        UPDATE_TIME: date
      }
      if (this.windowInfo.title == '新建方案') {
        obj.CREATE_TIME = date
        setSql(obj).then(() => {
          that.dialogFormVisible = false
          that.$message({
            type: 'success',
            message: '新建成功!'
          })
        })
      } else {
        obj.sql = 1702
        obj.ID = rowData.ID
        setSql(obj).then(() => {
          that.$message({
            type: 'success',
            message: '修改成功!'
          })
          that.dialogFormVisible = false
        })
      }
    },
    // 关联设备
    relevanceDevice(id) {},
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
      for (var i in this.input) {
        this.input[i] = ''
      }
      this.pile_num = ''
      this.position = ''
    },
    // 返回列表
    back() {
      this.dialogFormVisible = false
      this.select_val = ''
      this.getList()
    },
    // 单个删除
    def(id) {
      const params = {
        sql: 1703,
        id: id
      }
      getSql(params).then(() => {
        this.getList()
      })
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
