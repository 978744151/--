// 小程序 封装大全

// 1. 保存图片文件封装

function getsttingImage(url){
    return new Promise((reslove,reject)=>{
      if(url){
        wx.showLoading({
          title: '保存中',
          mask:true
        })
        wx.getSetting({
          success(res) {
            wx.downloadFile({
              url: url,
              success: function (res) {
                console.log(res)
                var temp = res.tempFilePath
                wx.saveImageToPhotosAlbum({
                  filePath: temp,
                  success: function (res) {
                    reslove(res)
                  },
                  fail: function (err) {
                    wx.hideLoading()
                    reject(err)
                    
                  }
                })
              },
              fail: function (err) {
                wx.hideLoading()
                wx.utils.alert('保存失败')
              }
            })
          },
          fail(res) {
          }
        })
      }else{
        wx.showLoading({
          title: '请稍等',
          mask: true
        })
        setTimeout(()=>{
          wx.hideLoading()
        },1000)
      }
    })
  }

// 2. 保存视频文件封装

function getVideoStting(url) {
    return new Promise((reslove, reject) => {
      if (url) {
        wx.showLoading({
          title: '保存中',
          mask: true
        })
        wx.getSetting({
          success(res) {
            wx.downloadFile({
              url: url,
              success: function (res) {
                console.log(res)
                var temp = res.tempFilePath
                wx.saveVideoToPhotosAlbum({
                  filePath: temp,
                  success: function (res) {
                    reslove(res)
                  },
                  fail: function (err) {
                    wx.hideLoading()
                    reject(err)
  
                  }
                })
              },
              fail: function (err) {
                wx.hideLoading()
                wx.utils.alert('保存失败')
              }
            })
          },
          fail(res) {
          }
        })
      } else {
        wx.showLoading({
          title: '请稍等',
          mask: true
        })
        setTimeout(() => {
          wx.hideLoading()
        }, 1000)
      }
    })
  }

// 3.跳转封装
function navigate(e){
    var url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  }

// 4.跳转到别的小程序的封装

function toMiNis(appid,url){
    return new Promise((reslove, reject) => {
      wx.navigateToMiniProgram({
            appId: appid, // 要跳转的小程序的appid
            path: url, // 跳转的目标页面
            extarData: {
              open: 'auth'
            },
            success(res) {
              // 打开成功  
              reslove(res)
            }
          })
    })
  }


// 5. 保存canvas、封装方法
function saveCanvas(_scope,width,height,shareCon){
    wx.showLoading({
      title: '保存中',
      mask: true
    })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: parseInt(width * scale),
      height: parseInt(height * scale),
      destWidth: parseInt(1104 * scale),
      destHeight: parseInt(1812 * scale),
      canvasId: shareCon,
      success(resu) {
        wx.saveImageToPhotosAlbum({
          filePath: resu.tempFilePath,
          success(resp) {
            setTimeout(function () {
              wx.hideLoading()
            }, 1000)
            wx.utils.alert('保存成功', function() {
              _scope.setData({
                isPicture: false,
                loadtrue: false,
                isspec: false,
                isCanvas: false,
              })
            })
          },
          fail(err) {
            if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
              wx.showModal({
                title: '提示',
                content: '需要您授权保存相册',
                showCancel: false,
                success: modalSuccess => {
                  wx.openSetting({
                    success(settingdata) {
                      if (settingdata.authSetting['scope.writePhotosAlbum']) {
                        wx.showModal({
                          title: '提示',
                          content: '再次点击保存图片即可保存',
                          showCancel: false,
                        })
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限失败，将无法保存到相册哦~',
                          showCancel: false,
                        })
                      }
                    },
                    fail(failData) {
                      console.log("failData", failData)
                    },
                    complete(finishData) {
                      console.log("finishData", finishData)
                    }
                  })
                }
              })
            }
            wx.hideLoading()
          }
        })
      }
    })
 }

//  6. 身份证封装方法

//  7 计算身份证校验码，根据国家标准GB 11643-1999
function checkIdcard(code) {
    if (code.length != 18) {
      return false
    }
    //校验位
    var smallx = ['1', '0', 'x', '9', '8', '7', '6', '5', '4', '3', '2'];
    var bigX = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    var parity;
    if (code[17] === 'x') {
      parity = smallx;
    } else {
      parity = bigX;
    }
    var city = {
      11: "北京",
      12: "天津",
      13: "河北",
      14: "山西",
      15: "内蒙古",
      21: "辽宁",
      22: "吉林",
      23: "黑龙江 ",
      31: "上海",
      32: "江苏",
      33: "浙江",
      34: "安徽",
      35: "福建",
      36: "江西",
      37: "山东",
      41: "河南",
      42: "湖北 ",
      43: "湖南",
      44: "广东",
      45: "广西",
      46: "海南",
      50: "重庆",
      51: "四川",
      52: "贵州",
      53: "云南",
      54: "西藏 ",
      61: "陕西",
      62: "甘肃",
      63: "青海",
      64: "宁夏",
      65: "新疆",
      71: "台湾",
      81: "香港",
      82: "澳门",
      91: "国外 "
    };
    var tip = "";
    var pass = true;
    var regs = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/;
    if (!code || !regs.test(code)) {
      tip = "身份证号格式错误";
      pass = false;
    } else if (!city[code.substr(0, 2)]) {
      tip = "地址编码错误";
      pass = false;
    } else {
      //18位身份证需要验证最后一位校验位
      if (code.length == 18) {
  
        code = code.split('');
        //∑(ai×Wi)(mod 11)
        //加权因子
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  
        var sum = 0;
        var ai = 0;
        var wi = 0;
        for (var i = 0; i < 17; i++) {
          ai = code[i];
          wi = factor[i];
          sum += ai * wi;
        }
        var last = parity[sum % 11];
        if (last != code[17]) {
          tip = "校验位错误";
          pass = false;
        }
      }
    }
    //		if(!pass){
    //			alert(tip)
    //		}
    //		alert(tip)
    return pass;
  }

/**
 *  8截取首尾空格
 */
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  }
  
/**
 *  9 .处理用户手机号（模糊处理，保留前三位和最后一位）
 */
function hideUserMobile(mobile) {
    mobile = utils.trim(mobile);
    return mobile.substr(0, 3) + '*******' + (mobile.mobile > 1 ? mobile.substr(-1, 1) : '*');
  }

/**
 * 10. 处理用户名（模糊处理）
 */
function hideUserName(username, force) {
    if (!username || username == '' || utils.trim(username) == '' || typeof(username) !== 'string' || force == true) {
      return '***';
    }
    username = utils.trim(username);
    return username.substr(0, 1) + '*' + (username.length > 1 ? username.substr(-1, 1) : '*');
  }
  
/**
 *  11. 获取系统数据
 */
function sysInfo(page, successFun) {
    let sysTemInfo = wx.getSystemInfoSync();
    wx.getSystemInfo({
      success: function(sysTemInfo) {
        let sysinfo = {
          brand: sysTemInfo.brand || '',
          SDKVersion: sysTemInfo.SDKVersion || '',
          system: sysTemInfo.system,
          isAndroid: (/android/.test(sysTemInfo.system)) || (/Android/.test(sysTemInfo.system)) ? true : false,
          isiOs: ((/iOs/.test(sysTemInfo.system)) || (/ios/.test(sysTemInfo.system)) || (/iOS/.test(sysTemInfo.system)) || (/Ios/.test(sysTemInfo.system))) ? true : false,
          version: sysTemInfo.version,
          windowWidth: sysTemInfo.windowWidth,
          windowHeight: sysTemInfo.windowHeight,
          screenWidth: sysTemInfo.screenWidth || '',
          screenHeight: sysTemInfo.screenHeight || '',
          WechatVersion: sysTemInfo.version,
          model: sysTemInfo.model,
          pixelRatio: sysTemInfo.pixelRatio,
          language: sysTemInfo.language,
          platform: sysTemInfo.platform
        };
        if (page && page.setData) {
          page.setData({
            sysinfo: sysinfo,
          });
        };
        if (successFun && typeof(successFun) == 'function') {
          successFun(sysinfo);
        }
      }
    });
  }

// 12. 身份证究极认证

function IDCardCheck(num) {
    num = num.toUpperCase();
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。   
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
        wx.showToast({
            title: '请填写有效的身份证号码',
            icon: 'none',
            duration: 1500,
            mask: false,
        })
        return false;
    }
    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
    //下面分别分析出生日期和校验位 
    var len, re;
    len = num.length;
    if (len == 15) {
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        var arrSplit = num.match(re);

        //检查生日日期是否正确 
        var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            wx.showToast({
                title: '输入的身份证号里出生日期不对！',
                icon: 'none',
                duration: 1500,
                mask: false,
            })
            return false;
        }
        else {
            //将15位身份证转成18位 
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0, i;
            num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            num += arrCh[nTemp % 11];
            return true;
        }
    }
    if (len == 18) {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        var arrSplit = num.match(re);

        //检查生日日期是否正确 
        var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            wx.showToast({
                title: '输入的身份证号里出生日期不对！',
                icon: 'none',
                duration: 1500,
                mask: false,
            })
            return false;
        }
        else {
            //检验18位身份证的校验码是否正确。 
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
            var valnum;
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0, i;
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            valnum = arrCh[nTemp % 11];
            if (valnum != num.substr(17, 1)) {
                wx.showToast({
                    title: '18位身份证的校验码不正确！',
                    icon: 'none',
                    duration: 1500,
                    mask: false,
                })
                return false;
            }
            return true;
        }
    }
    return false;
}

// 13. modal封装
var showModal =  function (title, content, showCancel, success,confirmText,cancel) {
	wx.showModal({
		title: title || '提示',
		content: content || '',
		showCancel: showCancel || false ,
		cancelText: '取消',
		cancelColor: '#000000',
		confirmText: confirmText || '确定',
		confirmColor: '#000000',
		success: function(res)  {
			if(res.confirm){
				success && success();
			}else{
				cancel && cancel()
			}
		},

	});
}

// 14 . showToast封装
var showToast =  function (title, icon, duration, success) {
	wx.showToast({
		title: title || '加载中',
		icon: icon || 'none',
		mask: true,
		duration: duration || 1000,
		success: function () {
			success && success();
		}
	});
}