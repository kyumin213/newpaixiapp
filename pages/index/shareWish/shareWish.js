// pages/index/shareWish/shareWish.js
const app = getApp()
var agri = require('../../../utils/agriknow.js')
const utils = require('../../../utils/util.js')
var config = require('../../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    conBg: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20190428034158764777067.jpg',
    bg1: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20190428034158764777067.jpg',
    bg2: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20190428034239318901791.jpg',
    bg3: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20190428034258258702048.jpg',
    bg4: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20190429050404608410311.jpg',
    bg5: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20190429050544201601590.jpg',
    bg6: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20190428034348191469990.jpg',
    shareImg: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20190428083206010292527.jpg',
    selected: false,
    themeBg: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20190429042251202851712.jpg',
    currentTab: 1,
    bcol: '#9FB5FA',
    myBir: '',
    created: '',
    token: '',
    nameCol: '#2B7FAD',
    isShowCanvas: false,
    canvasItemList: {},
    bgImg: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20190428034158764777067.jpg',
    winWidth: '',
    winHeight: '',
    w: '',
    h: '',
    userId: '',
    userHead: '',
    userName: '',
    ratio: 0,
    canvasWidth: '',
    canvasHeight: '',
    screenWidth: '',
    wisthList: {}, //愿望清单
    codeImg: '' //二维码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let token = wx.getStorageSync('token')
    that.setData({
      token: token,
      userId: options.userId
    })
    wx.getSystemInfo({
      success: (res) => {
        var i = res.screenWidth / 375;
        that.setData({
          screenWidth: i,
          winWidth: res.windowWidth + 'px',
          winHeight: res.screenHeight + 'px',
          w: res.screenWidth,
          h: res.screenHeight
        });
        // e.globalData.platform = a.platform
        that.setData({
          ratio: 750 / res.screenWidth
        })
      }
    })
    that.getBirthdayWish()
    that.getCodeImg()
    that.getheadImg()
  },
  // 查询生日及愿望清单
  getBirthdayWish: function() {
    let that = this
    let token = that.data.token
    app.agriknow.getBirthdayAndWish(token).then(res => {
      if (res.status == 200) {
        let wisthList = res.bean.birthdayWishList
        let birth = res.bean.userBirthday.birthdays
        let myBir = birth.substring(5, 11)
        let created = res.bean.userBirthday.created
        let itemListCopy = res.bean.birthdayWishList
        // var canvasItemList = itemListCopy.splice(0, 2)
        if (wisthList != '') {
          that.setData({
            wisthList: wisthList,
            myBir: myBir,
            created: created,
            canvasItemList: itemListCopy
          })
        }
      }
    })
  },
  // 获取头像
  getheadImg: function() {
    let that = this
    let token = that.data.token
    let userId = that.data.userId
    app.agriknow.getHeadImg(token, userId).then(res => {
      let pic = res.picture
      that.setData({
        userName: res.nickname,
        userHead: res.picture
      })
      wx.downloadFile({
        url: pic,
        success: res => {
          that.setData({
            userHead: res.tempFilePath
          });
        },
        fail: res => {
          // console.log(res);
        }

      })
      // wx.getImageInfo({
      //   src: pic,
      //   success: (res) => {
      //     console.log(res)
      //     that.setData({
      //       userHead: res.path
      //     })
      //   }
      // })

    })
  },
  // 获取二维码图片
  getCodeImg() {
    let that = this
    let token = that.data.token
    wx.request({
      url: config.config.postwachatCode,
      method: 'POST',
      data: {
        token: token,
        pagename: 'birthdayWish',
        routes: 'pages/index/birthdayWish/birthdayWish'
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.getImageInfo({
            src: res.data.bean,
            success: (res) => {
              that.setData({
                codeImg: res.path
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  // 主题切换
  sitchTab: function(e) {
    let that = this
    let bg = e.target.dataset.theme
    let cur = e.target.dataset.id
    that.setData({
      currentTab: cur,
      conBg: bg
    })
    if (cur == 1) {
      that.setData({
        nameCol: '#2B7FAD',
        bcol: '#9FB5FA',
        themeBg: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20190429042251202851712.jpg'
      })
    }
    if (cur == 2) {
      that.setData({
        nameCol: '#FD6693',
        bcol: '#FD6592',
        themeBg: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20190429042325579870718.jpg'
      })
    }
    if (cur == 3) {
      that.setData({
        nameCol: '#fff',
        bcol: '#000',
        themeBg: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20190429043505064860729.jpg'
      })
    }
    if (cur == 4) {
      that.setData({
        nameCol: '#000',
        bcol: '#4e9dff',
        themeBg: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20190429042051899313754.jpg'
      })
    }
    if (cur == 5) {
      that.setData({
        nameCol: '#FF004E',
        bcol: '#000',
        themeBg: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20190429045257702607422.jpg'
      })
    }
    if (cur == 6) {
      that.setData({
        nameCol: '#EA6248',
        bcol: '#968BB3',
        themeBg: 'https://prise-picture.oss-cn-shenzhen.aliyuncs.com/20190429042423647707591.jpg'
      })
    }
    let bgImgs = that.data.themeBg
    wx.getImageInfo({
      src: bgImgs,
      success: (res) => {
        that.setData({
          bgImg: res.path
        })
      }
    })
  },
  // 保存
  saveImg: function() {
    let that = this
    that.setData({
      isShowCanvas: true
    })
    that.drawShareImg(that.data.bgImg, that.data.codeImg, that.data.userHead)
  },

  // 绘制图片
  drawShareImg: function(bgImg, codeImg, userHead) {
    var that = this
    var x = that.data.w
    var h = that.data.h

    let names = that.data.userName
    var myBir = that.data.myBir
    let ratios = that.data.ratio
    let createTime = that.data.created
    let cur = that.data.currentTab
    var lists = that.data.wisthList
    const ctx = wx.createCanvasContext('shareCanvas')
    ctx.drawImage(bgImg, 0, 0, x, 1.778 * x)
    ctx.save()
    ctx.beginPath()
    ctx.arc(0.248 * x / 2 + 0.376 * x, 0.248 * x / 2 + 0.332 * x, 0.248 * x / 2, 0, Math.PI * 2, false)
    ctx.clip()
    ctx.drawImage(userHead, 0.376 * x, 0.332 * x, 0.248 * x, 0.248 * x)
    ctx.restore()
    ctx.save()
    ctx.drawImage(codeImg, 0.406 * x, 1.536 * x, 0.197 * x, 0.197 * x)
    if (cur == 1) {
      let str = that.data.userName;
      var names1 = str;
      if (str.length > 13) {
        names1 = str.substring(0, 13) + '...'
      } else {
        names1 = str
      }
      ctx.setFontSize(19)
      ctx.setFillStyle('#2B7FAD');
      let txtWidth = ctx.measureText(names1).width
      ctx.fillText(names1, (x - txtWidth) / 2, 0.64 * x)
      let birWid = ctx.measureText(myBir + '是我的生日').width
      let newbir = birWid - (0.128 * x)
      ctx.setFillStyle('#000');
      ctx.setFontSize(14)
      ctx.fillText(myBir + '是我的生日', (x - newbir) / 2, 0.7 * x)
      let lists = that.data.wisthList
      ctx.setFillStyle('#000000');
      ctx.setFontSize(14)
      for (let i = 0; i < lists.length; i++) {
        let txt = lists[i].wishText
        ctx.fillText(i + 1 + '.' + txt, 0.113 * x, 0.82 * x + (i * (0.08 * x)))
      }
    } else if (cur == 2) {
      let str = that.data.userName;
      var names2 = str;
      if (str.length > 13) {
        names2 = str.substring(0, 13) + '...'
      } else {
        names2 = str
      }
      ctx.setFontSize(19)
      ctx.setFillStyle('#FD6693');
      let txtWidth = ctx.measureText(names2).width
      ctx.fillText(names2, (x - txtWidth) / 2, 0.64 * x)
      let bgWid = ctx.measureText(myBir + '是我的生日').width
      console.log(bgWid)
      let newWin = bgWid - (0.101 * x)
      console.log(newWin)
      ctx.setFillStyle('#3F4FA4')
      ctx.setFontSize(14)
      ctx.fillRect((x - newWin) / 2, 0.66 * x, newWin, 0.053 * x)
      let birWid = ctx.measureText(myBir + '是我的生日').width
      let newbir = birWid - (0.128 * x)
      ctx.setFillStyle('#fff');
      ctx.setFontSize(14)
      ctx.fillText(myBir + '是我的生日', (x - birWid) / 2, 0.7 * x)
      let lists = that.data.wisthList
      ctx.setFillStyle('#000000');
      ctx.setFontSize(14)
      for (let i = 0; i < lists.length; i++) {
        let txt = lists[i].wishText
        ctx.fillText(i + 1 + '.' + txt, 0.113 * x, 0.82 * x + (i * (0.08 * x)))
      }
    } else if (cur == 3) {
      console.log(that.data.userName)
      let str = that.data.userName;
      var names3 = str;
      if (str.length > 13) {
        names3 = str.substring(0, 13)+'...'
      }else{
        names3 = str
      }
      let txtWidth = ctx.measureText(names3).width
      ctx.setFillStyle('#000')
      ctx.setFontSize(19)
      ctx.fillRect((x - txtWidth * 2) / 2, 0.6 * x, txtWidth * 2, 0.0586 * x)
      let txtWidths = ctx.measureText(names).width
      ctx.setFontSize(19)
      ctx.setFillStyle('#fff');
      ctx.fillText(names3, (x - txtWidths) / 2, 0.647 * x)
      let birWid = ctx.measureText(myBir + '是我的生日').width
      let newbir = birWid - (0.128 * x)
      ctx.setFontSize(14)
      ctx.setFillStyle('#000');
      ctx.fillText(myBir + '是我的生日', (x - newbir) / 2, 0.7 * x)
      let lists = that.data.wisthList
      ctx.setFillStyle('#000000');
      ctx.setFontSize(14)
      for (let i = 0; i < lists.length; i++) {
        let txt = lists[i].wishText
        ctx.fillText(i + 1 + '.' + txt, 0.113 * x, 0.82 * x + (i * (0.08 * x)))
      }
    } else if (cur == 4) {
      let str = that.data.userName;
      var names4 = str;
      if (str.length > 13) {
        names4 = str.substring(0, 13) + '...'
      } else {
        names4 = str
      }
      ctx.setFontSize(19)
      ctx.setFillStyle('#000');
      let txtWidth = ctx.measureText(names4).width
      ctx.fillText(names4, (x - txtWidth) / 2, 0.64 * x)
      let birWid = ctx.measureText(myBir + '是我的生日').width
      let newbir = birWid - (0.128 * x)
      ctx.setFillStyle('#000');
      ctx.setFontSize(14)
      ctx.fillText(myBir + '是我的生日', (x - newbir) / 2, 0.7 * x)
      let lists = that.data.wisthList
      ctx.setFillStyle('#000000');
      ctx.setFontSize(14)
      for (let i = 0; i < lists.length; i++) {
        let txt = lists[i].wishText
        ctx.fillText(i + 1 + '.' + txt, 0.113 * x, 0.82 * x + (i * (0.08 * x)))
      }
    } else if (cur == 5) {
      let str = that.data.userName;
      var names5 = str;
      if (str.length > 13) {
        names5 = str.substring(0, 13) + '...'
      } else {
        names5 = str
      }
      ctx.setFontSize(19)
      ctx.setFillStyle('#FF004E');
      let txtWidth = ctx.measureText(names5).width
      ctx.fillText(names5, (x - txtWidth) / 2, 0.64 * x)
      ctx.setFontSize(14)
      ctx.setFillStyle('#ffffff');
      let birWid = ctx.measureText(myBir + '是我的生日').width
      ctx.fillText(myBir + '是我的生日', (x - birWid) / 2, 0.7 * x)
      let lists = that.data.wisthList
      for (let i = 0; i < lists.length; i++) {
        let txt = lists[i].wishText
        ctx.fillText(i + 1 + '.' + txt, 0.113 * x, 0.82 * x + (i * (0.08 * x)))
      }
    } else if (cur == 6) {
      let str = that.data.userName;
      var names6 = str;
      if (str.length > 13) {
        names6 = str.substring(0, 13) + '...'
      } else {
        names6 = str
      }
      ctx.setFontSize(19)
      ctx.setFillStyle('#EA6248');
      let txtWidth = ctx.measureText(names6).width
      ctx.fillText(names6, (x - txtWidth) / 2, 0.64 * x)
      let birWid = ctx.measureText(myBir + '是我的生日').width;
      let newbir = birWid - (0.128 * x)
      ctx.setFillStyle('#000');
      ctx.setFontSize(14);
      ctx.fillText(myBir + '是我的生日', (x - newbir) / 2, 0.7 * x)

      ctx.setFillStyle('#000000');
      ctx.setFontSize(14)
      for (let i = 0; i < lists.length; i++) {
        let txt = lists[i].wishText
        ctx.fillText(i + 1 + '.' + txt, 0.113 * x, 0.82 * x + (i * (0.08 * x)))
      }
    }
    ctx.setFontSize(10)
    ctx.setFillStyle('#888888');
    ctx.fillText('创建于' + createTime, 0.113 * x, 1.41 * x)
    ctx.draw()
    wx.showLoading({
      title: '正在生成图片',
    })
    setTimeout(() => {
      wx.canvasToTempFilePath({
        width: that.data.w,
        height: 2.1 * that.data.w,
        canvasId: 'shareCanvas',
        success: (res) => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: (res) => {
              wx.hideLoading()
              that.setData({
                isShowCanvas: false
              })
              wx.showToast({
                title: '保存图片成功',
              })
            },
            fail: (res) => {
              wx.showToast({
                title: '保存图片失败',
                icon: 'none'
              })
              that.setData({
                isShowCanvas: false
              })
              // 拒绝授权 二次授权
              wx.getSetting({
                success(res) {
                  if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                      scope: 'scope.writePhotosAlbum',
                      success() {
                        console.log('success')
                      },
                      fail() {
                        utils.showModelStr('友情提示', '您点击了拒绝授权，将无法保存图片，点击确定重新获取授权', '确定', '取消', (res) => {
                          if (res.confirm) {
                            wx.openSetting({
                              success: (res) => {
                                console.log(res)
                                if (res.authSetting["scope.writePhotosAlbum"]) {
                                  // this.addAddress()
                                }
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                }
              })
            }
          })
        },
        fail: (res) => {
          wx.showToast({
            title: '保存图片失败',
            icon: 'none'
          })
        }
      })
    }, 3000)
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
    // let themeBg = that.data.themeBg
    let themeBg = that.data.themeBg
    let pic = that.data.userHead
    wx.getImageInfo({
      src: themeBg,
      success: (res) => {
        that.setData({
          bgImg: res.path
        })
      }
    })
    // wx.downloadFile({
    //   url: pic,
    //   success: res => {
    //     console.log(res)
    //     that.setData({
    //       userHead: res.tempFilePath
    //     });
    //   },
    //   fail: res => {
    //     console.log(res);
    //   }

    // })
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