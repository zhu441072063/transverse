<template>
  <div class="app-container map-container">
    <div class="z-top">
      <div class="zleft">
        <el-input
          placeholder="请输入关键词"
          class="search"
        >
          <el-button slot="append" @click="showEq()">搜索</el-button>
        </el-input>

        <el-input placeholder="备忘录" class="log" readonly @focus="showBwl()">
          <el-button slot="prepend" icon="el-icon-bell" @click="showBwl()"></el-button>
        </el-input>
        <el-button @click="showSjList()">事件记录</el-button>
        <el-button @click="showEPlanList()">紧急预案</el-button>
        <el-button @click="showRPlanList()">常规预案</el-button>
        <el-button @click="showLightingList()">照明群控</el-button>
        <el-button @click="showFan()">风机群控</el-button>
        <el-button @click="showRouteSign()">交通模式控制</el-button>
        <el-button @click="showTransverseLighting()">横洞照明控制</el-button>
        <el-button @click="showFireDoor()">防火门控制</el-button>
      </div>
      <div class="zright">
        <el-select v-model="trainID" class="filter-item train_list" placeholder="请选择">
          <el-option v-for="item in trainListAll" :key="item.ID" :label="item.CODELABEL" :value="item.CODEVALUE"/>
        </el-select>
        <i class="el-icon-menu zmenu"/>
      </div>
      <div class="clear"></div>
    </div>
    <div class="zmap">
      <template v-for="(item,index) in people_transverse">
        <img src="../assets/img/people_transverse.png" alt="" class="pt_img t1" :style="{'left':item.start-list[0].start+'px'}">
        <img src="../assets/img/people_transverse.png" alt="" class="pt_img t2" :style="{'left':item.end-list[1].start+'px'}">
        <div :style="lineStyle(item.start-list[0].start,300,item.end-list[1].start,400,people_lineWidth,people_color)"
             class="people_transverse" :key="'people_transverse'+index">
          <div class="wz">人行横洞</div>
          <img src="../assets/img/transverse_arrow.png" alt="" class="ta-row tr1">
          <img src="../assets/img/transverse_arrow.png" alt="" class="ta-row tr2">
        </div>
      </template>
      <template v-for="(item,index) in car_transverse">
        <img src="../assets/img/car_transverse.png" alt="" class="ct_img t1" :style="{'left':item.start-list[0].start+'px'}">
        <img src="../assets/img/car_transverse.png" alt="" class="ct_img t2" :style="{'left':item.end-list[1].start+'px'}">
        <div :style="lineStyle(item.start-list[0].start,300,item.end-list[1].start,400,car_lineWidth,car_color)"
             class="car_transverse" :key="'car_transverse'+index">
          <div class="wz">车行横洞</div>
          <img src="../assets/img/transverse_arrow.png" alt="" class="ta-row tr1">
          <img src="../assets/img/transverse_arrow.png" alt="" class="ta-row tr2">
        </div>
      </template>
      <template v-for="(item,index) in list">
        <div :class="{'tunnel ':1,'no-last':index!=list.length-1}" :key="index" :style="{'width':item.len+'px'}">
          <div class="line"></div>
          <div class="z-line line1"></div>
          <div class="z-line line2" v-if="index==0"></div>
          <div class="z-line line3" v-if="index==1"></div>
          <div class="z-line line4"></div>
          <template v-for="(item2,index2) in item.lane">
            <div class="lane" :key="index2" :style="{'left':item2.start-item.start+'px'}">
              <div :class="{'l_icon ':index==0,'r_icon ':index==1}"><img src="../assets/img/lane.png" alt=""></div>
              <div :class="{'l_icon ':index==0,'r_icon ':index==1,'t_icon ':1}"><img src="../assets/img/lane.png" alt=""></div>
            </div>
          </template>
          <template v-for="(item3,i3) in item.camera">
            <div :class="{'camera ':1,'camera_z':index==0,'camera_y':index==1}" :key="'camera'+i3"
                 :style="{'left':item3.start-item.start+'px'}">
              <div class="camera_icon">
                <img src="../assets/img/fixed_camera.png" alt="">
              </div>
            </div>
          </template>
          <template v-for="(item4,i4) in item.information">
            <div class="information" :key="'information'+i4" :style="{'left':item4.start-item.start+'px'}">
              <marquee class="re" direction="left" behavior="scroll" scrollamount="3" scrolldelay="10" loop="-1">
                {{item4.title}}
              </marquee>
            </div>
          </template>
          <template v-for="(item5,i5) in item.parking">
            <div :class="{'parking ':1,'parking_z':index==0,'parking_y':index==1}" :key="'parking'+i5"
                 :style="{'left':item5.start-item.start+'px'}">
              <img src="../assets/img/parking.png" alt="" :class="{'p-top':index==0,'p-botton':index==1}">
            </div>
          </template>
        </div>
      </template>
    </div>
    <!--设备-->
    <dialogEquip ref="dialogEquip" />
    <!--备忘录-->
    <dialogBwl ref="dialogBwl" />
    <!--事件-->
    <dialogEvent ref="dialogEvent" />
    <!--紧急预案-->
    <dialogEmergencyPlan ref="dialogEmergencyPlan" />
    <!--常规预案-->
    <dialogRoutinePlan ref="dialogRoutinePlan" />
    <!--照明群控-->
    <dialogLighting ref="dialogLighting" />
    <!--分机群控-->
    <dialogFan ref="dialogFan" />
    <!--交通模式控制-->
    <dialogRouteSign ref="dialogRouteSign" />
    <!--横洞照明控制-->
    <dialogTransverseLighting ref="dialogTransverseLighting" />
    <!--防火门-->
    <dialogFireDoor ref="dialogFireDoor" />
  </div>
</template>

<script>

import { zGetCodeAll, zGetCode, zGetDir, each, lineStyle } from '@/utils/common'
import { getSql, setSql } from '@/api/sql'
import Pagination from '@/components/Pagination' //  secondary package based on el-pagination
import dialogBwl from './component/dialogBwl'
import dialogEvent from './component/dialogEvent'
import dialogEquip from './component/dialogEquip'
import dialogEmergencyPlan from './component/dialogEmergencyPlan'
import dialogRoutinePlan from './component/dialogRoutinePlan'
import dialogTransverseLighting from './component/dialogTransverseLighting'
import dialogFan from './component/dialogFan'
import dialogRouteSign from './component/dialogRouteSign'
import dialogFireDoor from './component/dialogFireDoor'
import dialogLighting from './component/dialogLighting'

export default {
  name: 'Map',
  components: {
    Pagination,
    dialogBwl,
    dialogEvent,
    dialogEquip,
    dialogEmergencyPlan,
    dialogRoutinePlan,
    dialogTransverseLighting,
    dialogFan,
    dialogRouteSign,
    dialogFireDoor,
    dialogLighting
  },
  data() {
    return {
      name: '123',
      list: [],
      people_transverse: [],
      people_lineWidth: 30,
      people_color: '#44535F',
      car_transverse: [],
      car_lineWidth: 50,
      trainList: zGetCodeAll('train'),
      trainListAll: [],
      trainID: 0,
      car_color: '#44535F',
      zGetCode: zGetCode // 获取字典值
    }
  },
  mounted: function() {
    console.log(this)
    this.getInfo()
    this.trainListAll = zGetCodeAll('train')
    this.trainListAll.unshift({
      CODEVALUE: 0,
      ID: 0,
      CODELABEL: '主监控'
    })
  },
  methods: {
    lineStyle: function(x1, y1, x2, y2, lineWidth, color) {
      y1 = y1 - 10
      y2 = y2 + 10
      return lineStyle(x1, y1, x2, y2, lineWidth, color)
    },
    getInfo: function() {
      var that = this
      that.list = [
        {
          name: 'Z',
          start: 37204,
          end: 39687,
          lane: [
            { start: 37545 },
            { start: 38169 },
            { start: 38799 },
            { start: 39397 }
          ],
          camera: [
            { start: 37525 },
            { start: 37577 },
            { start: 37725 },
            { start: 37877 },
            { start: 38027 },
            { start: 38155 },
            { start: 38171 },
            { start: 38182 },
            { start: 38327 },
            { start: 38477 },
            { start: 38606 },
            { start: 38777 },
            { start: 38799 },
            { start: 38826 },
            { start: 38918 },
            { start: 39077 },
            { start: 39227 },
            { start: 39392 }
          ],
          information: [
            { start: 37840, title: '全线路段封闭，车辆注意慢行。全路施工，限速60Km/h' },
            { start: 38475, title: '全线路段封闭，车辆注意慢行。全路施工，限速60Km/h' },
            { start: 39093, title: '全线路段封闭，车辆注意慢行。全路施工，限速60Km/h' }
          ],
          parking: [
            { start: 38154 },
            { start: 38804 }
          ]
        },
        {
          name: 'Y',
          start: 37239,
          end: 39722,
          lane: [
            { start: 37545 },
            { start: 38185 },
            { start: 38820 },
            { start: 39460 }
          ],
          camera: [
            { start: 37701 },
            { start: 37849 },
            { start: 38005 },
            { start: 38153 },
            { start: 38188 },
            { start: 38299 },
            { start: 38449 },
            { start: 38596 },
            { start: 38740 },
            { start: 38817 },
            { start: 38854 },
            { start: 38895 },
            { start: 39039 },
            { start: 39194 },
            { start: 39349 }
          ],
          information: [
            { start: 37850, title: '全线路段封闭，车辆注意慢行。全路施工，限速60Km/h' },
            { start: 38540, title: '全线路段封闭，车辆注意慢行。全路施工，限速60Km/h' },
            { start: 39155, title: '全线路段封闭，车辆注意慢行。全路施工，限速60Km/h' }
          ],
          parking: [
            { start: 38125 },
            { start: 38825 }
          ]
        }
      ]
      that.people_transverse = [
        { start: 37747, end: 37790 },
        { start: 37955, end: 37990 },
        { start: 38365, end: 38400 },
        { start: 38575, end: 38613 },
        { start: 38985, end: 39020 },
        { start: 39184, end: 39220 }
      ]
      that.car_transverse = [
        { start: 38170, end: 38190 },
        { start: 38799, end: 38820 }
      ]
      each(that.list, function(v, i) {
        var cha = i.end - i.start
        i.len = cha
      })
    },
    // 查询设备
    showEq: function() {
      this.$refs['dialogEquip'].showEq()
    },
    // 备忘录
    showBwl() {
      this.$refs['dialogBwl'].showBwl()
    },
    // 事件列表
    showSjList() {
      this.$refs['dialogEvent'].showSjList()
    },
    // 紧急预案
    showEPlanList() {
      this.$refs['dialogEmergencyPlan'].showEPlanList()
    },
    // 常规预案
    showRPlanList() {
      this.$refs['dialogRoutinePlan'].showRPlanList()
    },
    // 照明群控控制
    showLightingList() {
      this.$refs['dialogLighting'].showList()
    },
    // 分机群控控制
    showFan() {
      this.$refs['dialogFan'].showList()
    },
    // 横洞照明控制
    showTransverseLighting() {
      this.$refs['dialogTransverseLighting'].showList()
    },
    // 交通模式控制
    showRouteSign() {
      this.$refs['dialogRouteSign'].showList()
    },
    // 防火门
    showFireDoor() {
      this.$refs['dialogFireDoor'].showList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .map-container {
    /*height: calc(100vh - 84px);*/
    .z-top {
      width: 100%;
      background-color: #cccccc;
      .zleft {
        position: relative;
        float: left;
        .search {
          margin-top: 12px;
          width: 200px;
          margin-left: 10px;
        }
        .log {
          margin-top: 12px;
          width: 160px;
        }
      }
      .zright {
        position: relative;
        float: right;
        height: 60px;
        width: 280px;
        .train_list {
          position: absolute;
          right: 70px;
          width: 200px;
          top: 12px;
        }
        .zmenu {
          font-size: 36px;
          margin-top: 13px;
          color: white;
          margin-right: 20px;
          cursor: pointer;
          float: right;
        }
      }
    }
    .zmap {
      overflow-x: scroll;
      overflow-y: hidden;
      position: relative;
      padding: 40px 0px 25px;
      .people_transverse,.car_transverse {
        .wz{
          position: absolute;
          width: 20px;
          transform:rotate(90deg);
          -ms-transform:rotate(90deg); /* Internet Explorer 9*/
          -moz-transform:rotate(90deg); /* Firefox */
          -webkit-transform:rotate(90deg); /* Safari 和 Chrome */
          -o-transform:rotate(90deg); /* Opera */
          filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);
          height: 70px;
          color: #FFFFFF;
          text-align: justify;
          text-justify: newspaper;
          word-break: break-all;
          left: 50px;
          top: -16px;
          font-size: 14px;
        }
        position: absolute;
        z-index: 1;
        .ta-row{
          height: 30px;
          display: block;
        }
        .tr1{
          transform: rotate(90deg);
          float: right;
        }
        .tr2{
          transform: rotate(270deg);
          float: left;
        }
      }
      .car_transverse{
        .wz{
          left: 45px;
          top: -8px;
        }
        .ta-row{
          margin-top: 10px;
        }
      }
      .ct_img{
        position: absolute;
        z-index: 2;
      }
      .pt_img{
        position: absolute;
        z-index: 2;
      }
      .t1{
        top: 304px;
      }
      .t2{
        top: 446px;
      }
      .no-last {
        margin-bottom: 100px;
      }
      .tunnel {
        background: #44535F;
        height: 300px;
        position: relative;
        .line {
          width: 100%;
          border-top: 2px white dashed;
          position: absolute;
          left: 0;
          top: 149px;
        }
        .z-line{
          width: 100%;
          border-top: 4px #ffff00 solid;
          position: absolute;
          left: 0;
        }
        .line1{
          top: 2px;
        }
        .line2{
          top: 10px;
        }
        .line3{
          bottom: 10px;
        }
        .line4{
          bottom: 2px;
        }
        .lane {
          position: absolute;
          height: 100%;
          top: 0;
          width: 40px;
          .l_icon, .r_icon {
            width: 40px;
            height: 40px;
            display: block;
            background: red;
            position: absolute;
            left: 0;
            font-size: 40px;
            background: black;
            color: green;
            img{
              display: flex;
              width: 40px;
              height: 40px;
            }
          }
          .l_icon,.r_icon{
            top: 70px;
          }
          .r_icon{
            transform: rotate(180deg);
          }
          .t_icon{
            bottom: 70px;
            top: auto;
          }
        }
        .camera {
          position: absolute;
          width: 25px;
          height: 15px;
          z-index: 20;
          .camera_icon {
            width: 35px;
            height: 14px;
          }
        }
        .camera_z {
          top: 16px;
        }
        .camera_y {
          bottom: 16px;
        }
        .information {
          width: 80px;
          height: 100%;
          background: #112033;
          position: absolute;
          top: 0;
          z-index: 10;
          .re {
            transform: translate(-110px, 140px) rotate(90deg);
            -ms-transform: translate(-110px, 140px) rotate(90deg); /* Internet Explorer 9*/
            -moz-transform: translate(-110px, 140px) rotate(90deg); /* Firefox */
            -webkit-transform: translate(-110px, 140px) rotate(90deg); /* Safari 和 Chrome */
            -o-transform: translate(-110px, 140px) rotate(90deg); /* Opera */
            filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);
            text-align: center;
            width: 300px;
            /*height: 300px;*/
            /*line-height: 300px;*/
            height: 20px;
            line-height: 20px;
            z-index: 50;
            overflow: hidden;
            font-size: 18px;
            font-weight: bold;
            color: #fb1c1c;
          }
        }
        .parking {
          width: 50px;
          height: 10px;
          position: absolute;
          z-index: 10;
          img{
            display: flex;
            width: 150px;
            height: 30px;
          }
          .p-botton{
            transform: rotate(180deg);
          }
        }
        .parking_z {
          top: -16px;
        }
        .parking_y {
          bottom: 4px;
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
</style>
