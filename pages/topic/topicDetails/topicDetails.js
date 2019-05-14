// pages/topic/topicDetails/topicDetails.js
const app = getApp()
var config = require("../../../utils/config.js")
var agri = require("../../../utils/agriknow.js")
const utils = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgImg: "https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20190416051855780163022.png",
    title: '',
    sId: '',
    token: '',
    name: '',
    bewrite: '',
    beginTime: '',
    productList: {},
    topics: {}, //专题列表
    index: 0,
    listStatus: false,
    background: '', //详情顶部图片
    banner: '', //科普页面图片
    festText: '' //节日科普
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let token = wx.getStorageSync('token')
    that.setData({
      name: options.name,
      bewrite: options.bewrite,
      beginTime: options.beginTime,
      sId: options.id,
      background: options.background,
      banner: options.banner,
      festText: options.festText,
      token: token,
      
    })
    if (options.index!=undefined){
      that.setData({
        index: options.index
      })
    } else{
      that.setData({
        index:0
      })
    }
    console.log(options.index)
    wx.getSystemInfo({
      success: (res) => {
        if (res.model.toLowerCase().indexOf('iphone x') > -1) {
          console.log('xx')
          this.setData({
            iphonex: true
          })
        }
      },
    })
    that.getTopicDetail()
    that.getIndex()
  },
  getIndex: function() {
    let that = this
    let token = that.data.token
    app.agriknow.getIndex(token).then(res => {
      if (res.status == 200) {
        let topicsList = res.bean.specials
        console.log(topicsList.length)
        if (topicsList.length > 0) {
          that.setData({
            topics: topicsList
          })
        }
      } else if (res.status == 801) {
        utils.getUserInfoFun(this.getProductaiData, this)
      } else {
        utils.showTips(res.data.msg)
      }
    })
  },
  // 下一专题
  nextTopic: function() {
    let that = this
    let token = that.data.token
    let topicList = that.data.topics
    console.log(topicList)
    let topLen = topicList.length
    console.log(topicList.length)
    let ind = that.data.index
    let min = parseInt(topLen) - parseInt(ind)
    if (min == 1) {
      that.setData({
        index: 0
      })
      var index = 0
    } else {
      var index = parseInt(ind)+1
      that.setData({
        index:index
      })
    }
    let sId = topicList[index].id
    console.log(sId)
    let name = topicList[index].festivalName
    let bewrite = topicList[index].festivalBrief
    let beginTime = topicList[index].festivalTime
    let festivalText = topicList[index].festivalText
    let festBanner = topicList[index].festivalBanner
    let bg = topicList[index].background
    let times = beginTime.substring(0, 10)
    let nowtimes = times.replace(/-/g, '')
    let y = nowtimes.substring(0, 4)
    let m = nowtimes.substring(4, 6)
    let d = nowtimes.substring(6, 8)
    var createDate = y + '年' + m + '月' + d + '日'
    that.setData({
      name: name,
      bewrite: bewrite,
      beginTime: createDate,
      background: bg,
      festText: festivalText,
      banner: festBanner
    })

    app.agriknow.getTopicList(token, sId).then(res => {
      if (res.status == 200) {
        let product = res.bean
        console.log(product.length)
        if (product.length > 0) {
          that.setData({
            productList: product
          })
        } 
        if (product.length > 4) {
          that.setData({
            listStatus: true
          })
        }

      }
    })


  },
  // 数据初始化
  getTopicDetail: function() {
    let that = this
    let token = that.data.token
    let sId = that.data.sId
    app.agriknow.getTopicList(token, sId).then(res => {
      if (res.status == 200) {
        let product = res.bean
        if (product.length > 0) {
          that.setData({
            productList: product
          })
        }

      } else if (res.status == 801) {
        utils.getUserInfoFun(this.getProductaiData, this)
      } else {
        utils.showTips(res.data.msg)
      }
    })
  },
  // 节目科普
  science: function() {
    let that = this
    let festText = that.data.festText
    let banner = that.data.banner
    let beginTime = that.data.beginTime
    let name = that.data.name
    let id = that.data.sId
    let background = that.data.background
    let bewrite = that.data.bewrite
    wx.navigateTo({
      url: '../science/science?festText=' + festText + '&banner=' + banner + '&beginTime=' + beginTime + '&name=' + name + '&bewrite=' + bewrite + '&id=' + id + '&background=' + background,
    })
  },
  // 商品详情
  productDetail: function(e) {
    let that = this
    console.log(22)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../productDetails/productDetails?id=' + id,
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
    let id = that.data.sId
    console.log(id)
    let background = that.data.background
    let banner = that.data.banner
    let festText = that.data.festText
    let index = that.data.index
    console.log(index)
    return {
      // title: 'TA悄悄为你准备了礼物，快来领取吧！',
      path: '/pages/topic/topicDetails/topicDetails?name=' + name + '&id=' + id + '&background=' + background + '&banner=' + banner + '&festText=' + festText + '&bewrite=' + bewrite + '&beginTime=' + beginTime+'&index='+index,
      // imageUrl: 'https://image.prise.shop/images/2018/05/28/1527499314947054.png',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})