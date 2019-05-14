// pages/me/bargainStatus/bargainStatus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    winHeight: '',
    allList:{},
    completedList:{},
    progressList:{},
    hasEndedList:{},
    allItem:false, //全部
    completed:false, //已完成
    progress:false, //进行中
    hasEnded:false //已结束
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        that.setData({
          winHeight: clientHeight
        });
      }
    })
  },
  // 状态切换
  coachTab: function (e) {
    var that = this
    let cur = e.currentTarget.dataset.current
    if (that.data.currentTab == cur) {
      return false;
    } else {
      that.setData({
        currentTab: cur
      })
    }
  },
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
  },
  // 砍价详情页
  bargainDetails:function(){
    wx.navigateTo({
      url: '/pages/index/BargainDetails/BargainDetails',
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