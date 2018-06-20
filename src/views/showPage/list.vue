<template>
    <div>
        <cd-header></cd-header>
        <div class="container color-6 index-show">
            <el-row :gutter="40" class="mt-50">
                <el-col :sm="24">
                    <div class="grid-content">
                        <div class="fb f22 t-10"><i class="iconfont icon-biaoti color-blue mr-10"></i>{{menuTitle}}</div>
                        <ul class="mt-15 list-content">
                            <router-link v-for="item in listData" :key="item.id" :to="{ path: '/info',query:{articleId:item.id,type:menuTitle}}">
                            <li>
                                <div class="f16 text-short">{{item.title}}</div>
                                <div class="f12 mt-5 color-8">
                                    <i class="iconfont icon-dengdaichuli mr-5"></i>
                                    <span>{{(menuTitle=="企业动态"?item.createtime:item.createTime)|formatDate}}</span>
                                    <i class="iconfont icon-zhanghao mr-5 ml-20"></i>
                                    <span>{{menuTitle=="企业动态"?item.author:item.createUser}}</span>
                                </div>
                            </li>
                            </router-link>
                            
                        </ul>
                    </div>
                </el-col>
            </el-row>
            <div class="tr mt-50">
                <el-pagination v-if="total>10" :total="total" :page-size="10" @current-change="changeLists" :current-page="page" background layout="prev, pager, next"></el-pagination>
            </div>

        </div>
        <cd-footer></cd-footer>
    </div>
</template>

<script>
import header from '../public/header'
import footer from '../public/footer'
export default {
  data() {
    return {
      page: 1,
      total: 0,
      recruitData: '',
      title: '',
      menuTitle: this.$route.query.menuTitle,
      listData: []
    }
  },
  components: {
    'cd-header': header,
    'cd-footer': footer
  },
  mounted() {
    this.getListInfo()
  },
  methods: {
    getListInfo() {
      if (this.menuTitle == '企业动态') {
        var url = `api/listNews?page=${this.page}&rows=10`
      } else if (this.menuTitle == '招标公告') {
        var url = `agent/notice/listOut?page=${this.page}&rows=10&state=启用`
      }
      this.publicFun.httpRequest('get', url, null, (status, data, message) => {
        if (status == 0) {
          this.listData = data.rows
          this.total = data.total
        } else {
          this.$message.error(message)
        }
      })
    },
    changeLists(val) {
      this.page = val
      this.getListInfo()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
.list-content
    margin-top 50px
    min-height 500px
    li
        padding 15px 0 15px 0
        border-bottom 1px dashed #cccccc
        margin-bottom 5px
        &:last-child
            border-bottom none
        &:hover
          color #008fd6!important
          i,span
            color #008fd6
</style>
