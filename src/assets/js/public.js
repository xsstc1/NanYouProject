import Vue from 'vue'
import axios from 'axios'
import {
  Message
} from 'element-ui'

export function formatDate(date) {
  if (date == null) {
    return "--"
  } else {
    var dateInt = parseInt(date);
    var now = new Date(dateInt);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (minute < 10) {
      var minute = "0" + now.getMinutes();
    } else if (second < 10) {
      var second = "0" + now.getSeconds();
    }
    return year + "-" + month + "-" + date;
  }
}
export function httpNode(type, url, data, callback, params) {
  //发布
  let httpUrl = "http://119.23.48.248:3000/" + url;

  //测试
  // let httpUrl = "http://47.98.40.41:3000/" + url;

  axios({
    method: type,
    url: httpUrl,
    data: data,
    params: params
  }).then(response => {
    let result = response.data;
    if (result.code == 200) {
      callback(result.code, result.data, result.msg);
    } else {
      callback(result.rspCode, result.data, result.rspMsg);
    }
  }).catch((error) => {});
}

export function httpRequest(type, url, data, callback, params) {
  const localhost = location.origin;
  const userToken = Cookies.get("UserToken")
  axios({
    method: type,
    url: encodeURI(localhost + "/xhcd/" + url),
    data: data,
    params: params,
  }).then(response => {
    let result = response.data;
    if (result.code == 0) {
      callback(result.code, result.record, result.msg);
    } else {
      callback(result.code, result.record, result.msg);
    }
  }).catch((error) => {});
}
