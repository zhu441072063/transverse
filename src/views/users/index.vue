
<template>
  <div id="index">
    <el-container>
      <el-header>人员管理
        <el-button type="info" plain @click="adduser()">添加用户</el-button>
      </el-header>

      <el-main>
        <!-- 查询项 -->
        <div class="input">
          <el-row>
            <span>用户名：</span>
            <el-input v-model="userlist.USERNAME" placeholder="请输入内容"/>
            <span>显示名：</span>
            <el-input v-model="userlist.DISPLAYNAME" placeholder="请输入内容"/>
            <span>联系电话：</span>
            <el-input v-model="userlist.TEL" placeholder="请输入内容"/>
            <span>用户状态：</span>
            <el-select v-model="userlist.USERSTATE" clearable placeholder="用户状态">
              <el-option
                v-for="item in user_USERSTATE"
                :key="item.CODEVALUE"
                :label="item.CODELABEL"
                :value="item.CODEVALUE"
              />
            </el-select>
            <el-button type="primary" @click="Search">查询</el-button>
          </el-row>
        </div>
        <!-- 表格 -->
        <div class="table">
          <el-table
            ref="multipleTable"
            v-loading="listLoading"
            :data="tableData1"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column
              v-if="false"
              prop="ID"
              label="ID"
              width="60px"
              align="center"
            />
            <el-table-column
              v-if="false"
              prop="RID"
              label="RID"
              width="60px"
              align="center"
            />
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
              prop="USERADDR"
              label="通讯地址"
              align="center"
            />
            <el-table-column
              label="用户状态"
              align="center"
            >
              <template slot-scope="{row}">
                {{ zGetCode('userstate', row.USERSTATE) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="DESCRIPTION"
              label="用户描述"
              align="center"
            />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">

                <el-tooltip class="item" effect="dark" content="修改" placement="top">
                  <el-button type="success" icon="el-icon-edit" size="small" @click="update(scope.row.ID,scope.row.RID)"/>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-popconfirm
                  confirmButtonText='好的'
                  cancelButtonText='不用了'
                  icon="el-icon-info"
                  iconColor="red"
                  title="这是一段内容确定删除吗？"
                  @onConfirm="deleteuser(scope.row.ID,scope.row.RID)"
                >
                  <el-button slot="reference" type="danger" icon="el-icon-delete" size="small" >删除</el-button>
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
          <pagination
            :total="total"
            :page.sync="listQuery.pageno"
            :limit.sync="listQuery.pagesize"
            @pagination="getList"
          />
        </div>
      </el-footer>
    </el-container>

    <!-- 弹窗 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="1000px"
      :close-on-click-modal="false"
    >
      <el-container>
        <el-header>添加用户
          <el-button type="info" plain @click="back()">返回列表</el-button>
        </el-header>
        <el-main>
          <el-form ref="useraddForm" label-width="100px" :rules="Rules" class="demo-ruleForm">
            <div style="width: 500px">
            <el-form-item
              prop="USERNAME"
              label="用户名"
            >
              <el-input v-model="tableData.USERNAME"/>
            </el-form-item>
            <el-form-item
              label="显示名"
              prop="DISPLAYNAME"
            >
              <el-input v-model="tableData.DISPLAYNAME"/>
            </el-form-item>
            <el-form-item
              label="密码"
              prop="PASSWD"
            >
              <el-input v-model="tableData.PASSWD" type="password" autocomplete="off"/>
            </el-form-item>
            <el-form-item
              label="确认密码"
              prop="checkPass"
            >
              <el-input v-model="checkPass" type="password" autocomplete="off"/>
            </el-form-item>
            <el-form-item
              label="联系电话"
              prop="TEL"
            >
              <el-input v-model="tableData.TEL"/>
            </el-form-item>
            <el-form-item
              label="通讯地址"
              prop="USERADDR"
            >
              <el-input v-model="tableData.USERADDR"/>
            </el-form-item>
            <el-form-item
              label="角色"
              prop="ROLE"
            >
              <el-select v-model="ROLE" placeholder="角色">
                <el-option
                  v-for="item in roles"
                  :key="item.ID"
                  :label="item.ROLE_NAME"
                  :value="item.ID"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="用户描述"
              prop="DESCRIPTION"
            >
              <el-input v-model="tableData.DESCRIPTION" type="textarea"/>
            </el-form-item>
            <el-form-item label="是否禁用"v-show="edit_flag">
              <el-radio v-model="tableData.USERSTATE" label="2">是</el-radio>
              <el-radio v-model="tableData.USERSTATE" label="1">否</el-radio>
            </el-form-item>
            </div>
          <!--图片-->
            <div class="image">
            <el-form-item>
                      <el-upload
                        class="avatar-uploader"
                        action="/uploadpic"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                      >
                        <img v-if="tableData.USER_IMAGE" :src="tableData.USER_IMAGE" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon" />
                      </el-upload>
            </el-form-item>
            </div>

            <el-form-item>
              <el-button v-show="add_flag" type="warning" @click="Continue">提交并继续添加</el-button>
              <el-button v-show="add_flag" type="success" @click="Add">提交</el-button>
              <el-button v-show="edit_flag" type="warning" @click="updateuser()">保存</el-button>
              <el-button type="" @click="clear">重置</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>
<script>
  import { getSql, setSql } from '@/api/sql'
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import { zGetCodeAll, zGetCode } from '@/utils/common'
  import { uploadpic } from '@/api/other'
  export default {
    components: {Pagination},
    data() {
      return {
        //获取字典
        zGetCode: zGetCode,
        fileData:"",
        //用户信息数组
        tableData1: [],
        //加载图标
        listLoading:true,

        //角色类型数组
        roles: [],
        //分页
        total: 0,
        dialogFormVisible: false,
        title: '',
        //隐藏
        add_flag: '',
        edit_flag: '',
        //密码确认
        checkPass: '',
        ROLE: '',//角色id
        u_r_ID: '',//用户数组链接表id


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
          sql: 202,
          USERNAME: '',
          DISPLAYNAME: '',
          TEL: '',
          USERSTATE: ''
        },
        //按照id条件查询用户信息
        idselect: {
          sql: 206,
        },


        //用户状态信息
        user_USERSTATE: [],

        // 添加-修改用户
        tableData:
          {
            USERNAME: '',//用户名
            DISPLAYNAME: '',//显示名
            PASSWD: '',//密码
            TEL: '',//联系电话
            USERADDR: '',//通讯地址
            USERSTATE:'',//用户状态
            DESCRIPTION: '',//用户描述
            CREATE_TIME:'',//创建时间
            UPDATE_TIME:'',//修改时间
            USER_IMAGE:'',//图片地址
          },

        //中间表插入
        user_roles: {
          USERID: '',//用户id
          ROLEID: '',//角色id
          CREATE_TIME:'',//创建时间
          UPDATE_TIME:'',//修改时间
        },
        Rules: { // 提交验证
          USERNAME: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          DISPLAYNAME: [{ required: true, message: '请输入显示名', trigger: 'blur' }],
          PASSWD: [{ required: true, message: '请输入密码', trigger: 'blur' }],
          TEL: [{ required: true, message: '请输入电话号', trigger: 'blur' }],
          USERADDR: [{ required: true, message: '请输入地址', trigger: 'blur' }],
          DESCRIPTION: [{ required: true, message: '请输入描述', trigger: 'blur' }],
          ROLE: [{ required: true, message: '请选择', trigger: 'change' }]

        },

      }
    },
    created() {

    },
    mounted() {
      this.getList()
      this.select_Code()
    },
    methods: {
      // 查全部
      getList() {
        this.listLoading = true
        getSql(this.listQuery).then(response => {
          this.tableData1 = response.rows
          this.total = response.total
          this.listLoading = false
        })
      },

      //根据id查全部
      selectID(ID,RID) {
        this.idselect.ID = ID
        getSql(this.idselect).then(response => {
          this.tableData = response.rows[0]
          this.ROLE = RID
        })
      },


      // 条件查询
      Search() {
        this.listLoading = true
        getSql(this.userlist).then(response => {
          this.tableData1 = response.rows
          this.total = response.total
          this.listLoading = false
        })
      },

      //查询u_r连接表
      u_rselect(ID, RID) {
        this.user_roles.USERID = ID
        this.user_roles.ROLEID = RID
          this.user_roles.sql = 209,
          getSql(this.user_roles).then(response => {
            if(response.count==1){
              this.u_r_ID = response.rows[0]
            }else{
              this.$message({
                message: '查询链接表id失败',
                type: 'error'
              })
            }
          })
      },
      //查询字典
      select_Code(){
         this.user_USERSTATE=zGetCodeAll('userstate')
        //zGetCode('userstate','')
      },

//修改框
      update(ID, RID) {
        this.title = '修改用户'
        this.dialogFormVisible = true
        this.add_flag = false
        this.edit_flag = true
        this.selectID(ID,RID);
        this.getroletype();
        this.u_rselect(ID, RID);
      },

      // 增加框
      adduser() {
        this.clear()
        this.title = '添加用户'
        this.dialogFormVisible = true
        this.add_flag = true
        this.edit_flag = false
        this.getroletype();
      },


      //查询角色类型
      getroletype() {
        const params = {
          sql: 204
        };
        getSql(params).then(response => {
          this.roles = response.rows
        })
      },

      //  保存并继续
      uploadpicData(callback) {
        var that = this
        var formData = new window.FormData()
        formData.append('file', this.fileData)
        uploadpic(formData).then(response => {
          that.tableData.USER_IMAGE = response.url
          if(callback&&response.url){
            callback(response.url)
          }else{
            console.error(111)
          }
        })
      },
      Continue() {
        var that = this
        uploadpicData(function (src) {
          that.tableData.sql = 203,
            that.tableData.CREATE_TIME=parseTime(new Date())
          setSql(that.tableData).then(response => {
            if(response.count == 1){
              that.user_roles.ROLEID = that.ROLE,
                that.user_roles.USERID = response.msg,
                that.user_roles.sql = 205,
                that.user_roles.CREATE_TIME=parseTime(new Date())
              setSql(that.user_roles).then(response1 =>{
                if(response1.count == 0){
                  that.$message({
                    message: '新增链接失败',
                    type: 'error'
                  })
                }
              })
            }else{
              that.$message({
                message: '新增人员失败',
                type: 'error'
              })
            }
            that.clear()
            that.getList()
          })
        })

      },
      //用户修改
      updateuser() {
        this.tableData.sql = 207
        this.tableData.UPDATE_TIME=parseTime(new Date())
        setSql(this.tableData).then(response => {
          if(response.count >= 0){
            this.user_roles.ROLEID = this.ROLE,
              this.user_roles.sql = 208,
              this.user_roles.UPDATE_TIME=parseTime(new Date())
              this.user_roles.ID = this.u_r_ID.ID
            setSql(this.user_roles).then(response1 =>{
              if(response1.count < 0){
                this.$message({
                  message: '修改链接失败',
                  type: 'error'
                })
              }
            })
          }else {
            this.$message({
              message: '修改人员失败',
              type: 'error'
            })
          }
          this.clear()
          this.getList()
        })
        this.back()
      },

      // 删除
      deleteuser(ID, RID) {
        this.tableData.sql = 210
        this.tableData.ID = ID
        this.u_rselect(ID, RID)
        setSql(this.tableData).then(response => {
          if(response.count == 1){
            this.user_roles.sql = 211,
            this.user_roles.ID = this.u_r_ID.ID
            setSql(this.user_roles).then(response1 =>{
                  if(response1.count == 0){
                    this.$message({
                      message: '删除连接表失败',
                      type: 'error'
                    })
                  }
                })
          }else{
            this.$message({
              message: '删除人员失败',
              type: 'error'
            })
          }
          this.getList()
        })
      },
      //确认删除
      onConfirm() {
        if (this.delFunc === 'deleteRm') { // 删除字典
          this.deleteRm()
        } else { // 删除字典目录
          this.deleteHandle()
        }
      },


      // 用户增加
      Add() {
        this.Continue()
        this.back()
      },

      // 返回列表
      back() {
        this.dialogFormVisible = false
      },
      //  重置信息
      clear() {
        for (var i in this.tableData) {
          this.tableData[i] = ''
        }
        this.checkPass = ''
        this.ROLE = ''
        this.u_r_ID=''
      },
      // 图片上传
      handleAvatarSuccess(res, file) {
        this.fileData = file.raw
        this.tableData.USER_IMAGE = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }



    }
  }
</script>
<style lang="scss" scoped>

  #index{
    min-width: 1300px;
  }

  .el-container {
    border: 1px solid #dfdfdf;

    .el-header {
      background-color: #eceff1;
      height: 60px;
      line-height: 60px;
    }

    .el-main {
      .el-form{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
      }
      .image{
        width: 200px;
        height: 200px;
        border: 1px solid black;
        margin: 75px;

      }
      .input {
        width: 100%;
        padding: 5px;
        border-bottom: 1px solid #E6EBF5;

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
          background-color: #1ab394;

        }

      }

      .table {
        .el-table-column {

        }
      }
    }

    .el-footer {
      .block {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1367px;

      }
      .el-pagination {
        display: inline-block;
      }
    }
  }
//添加图片
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    display: inline-block;
  }
  .avatar {
    width: 200px;
    height: 200px;
    display: block;
  }
</style>
