<template>
  <div id="system-staement">
    <template>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="车流量" name="first">
          <tab1/>
        </el-tab-pane>
        <el-tab-pane label="CO浓度" name="second">
          <tab2/>
        </el-tab-pane>
        <el-tab-pane label="VI透过率" name="third">
          <tab3/>
        </el-tab-pane>
        <el-tab-pane label="LO洞外光强" name="fourth">
          <tab4/>
        </el-tab-pane>
        <el-tab-pane label="LI洞内光强" name="fifth">
          <tab5/>
        </el-tab-pane>
        <el-tab-pane label="WS风况风速" name="sixth">
          <tab6/>
        </el-tab-pane>
        <el-tab-pane label="车位" name="sevevth">
          <tab7/>
        </el-tab-pane>
        <el-tab-pane label="气象站" name="eight">
          <tab8/>
        </el-tab-pane>
        <el-tab-pane label="超速" name="ninth">
          <tab9/>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>




<script>
  import tab1 from './component/gather-staement-carflow.vue'
  import tab2 from './component/gather-staement-co.vue'
  import tab3 from './component/gather-staement-vi.vue'
  import tab4 from './component/gather-staement-lo.vue'
  import tab5 from './component/gather-staement-li.vue'
  import tab6 from './component/gather-staement-ws.vue'
  import tab7 from './component/gather-staement-stall.vue'
  import tab8 from './component/gather-staement-weather.vue'
  import tab9 from './component/gather-staement-speed.vue'
  export default {

    components: { tab1,tab2,tab3,tab4,tab5,tab6,tab7,tab8,tab9  },

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
