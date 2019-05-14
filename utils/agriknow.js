import request from './request.js'
class agriknow {
  constructor() {
    // this._baseUrl = 'https://api.prise.shop' //正式地址
    this._baseUrl = 'https://testapi.prise.shop' //测试地址
    this._defaultHeader = {
      // 'content-type': 'application/json'
      'content-type': 'application/x-www-form-urlencoded'
    }
    this._request = new request
    this._request.setErrorHandler(this.errorHander)
  }

  /**
   * 统一的异常处理方法
   */
  errorHander(res) {
    console.error(res)
  }
  // 首页获取banner图
  getIndeBanner(token){
    let data = {
      token:token
    }
    return this._request.getRequest(this._baseUrl + '/index/banner', data).then(res => res.data)
  }
  // 获取头像
  getHeadImg(token, userId) {
    let data = {
      token: token,
      userId: userId
    }
    return this._request.getRequest(this._baseUrl + '/user/inside/prise/get/user', data).then(res => res.data)
  }
  //  发现专题详情
  getTopicList(token, sId) {
    let data = {
      token: token,
      sId: sId
    }
    return this._request.getRequest(this._baseUrl + '/product/get/special/available/id/group', data).then(res => res.data)
  }
  // 专题首页
  getIndex(token) {
    let data = {
      token: token
    }
    return this._request.getRequest(this._baseUrl + '/major/index/one', data).then(res => res.data)
  }
  //  首页一级标签
  getproductaiList(parentId, token) {
    let data = {
      parentId: parentId,
      token: token
    }
    return this._request.getRequest(this._baseUrl + '/product/productaidata/get/id', data).then(res => res.data)
  }
  //  获取精选商品
  getproductaidata(aidata, token) {
    let data = {
      aidata: aidata,
      token: token
    }
    return this._request.getRequest(this._baseUrl + '/product/productaidata/get/product/aidata', data).then(res => res.data)
  }
  // 查询生日
  getBirthday(token) {
    let data = {
      token: token
    }
    return this._request.getRequest(this._baseUrl + '/user/birthday/get', data).then(res => res.data)
  }
  //  添加生日
  addBirthday(token, birthday) {
    let data = {
      token: token,
      birthday: birthday
    }
    return this._request.postRequest(this._baseUrl + '/user/birthday/add', data).then(res => res.data)
  }
  //  修改生日
  updateBirthday(token, birthday) {
    let data = {
      token: token,
      birthday: birthday
    }
    return this._request.postRequest(this._baseUrl + '/user/birthday/update', data).then(res => res.data)
  }
  // 添加愿望清单
  addBirthdayWish(token, wishText) {
    let data = {
      token: token,
      wishText: wishText
    }
    return this._request.postRequest(this._baseUrl + '/user/birthday/add/wish', data).then(res => res.data)
  }
  // 修改愿望清单
  updateBirthdayWish(token,id, wishText) {
    let data = {
      token: token,
      id:id,
      wishText: wishText
    }
    return this._request.postRequest(this._baseUrl + '/user/birthday/update/wish', data).then(res => res.data)
  }
  // 查询生日及愿望清单
  getBirthdayAndWish(token) {
    let data = {
      token: token
    }
    return this._request.getRequest(this._baseUrl + '/user/birthday/get/wish', data).then(res => res.data)
  }
  // 清空生日清单
  deleteBirthdayWish(token, BirthdayId) {
    let data = {
      token: token,
      BirthdayId: BirthdayId
    }
    return this._request.postRequest(this._baseUrl + '/user/birthday/delete/wish', data).then(res => res.data)
  }

  // 商品详情规格
  getProductDetail(token, id) {
    let data = {
      token: token,
      id: id
    }
    return this._request.getRequest(this._baseUrl + '/product/get/available/id', data).then(res => res.data)
  }
  // 支付订单
  postPayOrder(token, priceTotal, remarks, category, idCard) {
    let data = {
      token: token,
      priceTotal: priceTotal,
      remarks: remarks,
      category: category,
      idCard: idCard
    }
    return this._request.postRequest(this._baseUrl + '/orders/gift/pay', data).then(res => res.data)
  }
  // 提交订单
  postOrder(token, remarks, priceTotal, category, idCard, formId) {
    let data = {
      token: token,
      remarks: remarks,
      priceTotal: priceTotal,
      category: category,
      idCard: idCard,
      formId: formId
    }
    return this._request.postRequest(this._baseUrl + '/orders/gift/submit', data).then(res => res.data)
  }
  // 记录分享次数
  postShareNumber(ordersId) {
    let data = {
      ordersId: ordersId
    }
    return this._request.postRequest(this._baseUrl + '/orders/gift/share/num', data).then(res => res.data)
  }
  // 获取订单详情
  getGiftCardDetails(token, ordersId) {
    let data = {
      token: token,
      ordersId: ordersId
    }
    return this._request.getRequest(this._baseUrl + '/orders/gift/get/details/id', data).then(res => res.data)
  }
  // 获取二维码图片
  postCodeImg(token, pagename, routes) {
    let data = {
      token: token,
      pagename: pagename,
      routes: routes
    }
    return this._request.postRequest(this._baseUrl + '/user/wechat/get/wachat/code/unlimit', data).then(res => res.data)
  }
  // 送给好友add
  postAddGift(token, productId, title, basePrice, param, pictureCover, num, sku, isSeaAmoy, beforePrice) {
    let data = {
      token: token,
      productId: productId,
      title: title,
      basePrice: basePrice,
      param: JSON.stringify(param),
      pictureCover: pictureCover,
      num: num,
      sku: sku,
      isSeaAmoy: isSeaAmoy,
      beforePrice: beforePrice
    }
    return this._request.postRequest(this._baseUrl + '/cart/gift/add', data).then(res => res.data)
  }
  // 收藏
  postCollection(token, productId) {
    let data = {
      token: token,
      productId: productId
    }
    return this._request.postRequest(this._baseUrl + '/collection/add', data).then(res => res.data)
  }
  // 判断是否收藏
  postIsCollect(token, productId) {
    let data = {
      token: token,
      productId: productId
    }
    return this._request.postRequest(this._baseUrl + '/collection/is/collection', data).then(res => res.data)
  }
  // 取消收藏
  postCancelCollect(token, id) {
    let data = {
      token: token,
      id: id
    }
    return this._request.postRequest(this._baseUrl + '/collection/remove', data).then(res => res.data)
  }
  // 查看购物车
  getCarGift(token, isPacking) {
    let data = {
      token: token,
      isPacking: isPacking.toString()
    }
    return this._request.getRequest(this._baseUrl + '/cart/gift/get', data).then(res => res.data)
  }
  // 删除购物车
  postCarDele(token, id) {
    let data = {
      token: token,
      id: id
    }
    return this._request.postRequest(this._baseUrl + '/cart/gift/remove', data).then(res => res.data)
  }
  // 修改商品数量
  postGiftNum(token, id, num, keys) {
    let data = {
      token: token,
      id: id,
      num: num,
      keys: keys
    }
    return this._request.postRequest(this._baseUrl + '/cart/gift/modify/num', data).then(res => res.data)
  }
}
export default agriknow