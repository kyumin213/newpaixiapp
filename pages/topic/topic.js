// pages/topic/topic.js
const app = getApp()
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
var agri = require('../../utils/agriknow.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trans: 20,
    autoplay: false,
    interval: 5000,
    duration: 500,
    token: '',
    topics: {},
    name: '',
    bewrite: '',
    beginTime: '',
    imgLoading:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let token = wx.getStorageSync("token") || 'paixi_123'
    that.setData({
      token: token
    })
    // that.getIndex()

  },
  // 专题首页
  getIndex: function() {
    let that = this
    let token = that.data.token
    app.agriknow.getIndex(token).then(res => {
      if (res.status == 200) {
        let topicsList = res.bean.specials
        that.setData({
          topics: topicsList
        })
        let name = topicsList[0].festivalName
        let bewrite = topicsList[0].festivalBrief
        let beginTime = topicsList[0].festivalTime
        let times = beginTime.substring(0, 10)
        let nowtimes = times.replace(/-/g, '')
        let y = nowtimes.substring(0, 4)
        let m = nowtimes.substring(4, 6)
        let d = nowtimes.substring(6, 8)
        var createDate = y + '年' + m + '月' + d + '日'
        // }
        that.setData({
          name: name,
          bewrite: bewrite,
          beginTime: createDate
        })
      } else if (res.status == 801) {
        utils.getUserInfoFun(this.getProductaiData, this)
      } else {
        utils.showTips(res.data.msg)
      }
    })
  },
  // 轮播图改变焦点切换
  swiperChange: function(e) {
    let that = this
    let index = e.detail.current
    // let cur = that.data.cur
    let topicsList = that.data.topics
    let name = topicsList[index].festivalName
    let bewrite = topicsList[index].festivalBrief
    let beginTime = topicsList[index].festivalTime
    // if (!beginTime) {
    //   var createDate = '2019年02月14日'
    // } else {
    let times = beginTime.substring(0, 10)
    let nowtimes = times.replace(/-/g, '')
    let y = nowtimes.substring(0, 4)
    let m = nowtimes.substring(4, 6)
    let d = nowtimes.substring(6, 8)
    var createDate = y + '年' + m + '月' + d + '日'
    // }
    that.setData({
      name: name,
      bewrite: bewrite,
      beginTime: createDate
    })
  },
  /**
   * 获取专题数据
   */
  getData: function() {
    wx.showNavigationBarLoading()
    utils.httpRequestGet(config.config.getIndexNew, {
      token: this.data.token
    }, (res) => {
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
  imgLoadComplete: function() {
    let that = this
    that.setData({
      imgLoading: true
    })
    wx.hideLoading()
  },
  /**
   * 去专题详情
   */
  gotoSpecial: function(e) {
    let that = this
    var index = e.currentTarget.dataset.index
    var id = that.data.topics[index].id
    let name = that.data.name
    let bewrite = that.data.bewrite
    let beginTime = that.data.beginTime
    // var titleArr = that.data.topics[index].name
    // if (titleArr.length > 1) {
    //   var title = titleArr[1]
    // } else {
    //   var title = titleArr[0]
    // }
    var background = that.data.topics[index].background
    let banner = that.data.topics[index].festivalBanner
    let festTest = that.data.topics[index].festivalText
    wx.navigateTo({
      url: 'topicDetails/topicDetails?id=' + id + '&background=' + background + '&beginTime=' + beginTime + '&name=' + name + '&bewrite=' + bewrite + '&banner=' + banner + '&festText=' + festTest + '&index=' + index,
    })
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
    let that = this
    that.getIndex()
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
  onShareAppMessage: function() {

  }
})