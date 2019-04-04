// pages/topic/topic.js
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trans: 20,
    autoplay: false,
    interval: 5000,
    duration: 500,
  },

  /**
   * 获取专题数据
   */
  getData: function () {
    wx.showNavigationBarLoading()
    utils.httpRequestGet(config.config.getIndexNew, { token: this.data.token }, (res) => {
      if (res.data.status == 200) {
        var topics = res.data.bean.specials || []
        var sellRecommend = res.data.bean.sellRecommend || null
        var weekend = {}
        var specialsWeekId = ''
        if (res.data.bean.specialsWeek) {
          weekend = res.data.bean.specialsWeek
          specialsWeekId = res.data.bean.specialsWeek.id
        } else {
          this.setData({
            isShowWeek: false
          })
        }
        wx.setStorage({
          key: 'specialsWeekId',
          data: specialsWeekId,
        })
        this.setData({
          topics: topics,
          weekend: weekend,
          sellRecommend: sellRecommend,
        })
        var name = []
        for (var i in topics) {
          name = topics[i].name.split('+')
          this.setData({
            ['topics[' + i + '].name']: name
          })
        }
        wx.hideLoading()
        setTimeout(() => {
          this.setData({
            showIndex: true
          })
        }, 500)
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
      } else {
        utils.showTips(res.data.msg)
      }
    })
  },
  /**
   * 图片加载完成
   */
  imgLoadComplete: function () {
    this.setData({
      imgLoading: true
    })
    wx.hideLoading()
  },
  /**
   * 去专题详情
   */
  gotoSpecial: function (e) {
    var index = e.currentTarget.dataset.index
    var id = this.data.topics[index].id
    var titleArr = this.data.topics[index].name
    if (titleArr.length > 1) {
      var title = titleArr[1]
    } else {
      var title = titleArr[0]
    }
    var specialBanner = this.data.topics[index].pictureBanner
    wx.navigateTo({
      url: '/pages/special/special?id=' + id + '&title=' + title + '&specialBanner=' + specialBanner,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = wx.getStorageSync("token") || 'paixi_123'
    this.setData({
      token: token
    })
    this.getData()
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