<template>
    <footer class="index-footer">
            <div class="container">
                <el-row class="mt-20" :gutter="60">
                    <el-col :sm="17">
                        <div>
                            <span><router-link :to="{ path: '/'}">首页</router-link></span>
                            <span class="ml-20 mr-20">|</span>
                            <span><router-link :to="{ path: '/single',query:{type:'诚聘英才'}}">诚聘英才</router-link></span>
                            <span class="ml-20 mr-20">|</span>
                            <span><router-link :to="{ path: '/single',query:{type:'联系我们'}}">联系我们</router-link></span>
                        </div>
                        <div class="mt-10 cb">
                            <div class="fl cb mr-30">
                                <i class="iconfont icon-dianhua mr-5 f40 fl"></i>
                                <span class="f32 fl mt-8">1585000815</span>
                            </div>
                            <div class="fl cb">
                                <i class="iconfont icon-cz mr-5 f40 fl"></i>
                                <span class="f32 fl mt-8">0512-68557251 </span>
                            </div>
                        </div>
                        <div class="mt-10">
                            Copyright © 2015 苏州新华诚德项目管理有限公司
                        </div>
                        <div class="mt-10">
                            地址：吴中苏苑商务楼4楼
                        </div>
                        <div class="mt-10">
                            联系人：孙先生
                        </div>
                    </el-col>
                    <el-col :sm="7" class="tl index-footer-href hidden-xs">
                        <div class="ml-20">
                            <div>友情链接</div>
                            <ul class="mt-40 f15">
                                <li><a target="_blank" href="http://www.zfcg.suzhou.gov.cn/html/main/index.shtml">苏州市政府采购网</a></li>
                                <li class="mt-10"><a target="_blank" href="http://szzyjy.fwzx.suzhou.gov.cn">苏州公共资源交易中心</a></li>
                            </ul>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </footer>
</template>
<style lang="stylus">
.index-footer
    margin-top 100px
    background-color #424242
    padding 20px
    border-top 5px solid #008fd6
    color #bbb
.index-footer-href
    border-left 1px solid #bbb
</style>

