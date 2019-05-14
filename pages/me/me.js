// pages/me/me.js
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    flag: false,
    hiddenmodalput: true,
    userPhone: '',
    encryptedData: '',
    iv: '',
    collectNumber: 0,
    pendingPay: '',
    pendingReceive: '',
    completed: '',
    isLoading: false
  },
  gotoLogin: function () {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getStorage({
      key: 'isLogin',
      success: (res) => {
        this.setData({
          isLogin: res.data,
        })
      },
      fail: (res) => {
        this.setData({
          isLogin: false,
          accounts: '0.00'
        })
      }
    })
    wx.getStorage({
      key: 'token',
      success: (res) => {
        this.setData({
          token: res.data
        })
        if (app.globalData.userPhone) {
          this.setData({
            userPhone: app.globalData.userPhone
          })
        } else {
          this.getUserPhone()
        }
        // 获取优惠券可用数量
        this.getCouponNumber()
        // 获取红包金额
        this.getAccountInfo()
      },
      fail: (res) => {
        this.setData({
          accounts: '0.00'
        })
      }
    })
  },
  /**
   * 一元送礼
   */
  bargain:function(){
    wx.navigateTo({
      url: '/pages/me/bargainStatus/bargainStatus',
    })
  },
  /**
   * 生日愿望
   */
  birthdayWish:function(){
    wx.navigateTo({
      url: '/pages/index/birthdayWish/birthdayWish',
    })
  },
  /**
   * 去到我的钱包
   */
  goMoneyPackage: function () {
    if (this.data.isLogin) {
      wx.navigateTo({
        url: '/pages/wallet/wallet',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 查看钱包余额
   */
  getAccountInfo: function () {
    utils.httpRequestPost(config.config.postAccountDetail, { token: this.data.token }, (res) => {
      if (res.data.status == 200) {
        this.setData({
          accounts: res.data.bean.amount
        })
      } else if (res.data.status == 801) {
        utils.getUserInfoFun(this.getAccountInfo, this)
      } else {
        utils.showTips(res.data.msg)
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  /**
   * 去到优惠券页面 pageFrom=1从个人中心进入
   */
  goCoupon: function () {
    if (this.data.isLogin) {
      wx.navigateTo({
        url: '/pages/couponList/couponList?pageFrom=1',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 去到消息中心
   */
  goMessageList: function () {
    if (this.data.isLogin) {
      wx.navigateTo({
        url: '/packageA/pages/message/message',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  goAbout: function () {
    wx.navigateTo({
      url: '/packageA/pages/about/about',
    })
  },
  /**
   * 礼物记录 送出的
   */
  goRecordList: function (e) {
    if (this.data.isLogin) {
      var category = e.currentTarget.dataset.index
      wx.navigateTo({
        url: '../recordSendOut/recordSendOut?category=' + category,
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 礼物记录 收到的
   */
  goRecordListReceived: function (e) {
    if (this.data.isLogin) {
      var category = e.currentTarget.dataset.index
      wx.navigateTo({
        url: '../recordReceived/recordReceived?category=' + category,
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 礼物记录 参与的
   */
  goRecordListJoin: function (e) {
    if (this.data.isLogin) {
      var category = e.currentTarget.dataset.index
      wx.navigateTo({
        url: '../recordJoin/recordJoin?category=' + category,
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  goCollection: function () {
    if (this.data.isLogin) {
      wx.navigateTo({
        url: '/packageA/pages/collection/collection',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 获取手机号
   */
  getUserPhone: function () {
    wx.request({
      url: config.config.getUserPhone,
      data: {
        token: this.data.token
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.stopPullDownRefresh()
          app.globalData.userPhone = res.data.bean
          this.setData({
            userPhone: res.data.bean
          })
        } else if (res.data.status != 801) {
          app.globalData.userPhone = ''
          this.setData({
            userPhone: ''
          })
        }
      }
    })
  },
  bindPhone: function () {
    if (this.data.isLogin) {
      if (this.data.userPhone != '') {
        var title = '修改绑定的手机号'
        wx.navigateTo({
          url: '/pages/bindPhone/bindPhone?title=' + title,
        })
      } else {
        var title = '绑定手机号'
        wx.navigateTo({
          url: '/pages/bindPhone/bindPhone?title=' + title,
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 获取优惠券数量
   */
  getCouponNumber: function () {
    wx.request({
      url: config.config.getUserCanUserCoupon,
      data: {
        token: this.data.token
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          this.setData({
            couponTotal: res.data.bean
          })
        }
      }
    })
  }
})