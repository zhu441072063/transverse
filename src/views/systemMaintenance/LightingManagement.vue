<template>
  <div class="app-container">
    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
      <el-tab-pane label="照明内置模式" name="first">
        <tab1 />
      </el-tab-pane>
      <el-tab-pane label="照明自定义模式" name="second">
        <tab2 />
      </el-tab-pane>
      <el-tab-pane label="照明自控模式" name="third">
        <tab3 />
      </el-tab-pane>
      <el-tab-pane label="照明时控模式" name="fourth">
        <tab4 />
      </el-tab-pane>
      <el-tab-pane label="照明分类" name="five">
        <tab5 />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getSql, setSql } from '@/api/sql'
import tab1 from './component/LightingManagementTab1'
import tab2 from './component/LightingManagementTab2'
import tab3 from './component/LightingManagementTab3'
import tab4 from './component/LightingManagementTab4'
import tab5 from './component/LightingManagementTab5'
export default {
  components: { tab1, tab2, tab3, tab4, tab5 },
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
