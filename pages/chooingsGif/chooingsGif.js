// pages/chooingsGif/chooingsGif.js
const app = getApp()
var agri = require('../../utils/agriknow.js')
const utils = require('../../utils/util.js')
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    parentId: '',
    token: '',
    tabsList: {}, //问题列表
    problem: '',
    aidata: "",
    titleNumber: '',
    loadStatus: 1,
    ids: 0,
    totalNum: 6 //总题数

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let id = options.id
    let pid = options.pid
    if (options.ids != undefined) {
      that.setData({
        ids: options.ids
      })
    }
    if (options.ids == 3 || options.ids == 4) {
      that.setData({
        totalNum: 5
      })
    }
    let name = options.name
    let aidatas = id + '-' + name + '-' + pid + ','
    let token = wx.getStorageSync('token')
    if (options.loadStatus != undefined) {
      that.setData({
        loadStatus: options.loadStatus
      })
    } else {
      that.setData({
        loadStatus: 0
      })
    }
    if (options.aidata != undefined) {
      var aidata = options.aidata
      that.setData({
        aidata: aidata
      })

    } else {
      that.setData({
        aidata: aidatas
      })
    }
    that.setData({
      parentId: id,
      token: token
    })
    that.getProductaiData()
  },
  // 获取子级标签
  getProductaiData: function() {
    var that = this
    let token = that.data.token
    let parentId = that.data.parentId
    let aidata = that.data.aidata
    let aidatas = aidata.substring(0, aidata.length - 1);
    app.agriknow.getproductaiList(parentId, token).then(res => {
      let data = res.bean.hierarchyList
      if (data.length > 1) {
        that.setData({
          tabsList: res.bean.hierarchyList,
          problem: res.bean.problem.title,
          titleNumber: res.bean.problem.titleNumber
        })
      } else if (data.length == 0 && that.data.loadStatus == 0) {
        setTimeout(function() {
          wx.redirectTo({
            url: '/pages/chooingsGif/screeningGifts/screeningGifts?aidata=' + aidatas,
          })
        }, 100)
      }
    })
  },
  /**
   * 选择答案
   */
  selectTab: function(e) {
    let that = this
    // let titleNum = that.data.titleNumber
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    let pid = e.currentTarget.dataset.pid
    let parentId = that.data.parentId
    let ids = that.data.ids
    let newData = id + '-' + name + '-' + pid + ','
    let oldata = that.data.aidata
    var aidata = oldata + newData
    let aidatas = aidata.substring(0, aidata.length - 1)
    let token = that.data.token
    that.setData({
      currentTab: e.currentTarget.dataset.id
    })
    app.agriknow.getproductaiList(pid, token).then(res => {
      if (res.status == 200) {
        let data = res.bean.hierarchyList
        let nums = res.bean.problem.titleNumber
        let totalNum = that.data.totalNum
        if (totalNum == nums) {
          setTimeout(function() {
            wx.redirectTo({
              url: '/pages/chooingsGif/screeningGifts/screeningGifts?aidata=' + aidatas,
            })
          }, 0)
        } else {
          setTimeout(function() {
            wx.redirectTo({
              url: '../chooingsGif/chooingsGif?id=' + id + '&aidata=' + aidata + '&parentId=' + pid + '&ids=' + ids,
            })
          }, 0)
        }

        // if (data.length > 0) {
        //   setTimeout(function() {
        //     wx.navigateTo({
        //       url: '../chooingsGif/chooingsGif?id=' + id + '&aidata=' + aidata + '&parentId=' + pid+'&ids='+ids,
        //     })
        //   }, 0)
        // } else if (data.length == 0) {
        //   setTimeout(function() {
        //     wx.navigateTo({
        //       url: '/pages/chooingsGif/screeningGifts/screeningGifts?aidata=' + aidatas,
        //     })
        //   }, 0)
        // }
      }
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