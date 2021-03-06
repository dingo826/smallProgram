var app = getApp();

Page({
	data: {
		codeImg: '',
		inviteCode: undefined,
		friendsArr: null,
		friendsTotal: undefined,
		friendsNum: undefined
	},
	onLoad: function(){	
		console.log(app.globalData.userinfo)
		var that = this,
			userinfo = app.globalData.userinfo;

		that.setData({
			inviteCode: userinfo.inviteCode
		})
		//1、获取邀请码
		//2、生成二维码及连接  二维码是乱码问题需要解决
		//3、好友列表
		wx.request({
			url: '',
			success: function(res){
				that.setData({
					codeName: 'codeName'
				})
			}
		})
		
		wx.request({
			url:'https://www.kideep.pub/wechat/getToken?appid=wxd7967190aa2e400c&secret=e6de7fffd4d1a95f11f497fcc0739ceb',
			success: function(res){
				var ACCESS_TOKEN = res.data.accessToken.accessToken;
				wx.request({
					url: 'https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=' + ACCESS_TOKEN,
					data: {
						"path": "/page/component/index", 
						"width": 430
					},
					dataType: 'json', 
					header: {
						'Accept': 'text/xml;charset=x-user-defined',
					    'Content-type': 'image/jpeg',
					    'Authorization': 'Basic YWRtaW46'
					},
					method: "POST",
					success: function(res){	
						console.log()			
						that.setData({
							codeImg: res.data
						})
						
					},
					fail: function(res){
						console.log(res)
					}
				})
			}
		});

		app.getInviteFriendsAjax(function(data, that){
			console.log(data)
			var resArr = data.friends;
			resArr.forEach(function(item, i){
				resArr[i].createTime = item.createTime.split(' ')[0];
			});
			that.setData({
				friendsArr: resArr,
				friendsTotal: data.friends.length,
				friendsNum: data.totalNumber - data.friends.length
			})
		}, this)
		
	}
})