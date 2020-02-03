<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  },
  data() {
    return {
      websock: null
    }
  },
  mounted: function() {
  },
  methods: {
    threadPoxi() { // 实际调用的方法
      // 参数
      const agentData = '{"equipType":"1:灯","inFrom":"1:Web","list":[{"aoType":"0","equipId":"1","equipName":"1号灯光","id":"1"}],"message":"灯光控制","success":true,"transType":"3"}'
      // 若是ws开启状态
      if (this.websock.readyState === this.websock.OPEN) {
        this.websocketsend(agentData)
      } else if (this.websock.readyState === this.websock.CONNECTING) { // 若是正在开启状态，则等待300毫秒
        let that = this // 保存当前对象this
        setTimeout(function() {
          that.websocketsend(agentData)
        }, 300)
      } else { // 若未开启 ，则等待500毫秒
        this.initWebSocket()
        let that = this // 保存当前对象this
        setTimeout(function() {
          that.websocketsend(agentData)
        }, 500)
      }
    },
    initWebSocket() { // 初始化weosocket
      // ws地址
      const wsuri = 'ws://192.168.10.209:9001/wsocket/Web'
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onclose = this.websocketclose
      console.log(this.websock)
      this.threadPoxi()
    },
    websocketonmessage(e) { // 数据接收
      const redata = JSON.parse(e.data)
      // console.log('接受成功了')
      // console.log(redata)
    },
    websocketsend(agentData) { // 数据发送
      console.log(agentData)
      this.websock.send(agentData)
      this.$message({
        message: '下发成功',
        type: 'success'
      })
    },
    websocketclose(e) { // 关闭
      console.log('connection closed (' + e.code + ')')
    }
  },
  created() {
    this.initWebSocket()
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
