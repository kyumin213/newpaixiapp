//获取应用实例
const app = getApp()
var agri = require('../../utils/agriknow.js')
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')

Page({
  data: {
    token: '',
    tabsList: {},
    userPhone:'',
    userInfo: {},
    hasUserInfo: false,
    isLoading: false,
    isLogin:false
  },

  onLoad: function() {
    let that = this
    that.getSharePic('index')
    let token = wx.getStorageSync('token')
    that.setData({
      token: token
    })
    that.getProductaiData()
  },
  onShow: function() {
    let that = this
    wx.getStorage({
      key: 'isLogin',
      success: (res) => {
        that.setData({
          isLogin: res.data,
        })
      },
      fail: (res) => {
        that.setData({
          isLogin: false
        })
      }
    })
    wx.getStorage({
      key: 'token',
      success: (res) => {
        that.setData({
          token: res.data
        })
        if (app.globalData.userPhone) {
          that.setData({
            userPhone: app.globalData.userPhone
          })
        } else {
          that.getUserPhone()
        }
        that.getProductaiData()
      },
      fail: (res) => {
        this.setData({
          accounts: '0.00'
        })
      }
    })
  },
  gotoLogin: function () {
    wx.navigateTo({
      url: '/pages/login/login',
    })
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
  /**
   * 一级标签
   */
  getProductaiData: function() {
    var that = this
    let token = that.data.token
    let parentId = 0
    app.agriknow.getproductaiList(parentId, token).then(res => {
      if(res.status==200){
        that.setData({
          tabsList: res.bean.hierarchyList
        })
      } else if(res.status==801){
        utils.getUserInfoFun(this.getProductaiData, this)
      } else {
        utils.showTips(res.data.msg)
      }
    })
  },
  /**
   * 去到活动页面
   */
  gotoActivity: function() {
    wx.navigateTo({
      url: '/packageA/pages/activityList/activityList',
    })
  },
  // 生日愿望
  birthdayWish: function() {
    let that = this
    // if(that.data.isLogin){
      wx.navigateTo({
        url: 'birthdayWish/birthdayWish',
      })
    // } else{
    //   that.gotoLogin()
    // }
  
  },
  /**
   * 送长辈
   */
  recommend: function(e) {
    let that = this
    let parentId = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    let pid = e.currentTarget.dataset.pid
    let ids = e.currentTarget.dataset.ids
    let token = that.data.token
    app.agriknow.getproductaiList(parentId, token).then(res => {
      if (res.status == 200) {
        let data = res.bean.hierarchyList
        if (data.length > 0) {
          let loadStatus = 0
          wx.navigateTo({
            url: '../chooingsGif/chooingsGif?pid=' + pid + '&id=' + parentId + '&name=' + name + '&loadStatus=' + loadStatus+'&ids='+ids,
          })
        } else if (data.length == 0) {
          let loadStatus = 1
          wx.navigateTo({
            url: '../chooingsGif/chooingsGif?pid=' + pid + '&id=' + parentId + '&name=' + name + '&loadStatus=' + loadStatus,
          })
        }
      }
      // that.setData({
      //   tabsList: res.bean.hierarchyList
      // })
    })

  },
  /**
   * 一元送礼
   */
  bargain:function(){
    wx.navigateTo({
      url: './Bargain/Bargain',
    })
  },
  /**
   * 获取分享小图
   */
  getSharePic: function(configKey) {
    utils.httpRequestGet(config.config.getSharePic, {
      configKey: configKey
    }, (res) => {
      if (res.data.status == 200) {
        this.setData({
          sharePic: res.data.bean.configValue,
          shareText: res.data.bean.description
        })
      }
    })
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: this.data.shareText,
      imageUrl: this.data.sharePic
    }
  },
})