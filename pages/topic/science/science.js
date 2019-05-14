// pages/topic/science/science.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: false,
    interval: 5000,
    duration: 500,
    topImg: '',//banner
    festText: '', //科普
    beginTime: '', //时间
    name: '', //节目名称
    background:'',//列表背景
    id:'',
    bewrite:'' //简介
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      topImg: options.banner,
      festText: options.festText,
      beginTime: options.beginTime,
      name: options.name,
      id:options.id,
      background:options.background,
      bewrite:options.bewrite
    })
  },
  // 返回推荐
  back: function() {
    wx.switchTab({
      url: '/pages/topic/topic',
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
    var that = this
    let name = that.data.name
    let bewrite = that.data.bewrite
    let beginTime = that.data.beginTime
    let id = that.data.id
    let background = that.data.background
    let banner = that.data.topImg
    let festText = that.data.festText
    return {
      // title: 'TA悄悄为你准备了礼物，快来领取吧！',
      path: '/pages/topic/topicDetails/topicDetails?name=' + name + '&id=' + id + '&background=' + background + '&banner=' + banner + '&festText=' + festText + '&bewrite=' + bewrite + '&beginTime=' + beginTime,
      // imageUrl: 'https://image.prise.shop/images/2018/05/28/1527499314947054.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})