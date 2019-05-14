// pages/topic/productDetails/productDetails.js
const app = getApp()
var agri = require('../../../utils/agriknow.js')
const utils = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 500,
    chooseSize: false, //弹窗
    animationData: {},
    selectCur: 0,
    nums: 1,
    disable: true,
    open: 0,
    collect: false,
    id: '', //订单号
    token: '',
    bannerImgList: {}, //banner图
    productDetailData: {}, //详情数据
    speciList: {}, //规格
    information: {}, //产品信息
    skuImg: '',
    cur: 0, //焦点
    servesList: {}, //服务
    detailsImgList: {}, //详情图片
    sku: '',
    price: '',
    proName: '',
    categoryId: '',
    orderId: '',
    isLogin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let id = options.id
    let token = wx.getStorageSync('token')
    that.setData({
      id: id,
      token: token
    })
    that.getProductDetail()
    that.getGiftCar()
  },
  // 初始化数据
  getProductDetail() {
    let that = this
    let id = that.data.id
    let token = that.data.token
    app.agriknow.getProductDetail(token, id).then(res => {
      if (res.status == 200) {
        let details = res.bean
        let bannerImgList = details.pictureBanner.split(",")
        let detailsImgList = details.details.split(",")
        let information = JSON.parse(details.information)
        let specList = JSON.parse(details.skuList)
        let serves = JSON.parse(details.serves)
        let skuImg = specList[0].skuImg || details.pictureCover
        for (let i = 0; i < specList.length; i++) {
          specList[i].selected = false
          if (specList.length >= 0) {
            specList[0].selected = true
          }
        }
        that.setData({
          speciList: specList,
          productDetailData: details,
          skuImg: skuImg,
          bannerImgList: bannerImgList,
          detailsImgList: detailsImgList,
          information: information,
          servesList: serves
        })
      }
    })
  },
  // 提交添加礼物
  submitAddGift: function() {
    let that = this
    let token = that.data.token
    let productId = that.data.productDetailData.id
    let title = that.data.productDetailData.title
    let basePrice = that.data.productDetailData.basePrice
    let param = JSON.parse(that.data.productDetailData.param)
    let pictureCover = JSON.parse(that.data.productDetailData.pictureCover)
    let num = that.data.nums
    app.agriknow.postAddGift(token, productId, title, basePrice, param, pictureCover, num, sku, isSeaAmoy, beforePrice)
      .then(res => {
        if (res.status == 200) {
          wx.setStorageSync(car, res.bean)
        }
      })
    wx.request({
      url: config.config.postAddGift,
      data: {
        token: this.data.token,
        productId: this.data.id,
        title: this.data.productInfo.title,
        basePrice: this.data.skuPrice,
        param: JSON.stringify(this.data.selectedProp),
        pictureCover: this.data.skuImg,
        num: this.data.buyNumber,
        sku: this.data.sku,
        isSeaAmoy: this.data.productInfo.isSeaAmoy,
        beforePrice: this.data.productInfo.beforePrice
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.reLaunch({
            url: '/pages/gifts/gifts',
          })
        }
      }
    })
  },
  // 焦点
  swiperChange: function(e) {
    let that = this
    let index = e.detail.current
    that.setData({
      cur: index
    })
  },
  // 收藏切换
  toogleCollect: function() {
    let that = this
    let token = that.data.token
    let productId = that.data.id
    let coll = that.data.collect
    if (coll == false) {
      app.agriknow.postCollection(token, productId).then(res => {
        if (res.status == 200) {
          that.setData({
            collect: true
          })
        }
      })
    } else {
      app.agriknow.postCollection(token, productId).then(res => {
        if (res.status == 200) {
          that.setData({
            collect: false
          })
        }
      })
    }
  },
  // 查询购物车
  getGiftCar: function() {
    let that = this
    let token = that.data.token
    let keys = 4
    let isPacking = 0
    app.agriknow.getCarGift(token, isPacking).then(res => {
      if (res.status == 200) {
        if (res.bean.itemList) {
          that.setData({
            itemList: res.bean.itemList
          })
        }
      }
    })
  },

  // 打包礼物
  packGift: function(e) {
    let that = this
      that.hideModal(e)
      that.postAddGift()
      let title = that.data.productDetailData.title
      let nums = that.data.nums
      let skuImg = that.data.skuImg
      let categoryId = that.data.productDetailData.categoryId
      let price = that.data.productDetailData.basePrice
      let orderId = that.data.productDetailData.id
      wx.navigateTo({
        url: '../../packWell/packWell?title=' + title + '&nums=' + nums + '&skuImg=' + skuImg + '&categoryId=' + categoryId + '&price=' + price + '&orderId=' + orderId,
      })

  },
  // 打包add
  postAddGift: function() {
    let that = this
    let proName = that.data.proName
    let price = that.data.price
    let param = {
      proName: proName,
      price: price
    }
    let token = that.data.token
    let productId = that.data.productDetailData.id
    let title = that.data.productDetailData.title
    let basePrice = that.data.productDetailData.basePrice
    // let param = params
    let pictureCover = that.data.productDetailData.pictureCover
    let num = that.data.nums
    let sku = that.data.sku
    let isSeaAmoy = that.data.productDetailData.isSeaAmoy
    let beforePrice = that.data.productDetailData.beforePrice
    app.agriknow.postAddGift(token, productId, title, basePrice, param, pictureCover, num, sku, isSeaAmoy, beforePrice)
      .then(res => {
        if (res.status == 200) {
          console.log(res)
        }
      })

  },
  // 删除购物车
  deleteCar: function() {
    let that = this
    let token = that.data.token
    let itemList = that.data.itemList
    if (itemList.length > 0) {
      let id = itemList[0].id
      app.agriknow.postCarDele(token, id).then(res => {
        if (res.status == 200) {
          console.log(res)
        }
      })
    }
  },
  // 立即支付
  paymentBtn: function() {
    let that = this
    if(that.data.isLogin){
      that.showModel()
      that.deleteCar()
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
    
    
  },
  // 首页
  home: function() {
    wx.switchTab({
      url: '../../index/index',
    })
  },
  // 收藏
  collect: function() {
    let that = this
    let coll = that.data.collect
    if (coll == false) {
      that.setData({
        collect: true
      })
    } else {
      that.setData({
        collect: false
      })
    }
  },
  // 显示弹窗
  showModel: function(e) {
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 300,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(500).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      chooseSize: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  // 隐藏
  hideModal: function(e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(500).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false
      })
    }, 200)
  },
  // 选择规格
  selectSpec: function(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let skuList = that.data.speciList
    let skuImg = skuList[index].skuImg || that.productDetailData.pictureCover
    for (let i in skuList) {
      skuList[i].selected = false
    }
    skuList[index].selected = true
    let sku = skuList[index].sku
    let price = skuList[index].price
    let proName = skuList[index].major
    that.setData({
      speciList: skuList,
      sku: sku,
      price: price,
      proName: proName,
      skuImg: skuImg
    })
  },
  // 添加数量
  addNums: function() {
    let that = this
    let num = that.data.nums
    let newNum = num + 1
    that.setData({
      nums: newNum
    })
    if (num >= 1) {
      that.setData({
        disable: false
      })
    }
  },
  // 减少数量
  downNum: function() {
    let that = this
    let num = that.data.nums
    let newNum = num - 1
    that.setData({
      nums: newNum
    })
    if (num <= 2) {
      that.setData({
        disable: true
      })
    } else {
      that.setData({
        disable: false
      })
    }
  },
  // 礼品包装
  open: function() {
    let that = this
    let status = that.data.open
    if (status == 0) {
      that.setData({
        open: 1
      })
    } else {
      that.setData({
        open: 0
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
    let that = this
    wx.getStorage({
      key: 'isLogin',
      success: (res) => {
        that.setData({
          isLogin: res.data,
        })
      },
      fail: (res) => {
        that.setData({
          isLogin: false
        })

      }
    })
    wx.getStorage({
      key: 'token',
      success: (res) => {
        that.setData({
          token: res.data
        })
        that.getGiftCar()
      },
      fail: (res) => {
  
      }
    })
    
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
    let that = this
    let id = that.data.id
    return {
      // title: 'TA悄悄为你准备了礼物，快来领取吧！',
      path: 'pages/topic/productDetails/productDetails?id=' + id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})