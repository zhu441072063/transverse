<template>
  <el-dialog :visible.sync="dialogFlag" @close="closeDialog()" width="420px" class="myz-info-reconfirm">
    <div slot="title" class="title-reconfirm">
      <span>{{title}}</span>
      <span class="warn-red" v-if="deleteAdmin">({{redWarnMessage}})</span>
    </div>
    <div class="body_message">
      <span class="warn-img"></span>
      {{warnMessage}}
    </div>
    <span slot="footer" class="clearfix">
      <!--<span class="check-exact" v-if="deleteAdmin">-->
        <!--<el-checkbox v-model="checked">我已了解</el-checkbox>-->
      <!--</span>-->
      <span class="check-btn">
        <el-button type="primary" :disabled="!checked && deleteAdmin" @click="exact()">确定</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </span>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '提示'
    },
    warnMessage: {
      type: String
    },
    redWarnMessage: {
      type: String,
      default: ''
    },
    func: {
      type: String
    }
  },
  components: {},
  data() {
    return {
      deleteAdmin: false,
      dialogFlag: false,
      checked: false
    }
  },
  computed: {
  },
  created() {
    console.log(this.func)
  },
  mounted() {
  },
  methods: {
    closeDialog: function() {
      this.dialogFlag = false
    },
    openDialog: function() {
      this.dialogFlag = true
    },
    exact() {
      console.log(this)
      this.$emit(this.func)
    }
  }
}
</script>

<style lang="scss" scoped>
  .title-reconfirm {
    font-size: 18px;
  }

  .check-exact {
    float: left;
  }

  .check-btn {
    float: right;
  }

  .warn-red {
    font-size: 12px;
    color: red;
  }

  .body_message {
    padding-bottom: 30px;
    padding-left: 10px;
  }

  .warn-img {
    padding-right: 30px;
    display: inline-block;
    width: 25px;
    height: 25px;
    background: url("/static/icon/common-icon/warning.png") no-repeat;
    border: none;
    background-size: 25px 25px;
    vertical-align: middle;
  }
</style>
<style lang="scss">
  .el-checkbox__inner {
    border: 1px solid #909399;
  }

  .myz-info-reconfirm div.el-dialog__footer {
    border: none;
    text-align: right;
    height: 50px;
    padding: 6px 0;
  }

  .myz-info-reconfirm div.el-dialog__header {
    border: none;
    padding: 6px 0;
  }

  .myz-info-reconfirm div.el-dialog__body {
    padding: 20px;
  }

  .myz-info-reconfirm div.el-dialog {
    margin-top: 35vh !important;
  }

  /*清除浮动-start*/

  .clearfix {
    *zoom: 1;
  }

  .clearfix:before, .clearfix:after {
    display: block;
    overflow: hidden;
    clear: both;
    height: 0;
    visibility: hidden;
    content: ".";
  }

  /*清除浮动-end*/
</style>
