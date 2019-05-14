// pages/index/helpDetails/helpDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseSize: false, //规则弹窗
    bargainSuccess: true, //砍价弹窗
    bargainStatus: false, //砍价状态
    animationData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  // 规则弹窗
  showModel: function(e) {
    let that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 300,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 执行第一个动画
    animation.opacity(0).rotateX(-100).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      chooseSize: true
    })
    // 设置setTimeout来改变透明度，实现有感觉的滑动
    setTimeout(function() {
      animation.opacity(1).rotateX(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  // 规则隐藏
  hideModal: function(e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.opacity(0).rotateX(-100).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function() {
      animation.opacity(1).rotateX(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false
      })
    }, 200)
  },
  // 砍价弹窗显示
  barshowModel: function(e) {
    let that = this;
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.opacity(0).rotateX(-100).step()
    that.setData({
      animationData: animation.export(),
      bargainSuccess: true
    })
    setTimeout(function() {
      animation.opacity(1).rotateX(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  // 砍价隐藏
  barhideModal: function(e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.opacity(0).rotateX(-100).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function() {
      animation.opacity(1).rotateX(0).step()
      that.setData({
        animationData: animation.export(),
        bargainSuccess: false
      })
    }, 200)
  },
  // 前往钱包
  wallet:function(){
    wx.navigateTo({
      url: '/pages/wallet/wallet',
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

  }
})