<template>
  <div class="app-container">
    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
      <el-tab-pane label="紧急预案" name="first">
        <tab1 />
      </el-tab-pane>
      <el-tab-pane label="常规预案" name="second">
        <tab2 />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getSql, setSql } from '@/api/sql'
import tab1 from './component/projectManagementTab1'
import tab2 from './component/projectManagementTab2'
export default {
  components: { tab1, tab2 },
  data() {
    return {
      activeName2: 'first'
    }
  },
  mounted() {

  },
  created() {

  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
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
