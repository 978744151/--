/*
 * zxl 2019.2.6
 **/
import Vue from 'vue'
import axios from "axios"
import Qs from 'qs'
import router from "../router";
let host = '/media';
// let host = 'https://api.0gowang.com/international/media?';
function httpRequest(
  url,
  params = {},
  method = 'POST',
  contentType = 'application/json'
) {
  return new Promise((reslove, reject) => {
    axios({
      url: host + url,
      data: Object.assign({appver:"1.3.1",zid:"32"}, params),
      transformRequest: [data => Qs.stringify(data)],
      method: method,
    }).then(res => {
      var pathName = router.currentRoute.name
      var path     = router.currentRoute.path
      var resCode = res.data.status || 0;
      reslove(res.data)

    }).catch(error => {

      reject(error)
    })
  })
}
export {
  httpRequest
}
