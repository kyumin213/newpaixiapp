// pages/index/birthdayWish/birthdayWish.js
//获取应用实例
const app = getApp()
var agri = require('../../../utils/agriknow.js')
const utils = require('../../../utils/util.js')
var config = require('../../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '请选择生日哦',
    disabled: true,
    token: '',
    today: '',
    nowTime: '', //创建时间
    wishData: '',
    bgBtn: '#ddd',
    chooseSize: false, //填写弹窗
    animationData: {},
    wishCon: true, //愿望为空,
    birthday: '', //接口生日参数
    wishText: {},
    birthdayId: '',
    myBir: '',
    userId: '',
    wishTxt: '',
    id: '', //清单id
    isLogin: false,
    userPhone: '',
    addStatus: true, //添加修改完成按钮状态
    createTime: '' //创建时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let token = wx.getStorageSync('token')
    let date = new Date()
    let y = date.getFullYear()
    let m = date.getMonth()
    let d = date.getDate()
    let today = y + '-' + m + '-' + d
    that.setData({
      token: token,
      today: today
    })
    // that.getBirthday()
    // that.getBirthdayWish()
  },
  // 编辑愿望
  editItem: function(e) {
    let that = this
    that.showModel(e)
    let index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.id
    let wishList = that.data.wishText
    let txt = wishList[index].wishText
    that.setData({
      wishTxt: txt,
      id: id,
      addStatus: false
    })
  },
  // 查询生日
  getBirthday: function() {
    let that = this
    let token = that.data.token
    console.log(that.data.isLogin)
    if (that.data.isLogin) {
      app.agriknow.getBirthday(token).then(res => {
        if (res.status == 200) {
          let times = res.bean.created
          let create = times.substring(0, 10)
          let nowtimes = create.replace(/-/g, '')
          let y = nowtimes.substring(0, 4)
          let m = nowtimes.substring(4, 6)
          let d = nowtimes.substring(6, 8)
          let createDate = y + '年' + m + '月' + d + '日'
          that.setData({
            date: res.bean.birthdays,
            birthdayId: res.bean.id,
            createTime: createDate,
            disabled: false,
            bgBtn: '#FD6592'
          })
        } else if (res.status == 403) {
          that.setData({
            date: '请选择生日哦'
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  // 选择生日
  bindDateChange(e) {
    let that = this
    let dates = e.detail.value
    let birthdayTime = that.data.date
    let token = that.data.token
    let birthday = that.data.birthdayId
    let times = dates.replace(/-/g, '')
    let y = times.substring(0, 4)
    let m = times.substring(4, 6)
    let d = times.substring(6, 8)
    let birdate = y + '年' + m + '月' + d + '日'
    let myBir = m + '月' + d + '日'
    let birthdays = y + '-' + m + '-' + d
    console.log(birthdayTime)
    if (birthdayTime == '请选择生日哦') {
      app.agriknow.addBirthday(token, birthdays).then(res => {
        if (res.status == 200) {
          that.setData({
            date: birdate,
            disabled: false,
            bgBtn: '#FD6592',
            myBir: myBir
          })
        }
      })
    } else {
      app.agriknow.updateBirthday(token, birthdays).then(res => {
        if (res.status == 200) {
          that.setData({
            date: birdate,
            myBir: myBir
          })
        }
      })
    }
  },
  // 修改生日
  updateBirthday: function() {
    let that = this
    let token = that.data.token
    let birthday = that.data.birthdayId
    app.agriknow.updateBirthday(token, birthday).then(res => {

    })

  },
  // 查询生日及愿望清单
  getBirthdayWish: function() {
    let that = this
    let token = that.data.token
    if (that.data.isLogin) {
      app.agriknow.getBirthdayAndWish(token).then(res => {
        if (res.status == 200) {
          let wisthList = res.bean.birthdayWishList
          let birthday = res.bean.userBirthday
          let userId = res.bean.userBirthday.userId
          if (wisthList.length > 0) {
            that.setData({
              wishText: wisthList,
              wishCon: false,
              userId: userId
            })
          } else if (wisthList.length == 0) {
            that.setData({
              wishCon: true
            })
          }
          if (birthday == '') {
            that.setData({
              date: '请选择生日哦'
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  // 清空愿望
  deleteBirthdayWish: function() {
    let that = this
    let token = that.data.token
    let BirthdayId = that.data.birthdayId
    wx.showModal({
      title: '温馨提示',
      content: '是否清空愿望',
      success(res) {
        if (res.confirm) {
          app.agriknow.deleteBirthdayWish(token, BirthdayId).then(res => {
            if (res.status == 200) {
              that.setData({
                wishCon: true,
                wishText: {}
              })
            }
          })
        } else if (res.cancel) {}
      }
    })


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
  // 编辑生日愿望
  editWish: function() {
    let that = this
    that.showModel()
    that.setData({
      chooseSize: true
    })
  },
  // 清单编辑框内容
  birWish: function(e) {
    let that = this
    let wishTxt = e.detail.value
    let wishNum = wishTxt.length
    that.setData({
      wishData: wishTxt
    })
  },
  // 完成添加愿望清单
  completeBir: function() {
    let that = this
    that.hideModal()
    let token = that.data.token
    let wishText = that.data.wishData
    app.agriknow.addBirthdayWish(token, wishText).then(res => {
      if (res.status == 200) {
        that.getBirthdayWish()
        that.getBirthday()
      }

    }).catch(res => {
      console.log(res)
    })

  },
  // 修改完成愿望清单
  updatecompleteBir: function() {
    let that = this
    that.hideModal()
    let token = that.data.token
    let wishText = that.data.wishData
    let id = that.data.id
    app.agriknow.updateBirthdayWish(token, id, wishText).then(res => {
      if (res.status == 200) {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 300
        })
        that.getBirthdayWish()
        // that.getBirthday()
      }

    }).catch(res => {
      console.log(res)
    })

  },
  // 分享愿望
  shareWish: function() {
    let that = this
    let userId = that.data.userId
    wx.navigateTo({
      url: '../shareWish/shareWish?userId=' + userId,
    })
  },
  /**
   * 获取手机号
   */
  getUserPhone: function() {
    wx.request({
      url: config.config.getUserPhone,
      data: {
        token: this.data.token
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.stopPullDownRefresh()
          app.globalData.userPhone = res.data.bean
          this.setData({
            userPhone: res.data.bean
          })
        } else if (res.data.status != 801) {
          app.globalData.userPhone = ''
          this.setData({
            userPhone: ''
          })
        }
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
    let that = this
    wx.getStorage({
      key: 'isLogin',
      success: (res) => {
        console.log(res)
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
        console.log(res)
        that.setData({
          token: res.data
        })
        if (app.globalData.userPhone) {
          that.setData({
            userPhone: app.globalData.userPhone
          })
        } else {
          that.getUserPhone()
        }
        that.getBirthday()
        that.getBirthdayWish()
      },
      fail: (res) => {
        console.log(res)
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
    })
    // if (that.data.isLogin) {
    //   that.getBirthday()
    //   that.getBirthdayWish()
    // } else {
    //   wx.navigateTo({
    //     url: '/pages/login/login',
    //   })
    // }

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