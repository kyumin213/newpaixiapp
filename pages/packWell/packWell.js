// pages/packWell/packWell.js
const app = getApp()
var config = require('../../utils/config.js')
var agri = require('../../utils/agriknow.js')
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sayCon: '',
    sayStatus: true,
    title: '',
    nums: 0,
    skuImg: '',
    categoryId: '',
    price: '99',
    token: '',
    orderId: '',
    open: 0,
    ordersPay: "",
    itemList: {},
    dis: false

  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    let that = this
    let title = options.title
    let nums = options.nums
    let skuImg = options.skuImg
    let categoryId = options.categoryId
    let price = options.price
    let token = wx.getStorageSync('token')
    that.setData({
      title: title,
      nums: nums,
      skuImg: skuImg,
      token: token,
      categoryId: categoryId,
      price: price,
    })
    // that.open()
    that.isPack()
  },
  
  // 修改商品数量
  modifyNumber: function(token, id, num, keys, isPacking) {
    wx.request({
      url: config.config.postModifyGiftNum,
      data: {
        token: token,
        id: id,
        num: num,
        keys: keys,
        isPacking: isPacking
      },
      dataType: 'json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          var ordersPay = res.data.bean.ordersPay
          var itemList = res.data.bean.itemList
          // 检查是否有海淘产品
          var isSeaAmoy = false
          for (var i in itemList) {
            if (itemList[i].isSeaAmoy == 1) {
              isSeaAmoy = true
            }
          }
          this.setData({
            isSeaAmoy: isSeaAmoy
          })
          var itemListsub = itemList.splice(0, 3)
          var total = res.data.bean.number
          this.setData({
            ordersPay: ordersPay,
            total: total,
            rows: res.data.total,
            reduceCoupon: res.data.bean.reduceCoupon,
            reducePrice: res.data.bean.reducePrice,
            productPrice: res.data.bean.productPrice,
            priceSplit: res.data.bean.priceSplit
          })
          if (num == 0) {
            this.setData({
              itemList: itemListsub
            })
            var param = {}
            for (var i in itemListsub) {
              param.propName = JSON.parse(itemListsub[i].productParamText).propName
              this.setData({
                ['itemList[' + i + '].productParamText']: param
              })
            }
          }
          if (res.data.total > 3) {
            this.setData({
              isShowAll: true
            })
          } else {
            this.setData({
              isShowAll: false
            })
          }
        } else if (res.data.status == 801) {
          // this.getUserInfoFun(this.modifyNumber)
          utils.getUserInfoFun(this.modifyNumber, this)
        }
      }
    })
  },
  // 添加数量
  addNums: function(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    this.data.itemList[index].num++
    // let nums = that.data.nums
      that.setData({
        itemList: that.data.itemList
        // nums: nums
      })
    let id = that.data.itemList[index].id
    let num = that.data.itemList[index].num
    let token = that.data.token
    let isPacking = that.data.open
    that.modifyNumber(token, id, num, 4, isPacking)
    // that.isPack()
  },
  // 减少数量
  downNum: function(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let nums = that.data.itemList[index].num
    if (nums > 1) {
      that.data.itemList[index].num--
        that.setData({
          disable: false,
          itemList: that.data.itemList
        })
    } else {
      that.setData({
        disable: true
      })
    }
    // that.setData({
    //   itemList: that.data.itemList
    // })
    let id = that.data.itemList[index].id
    let num = that.data.itemList[index].num
    let token = that.data.token
    let isPacking = that.data.open
    that.modifyNumber(token, id, num, 4, isPacking)
    // that.isPack()
  },
  // 包装开关
  isPack: function() {
    let that = this
    let token = that.data.token
    let keys = 4
    let isPacking = that.data.open
    app.agriknow.getCarGift(token, isPacking).then(res => {
      if (res.status == 200) {
        let ordersPay = res.bean.ordersPay
        that.setData({
          ordersPay: ordersPay,
          nums: res.bean.number,
          itemList: res.bean.itemList
        })
      }
    })
  },
  // 礼品包装
  open: function() {
    let that = this
    let token = that.data.token
    let keys = 4
    let isPack = that.data.open
    if (isPack == 0) {
      that.setData({
        open: 1
      })
    } else {
      that.setData({
        open: 0
      })
    }
    let isPacking = that.data.open
    console.log(isPacking)
    app.agriknow.getCarGift(token,isPacking).then(res => {
      if (res.status == 200) {
        let ordersPay = res.bean.ordersPay
        that.setData({
          ordersPay: ordersPay,
          nums: res.bean.number,
          itemList: res.bean.itemList,
        })
      }
    })
  },
  // 提交订单
  getOrderId: function() {
    let that = this
    let token = that.data.token
    let remarks = that.data.sayCon || '大吉大利，送你好礼！'
    let priceTotal = that.data.ordersPay
    let category = 4
    let idCard = ''
    let formId = ''
    app.agriknow.postOrder(token, remarks, priceTotal, category, idCard, formId).then(res => {
      if (res.status == 200) {
        let orderId = res.bean
        wx.navigateTo({
          url: '../payComplate/payComplate?remarks=' + remarks + '&orderId=' + orderId,
        })
      }
    })
  },
  // 马上支付
  paymentBtn: function() {
    let that = this
    let priceTotal = that.data.ordersPay
    let category = 11
    let token = that.data.token
    let remarks = that.data.sayCon || '大吉大利，送你好礼！'
    let idCard = ''
    let nums = that.data.nums
    let title = that.data.title
    let skuImg = that.data.skuImg
    let orderId = that.data.orderId
    app.agriknow.postPayOrder(token, priceTotal, remarks, category, idCard).then(res => {
      if (res.status == 200) {
        wx.requestPayment({
          'timeStamp': res.bean.timeStamp,
          'nonceStr': res.bean.nonceStr,
          'package': res.bean.package,
          'signType': 'MD5',
          'paySign': res.bean.sign,
          'success': (res) => {
            that.getOrderId()
            that.setData({
              dis: true
            })
            // wx.navigateTo({
            //   url: '../payComplate/payComplate?remarks=' + remarks + '&nums=' + nums + '&title=' + title + '&skuImg=' + skuImg + '&orderId=' + orderId,
            // })
            console.log(res)
            // 支付成功再提交订单信息
            // this.submitGiftOrderAll()
            // this.setData({
            //   canClickSendBtn: true
            // })
          },
          'fail': (res) => {
            this.setData({
              canClickSendBtn: true
            })
          }
        })
      } else if (res.status == 801) {
        utils.getUserInfoFun(this.paymentBtn, this)
      }
      // }
    })
    // wx.navigateTo({
    //   url: '../receiveGift/receiveGift',
    // })
  },

  // 输入完成
  sayStatus: function(e) {
    let that = this
    let cons = e.detail.value
    console.log(cons)
    if (cons.length > 1) {
      that.setData({
        sayCon: cons,
        sayStatus: false
      })
    }
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