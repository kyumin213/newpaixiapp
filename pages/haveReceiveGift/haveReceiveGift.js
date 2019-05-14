// pages/haveReceiveGift/haveReceiveGift.js
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    receive:false,
    paseTime:true,
    send:false,
    isShowDialog: false,
    hasAddress: false,
    addressInfo: {},
    username: '',
    userphone: '',
    addressDetail: '',
    status: '',
    isShowMore: false,
    scrollHeight: '670rpx',
    isJoin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
 * 参与活动填地址
 */
  joinGame: function () {
    wx.request({
      url: config.config.postAddressDirect,
      method: 'POST',
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        addressId: this.data.addressId
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          utils.showTips('领取成功')
          this.setData({
            isShowDialog: !this.data.isShowDialog,
            isJoin: true
          })
          wx.navigateTo({
            url: '/pages/directSuccess/directSuccess',
          })
          // this.getCard()
        } else if (res.data.status == 503) {
          utils.showTips(res.data.msg)
          this.setData({
            isShowDialog: !this.data.isShowDialog
          })
        } else if (res.data.status == 801) {
          utils.getUserInfoFun(this.joinGame, this)
          // this.joinGame()
        }
      }
    })
  },
  /**
   * new领取 直接送提交地址接口
   */
  joinGameDirect: function () {
    wx.request({
      url: config.config.postAddressDirect,
      method: 'POST',
      data: {
        token: this.data.token,
        ordersId: this.data.ordersId,
        addressId: this.data.addressId
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          utils.showTips('领取成功')
          wx.navigateTo({
            url: '/pages/directSuccess/directSuccess',
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
  // new直接送 参与接口
  joinDirect: function () {
    if (!this.data.isLogin) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      wx.request({
        url: config.config.postJoinGameDirect,
        method: 'POST',
        data: {
          token: this.data.token,
          ordersId: this.data.ordersId,
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
  // new直接弹出地址框 new弹出微信默认地址
  directAddress: function () {
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
 * 获取用户默认地址
 */
  getUserAddress: function () {
    wx.request({
      url: config.config.getUserDefaultAddress,
      data: {
        token: this.data.token
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          if (res.data.bean) {
            this.setData({
              addressId: res.data.bean.id,
              addressDetail: res.data.bean.location,
              userphone: res.data.bean.phone,
              username: res.data.bean.receiver,
              hasAddress: true
            })
          }
        } else {
          this.setData({
            hasAddress: false
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})