var app = getApp();
Page({
	data: {
		hasUserInfo: false
	},
	onLoad: function(){
		var that = this;
		
		if (app.globalData.hasLogin === false) {
			wx.login({
				success: function(){
					wx.getUserInfo({
						success: function (res) {
							//console.log(res)
							//1、通过解密获取到openid
							//2、通过openid 访问对应接口 并重置 hasUserInfo
							//3、根据hasUserInfo 显示对应的数据，并将个人信息保存在本地存储中。
							that.setData({
								hasUserInfo: true,
								userInfo: res.userInfo
							})
							
						}
					})
				}
			})
		} 
	},
	
	clear: function () {
		this.setData({
			hasUserInfo: false,
			userInfo: {}
		})
	}
})
