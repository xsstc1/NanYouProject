<template>
  <div>
    <cd-header></cd-header>
    <div class="container pb-50">
      <div id="myChart" class="w mt-50">
        <i-echarts :option="options"></i-echarts>

      </div>
      <div id="acceleration" class="w mt-50">
        <i-echarts :option="optionsAcceleration"></i-echarts>
      </div>

      <el-row :gutter="20" class="mt-20">
        <el-col :span="12" class="tc">
          <div class="fb font-show" :class="[markerPosition=='A' ? 'color-green' : 'color-red']">{{markerPosition}}</div>
          <div v-show="markerPosition">
            <i :class="[markerPosition=='A' ? 'el-icon-success color-green' : 'el-icon-warning color-red']" class="mr-5"></i>{{markerPosition=='A'?'脊背端正状态':'脊背弯曲状态'}}</div>
        </el-col>
        <el-col :span="12" class="tc">
          <div class="fb font-show" :class="[judgmentPosition=='D' ? 'color-green' : 'color-red']">{{judgmentPosition}}</div>
          <div v-show="judgmentPosition">
            <i :class="[judgmentPosition=='D' ? 'el-icon-success color-green' : 'el-icon-warning color-red']" class="mr-5"></i>{{judgmentPosition=='D'?'安全状态':'危险状态'}}</div>
        </el-col>
      </el-row>

      <el-form label-position="left" class="mt-80" :inline="true" ref="form" :model="searchData" label-width="100px">

        <el-form-item label="选择日期">
          <el-col :span="11">
            <el-date-picker format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" id="input" type="date" placeholder="选择日期" v-model="searchData.date"></el-date-picker>
          </el-col>

        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">查找</el-button>
          <el-button :type="typeBtn" @click="timeShow">{{typeText}}</el-button>
        </el-form-item>
      </el-form>
      <div class="mt-20">状态：
        <span class="fb f18">{{reloadType}}</span>
      </div>
      <el-table class="mt-20 disinblock" :data="projectData" style="width: 100%">
        <el-table-column align="center" prop="voltage_value" label="脊背弯曲度" min-width="100"></el-table-column>
        <el-table-column align="center" label="脊背状态" width="80">
          <template slot-scope="scope">
            {{scope.row.marker_position}}
            <i :class="[scope.row.marker_position=='A' ? 'el-icon-success color-green' : 'el-icon-warning color-red']" class="ml-5"></i>
          </template>
        </el-table-column>
        <el-table-column align="center" label="加速度">
          <el-table-column align="center" prop="acceleration_x" label="X轴" width="60">
          </el-table-column>
          <el-table-column align="center" prop="acceleration_y" label="Y轴" width="60">
          </el-table-column>
          <el-table-column align="center" prop="acceleration_z" label="Z轴" width="60">
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="时间" width="100">
          <template slot-scope="scope">
            {{scope.row.time|setTime}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="纬度" width="110">
          <template slot-scope="scope">
            {{scope.row.latitude|setNum}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="北或南纬" width="80">
          <template slot-scope="scope">
            {{scope.row.latitude|setString}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="经度" width="110">
          <template slot-scope="scope">
            {{scope.row.longitude|setNum}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="东或西经" width="80">
          <template slot-scope="scope">
            {{scope.row.longitude|setString}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="月日年" width="150">
          <template slot-scope="scope">
            {{scope.row.date|setDate}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="安全状态" width="80">
          <template slot-scope="scope">
            {{scope.row.judgment_position}}
            <i :class="[scope.row.judgment_position=='D' ? 'el-icon-success color-green' : 'el-icon-warning color-red']" class="ml-5"></i>
          </template>
        </el-table-column>
        <el-table-column label="地图" align="center" width="80">
          <template slot-scope="scope">
            <i @click="showMap(scope.row)" class="el-icon-location cp"></i>
          </template>
        </el-table-column>
      </el-table>
      <div class="tr mt-25">
        <el-pagination :total="total" :current-page="page" :page-size="15" @current-change="handleCurrentChange" class="mt-20" layout="prev, pager, next"></el-pagination>
      </div>
    </div>
    <!-- 地图dialog -->
    <el-dialog title="位置" custom-class="radius5" :visible.sync="dialogVisible" :show-close="false" width="80%">
      <div class="w" id="mapContent"></div>

    </el-dialog>
  </div>
</template>

<script>
var data = []
var now = new Date()
var value = Math.random() * 1000
import IEcharts from 'vue-echarts-v3/src/full'
import AMap from 'AMap' //引入高德地图
import header from '../public/header'
import footer from '../public/footer'
export default {
  data() {
    return {
      typeBtn: 'success',
      typeText: '停止实时查看',
      reloadType: '实时刷新中',
      markerPosition: '',
      judgmentPosition: '',
      intervalid: {},
      intervalidPic: {},
      page: 1,
      total: 0,
      totalPic: 0,
      PI: 3.1415926535897932384626,
      ee: 0.00669342162296594323,
      aData: 6378245.0,
      phoneNumber: this.$route.query.phoneNumber,
      activeIndex: 1,
      dialogVisible: false,
      projectData: [],
      searchData: {
        phone: '',
        date: ''
      },
      optionsAcceleration: {
        title: {
          text: '加速度曲线'
        },
        grid: {
          top: 100,
          left: 50,
          right: 50
        },
        legend: {
          data: ['加速度X轴', '加速度Y轴', '加速度Z轴']
        },
        tooltip: {
          trigger: 'axis',
          formatter: {},
          axisPointer: {
            animation: false
          }
        },
        xAxis: {
          name: '时间',
          type: 'time',
          splitLine: {
            show: false
          }
        },
        // yAxis: {},      纵轴自适应
        yAxis: {
          //纵轴标尺固定
          name: '加速度值',
          type: 'value',
          boundaryGap: [0, '100%'],
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: '加速度X轴',
            type: 'line',
            showSymbol: true,
            smooth: true,
            hoverAnimation: true,
            data: []
          },
          {
            name: '加速度Y轴',
            type: 'line',
            showSymbol: true,
            smooth: true,
            hoverAnimation: true,
            data: []
          },
          {
            name: '加速度Z轴',
            type: 'line',
            showSymbol: true,
            smooth: true,
            hoverAnimation: true,
            data: []
          }
        ]
      },
      options: {
        title: {
          text: '脊背弯曲度曲线'
        },
        grid: {
          top: 100,
          left: 50,
          right: 50
        },
        legend: {
          data: ['脊背弯曲度']
        },
        tooltip: {
          trigger: 'axis',
          formatter: {},
          axisPointer: {
            animation: false
          }
        },
        xAxis: {
          name: '时间',
          type: 'time',
          splitLine: {
            show: false
          }
        },
        // yAxis: {},      纵轴自适应
        yAxis: {
          //纵轴标尺固定
          name: '脊背弯曲度',
          type: 'value',
          boundaryGap: [0, '100%'],
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: '脊背弯曲度',
            type: 'line',
            showSymbol: true,
            smooth: true,
            hoverAnimation: true,
            data: []
          }
        ]
      }
    }
  },
  filters: {
    setNum(val) {
      if (val.length == 9) {
        let value = val.split('')
        var v1 = value[0] + value[1] //度
        var v2 = value[2] + value[3] //分
        var v3 = value[4] + value[5] + '.' + value[6] + value[7] //秒
        return v1 + '°' + v2 + "'" + v3 + '"'
      } else if (val.length == 10) {
        let value = val.split('')
        var v1 = value[0] + value[1] + value[2] //度
        var v2 = value[3] + value[4] //分
        var v3 = value[5] + value[6] + '.' + value[7] + value[8] //秒
        return v1 + '°' + v2 + "'" + v3 + '"'
      }
    },
    setString(val) {
      return val.substr(val.length - 1, 1)
    },
    setTime(val) {
      var timeArr = String(val).split('')
      if (timeArr.length == 5) {
        timeArr.unshift('0')
      }
      let hour = timeArr[0] + timeArr[1]
      let minute = timeArr[2] + timeArr[3]
      let second = timeArr[4] + timeArr[5]
      return `${hour}:${minute}:${second}`
    },
    setDate(val) {
      var dateArr = String(val).split('')
      if (dateArr.length == 7) {
        dateArr.unshift('0')
      }
      let year = dateArr[4] + dateArr[5] + dateArr[6] + dateArr[7]
      let month = dateArr[2] + dateArr[3]
      let day = dateArr[0] + dateArr[1]
      return `${month}月${day}日${year}年`
    }
  },
  components: {
    'cd-header': header,
    'cd-footer': footer,
    IEcharts
  },
  mounted() {
    this.getAll(() => {
      this.intervalPic()
      this.intervalAll()
    })
  },

  methods: {
    timeShow() {
      if (this.typeBtn == 'success') {
        this.typeBtn = 'warning'
        this.typeText = '实时查看'
        this.reloadType = '停止实时刷新'
        clearInterval(this.intervalid)
      } else {
        this.intervalAll()
        this.typeBtn = 'success'
        this.typeText = '停止实时查看'
        this.reloadType = '实时刷新中'
        this.searchData.date = ''
        this.page = 1
      }
    },
    onSubmit() {
      this.page = 1
      this.typeBtn = 'warning'
      this.typeText = '实时查看'
      this.reloadType = '停止实时刷新'
      this.getAll()
      clearInterval(this.intervalid)
    },
    changeData() {
      let data = []
      var vm = this
      setInterval(function() {
        //data.shift();
        data.push(vm.randomData())
        vm.options.series[0].data = data
        // console.log('电压值', voltageData)
      }, 2000)
    },
    handleCurrentChange(val) {
      this.typeBtn = 'warning'
      this.typeText = '实时查看'
      this.reloadType = '停止实时刷新'
      this.page = val
      this.getAll()
      clearInterval(this.intervalid)
    },
    randomData() {
      now = new Date(+now + 1000)
      value = value + Math.random() * 21 - 10
      return {
        name: now.toString(),
        value: [now, Math.round(value)]
      }
    },
    intervalPic() {
      let voltageData = []
      let accelerationX = []
      let accelerationY = []
      let accelerationZ = []
      this.intervalidPic = setInterval(() => {
        this.publicFun.httpNode(
          'get',
          `project/getAll?phoneNumber=${this.phoneNumber}&page=1&size=1`,
          null,
          (status, data, message) => {
            if (status == 200) {
              if (this.total != data.count && this.totalPic != data.count) {
                this.markerPosition = data.summary[0].marker_position
                this.judgmentPosition = data.summary[0].judgment_position
                // 电压图
                voltageData.push({
                  name: data.summary[0].severTime,
                  value: [
                    data.summary[0].severTime,
                    data.summary[0].voltage_value
                  ]
                })
                this.options.series[0].data = voltageData
                // 加速度X
                accelerationX.push({
                  name: data.summary[0].acceleration_x,
                  value: [
                    data.summary[0].severTime,
                    data.summary[0].acceleration_x
                  ]
                })
                this.optionsAcceleration.series[0].data = accelerationX
                // 加速度Y
                accelerationY.push({
                  name: data.summary[0].acceleration_y,
                  value: [
                    data.summary[0].severTime,
                    data.summary[0].acceleration_y
                  ]
                })
                this.optionsAcceleration.series[1].data = accelerationY
                // 加速度Z
                accelerationZ.push({
                  name: data.summary[0].acceleration_z,
                  value: [
                    data.summary[0].severTime,
                    data.summary[0].acceleration_z
                  ]
                })
                this.optionsAcceleration.series[2].data = accelerationZ

                this.totalPic = data.count
              }
              // console.log('电压值', voltageData)
            } else {
              this.$message.error(message)
            }
          }
        )
      }, 2000)
    },
    intervalAll() {
      this.intervalid = setInterval(() => {
        this.publicFun.httpNode(
          'get',
          `project/getAll?phoneNumber=${this.phoneNumber}&page=1&size=15`,
          null,
          (status, data, message) => {
            if (status == 200) {
              if (this.total != data.count) {
                this.projectData = data.summary
              }
            } else {
              this.$message.error(message)
            }
          }
        )
      }, 2000)
    },
    DegreeConvertBack(value) {
      ///<summary>度分秒转换成为度</summary>
      console.log('度分秒', value)
      var du = value.split('°')[0]
      var fen = value.split('°')[1].split("'")[0]
      var miao = value
        .split('°')[1]
        .split("'")[1]
        .split('"')[0]

      console.log(
        '度',
        Math.abs(du) + '.' + (Math.abs(fen) / 60 + Math.abs(miao) / 3600)
      )

      return Math.abs(du) + (Math.abs(fen) / 60 + Math.abs(miao) / 3600)
    },
    showMap(row) {
      this.dialogVisible = true

      let valueLongitude = row.longitude.split('')
      var v1 = valueLongitude[0] + valueLongitude[1] + valueLongitude[2] //度
      var v2 = valueLongitude[3] + valueLongitude[4] //分
      var v3 =
        valueLongitude[5] +
        valueLongitude[6] +
        '.' +
        valueLongitude[7] +
        valueLongitude[8] //秒
      var longitude = v1 + '°' + v2 + "'" + v3 + '"'

      let valueLatitude = row.latitude.split('')
      var v4 = valueLatitude[0] + valueLatitude[1] //度
      var v5 = valueLatitude[2] + valueLatitude[3] //分
      var v6 =
        valueLatitude[4] +
        valueLatitude[5] +
        '.' +
        valueLatitude[6] +
        valueLatitude[7] //秒
      var latitude = v4 + '°' + v5 + "'" + v6 + '"'

      let locationArr = GPS.gcj_encrypt(
        this.DegreeConvertBack(longitude),
        this.DegreeConvertBack(latitude)
      )
      console.log(locationArr)
      var gps = [locationArr.lat, locationArr.lon]
      AMap.convertFrom(gps, 'gps', (status, result) => {
        if (result.info === 'ok') {
          var lnglats = result.locations[0] // Array.<LngLat>
          console.log('转化过的', lnglats)
          this.setMap(lnglats.lng, lnglats.lat)
        }
      })
    },
    setMap(longitude, latitude) {
      setTimeout(() => {
        const map = new AMap.Map('mapContent', {
          resizeEnable: true,
          center: [longitude, latitude],
          zoom: 9
        })
        var marker = new AMap.Marker({
          icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
          position: [longitude, latitude]
        })
        marker.setMap(map)
      }, 100)
    },
    getAll(callback) {
      this.publicFun.httpNode(
        'get',
        `project/getAll?phoneNumber=${this.phoneNumber}&date=${
          this.searchData.date
        }&page=${this.page}&size=15`,
        null,
        (status, data, message) => {
          if (status == 200) {
            this.projectData = data.summary
            this.total = data.count
            if (callback) {
              callback()
            }
          } else {
            this.$message.error(message)
          }
        }
      )
    },
    setPicTime(val) {
      var timeArr = String(val).split('')
      if (timeArr.length == 5) {
        timeArr.unshift('0')
      }
      let hour = timeArr[0] + timeArr[1]
      let minute = timeArr[2] + timeArr[3]
      let second = timeArr[4] + timeArr[5]
      return `${hour}:${minute}:${second}`
    }
  }
}

var GPS = {
  PI: 3.14159265358979324,
  x_pi: 3.14159265358979324 * 3000.0 / 180.0,
  delta: function(lat, lon) {
    // Krasovsky 1940
    //
    // a = 6378245.0, 1/f = 298.3
    // b = a * (1 - f)
    // ee = (a^2 - b^2) / a^2;
    var a = 6378245.0 //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
    var ee = 0.00669342162296594323 //  ee: 椭球的偏心率。
    var dLat = this.transformLat(lon - 105.0, lat - 35.0)
    var dLon = this.transformLon(lon - 105.0, lat - 35.0)
    var radLat = lat / 180.0 * this.PI
    var magic = Math.sin(radLat)
    magic = 1 - ee * magic * magic
    var sqrtMagic = Math.sqrt(magic)
    dLat = dLat * 180.0 / (a * (1 - ee) / (magic * sqrtMagic) * this.PI)
    dLon = dLon * 180.0 / (a / sqrtMagic * Math.cos(radLat) * this.PI)
    return { lat: dLat, lon: dLon }
  },

  //GPS---高德
  gcj_encrypt: function(wgsLat, wgsLon) {
    if (this.outOfChina(wgsLat, wgsLon)) return { lat: wgsLat, lon: wgsLon }

    var d = this.delta(wgsLat, wgsLon)
    return { lat: wgsLat + d.lat, lon: wgsLon + d.lon }
  },
  outOfChina: function(lat, lon) {
    if (lon < 72.004 || lon > 137.8347) return true
    if (lat < 0.8293 || lat > 55.8271) return true
    return false
  },
  transformLat: function(x, y) {
    var ret =
      -100.0 +
      2.0 * x +
      3.0 * y +
      0.2 * y * y +
      0.1 * x * y +
      0.2 * Math.sqrt(Math.abs(x))
    ret +=
      (20.0 * Math.sin(6.0 * x * this.PI) +
        20.0 * Math.sin(2.0 * x * this.PI)) *
      2.0 /
      3.0
    ret +=
      (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) *
      2.0 /
      3.0
    ret +=
      (160.0 * Math.sin(y / 12.0 * this.PI) +
        320 * Math.sin(y * this.PI / 30.0)) *
      2.0 /
      3.0
    return ret
  },
  transformLon: function(x, y) {
    var ret =
      300.0 +
      x +
      2.0 * y +
      0.1 * x * x +
      0.1 * x * y +
      0.1 * Math.sqrt(Math.abs(x))
    ret +=
      (20.0 * Math.sin(6.0 * x * this.PI) +
        20.0 * Math.sin(2.0 * x * this.PI)) *
      2.0 /
      3.0
    ret +=
      (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) *
      2.0 /
      3.0
    ret +=
      (150.0 * Math.sin(x / 12.0 * this.PI) +
        300.0 * Math.sin(x / 30.0 * this.PI)) *
      2.0 /
      3.0
    return ret
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
#myChart, #acceleration
  height 400px
#mapContent
  width 300px
  height 600px
.font-show
  font-size 60px
</style>
