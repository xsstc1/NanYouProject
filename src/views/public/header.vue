<template>

    <el-header class="cd-header">
        <div class="container">
            <router-link :to="{ path: '/'}">
                <div class="fl w50 cb">
                    <span class="fl mt-15 f20 ml-10 hidden-xs">智能学生坐姿与安全监测系统（i-kids）</span>
                </div>
            </router-link>
            
        </div>
        <el-dialog :visible.sync="dialogVisible" :fullscreen="true">
            <ul class="tc mt-50 mobile-menu">
                <li>
                    <router-link :to="{ path: '/'}">首页</router-link>
                </li>
                <li>
                    <router-link :to="{ path: '/list',query:{menuTitle:'招标公告'}}">招标信息</router-link>
                </li>
                <li>
                    <router-link :to="{ path: '/single',query:{type:'诚聘英才'}}">诚聘英才</router-link>
                </li>
                <li>
                    <router-link :to="{ path: '/single',query:{type:'关于我们'}}">关于我们</router-link>
                </li>
                <li>
                    <router-link :to="{ path: '/single',query:{type:'联系我们'}}">联系我们</router-link>
                </li>
            </ul>

        </el-dialog>
    </el-header>

</template>
<script>
export default {
  data() {
    return {
      activeIndex: this.$route.query.type,
      dialogVisible: false,
      loginHref:''
    }
  },
  mounted() {
      this.loginHref = `//${location.hostname}:8088/xhcd/login`
  },
  methods: {}
}
</script>
<style lang="stylus">
.el-submenu__title
    color #fff!important
.el-submenu__title i
    color #fff
.el-submenu__title:hover
    background-color #fff
    color #000!important
    i 
       color #000!important 
.cd-header
    background-color #008fd6
    color #fff
.el-menu
    border none
    background-color transparent
    .el-menu-item
        color #fff
        padding 0
.el-menu--horizontal>.el-menu-item.is-active
    border-bottom none
    color #000
    background-color #fff
.el-menu--horizontal>.el-menu-item a, .el-menu--horizontal>.el-menu-item a:hover
    display inline-block
    padding 0 20px
.mobile-menu
    li
        padding 20px
</style>
