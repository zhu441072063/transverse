<template>
  <div id="system-staement">
    <template>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="系统设备" name="first">
          <tab1/>
        </el-tab-pane>
        <el-tab-pane label="设备类型" name="second">
          <tab2/>
        </el-tab-pane>
        <el-tab-pane label="设备报警" name="third">
          <tab3/>
        </el-tab-pane>
        <el-tab-pane label="设备故障" name="fourth">
          <tab4/>
        </el-tab-pane>
        <el-tab-pane label="设备状态" name="fifth">
          <tab5/>
        </el-tab-pane>

      </el-tabs>

    </template>

  </div>


</template>




<script>
  import tab1 from './component/operation-staement-eqmenttable.vue'
  import tab2 from './component/operation-staement-eqment_typetable.vue'
  import tab3 from './component/operation-staement-eqment_polictable.vue'
  import tab4 from './component/operation-staement-eqment_brokentable.vue'
  import tab5 from './component/operation-staement-eqment_statetable.vue'
  export default {

    components: { tab1,tab2,tab3,tab4,tab5 },

    data(){
      return{
        activeName: 'first' ,//标签页
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
