var app = getApp();

Page({
	data: {
		isRegister: false,
		hasUserInfo: false,
		user: null,
		openid: null
	},
	onLoad: function(){
		var that = this,
			openid = app.globalData.openid;

		that.setData({
			hasUserInfo: app.globalData.userinfo != null,
			user: app.globalData.userinfo,
			isRegister: app.globalData.isRegister,
			openid: openid
		});  
	},
	clear: function () {
		this.setData({
			hasUserInfo: false,
			userInfo: {}
		})
	}
})
