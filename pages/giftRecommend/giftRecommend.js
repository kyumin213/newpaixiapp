// pages/giftRecommend/giftRecommend.js
const app = getApp()
var agri = require('../../utils/agriknow.js')
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 400,
    collect: false, //收藏
    chooseSize: false, //弹窗
    animationData: {},
    selectCur: 0,
    nums: 1,
    disable: true,
    aidata: "",
    token: '',
    productList: {},
    cur: 0,
    title: '',
    sellingPoint: '',
    basePrice: '',
    check: false,
    speciList: {}, //商品详情规格
    productDetailData: {}, //商品详情
    skuImg: '', //详情弹窗商品图片
    categoryId: '',
    orderId: '',
    sku: '',
    price: '',
    proName: '',
    isNull: true,
    isLogin: false,
    itemList: {} //查询购物车

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let token = wx.getStorageSync('token')
    that.setData({
      token: token
    })
    if (options.aidata != undefined) {
      let aidata = options.aidata
      that.setData({
        aidata: aidata
      })
    }
    that.getProductAidata()

  },
  // 去首页
  toIndx: function() {
    wx.switchTab({
      url: '../index/index',
    })
  },
  // 删除购物车
  deleteCar: function() {
    let that = this
    let token = that.data.token
    let itemList = that.data.itemList
    if (itemList.length>0){
      let id = itemList[0].id
      app.agriknow.postCarDele(token, id).then(res => {
        if (res.status == 200) {
          console.log(res)
        }
      })
    }
  },

  /**
   * 商品列表
   */
  getProductAidata: function() {
    let that = this
    let token = that.data.token
    let aidata = that.data.aidata
    app.agriknow.getproductaidata(aidata, token).then(res => {
      if (res.status == 200) {
        let productList = res.bean.productList
        if (productList.length > 0) {
          that.setData({
            isNull:false
          })
          for (let i = 0; i < productList.length; i++) {
            productList[i].check = false
          }
          that.setData({
            productList: productList
          })
          let cur = that.data.cur
          let title = productList[cur].title
          let point = productList[cur].sellingPoint
          let price = productList[cur].basePrice
          let categoryId = productList[cur].categoryId
          let orderId = productList[cur].relativeId
          that.setData({
            title: title,
            sellingPoint: point,
            basePrice: price,
            categoryId: categoryId,
            orderId: orderId
          })
        } else if (productList.length == 0) {
          that.setData({
            isNull: true
          })
        }
      }


    })
  },
  // 轮播图改变焦点切换
  swiperChange: function(e) {
    let that = this
    let index = e.detail.current
    let cur = that.data.cur
    let productList = that.data.productList
    let title = productList[index].title
    let point = productList[index].sellingPoint
    let price = productList[index].basePrice
    let orderId = productList[index].relativeId
    that.setData({
      cur: index,
      title: title,
      sellingPoint: point,
      basePrice: price,
      orderId: orderId
    })
  },
  /**
   * 商品详情
   */

  commodityDetails: function(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: './commodityDetails/commodityDetails?id=' + id,
    })
  },
  /**
   * 收藏切换
   */
  toogleCollect: function(e) {
    let that = this
    let coll = that.data.collect
    let token = that.data.token
    let index = e.currentTarget.dataset.index
    console.log(index)
    let productId = e.currentTarget.dataset.id
    console.log(productId)
    let list = that.data.productList
    let cur = that.data.cur
    for (let i = 0; i < list.length; i++) {
      if (i == index) {
        console.log(list[i].check)
        if (list[i].check==false) {
          list[i].check = true;
          app.agriknow.postCollection(token, productId).then(res => {
            if (res.status == 200) {
              list[i].check = true;
            }
          })

        } else {
          list[i].check = false;
          app.agriknow.postCollection(token, productId).then(res => {
            if (res.status == 200) {
              list[i].check = false
            }
          })

        }

      }
      //  else {
      //   list[i].check = true;
      // }
    }
    that.setData({
      productList: list
    })
    console.log(that.data.productList)
  },
  // 选ta啦按钮
  selectProduct: function(e) {
    let that = this
    if(that.data.isLogin){
      that.showModel(e)
      that.deleteCar()
      let token = that.data.token
      let cur = that.data.cur
      let list = that.data.productList
      let id = list[cur].relativeId
      app.agriknow.getProductDetail(token, id).then(res => {
        if (res.status == 200) {
          let details = res.bean
          let specList = JSON.parse(details.skuList)
          let skuImg = specList[0].skuImg || details.pictureCover
          for (let i = 0; i < specList.length; i++) {
            specList[i].selected = false
            if (specList.length >= 0) {
              specList[0].selected = true
              that.setData({
                sku: specList[0].sku,
                price: specList[0].price,
                proName: specList[0].major
              })
            }
          }
          that.setData({
            speciList: specList,
            productDetailData: details,
            skuImg: skuImg
          })
        }
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
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
    this.setData({
      skuImg: skuImg,
      speciList: skuList,
      sku: sku,
      price: price,
      proName: proName
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
    let title = that.data.title
    let nums = that.data.nums
    let skuImg = that.data.skuImg
    let categoryId = that.data.categoryId
    let price = that.data.basePrice
    let orderId = that.data.orderId
    console.log(orderId)
    wx.navigateTo({
      url: '../packWell/packWell?title=' + title + '&nums=' + nums + '&skuImg=' + skuImg + '&categoryId=' + categoryId + '&price=' + price + '&orderId=' + orderId,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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

  }
})