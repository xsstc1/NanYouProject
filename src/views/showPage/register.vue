<template>
    <div>
        <cd-header></cd-header>
        <div class="container pb-50">

            <el-form ref="searchData" :rules="rules" class="mt-100 tc phone-input bc" :model="searchData" label-width="100px">
                <el-form-item label="手机号" prop="phone">
                    <el-input type="number" id="input" v-model="searchData.phone"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pass">
                    <el-input id="password" type="password" v-model="searchData.pass"></el-input>
                </el-form-item>
                <el-form-item label="重复密码" prop="checkPass">
                    <el-input id="password" type="password" v-model="searchData.checkPass"></el-input>
                </el-form-item>
                <el-form-item class="mt-30">
                    <el-button type="primary" @click="onSubmit('searchData')">注册并登录</el-button>
                    <el-button type="warning" @click="onRegister">返回登录页</el-button>
                </el-form-item>
            </el-form>

        </div>
    </div>
</template>

<script>
var data = [];
var now = new Date();
var value = Math.random() * 1000;
import AMap from "AMap"; //引入高德地图
import header from "../public/header";
import footer from "../public/footer";
export default {
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else {
                if (this.searchData.checkPass !== "") {
                    this.$refs.searchData.validateField("checkPass");
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.searchData.pass) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            intervalid: {},
            intervalidPic: {},
            page: 1,
            total: 0,
            PI: 3.1415926535897932384626,
            ee: 0.00669342162296594323,
            aData: 6378245.0,
            activeIndex: 1,
            dialogVisible: false,
            projectData: [],
            searchData: {
                phone: "",
                date: "",
                pass: "",
                checkPass: ""
            },
            rules: {
                phone: [
                    { required: true, message: "请输入手机号", trigger: "blur" }
                ],
                pass: [
                    { required: true, validator: validatePass, trigger: "blur" }
                ],
                checkPass: [
                    {
                        required: true,
                        validator: validatePass2,
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    components: {
        "cd-header": header,
        "cd-footer": footer
    },
    mounted() {
        // this.getAll()
    },

    methods: {
        onRegister() {
            this.$router.push({
                path: "/"
            });
        },
        onSubmit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$router.push({
                        path: "/info",
                        query: { phoneNumber: this.searchData.phone }
                    });
                } else {
                    if (!this.searchData.phone) {
        
                        document.querySelector("#input").focus();
                    } else if (!this.searchData.pass) {
                    
                        document.querySelector("#password").focus();
                    }
                    return false;
                }
            });
        }
    }
};

var GPS = {
    PI: 3.14159265358979324,
    x_pi: 3.14159265358979324 * 3000.0 / 180.0,
    delta: function(lat, lon) {
        // Krasovsky 1940
        //
        // a = 6378245.0, 1/f = 298.3
        // b = a * (1 - f)
        // ee = (a^2 - b^2) / a^2;
        var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
        var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
        var dLat = this.transformLat(lon - 105.0, lat - 35.0);
        var dLon = this.transformLon(lon - 105.0, lat - 35.0);
        var radLat = lat / 180.0 * this.PI;
        var magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = dLat * 180.0 / (a * (1 - ee) / (magic * sqrtMagic) * this.PI);
        dLon = dLon * 180.0 / (a / sqrtMagic * Math.cos(radLat) * this.PI);
        return { lat: dLat, lon: dLon };
    },

    //GPS---高德
    gcj_encrypt: function(wgsLat, wgsLon) {
        if (this.outOfChina(wgsLat, wgsLon))
            return { lat: wgsLat, lon: wgsLon };

        var d = this.delta(wgsLat, wgsLon);
        return { lat: wgsLat + d.lat, lon: wgsLon + d.lon };
    },
    outOfChina: function(lat, lon) {
        if (lon < 72.004 || lon > 137.8347) return true;
        if (lat < 0.8293 || lat > 55.8271) return true;
        return false;
    },
    transformLat: function(x, y) {
        var ret =
            -100.0 +
            2.0 * x +
            3.0 * y +
            0.2 * y * y +
            0.1 * x * y +
            0.2 * Math.sqrt(Math.abs(x));
        ret +=
            (20.0 * Math.sin(6.0 * x * this.PI) +
                20.0 * Math.sin(2.0 * x * this.PI)) *
            2.0 /
            3.0;
        ret +=
            (20.0 * Math.sin(y * this.PI) +
                40.0 * Math.sin(y / 3.0 * this.PI)) *
            2.0 /
            3.0;
        ret +=
            (160.0 * Math.sin(y / 12.0 * this.PI) +
                320 * Math.sin(y * this.PI / 30.0)) *
            2.0 /
            3.0;
        return ret;
    },
    transformLon: function(x, y) {
        var ret =
            300.0 +
            x +
            2.0 * y +
            0.1 * x * x +
            0.1 * x * y +
            0.1 * Math.sqrt(Math.abs(x));
        ret +=
            (20.0 * Math.sin(6.0 * x * this.PI) +
                20.0 * Math.sin(2.0 * x * this.PI)) *
            2.0 /
            3.0;
        ret +=
            (20.0 * Math.sin(x * this.PI) +
                40.0 * Math.sin(x / 3.0 * this.PI)) *
            2.0 /
            3.0;
        ret +=
            (150.0 * Math.sin(x / 12.0 * this.PI) +
                300.0 * Math.sin(x / 30.0 * this.PI)) *
            2.0 /
            3.0;
        return ret;
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.phone-input
    margin-top 200px
    width 50%
#myChart, #acceleration
    height 400px
#mapContent
    width 300px
    height 600px
</style>
