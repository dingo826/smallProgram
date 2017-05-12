const config = require('./config'),
	  openIdUrl = config.openIdUrl,
	  sendVerifyUrl = config.sendVerifyUrl,
	  IsRegisterUrl = config.IsRegisterUrl,
	  getTagListUrl = config.getTagListUrl,
	  getImpressionListUrl = config.getImpressionListUrl,
	  myTagListUrl = config.myTagListUrl,
	  deleteMyTagMyUrl = config.deleteMyTagMyUrl,
	  addMyTagUrl = config.addMyTagUrl,
	  getFriendListUrl = config.getFriendListUrl,
	  updateFriendDetailUrl = config.updateFriendDetailUrl,
	  saveFriendImpressUrl = config.saveFriendImpressUrl,
	  regUrl = config.regUrl,
	  payCodeSaveUrl = config.payCodeUrl,
	  uploadFileUrl = config.uploadFileUrl,
	  verifyUrl = config.verifyUrl,
	  verifyInviteCodeUrl = config.verifyInviteCodeUrl,
	  getInviteFriendsUrl = config.getInviteFriendsUrl,
	  getFriendDetailUrl = config.getFriendDetailUrl,
	  deleteFriendDetailUrl = config.deleteFriendDetailUrl,
	  getTribeListUrl = config.getTribeListUrl


App({
	onLaunch: function () {	
	},
	onLoad: function(){

	},
	onShow: function () {
		console.log('App Show')

		this.getUserOpenId(function(openid, that){
			
			if (that.globalData.hasLogin === false) {
				wx.login({
					success: function(){
						wx.getUserInfo({
							success: function (res) {
								console.log(res)
								var userInfo = res.userInfo,
									param = {
										nickname: userInfo.nickName,
										headImgUrl: userInfo.avatarUrl,
										sex: userInfo.gender, //性别 0：未知、1：男、2：女
										province: userInfo.province,
										city: userInfo.city,
										country: userInfo.country
									};

								that.getIsRegister(openid, param, function(data){
									that.globalData.userinfo = data.result;
									that.globalData.hasUserInfo = true;
									that.globalData.isRegister = data.isRegister;
									that.globalData.sessionId = data.sessionId;
								});

								
							}
						})
					}
				})
			}
		}, this);
		
	},
	onHide: function () {
		console.log('App Hide')
	},
	globalData: {
		hasLogin: false,
		userinfo: null,
		openid: null,
		sessionId: null,
		isRegister: false
	},
	// lazy loading openid
	getUserOpenId: function(callback, that) {
		var self = this;
		if (self.globalData.openid) {
			callback(self.globalData.openid, that)
		} else {
		  	wx.login({
				success: function(res) {
				console.log(res)					
					if (res.code) {
						wx.request({
							url: openIdUrl + res.code,
							success: function(res){
								console.log('拉取openid成功', res)
								console.log(res.data.openid)
								self.globalData.openid = res.data.openid
								callback(self.globalData.openid, that)
							}
						});
					 
					} else {
						console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
						callback(res)
					}
				},
				fail: function(err) {
					console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
					callback(err)
				}
		  	})
		}
	},
	// 判断是否注册
	getIsRegister: function(openid, param, callback){
		wx.request({
			url: IsRegisterUrl + openid,
			header: {
	      		Cookie:'JSESSIONID=' + this.globalData.sessionId
	      	},
			data: param,
			success: function(res){
				callback&&callback(res.data);
			}
		});
	},
	// 发送二维码
	sendVerifyCodeAjax: function(callback, phoneNumber){
		wx.request({
			url: sendVerifyUrl +'?phoneNumber=' + phoneNumber,
			header: {
	      		Cookie:'JSESSIONID=' + this.globalData.sessionId
	      	},
			success: function(res){
				console.log(res)
			}
		})
	},
	// 获取tag列表
	getListTagAjax: function(callback, that){
		wx.request({
			url: getTagListUrl,
			header: {
	      		Cookie:'JSESSIONID=' + this.globalData.sessionId
	      	},
			success: function(res){
				callback&&callback(res.data, that)
			}
		})
	},
	// 获取我的标签列表接口
	getMyTagListAjax: function(callback, that, param){
		wx.request({
			url: myTagListUrl,
			header: {
	      		Cookie:'JSESSIONID=' + this.globalData.sessionId
	      	},
			data: param,
			success: function(res){
				callback&&callback(res.data, that)
			}
		})
	},
	// 获取我的标签列表接口
	deleteMyTagAjax: function(callback, that, param){
		wx.request({
			url: deleteMyTagMyUrl,
			header: {
	      		Cookie:'JSESSIONID=' + this.globalData.sessionId
	      	},
			data: param,
			success: function(res){
				callback&&callback(res.data, that)
			}
		})
	},
	// 添加我的标签接口
	addMyTagAjax: function(callback, that, param){
		wx.request({
			url: addMyTagUrl,
			header: {
	      		Cookie:'JSESSIONID=' + this.globalData.sessionId
	      	},
			data: param,
			success: function(res){
				callback&&callback(res.data, that)
			}
		})
	},
	// 给好友贴标签接口
	saveFriendImpressAjax: function(callback, that, param){
		wx.request({
			url: saveFriendImpressUrl,
			header: {
	      		Cookie:'JSESSIONID=' + this.globalData.sessionId
	      	},
			data: param,
			success: function(res){
				callback&&callback(res.data, that)
			}
		})
	},
	
	getInviteFriendsAjax: function(callback, that,){
		wx.request({
			url: getInviteFriendsUrl,
			header: {
	      		Cookie:'JSESSIONID=' + this.globalData.sessionId
	      	},
			success: function(res){
				callback&&callback(res.data.result, that)
			}
		})
	},

	updateFriendDetailAjax: function(callback, that, params){
		wx.request({
			url: updateFriendDetailUrl,
			data: params,
			header: {
	      		Cookie:'JSESSIONID=' + this.globalData.sessionId
	      	},
			success: function(res){
				callback&&callback(res, that)
			}
		})
	},

	
	// 获取好友印象列表接口
	getImpressionListAjax: function(callback, that){
		wx.request({
			url: getImpressionListUrl,
			header: {
	      		Cookie:'JSESSIONID=' + this.globalData.sessionId
	      	},
			success: function(res){
				callback&&callback(res.data, that)
			}
		})
	},
	// 获取我的好友列表接口
	getFriendListAjax: function(callback, that, param){
		wx.request({
			url: getFriendListUrl,
			header: {
	      		Cookie:'JSESSIONID=' + this.globalData.sessionId
	      	},
			data: param,
			success: function(res){
				callback&&callback(res.data, that)
			}
		})
	},
	// 获取我的好友详情表接口
	getFriendDetailAjax: function(callback, that, param){
		wx.request({
			url: getFriendDetailUrl,
			header: {
	      		Cookie:'JSESSIONID=' + this.globalData.sessionId
	      	},
			data: param,
			success: function(res){
				callback&&callback(res.data, that)
			}
		})
	},

	// 获取删除我的好友详情表接口
	deleteFriendDetailAjax: function(callback, that, param){
		wx.request({
			url: deleteFriendDetailUrl,
			header: {
	      		Cookie:'JSESSIONID=' + this.globalData.sessionId
	      	},
			data: param,
			success: function(res){
				callback&&callback(res, that)
			}
		})
	},
	
	// 注册
	regAjax: function(callback, param){
		wx.request({
	      	url: regUrl,
	      	header: {
	      		Cookie:'JSESSIONID=' + this.globalData.sessionId
	      	},
	      	type: 'post',
	      	dataType: 'json',
		    data: param,
	      	success: function (res) {
	      		callback&&callback(res.data)
	      	}
	    });
	},
	// 提交二维码
	payCodeSaveAjax: function(callback, param){
		wx.request({
	      	url: payCodeSaveUrl,
	      	header: {
	      		Cookie:'JSESSIONID=' + this.globalData.sessionId
	      	},
	      	type: 'post',
	      	dataType: 'json',
		    data: param,
	      	success: function (res) {
	      		callback&&callback(res.data)
	      	}
	    });
	},

	
	// 手机校验码校验
	verifyAjax: function(callback, param, that){
		wx.request({
	      	url: verifyUrl,
	      	header: {
	      		Cookie:'JSESSIONID=' + this.globalData.sessionId
	      	},
	      	type: 'post',
	      	dataType: 'json',
		    data: param,
	      	success: function (res) {	      		
	      		if(res.data.status == 'FAILURE'){
	      			wx.showModal({
						title: '提示',
						content: res.data.errorMsg,
						showCancel: false
					})
	      		}else{
	      			callback&&callback(res.data, that)
	      		}
	      		
	      	}
	    });
	},
	// 邀请码校验
	verifyInviteCodeAjax: function(callback, param){
		wx.request({
	      	url: verifyInviteCodeUrl,
	      	header: {
	      		Cookie:'JSESSIONID=' + this.globalData.sessionId
	      	},
	      	type: 'post',
	      	dataType: 'json',
		    data: param,
	      	success: function (res) {	      		
	      		if(res.data.status == 'FAILURE'){
	      			wx.showModal({
						title: '提示',
						content: res.data.errorMsg,
						showCancel: false
					})
	      		}else{
	      			callback&&callback(res.data)
	      		}
	      		
	      	}
	    });
	},

	// 获取群列表
	getTribeListAjax: function(callback, param, that){
		wx.request({
	      	url: getTribeListUrl,
	      	header: {
	      		Cookie:'JSESSIONID=' + this.globalData.sessionId
	      	},
	      	type: 'post',
	      	dataType: 'json',
		    data: param,
	      	success: function (res) {	      		
	      		callback&&callback(res.data, that)
	      		
	      	}
	    });
	},
	uploadFileAjax: function(callback, path, that){
		console.log('begin')
		wx.showToast({
			icon: "loading",
			title: "正在上传"
		})
		console.log(path)
		wx.uploadFile({
			url: uploadFileUrl, 
			filePath: path,
			name: 'file',
			success: function(res){
				console.log(res)
				var data = res.data
				callback&&callback(data, that)
			},
			fail: function (e) {
				console.log(e)
				wx.showModal({
					title: '提示',
					content: '上传失败',
					showCancel: false
				})
			},
			complete: function () {
				wx.hideToast();  //隐藏Toast
			}
		})
	}
})
