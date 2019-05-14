// pages/payComplate/payComplate.js
const app = getApp()
var config = require('../../utils/config.js')
var agri = require('../../utils/agriknow.js')
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseSize: false, //弹窗
    animationData: {},
    sayCon: '',
    sayStatus: true,
    title: '',
    nums: '',
    skuImg: '',
    categoryId: '',
    token: '',
    orderId: '',
    isShowMore: false,
    isShowCanvas: true,
    canvasItemList: {},
    itemList: {},
    isShowDialog: false,
    hasAddress: false,
    addressInfo: {},
    username: '',
    userphone: '',
    addressDetail: '',
    status: '',
    isShowMore: false,
    scrollHeight: '670rpx',
    isJoin: false,
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let title = options.title
    // let nums = options.nums
    // let skuImg = options.skuImg
    let remarks = options.remarks
    let orderId = options.orderId
    if (remarks != undefined || remarks != null) {
      that.setData({
        sayStatus: false
      })
    } else {
      that.setData({
        sayStatus: true
      })
    }
    let token = wx.getStorageSync('token')
    that.setData({
      // title: title,
      // nums: nums,
      // skuImg: skuImg,
      token: token,
      sayCon: remarks,
      orderId: orderId
    })
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          winWidth: res.screenWidth + 'px',
          winHeight: res.screenHeight + 'px',
          w: res.screenWidth,
          h: res.screenHeight
        });
      }
    })
  },
  // 自己收礼
  joinDirect: function() {
    var that = this
    var ordersId = that.data.orderId
    if (!this.data.isLogin) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      wx.request({
        url: config.config.postJoinGameDirect,
        method: 'POST',
        data: {
          token: that.data.token,
          ordersId: ordersId,
        },
        dataType: 'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          if (res.data.status == 200) {
            // 弹出地址框
            this.directAddress()
          } else if (res.data.status == 801) {
            utils.getUserInfoFun(this.joinDirect, this)
          } else {
            utils.showTips(res.data.msg)
          }
        }
      })
    }
  },
  // old 悄悄送礼弹出框形式
  toggleDialog: function() {
    var that = this
    if (!this.data.isLogin) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      wx.request({
        url: config.config.postJoinGameDirect,
        method: 'POST',
        data: {
          token: that.data.token,
          ordersId: that.data.orderId,
        },
        dataType: 'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          if (res.data.status == 200) {
            // 查询是否有默认地址 弹出地址框
            that.getUserAddress()
            that.setData({
              isShowDialog: !that.data.isShowDialog
            })
          } else if (res.data.status == 801) {
            utils.getUserInfoFun(that.toggleDialog, this)
          } else {
            utils.showTips(res.data.msg)
          }
        }
      })
    }
  },
  // new直接弹出地址框 new弹出微信默认地址
  directAddress: function() {
    var _this = this
    // var id = _this.data.addressInfo.id
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success() {
              console.log('success')
            },
            fail() {
              utils.showModelStr('友情提示', '您点击了拒绝授权，将无法获取地址信息，点击确定重新获取授权', '确定', '取消', (res) => {
                if (res.confirm) {
                  wx.openSetting({
                    success: (res) => {
                      console.log(res)
                      if (res.authSetting["scope.address"]) {
                        // this.addAddress()
                      }
                    }
                  })
                } else {
                  console.log('用户点击取消')
                }
              })
            }
          })
        } else {
          if (_this.data.hasAddress) {
            // 有地址 则调用修改接口
            wx.chooseAddress({
              success: (res) => {
                _this.setData({
                  addressInfo: res,
                  hasAddress: true
                })
                console.log(_this.data.addressInfo)
                _this.setData({
                  addressDetail: res.provinceName + res.cityName + res.countyName + res.detailInfo,
                  userphone: res.telNumber,
                  username: res.userName
                })
                wx.request({
                  url: config.config.postModifyAddress,
                  method: 'POST',
                  data: {
                    token: _this.data.token,
                    receiver: _this.data.addressInfo.userName,
                    phone: _this.data.addressInfo.telNumber,
                    province: _this.data.addressInfo.provinceName,
                    city: _this.data.addressInfo.cityName,
                    district: _this.data.addressInfo.countyName,
                    detailed: _this.data.addressInfo.detailInfo,
                    longitude: '',
                    latitude: '',
                    location: '',
                    isDefault: 1,
                    id: _this.data.addressId
                  },
                  dataType: 'json',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: (res) => {
                    console.log(res.data)
                    if (res.data.status == 200) {
                      console.log('xiugaichenggong')
                      // 1015 修改成功弹出地址
                      utils.showModelStr('确认收件信息', _this.data.username + ',' + _this.data.userphone + ',' + _this.data.addressDetail, '确认地址', '返回修改', (res) => {
                        if (res.confirm) {
                          _this.joinGameDirect()
                        } else {
                          console.log('用户点击取消')
                          _this.directAddress()
                        }
                      })
                    } else if (res.data.status == 801) {
                      utils.getUserInfoFun(_this.directAddress, _this)
                    } else {
                      utils.showTips(res.data.msg)
                    }
                  }
                })
              },
            })
          } else {
            wx.chooseAddress({
              success: (res) => {
                _this.setData({
                  addressInfo: res,
                  hasAddress: true,
                  addressDetail: res.provinceName + res.cityName + res.countyName + res.detailInfo,
                  userphone: res.telNumber,
                  username: res.userName
                })
                console.log(_this.data.addressInfo)
                wx.request({
                  url: config.config.postAddaddress,
                  method: 'POST',
                  data: {
                    token: _this.data.token,
                    receiver: _this.data.addressInfo.userName,
                    phone: _this.data.addressInfo.telNumber,
                    province: _this.data.addressInfo.provinceName,
                    city: _this.data.addressInfo.cityName,
                    district: _this.data.addressInfo.countyName,
                    detailed: _this.data.addressInfo.detailInfo,
                    longitude: '',
                    latitude: '',
                    location: ''
                  },
                  dataType: 'json',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: (res) => {
                    console.log(res.data)
                    if (res.data.status == 200) {
                      var id = res.data.bean.id
                      _this.setData({
                        ['addressInfo.id']: id,
                        addressId: id
                      })
                      // 1015 修改成功弹出地址
                      utils.showModelStr('确认收件信息', _this.data.username + ',' + _this.data.userphone + ',' + _this.data.addressDetail, '确认地址', '返回修改', (res) => {
                        if (res.confirm) {
                          _this.joinGameDirect()
                        } else {
                          console.log('用户点击取消')
                          _this.directAddress()
                        }
                      })
                    } else if (res.data.status == 801) {
                      // this.getUserInfoFun(this.addAddress)
                      utils.getUserInfoFun(_this.directAddress, _this)
                    } else {
                      utils.showTips(res.data.msg)
                    }
                  }
                })
              },
            })
          }
        }
      }
    })
  },
  /**
 * new领取 直接送提交地址接口
 */
  joinGameDirect: function () {
    let that = this
    let ordersId = that.data.orderId
    wx.request({
      url: config.config.postAddressDirect,
      method: 'POST',
      data: {
        token: that.data.token,
        ordersId: ordersId,
        addressId: that.data.addressId
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          utils.showTips('领取成功')
          wx.navigateTo({
            url: '/pages/directSuccess/directSuccess?ordersId=' + ordersId,
          })
          // this.getCard()
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.joinGameDirect, this)
        } else if (res.data.status == 503) {
          utils.showTips(res.data.msg)
        }
      }
    })
  },
  /**
 * 监听输入姓名 
 */
  bindNameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  /**
   * 监听输入手机号 
   */
  bindPhoneInput: function (e) {
    this.setData({
      userphone: e.detail.value
    })
  },
  /**
   * 监听输入详细地址
   */
  bindAddressInput: function (e) {
    this.setData({
      addressDetail: e.detail.value
    })
  },
  // 获取订单详情
  getOrderDetail() {
    let that = this
    let token = that.data.token
    let ordersId = that.data.orderId
    app.agriknow.getGiftCardDetails(token, ordersId).then(res => {
      if (res.status == 200) {
        var itemList = res.bean.itemVoList
        console.log(itemList)
        if (itemList.length > 3) {
          this.setData({
            isShowMore: true
          })
        }
        var itemListCopy = [].concat(itemList)
        var canvasItemList = itemListCopy.splice(0, 2)
        var itemlistsub = itemList.splice(0, 3)
        this.setData({
          ordersItemNum: res.bean.ordersItemNum,
          itemList: itemlistsub,
          canvasItemList: canvasItemList
        })
        var param = {}
        for (var i in itemlistsub) {
          param.propName = JSON.parse(itemlistsub[i].productParamText).propName
          this.setData({
            ['itemList[' + i + '].productParamText']: param
          })
        }
        // 缓存要绘制的礼品的图片
        wx.getImageInfo({
          src: canvasItemList[0].productPicture,
          success: (res) => {
            this.setData({
              pictureone: res.path
            })
          }
        })
        if (canvasItemList.length > 1) {
          wx.getImageInfo({
            src: canvasItemList[1].productPicture,
            success: (res) => {
              this.setData({
                picturesecond: res.path
              })
            }
          })
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  // 获取二维码图片
  getCodeImg() {
    let that = this
    let ordersId = that.data.orderId
    let token = that.data.token
    wx.request({
      url: config.config.postwachatCode,
      method: 'POST',
      data: {
        token: token,
        pagename: 'giftsCardReceiver',
        routes: 'pages/giftsCardReceiver/giftsCardReceiver?ordersId=' + ordersId
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.getImageInfo({
            src: res.data.bean,
            success: (res) => {
              this.setData({
                codeImg: res.path
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  // 输入完成
  sayStatus: function(e) {
    let that = this
    let cons = e.detail.value
    console.log(cons)
    if (cons.length > 1) {
      that.setData({
        sayCon: cons,
        sayStatus: false
      })
    }
  },
  // 生成图片
  saveCardPic: function() {
    let that = this
    that.setData({
      chooseSize: !that.data.chooseSize
    })
    if (that.data.canvasItemList.length > 1) {
      that.drawShareImg(that.data.bgImgTwo, that.data.codeImg)
    } else {
      that.drawShareImg(that.data.bgImg, that.data.codeImg)
    }
  },
  // 显示弹窗
  showModel: function(e) {
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 260,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(338).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      chooseSize: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  // 隐藏
  hideModal: function(e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 260,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(338).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false
      })
    }, 200)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.getStorage({
      key: 'token',
      success: (res) => {
        if (res.data) {
          this.setData({
            token: res.data
          })
        }
        this.getOrderDetail()
        this.getCodeImg()
      },
    })
    wx.getStorage({
      key: 'isLogin',
      success: (res) => {
        console.log(res.data)
        this.setData({
          isLogin: res.data
        })
      },
      fail: (res) => {
        this.setData({
          isLogin: false
        })
      }
    })
    wx.getImageInfo({
      src: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20190419064631889586045.png',
      success: (res) => {
        this.setData({
          bgImg: res.path
        })
      }
    })
    wx.getImageInfo({
      src: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20190419064631889586045.png',
      success: (res) => {
        this.setData({
          bgImgTwo: res.path
        })
      }
    })
  },
  getTrueLength: function(str) { //获取字符串的真实长度（字节长度）
    var len = str.length,
      truelen = 0;
    for (var x = 0; x < len; x++) {
      if (str.charCodeAt(x) > 128) {
        truelen += 2;
      } else {
        truelen += 1;
      }
    }
    return truelen;
  },
  cutString: function(str, leng) { //按字节长度截取字符串，返回substr截取位置
    var len = str.length,
      tlen = len,
      nlen = 0;
    for (var x = 0; x < len; x++) {
      if (str.charCodeAt(x) > 128) {
        if (nlen + 2 < leng) {
          nlen += 2;
        } else {
          tlen = x;
          break;
        }
      } else {
        if (nlen + 1 < leng) {
          nlen += 1;
        } else {
          tlen = x;
          break;
        }
      }
    }
    return tlen;
  },
  drawShareImg: function(bgImg, codeImg) {
    this.setData({
      isShowCanvas: true
    })
    const ctx = wx.createCanvasContext('shareCanvas')
    var x = this.data.w
    ctx.drawImage(bgImg, 0, 0, this.data.w, 1.824 * this.data.w)

    // 绘制产品图片
    if (this.data.canvasItemList.length > 1) {
      var title1 = this.data.canvasItemList[0].productTitle
      // var picture1 = this.data.canvasItemList[0].productPicture
      var picture1 = this.data.pictureone
      var num1 = this.data.canvasItemList[0].num
      var title2 = this.data.canvasItemList[1].productTitle
      // var picture2 = this.data.canvasItemList[1].productPicture
      var picture2 = this.data.picturesecond
      var num2 = this.data.canvasItemList[1].num

      ctx.setFontSize(14);
      ctx.setFillStyle('#000000');
      for (var i = 1; this.getTrueLength(title1) > 0 && i < 3; i++) {
        var tl = this.cutString(title1, 20);
        ctx.fillText(title1.substr(0, tl).replace(/^\s+|\s+$/, ""), 0.4 * x, 1.65 * x + (i * 20));
        title1 = title1.substr(tl);
      }

      ctx.drawImage(picture1, 0.21 * x, 0.8 * x, 0.16 * x, 0.16 * x)
      ctx.setFontSize(12)
      ctx.setFillStyle('#3F4FA4');
      ctx.fillText('共' + num1 + '份', 0.45 * x, 1.28 * x)

      ctx.setFontSize(14);
      ctx.setFillStyle('#333333');
      for (var i = 1; this.getTrueLength(title2) > 0 && i < 3; i++) {
        var tl = this.cutString(title2, 20);
        ctx.fillText(title2.substr(0, tl).replace(/^\s+|\s+$/, ""), 0.4 * x, 1.24 * x + (i * 20));
        title2 = title2.substr(tl);
      }

      ctx.drawImage(picture2, 0.21 * x, 0.8 * x, 0.16 * x, 0.16 * x)
      ctx.setFontSize(12)
      ctx.setFillStyle('#3F4FA4');
      ctx.fillText('共' + num2 + '份', 0.45 * x, 1.28 * x)
    } else {
      var title1 = this.data.canvasItemList[0].productTitle
      var picture1 = this.data.pictureone
      var num1 = this.data.canvasItemList[0].num
      let goodsTitleArray3 = [];
      // if (title1.length > 5) {
      //   goodsTitleArray3.push(title1.substr(0, 6) + '...');
      // } else {
      //   goodsTitleArray3.push(title1)
      // }
      goodsTitleArray3.push(title1)
      var yOffset = 1.18 * x
      goodsTitleArray3.forEach(function(value) {
        ctx.setFontSize(14);
        ctx.setFillStyle('#333333');
        // ctx.setTextAlign('left');
        ctx.fillText(value, 0.36 * x, yOffset, 1.24 * x);
        yOffset += 0.05 * x;
      });
      // ctx.setFontSize(16)
      // ctx.setFillStyle('#000000');
      // ctx.fillText(title1, 0.4 * x, 0.68 * x)
      ctx.drawImage(picture1, 0.388 * x, 0.8 * x, 0.24 * x, 0.24 * x)
      ctx.setFontSize(12)
      ctx.setFillStyle('#3F4FA4');
      ctx.fillText('共' + num1 + '份', 0.45 * x, 1.28 * x)
    }
    ctx.setFontSize(12)
    ctx.setFillStyle('#333');
    if (this.data.h == 812) {
      ctx.drawImage(codeImg, 0.416 * x, 1.38 * x, 0.168 * x, 0.168 * x)
      ctx.fillText('长按识别小程序码领取礼物', 0.32 * x, 1.7 * x)
    } else {
      ctx.drawImage(codeImg, 0.416 * x, 1.38 * x, 0.168 * x, 0.168 * x)
      // ctx.fillText('长按识别小程序码领取礼物', 0.32 * x, 1.7 * x)
    }
    ctx.draw()
    wx.showLoading({
      title: '正在生成图片',
    })
    setTimeout(() => {
      wx.canvasToTempFilePath({
        width: this.data.w,
        height: 1.824 * this.data.w,
        canvasId: 'shareCanvas',
        success: (res) => {
          console.log(res.tempFilePath)
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: (res) => {
              wx.hideLoading()
              this.setData({
                isShowCanvas: false
              })
              wx.showToast({
                title: '保存图片成功',
              })
            },
            fail: (res) => {
              wx.showToast({
                title: '保存图片失败',
                icon: 'none'
              })
              this.setData({
                isShowCanvas: false
              })
              // 拒绝授权 二次授权
              wx.getSetting({
                success(res) {
                  if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                      scope: 'scope.writePhotosAlbum',
                      success() {
                        console.log('success')
                      },
                      fail() {
                        utils.showModelStr('友情提示', '您点击了拒绝授权，将无法保存图片，点击确定重新获取授权', '确定', '取消', (res) => {
                          if (res.confirm) {
                            wx.openSetting({
                              success: (res) => {
                                console.log(res)
                                if (res.authSetting["scope.writePhotosAlbum"]) {
                                  // this.addAddress()
                                }
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                }
              })
            }
          })
        },
        fail: (res) => {
          wx.showToast({
            title: '保存图片失败',
            icon: 'none'
          })
        }
      })
    }, 3000)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this
    var ordersId = that.data.orderId
    console.log(ordersId)
    if (res.from === 'button') {
      console.log(res.target)
      that.setData({
        chooseSize: !that.data.chooseSize
      })
    }
    // app.agriknow.postShareNumber(ordersId).then(res=>{
    //   if(res.status==200){
    //     console.log('点击分享了')
    //   }
    // })
    return {
      title: 'TA悄悄为你准备了礼物，快来领取吧！',
      path: '/pages/directReceiver/directReceiver?ordersId=' + ordersId,
      imageUrl: 'https://image.prise.shop/images/2018/05/28/1527499314947054.png',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})