// pages/index/Bargain/Bargain.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNull:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 详情
  productDetail:function(){
    wx.navigateTo({
      url: '../bargainProductDetails/bargainProductDetails',
    })
  },
  /**
   * 活动规则
   */
  science:function(){
    wx.navigateTo({
      url: '../shareBargain/shareBargain',
    })
  },
  // 去首页
  toIndx: function () {
    wx.switchTab({
      url: '../index',
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