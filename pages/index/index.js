//获取应用实例
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
Page({
  data: {
    
  },
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },
  
  onShow: function () {
    
  },
  onLoad: function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#F72F2B',
    })
    this.getSharePic('index')
  },
  /**
   * 去到活动页面
   */
  gotoActivity: function () {
    wx.navigateTo({
      url: '/packageA/pages/activityList/activityList',
    })
  },
  /**
   * 获取分享小图
   */
  getSharePic: function (configKey) {
    utils.httpRequestGet(config.config.getSharePic, { configKey: configKey }, (res) => {
      if (res.data.status == 200) {
        this.setData({
          sharePic: res.data.bean.configValue,
          shareText: res.data.bean.description
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.shareText,
      imageUrl: this.data.sharePic
    }
  },
})
