const openIdUrl = require('./config').openIdUrl
var app = getApp();
App({
	onLaunch: function () {
		/*var appid = 'wxd7967190aa2e400c',
		    secret = 'e6de7fffd4d1a95f11f497fcc0739ceb'
		wx.request({
			url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appid+'&secret='+secret,
			success: function(res){
				console.log('res' + res)
			}
		})*/
	
		wx.login({
			success: function(res) {
				
				wx.setStorageSync('access_token', 'access_token')
				var l='https://api.weixin.qq.com/sns/jscode2session?appid=wxd7967190aa2e400c&secret=e6de7fffd4d1a95f11f497fcc0739ceb&js_code='+res.code+'&grant_type=authorization_code';
				if (res.code) {
					wx.request({
						url: l,
						success: function(res){
							console.log(res)
						}
					});
				  //发起网络请求
					wx.request({
						url: 'https://test.com/onLogin',
						data: {
							code: res.code
						}
					})
				} else {
					console.log('获取用户登录态失败！' + res.errMsg)
				}
			}
		});
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	},
	globalData: {
		hasLogin: false,
		openid: null
	},
	// lazy loading openid
	getUserOpenId: function(callback) {
		var self = this

		if (self.globalData.openid) {
			callback(null, self.globalData.openid)
		} else {
		  	wx.login({
				success: function(data) {
					wx.request({
						url: openIdUrl,
						data: {
							code: data.code
						},
						success: function(res) {
							console.log('拉取openid成功', res)
							self.globalData.openid = res.data.openid
							callback(null, self.globalData.openid)
						},
						fail: function(res) {
							console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
							callback(res)
						}
					})
				},
				fail: function(err) {
					console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
					callback(err)
				}
		  	})
		}
	}
})
