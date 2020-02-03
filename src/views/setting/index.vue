<template>
  <div class="app-container">
    <div class="z_left" v-loading="treeLoading">
      <el-button   type="success" @click="getDirList()" icon="el-icon-edit">
        刷新
      </el-button>
      <el-button   type="danger" @click="setDirList()" icon="el-icon-edit">
        载入缓存
      </el-button>
      <tree :nodes="nodes" :setting="nodesSetting"/>
    </div>
    <div class="z_right">
      <el-container>
        <el-header>字典值
          <el-button icon="el-icon-plus" @click="addCode">添加字典</el-button>
        </el-header>
        <el-main>
          <!-- 表格 -->
          <div class="table">
            <el-table
              v-loading="listLoading"
              ref="multipleTable"
              :data="codeList"
              tooltip-effect="dark"
              style="width: 100%"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column
                prop="CODELABEL"
                label="显示名称"
                min-width="90px"
                align="center"
              />
              <el-table-column
                prop="CODEVALUE"
                label="值"
                min-width="30px"
                align="center"
              />
              <el-table-column
                prop="ORDERNO"
                label="排序序号"
                min-width="50px"
                align="center"
              />
              <el-table-column
                label="是否可用"
                min-width="100px"
                align="center">
                <template slot-scope="{row}">
                  {{ zGetCode('yesno', row.AVAILABLE) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="200px" align="center">
                <template slot-scope="{row}">
                  <el-button type="success" icon="el-icon-edit" @click="editCode(row)" size="small" />
                  <el-popconfirm
                    confirmButtonText='好的'
                    cancelButtonText='不用了'
                    icon="el-icon-info"
                    iconColor="red"
                    title="这是一段内容确定删除吗？"
                    @onConfirm="onConfirm"
                  >
                    <el-button slot="reference" type="danger" icon="el-icon-delete" size="small" @click="delCode(row)">删除</el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-main>
        <!-- 分页 -->
        <el-footer><div class="block">
          <el-button>批量删除</el-button>
          <pagination
            :total="total"
            :page.sync="listQuery.pageno"
            :limit.sync="listQuery.pagesize"
            @pagination="getList"
          /></div></el-footer>
      </el-container>
    </div>
    <div class="clear"></div>
    <div ref="box" class="right-menu" v-show="yshou" :style="{'left':left+'px','top':top+'px'}">
      <a href="javascript:" @click="addDataIndex">新增</a>
      <a href="javascript:" @click="editDataIndex">修改</a>
      <el-popconfirm
        confirmButtonText='好的'
        cancelButtonText='不用了'
        icon="el-icon-info"
        iconColor="red"
        title="这是一段内容确定删除吗？"
        @onConfirm="onConfirm"
      >
        <a slot="reference" href="javascript:" @click="deleteDataIndex">删除</a>
      </el-popconfirm>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="字典标识" prop="CODENAME">
          <el-input v-model="temp.CODENAME" />
        </el-form-item>
        <el-form-item label="字典含义" prop="CODEMEAN">
          <el-input v-model="temp.CODEMEAN" />
        </el-form-item>
        <el-form-item label="同级排序号" type="number" min="0" prop="ORDERNO">
          <el-input v-model="temp.ORDERNO" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          保存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :title="textMap2[dialogStatus]" :visible.sync="dialogFormVisible2">
      <el-form ref="dataForm2" :rules="rules2" :model="codeAddQuery" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="编码标签名" prop="CODELABEL">
          <el-input v-model="codeAddQuery.CODELABEL" />
        </el-form-item>
        <el-form-item label="编码值" prop="CODEVALUE">
          <el-input v-model="codeAddQuery.CODEVALUE" />
        </el-form-item>
        <el-form-item label="排序序号" prop="ORDERNO">
          <el-input type="number" min="0" v-model="codeAddQuery.ORDERNO"  />
        </el-form-item>
        <el-form-item label="所属目录" prop="DIRID">
          <el-select v-model="codeAddQuery.DIRID" class="filter-item" placeholder="请选择" disabled>
            <el-option v-for="item in dir" :key="item.ID" :label="item.CODEMEAN" :value="item.ID" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否可用" prop="AVAILABLE">
          <el-select v-model="codeAddQuery.AVAILABLE" class="filter-item" placeholder="请选择">
            <el-option v-for="item in yesno" :key="item.ID" :label="item.CODELABEL" :value="item.CODEVALUE" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus2==='create'?create2Data():update2Data()">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { zGetCodeAll, zGetCode } from '@/utils/common'
import tree from 'vue-giant-tree'
import { getSql, setSql } from '@/api/sql'

import store from '@/store'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'SettingIndex',
  data() {
    return {
      deleteLabelInfo: {},
      treeLoading: true,
      yshou: false,
      defaultProps: {
        children: 'children',
        label: 'CODEMEAN'
      },
      dirList: [], // 字典目录列表
      dirQuery: {
        sql: 501
      },
      nodes: [], // 字典目录树形结构
      nodesSetting: {
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pid',
            rootPId: 0
          }
        },
        callback: {
          onClick: this.OnClick,
          onRightClick: this.OnRightClick
        }
      }, // 树形结构配置文件
      left: 0,
      top: 0,
      dialogStatus: '',
      dialogStatus2: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      textMap2: {
        update: '编辑',
        create: '新增'
      },
      dialogFormVisible: false, // 字典目录弹窗
      dialogFormVisible2: false, // 字典弹窗
      temp: { // 选中的字典目录名称
        ID: 0,
        pid: 0,
        CODENAME: '',
        CODEMEAN: '',
        ORDERNO: ''
      },
      rules: {
        CODENAME: [{ required: true, message: '请填写字典标识', trigger: 'blur' }],
        CODEMEAN: [{ required: true, message: '请填写字典含义', trigger: 'blur' }]
      },
      rules2: {
        CODELABEL: [{ required: true, message: '请填写编码标签名', trigger: 'blur' }],
        CODEVALUE: [{ required: true, message: '请填写编码值', trigger: 'blur' }]
      },
      codeList: [], // 数据字典列表
      total: 0,
      listLoading: false,
      listQuery: {
        pageno: 1,
        pagesize: 5,
        id: 0,
        mode: 'get',
        sql: 503
      },
      zGetCode: zGetCode,
      DirDelQuery: { // 字典目录删除条件
        sql: 504,
        id: 0
      },
      DirAddQuery: { // 字典目录添加内容
        sql: 505,
        ID: 0, // 主键
        CREATE_ID: '1', // 创建人
        CODENAME: '', // 字典目录名
        PARENTID: '', // 父节点ID
        CODEMEAN: '', // 编码含义
        ORDERNO: '' // 同级菜单中排序序号
      },
      codeAddQuery: { // 字典添加内容
        sql: 507,
        ID: 0, // 主键
        CREATE_ID: '1', // 创建人
        CODELABEL: '', // 编码标签名
        CODEVALUE: '', // 编码值
        ORDERNO: '', // 排序序号
        DIRID: '', // 所属目录
        AVAILABLE: '' // 是否可用
      },
      codeDelQuery: {
        sql: 509,
        id: 0
      },
      yesno: [], // 是否显示下拉框
      dir: [], // 父目录下拉框
      delFunc: ''
    }
  },
  components: {
    Pagination,
    tree
  },
  computed: {
  },
  created() {
    this.getDirList()
    document.addEventListener('click', (e) => {
      if (this.$refs.box&&!this.$refs.box.contains(e.target) && this.yshou) {
        this.yshou = false
      }
      this.yshou = false
    })
    this.yesno = zGetCodeAll('yesno')
    console.log(tree)
  },
  methods: {
    // 获取字典目录-缓存
    getDirList() {
      this.treeLoading = true
      getSql(this.dirQuery).then(response => {
        // const list = zTree(response.rows, 'PARENTID', 'ID', 'children')
        // this.dirList = list
        this.nodes = this.setNewData(response.rows)
        this.dir = response.rows
      }).finally(response => {
        this.treeLoading = false
      })
    },
    // 获取字典目录-重新获取缓存
    setDirList() {
      store.dispatch('user/getCode', {
        mode: 'get',
        sql: 502
      }).then(response => {
        this.getDirList()
      })
    },
    // 点击更新右侧数据
    OnClick(a, b, c) {
      this.listQuery.id = c.id
      this.codeAddQuery.DIRID = c.id
      this.getList()
    },
    // 右击弹出层事件
    OnRightClick(a, b, c) {
      console.log(this.nodes)
      var position = a.target.getBoundingClientRect()
      this.left = position.x + position.width
      this.top = position.y
      if (c) {
        this.yshou = true
        this.temp = {
          ID: c.id,
          pid: c.pid,
          CODEMEAN: c.name,
          CODENAME: c.code,
          ORDERNO: c.orderno
        }
        this.DirDelQuery.id = c.id
        this.DirAddQuery.PARENTID = c.id
        this.DirAddQuery.ID = c.id
      }
    },
    // 处理、tree数据
    setNewData(data) {
      var newData = []
      for (let v of data) {
        const data = {
          id: v.ID,
          pid: v.PARENTID,
          name: v.CODEMEAN,
          code: v.CODENAME,
          orderno: v.ORDERNO,
          open: true
        }
        newData.push(data)
      }
      return newData
    },
    // 新增字典目录
    addDataIndex() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改字典目录
    editDataIndex() {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 删除字典目录
    deleteDataIndex() {
      this.delFunc = 'deleteHandle'
    },
    // 确认删除字典目录
    deleteHandle() {
      setSql(this.DirDelQuery).then(response => {
        if (response.count == 0) {
          this.$message({
            message: '删除失败',
            type: 'error'
          })
          return
        }
        this.getDirList()
      })
    },
    // 清空
    resetTemp() {
      this.temp = {
        ID: 0,
        pid: 0,
        CODEMEAN: '',
        CODENAME: '',
        ORDERNO: 0
      }
    },
    // 清空
    resetTemp2() {
      this.codeAddQuery.CODELABEL = ''
      this.codeAddQuery.CODEVALUE = ''
      this.codeAddQuery.ORDERNO = 0
      this.codeAddQuery.AVAILABLE = ''
    },
    // 新增字典目录-保存
    createData(formName) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.DirAddQuery.sql = 505 // 新增
          this.DirAddQuery.CODENAME = this.temp.CODENAME
          this.DirAddQuery.CODEMEAN = this.temp.CODEMEAN
          this.DirAddQuery.ORDERNO = this.temp.ORDERNO
          setSql(this.DirAddQuery).then(response => {
            if (response.count == 0) {
              this.$message({
                message: '添加失败',
                type: 'error'
              })
              return
            }
            this.getDirList()
            this.dialogFormVisible = false
          })
        }
      })
    },
    // 修改字典目录-保存
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.DirAddQuery.sql = 506 // 修改
          this.DirAddQuery.CODENAME = this.temp.CODENAME
          this.DirAddQuery.CODEMEAN = this.temp.CODEMEAN
          this.DirAddQuery.ORDERNO = this.temp.ORDERNO
          setSql(this.DirAddQuery).then(response => {
            if (response.count == 0) {
              this.$message({
                message: '修改失败',
                type: 'error'
              })
              return
            }
            this.getDirList()
            this.dialogFormVisible = false
          })
        }
      })
    },
    // 新增字典
    addCode() {
      this.resetTemp2()
      this.dialogStatus2 = 'create'
      this.codeAddQuery.AVAILABLE = '1'
      if (!this.codeAddQuery.DIRID) {
        this.$message({
          message: '请选择字典目录',
          type: 'error'
        })
        return
      }
      this.dialogFormVisible2 = true
      this.$nextTick(() => {
        this.$refs['dataForm2'].clearValidate()
      })
    },
    // 修改字典
    editCode(data) {
      this.codeAddQuery.ID = data.ID
      this.codeAddQuery.CODELABEL = data.CODELABEL
      this.codeAddQuery.CODEVALUE = data.CODEVALUE
      this.codeAddQuery.ORDERNO = data.ORDERNO
      this.codeAddQuery.AVAILABLE = data.AVAILABLE
      this.dialogStatus2 = 'update'
      this.dialogFormVisible2 = true
      this.$nextTick(() => {
        this.$refs['dataForm2'].clearValidate()
      })
    },
    // 删除字典
    delCode(data) {
      this.codeDelQuery.id = data.ID
      this.delFunc = 'deleteRm'
    },
    onConfirm() {
      if (this.delFunc === 'deleteRm') { // 删除字典
        this.deleteRm()
      } else { // 删除字典目录
        this.deleteHandle()
      }
    },
    // 确认删除字典目录
    deleteRm() {
      setSql(this.codeDelQuery).then(response => {
        if (response.count == 0) {
          this.$message({
            message: '删除失败',
            type: 'error'
          })
          return
        }
        this.getList()
      })
    },
    // 新增字典-保存
    create2Data(formName) {
      this.$refs['dataForm2'].validate((valid) => {
        if (valid) {
          this.codeAddQuery.sql = 507 // 新增
          setSql(this.codeAddQuery).then(response => {
            if (response.count == 0) {
              this.$message({
                message: '添加失败',
                type: 'error'
              })
              return
            }
            this.getList()
            this.dialogFormVisible2 = false
          })
        }
      })
    },
    // 修改字典-保存
    update2Data() {
      this.$refs['dataForm2'].validate((valid) => {
        if (valid) {
          this.codeAddQuery.sql = 508 // 修改
          setSql(this.codeAddQuery).then(response => {
            if (response.count == 0) {
              this.$message({
                message: '修改失败',
                type: 'error'
              })
              return
            }
            this.getList()
            this.dialogFormVisible2 = false
          })
        }
      })
    },
    getList() {
      this.listLoading = true
      getSql(this.listQuery).then(response => {
        this.total = response.total
        this.codeList = response.rows
      }).finally(response => {
        this.listLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    /*height: calc(100vh - 84px);*/
    .z_left{
      width: 25%;
      float: left;
    }
    .z_right{
      width: 70%;
      margin-left: 5%;
      float: left;
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
    }
  }
  a {
    color: #333;
  }
  .right-menu {
    position: fixed;
    background: #fff;
    border: solid 1px rgba(0, 0, 0, .2);
    border-radius: 3px;
    z-index: 999;
    /*display: none;*/
  }
  .right-menu a {
    width: 75px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    display: block;
    color: #1a1a1a;
  }
  .right-menu a:hover {
    background: #eee;
    color: #fff;
  }
  .right-menu {
    border: 1px solid #eee;
    box-shadow: 0 0.5em 1em 0 rgba(0,0,0,.1);
    border-radius: 1px;
  }
  a {
    text-decoration: none;
  }
  .right-menu a {
    padding: 2px;
  }
  .right-menu a:hover {
    background: #42b983;
  }
  path {
    fill: black;
  }
</style>
