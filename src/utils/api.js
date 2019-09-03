var fetch = require('./server');
const pcindexurl = '?action=videoShow'
let pcindex = function (params) {
    return fetch.httpRequest(pcindexurl, params)
}
const pcLiveList = '?action=liveList'
let liveList = function (params) {
    return fetch.httpRequest(pcLiveList, params)
}

const rytoken = '?action=rytoken'
let gorytoken = function (params) {
    return fetch.httpRequest(rytoken, params)
}
const livejoinapi = '?action=livejoin'
let livejoin = function (params) {
    return fetch.httpRequest(livejoinapi, params)
}
module.exports = {
    livejoin,
    pcindex,
    liveList,
    gorytoken
}