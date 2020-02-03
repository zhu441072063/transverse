<template>
  <div>
    <!--事件列表-->
    <el-dialog
      :title="'事件列表'"
      :visible.sync="dialogShowSjList"
      width="1000px"
      :close-on-click-modal="false"
      class="dialog-them2"
    >
      <el-container>
        <div class="zinput">
          <el-select
            v-model="eventListQuery.TUNNEL_ID"
            placeholder="请选择隧道"
            class="t-list"
          >
            <el-option
              v-for="item in trainList"
              :key="item.ID"
              :label="item.CODELABEL"
              v-model="item.CODEVALUE"
            />
          </el-select>
          <el-select
            v-model="eventListQuery.STATUS"
            placeholder="请选择状态"
            class="t-list"
          >
            <el-option
              v-for="item in eventStatus"
              :key="item.ID"
              :label="item.CODELABEL"
              v-model="item.CODEVALUE"
            />
          </el-select>
          <el-button class="t-list" type="primary" @click="showSjAdd()">添加</el-button>
        </div>
        <el-main>
          <el-form label-width="110px" :inline="true">
            <!-- 表格 -->
            <div class="table">
              <el-table
                ref="table"
                v-loading="eventListLoading"
                :data="eventData"
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
                  prop="HAPPEN_TIME"
                  label="发生时间"
                  min-width="120px"
                  align="center"
                />
                <el-table-column
                  label="事件位置"
                  min-width="120px"
                  align="center"
                >
                  <template slot-scope="{row}">
                    {{ zGetCode('tunnelType', row.HAPPEN_POSITION1) }}
                    K{{ row.HAPPEN_POSITION2 }}+
                    {{ row.HAPPEN_POSITION3 }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="报警源"
                  min-width="120px"
                  align="center">
                  <template slot-scope="{row}">
                    {{ zGetCode('source', row.SOURCE) }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="当前状态"
                  min-width="120px"
                  align="center"
                >
                  <template slot-scope="{row}">
                    {{ zGetCode('eventStatus', row.STATUS) }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="180px" align="center">
                  <template slot-scope="{row}">
                    <el-button
                      type="primary"
                      size="small"
                      @click="showSjAdd(row)"
                    >
                      详情
                    </el-button>
                    <el-button
                      v-if="row.STATUS==0"
                      type="warning"
                      size="small"
                      @click="handle(row)"
                    >
                      处理
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form>
        </el-main>
        <el-footer>
          <div class="block">
            <pagination
              :total="eventTotal"
              :page.sync="eventListQuery.pageno"
              :limit.sync="eventListQuery.pagesize"
              @pagination="showSjList"
            />
          </div>
        </el-footer>
      </el-container>
    </el-dialog>
    <!--事件输入-->
    <el-dialog
      :title="'事件输入'"
      :visible.sync="dialogShowSj"
      width="1000px"
      :close-on-click-modal="false"
      class="dialog-them1"
      v-loading="eventAddLoading"
    >
      <el-container class="z-sjadd">
        <el-main>
          <el-form label-width="110px" ref="eventInfoForm" :rules="eventRules" :model="eventInfo" :inline="true">
            <el-row>
              <el-col :span="12">
                <el-form-item label="事件来源" prop="SOURCE">
                  <el-select
                    v-model="eventInfo.SOURCE"
                    placeholder="请选择"
                    :disabled="eventReadonly"
                  >
                    <el-option
                      v-for="item in source"
                      :key="item.ID"
                      :label="item.CODELABEL"
                      v-model="item.CODEVALUE"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="报警位置" prop="CALL_POSITION">
                  <el-input v-model="eventInfo.CALL_POSITION" :readonly="eventReadonly"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="事件类型" prop="TYPE">
                  <el-select
                    v-model="eventInfo.TYPE"
                    placeholder="请选择"
                    :disabled="eventReadonly"
                  >
                    <el-option
                      v-for="item in eventType"
                      :key="item.ID"
                      :label="item.CODELABEL"
                      v-model="item.CODEVALUE"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="事件位置"  prop="HAPPEN_POSITION1">
                  <el-form-item>
                    <el-select
                      v-model="eventInfo.HAPPEN_POSITION1"
                      placeholder="请选择"
                      class="small_input"
                      :disabled="eventReadonly"
                    >
                      <el-option
                        v-for="item in tunnelType"
                        :key="item.value"
                        :label="item.CODELABEL"
                        :value="item.CODEVALUE"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="HAPPEN_POSITION2">
                    <el-input
                      placeholder="YYY"
                      v-model="eventInfo.HAPPEN_POSITION2"
                      maxlength="3"
                      class="small_input"
                      :readonly="eventReadonly"
                    >
                      <template slot="prepend">K</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="HAPPEN_POSITION3">
                    <el-input
                      placeholder="XXX"
                      v-model="eventInfo.HAPPEN_POSITION3"
                      maxlength="3"
                      class="small_input"
                      :readonly="eventReadonly"
                    >
                      <template slot="prepend">+</template>
                    </el-input>
                  </el-form-item>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="事件时间" prop="HAPPEN_TIME">
                  <div class="block">
                    <el-date-picker
                      v-model="eventInfo.HAPPEN_TIME"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :readonly="eventReadonly"
                      placeholder="选择日期时间">
                    </el-date-picker>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="事件级别" prop="LEVEL">
                  <el-select
                    v-model="eventInfo.LEVEL"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in eventLevel"
                      :key="item.ID"
                      :label="item.CODELABEL"
                      v-model="item.CODEVALUE"
                      :disabled="eventReadonly"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="伤亡情况">
                  <el-form-item prop="NUM1">
                    <el-input v-model="eventInfo.NUM1" type="number" min="0" :readonly="eventReadonly">
                      <template slot="prepend">轻伤人数</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="NUM2">
                    <el-input v-model="eventInfo.NUM2" type="number" min="0" :readonly="eventReadonly">
                      <template slot="prepend">重伤人数</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="NUM3">
                    <el-input v-model="eventInfo.NUM3" type="number" min="0" :readonly="eventReadonly">
                      <template slot="prepend">死亡人数</template>
                    </el-input>
                  </el-form-item>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="通知对象" prop="NOTICE_OBJECT_All">
                  <el-checkbox-group v-model="eventInfo.NOTICE_OBJECT_All" :disabled="eventReadonly">
                    <el-checkbox v-for="item in noticeObject" :key="item.ID" :label="item.CODEVALUE">
                      {{ item.CODELABEL }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="事件类容" prop="CONTENT">
              <el-input
                v-model="eventInfo.CONTENT"
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                class="last_input"
                :readonly="eventReadonly"
                resize="none"
              />
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
      <div slot="footer" class="dialog-footer"  v-if="footerShow">
        <el-button @click="dialogShowSj = false">
          取消
        </el-button>
        <el-button type="primary" @click="createEventData()">
          提交
        </el-button>
      </div>
    </el-dialog>
    <!--事件处理-->
    <el-dialog
      :title="'事件处理'"
      :visible.sync="dialogShowSjCl"
      width="700px"
      :close-on-click-modal="false"
      class="dialog-them1"
      v-loading="eventHandleLoading"
    >
      <el-container class="z-bwl">
        <el-main>
          <el-form label-width="110px" ref="eventHandleForm" :rules="eventHandleRules" :model="eventHandleInfo">
            <el-row>
              <el-col :span="24">
                <el-form-item label="处理人" prop="HANDLE_MEMBER">
                  <el-input v-model="eventHandleInfo.HANDLE_MEMBER" placeholder="请填写处理人"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="处理结果" prop="HANDLE_STATUS">
                  <el-select
                    v-model="eventHandleInfo.HANDLE_STATUS"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in handleStatus"
                      :key="item.ID"
                      :label="item.CODELABEL"
                      v-model="item.CODEVALUE"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="处理说明" prop="HANDLE_CONTENT">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6}"
                    placeholder="请输入内容"
                    v-model="eventHandleInfo.HANDLE_CONTENT">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-main>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowSjCl = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateEventHandleData()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSql, setSql } from '@/api/sql'
import { zGetCodeAll, zGetCode } from '@/utils/common'
import Pagination from '@/components/Pagination' //  secondary package based on el-pagination
import { parseTime } from '@/utils'
export default {
  name: 'DialogEvent',
  props: {
  },
  components: {
    Pagination
  },
  data() {
    return {
      trainID: 1, // 隧道ID
      zGetCode: zGetCode,
      dialogShowSjList: false, // 事件列表弹出
      eventListLoading: false, // 事件列表加载
      eventTotal: 0, // 事件列表总数
      eventData: [], // 事件列表
      eventListQuery: { // 事件列表查询
        sql: 602,
        pageno: 1,
        pagesize: 5,
        TUNNEL_ID: '', // 隧道ID
        STATUS: '' // 处理状态
      },
      tunnelType: zGetCodeAll('tunnelType'), // 隧道位置
      trainList: zGetCodeAll('train'), // 隧道列表
      noticeObject: zGetCodeAll('noticeObject'), // 通知对象
      source: zGetCodeAll('source'), // 事件来源
      eventType: zGetCodeAll('eventType'), // 事件类型
      eventLevel: zGetCodeAll('eventLevel'), // 事件级别
      eventStatus: zGetCodeAll('eventStatus'), // 事件状态
      handleStatus: zGetCodeAll('handleStatus'), // 事件处理结果
      dialogShowSj: false, // 备忘录弹窗
      eventInfo: { // 事件提交
        sql: 601, // sql字段
        TUNNEL_ID: 0, // 隧道ID
        ID: 0, // 事件ID
        SOURCE: '', // 事件来源
        TYPE: '', // 事件类型
        NOTICE_OBJECT_All: [], // 通知对象
        NOTICE_OBJECT: [], // 通知对象
        LEVEL: '', // 事件级别
        CALL_POSITION: '', // 报警位置
        HAPPEN_POSITION1: '', // 发生位置-1
        HAPPEN_POSITION2: '', // 发生位置-1
        HAPPEN_POSITION3: '', // 发生位置-3
        HAPPEN_TIME: '', // 发生时间
        NUM1: '', // 轻伤人数
        NUM2: '', // 重伤人数
        NUM3: '', // 死亡人数
        CONTENT: '' // 事件内容
      },
      eventRules: {
        CALL_POSITION: [{ required: true, message: '请填写报警位置', trigger: 'blur' }],
        SOURCE: [{ required: true, message: '请选择事件来源', trigger: 'change' }],
        TYPE: [{ required: true, message: '请选择事件类型', trigger: 'change' }],
        HAPPEN_TIME: [{ required: true, message: '请选择事件时间', trigger: 'change' }],
        LEVEL: [{ required: true, message: '请选择事件级别', trigger: 'change' }],
        HAPPEN_POSITION1: [{ required: true, message: '请填写', trigger: 'change' }],
        HAPPEN_POSITION2: [{ required: true, message: '请填写', trigger: 'blur' }],
        HAPPEN_POSITION3: [{ required: true, message: '请填写', trigger: 'blur' }],
        NUM1: [{ required: true, message: '请填写轻伤人数', trigger: 'blur' }],
        NUM2: [{ required: true, message: '请填写重伤人数', trigger: 'blur' }],
        NUM3: [{ required: true, message: '请填写死亡人数', trigger: 'blur' }],
        NOTICE_OBJECT_All: [{ type: 'array', required: true, message: '请至少选择一个通知对象', trigger: 'change' }],
        CONTENT: [{ required: true, message: '请填写事件类容', trigger: 'blur' }]
      },
      eventReadonly: false, // 事件详情是否可以编辑
      eventAddLoading: false, // 事件添加加载
      eventHandleLoading: false, // 事件处理加载
      eventHandleRules: { // 事件处理提交验证
        HANDLE_MEMBER: [{ required: true, message: '请填写处理人', trigger: 'blur' }],
        HANDLE_STATUS: [{ required: true, message: '请选择处理结果', trigger: 'change' }]
      },
      eventHandleInfo: { // 事件处理提交表单
        ID: 0,
        sql: 603,
        STATUS: 1,
        HANDLE_TIME: '',
        HANDLE_MEMBER: '',
        HANDLE_STATUS: '',
        HANDLE_CONTENT: ''
      },
      footerShow: true, // 底部按钮
      dialogShowSjCl: false // 事件处理弹出
    }
  },
  mounted() {
    // this.getList()
    this.handleStatus.shift()
  },
  methods: {
    // 事件列表
    showSjList() {
      this.dialogShowSjList = true
      this.eventListLoading = true
      getSql(this.eventListQuery).then(response => {
        this.eventTotal = response.total
        this.eventData = response.rows
      }).finally(response => {
        this.eventListLoading = false
      })
    },
    // 事件输入弹窗
    showSjAdd(row) {
      this.dialogShowSj = true
      this.eventInfo.TUNNEL_ID = this.trainID
      if (row) { // 查看
        this.footerShow = false
        this.eventReadonly = true
        this.eventInfo.SOURCE = row.SOURCE
        this.eventInfo.TYPE = row.TYPE
        this.eventInfo.NOTICE_OBJECT_All = row.NOTICE_OBJECT.split(',')
        this.eventInfo.NOTICE_OBJECT = row.NOTICE_OBJECT
        this.eventInfo.LEVEL = row.LEVEL
        this.eventInfo.CALL_POSITION = row.CALL_POSITION
        this.eventInfo.HAPPEN_POSITION1 = row.HAPPEN_POSITION1
        this.eventInfo.HAPPEN_POSITION2 = row.HAPPEN_POSITION2
        this.eventInfo.HAPPEN_POSITION3 = row.HAPPEN_POSITION3
        this.eventInfo.HAPPEN_TIME = row.HAPPEN_TIME
        this.eventInfo.NUM1 = row.NUM1
        this.eventInfo.NUM2 = row.NUM2
        this.eventInfo.NUM3 = row.NUM3
        this.eventInfo.CONTENT = row.CONTENT
        this.$nextTick(() => {
          this.$refs['eventInfoForm'].clearValidate()
        })
      } else {
        this.footerShow = true
        this.eventReadonly = false
        this.eventInfo.CONTENT = ''
        if (this.$refs['eventInfoForm']) {
          this.$refs['eventInfoForm'].resetFields()
        }
      }
    },

    // 事件新增
    createEventData() {
      this.$refs['eventInfoForm'].validate((valid) => {
        if (valid) {
          this.eventAddLoading = true
          var postData = this.eventInfo
          var NOTICE_OBJECT = postData.NOTICE_OBJECT_All
          postData.NOTICE_OBJECT = NOTICE_OBJECT.join(',')
          setSql(postData).then(response => {
            if (response.count == 0) {
              this.$message({
                message: '添加失败',
                type: 'error'
              })
              return
            }
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.dialogShowSj = false
          }).finally(response => {
            this.eventAddLoading = false
          })
        }
      })
    },

    // 事件处理
    handle(row) {
      this.eventHandleInfo.ID = row.ID
      this.dialogShowSjCl = true
      if (this.$refs['eventHandleForm']) {
        this.$refs['eventHandleForm'].resetFields()
      }
    },
    // 事件处理-提交
    updateEventHandleData() {
      this.$refs['eventHandleForm'].validate((valid) => {
        if (valid) {
          this.eventHandleLoading = true
          this.eventHandleInfo.HANDLE_TIME = parseTime(new Date())
          var postData = this.eventHandleInfo
          setSql(postData).then(response => {
            if (response.count == 0) {
              this.$message({
                message: '提交失败',
                type: 'error'
              })
              return
            }
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.dialogShowSjCl = false
            this.showSjList()
          }).finally(response => {
            this.eventHandleLoading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
