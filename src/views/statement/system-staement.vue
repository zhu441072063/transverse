<template>
  <div id="system-staement">
    <template>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="操作日志" name="first">
          <tab1/>
        </el-tab-pane>
        <el-tab-pane label="用户报表" name="second">
          <tab2/>
        </el-tab-pane>
        <el-tab-pane label="方案执行" name="third">
          <tab3/>
        </el-tab-pane>
        <el-tab-pane label="事件记录" name="fourth">
          <tab4/>
        </el-tab-pane>
        <el-tab-pane label="事件检测器" name="fifth">
          <tab5/>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>
<script>
  import tab1 from './component/system-staement-logtable.vue'
  import tab2 from './component/system-staement-usertable'
  import tab3 from './component/system-staement-schemetable.vue'
  import tab4 from './component/system-staement-eventtable.vue'
  import tab5 from './component/system-staement-event_detetable.vue'


    export default {

        components: { tab1,tab2,tab3,tab4,tab5 },

        data(){
            return{
              activeName: 'second' ,//标签页
            };
        },
      methods:{
          //标签页函数
        handleClick(tab, event) {
          console.log(tab, event);
        },

      }
    }
</script>

<style scoped>

</style>
