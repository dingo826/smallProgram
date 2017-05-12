var app = getApp();
Page({
	data: {
		info: null
	},
	onLoad: function(){
		var that = this;
		console.log(app.globalData.userinfo)
		that.setData({
			info: app.globalData.userinfo
		})
	}
})