<template>
    <div>
        <cd-header></cd-header>
        <div class="container color-6 index-show">
            <el-row :gutter="40" class="mt-50">
                <el-col :sm="24">
                    <div class="single-content">
                        <div class="fb f22"><i class="iconfont icon-biaoti color-blue mr-10"></i>{{typeTitle}}</div>
                        <div v-if="typeTitle=='诚聘英才'">
                            <nav class="mt-50 f18">{{title}}</nav>
                            <div class="mt-20" v-html="recruitData"></div>
                        </div>
                        <div v-if="typeTitle=='业务范围'" class="f16">
                            <div class="mt-40 f16">
                                <span>公司的主要业务范围为苏州、吴江、昆山、张家港、常熟、园区等地区，提供工程项目管理咨询、政府采购代理与咨询、工程招标代理与咨询、工程造价咨询、工程监理、企业管理咨询服务、可行性研究服务；价格评估服务等各种管理方面服务。</span>
                            </div>
                        </div>
                        <div v-if="typeTitle=='业务委托及招标流程'" class="f16">
                            <div class="mt-40 f16">
                                <span>公司按照国家法律规定，依法接受委托。与委托方签订委托合同，明确各自权利和义务。按照委托内容，对照法律规定确定招标方式。企业委托的按照招投标法来确定，运用财政性资金的按照政府采购法，招投标法及地方法规来确定。</span>
                            </div>
                        </div>
                        <div v-if="typeTitle=='关于我们'">
                            <div class="siteorigin-widget-tinymce textwidget">
                                <p>
                                </p>
                                <p>
                                    <span style="font-size:16px;">苏州诚德天工建设项目管理咨询有限公司于2017年7月在苏州市吴中区市场监督管理局注册成立，是专业从事政府采购代理业务、工程招标代理业务、工程造价咨询、工程项目管理、工程监理等业务的现代服务咨询机构，办公地址为苏州市吴中区苏苑街21号403-08室。办公设施齐全，配有专业监控设施的开标室、评标室能满足广大客户的招标采购业务使用需求。</span>
                                </p>
                                <p>
                                    <span style="font-size:16px;">公司的主要业务范围为：工程项目管理咨询；政府采购代理与咨询；工程招标代理与咨询；工程造价咨询；工程监理；企业管理咨询服务；可行性研究服务；价格评估服务。</span>
                                </p>
                                <p>
                                    <span style="font-size:16px;">公司虽然为新注册成立，但从业人员均为具有丰富行业工作经验的专业人员组成。</span>
                                </p>
                                <p>
                                    <span style="font-size:16px;">“服务第一、客户至上”是公司的服务宗旨。公司为此制定了规范的企业章程和严格的规章制度，坚守依法、独立、客观、公正的执业原则，以诚信和专业获取社会各界的信任与支持！</span>
                                </p>
                                <p>
                                    <br>
                                </p>
                                <span style="font-size:16px;"></span>
                                <p></p>
                            </div>
                        </div>

                        <div v-if="typeTitle=='联系我们'">
                            <div class="mt-40">
                                <p>
                                    <span style="font-size:16px;line-height:1.5;">联系人：孙先生</span>
                                </p>
                                <p>
                                    <span style="font-size:16px;">联系方式:15850008156、0512-68557982</span>
                                </p>
                                <p>
                                    <br>
                                </p>
                                <p>
                                    <span style="font-size:16px;">传真：0512-68557251</span>
                                </p>
                                <p>
                                    <span style="font-size:16px;"></span>
                                    <span style="line-height:1.5;font-size:16px;">地址：苏州市吴中区苏苑街21号苏苑饭店商务楼四楼</span>
                                </p>
                                <p>
                                    <br>
                                </p>
                                <br>
                                <span class="saver-img"><img class="w" src="../../assets/img/map.png" alt=""></span>
                            </div>
                        </div>
                    </div>
                </el-col>

            </el-row>

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
      recruitData: '',
      title: '',
      typeTitle: this.$route.query.type
    }
  },
  components: {
    'cd-header': header,
    'cd-footer': footer
  },
  watch: {
    $route: function() {
      this.typeTitle = this.$route.query.type
    }
  },
  mounted() {
    this.getrecruitInfo()
  },
  methods: {
    getrecruitInfo() {
      this.publicFun.httpRequest(
        'get',
        'api/getJoinUs',
        null,
        (status, data, message) => {
          if (status == 0) {
            this.recruitData = data.content
            this.title = data.title
          } else {
            this.$message.error(message)
          }
        }
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
td, th
    padding 10px
.saver-img
    img
        max-width 650px
.single-content
    min-height 600px
</style>
