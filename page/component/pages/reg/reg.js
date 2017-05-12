
var app = getApp();
var sourceType = [ ['camera'], ['album'], ['camera', 'album'] ]
var sizeType = [ ['compressed'], ['original'], ['compressed', 'original'] ]
Page({
	data: {
		imageList: [],
		sourceTypeIndex: 2,
		sourceType: ['拍照', '相册', '拍照或相册'],
		sizeTypeIndex: 2,
		sizeType: ['压缩', '原图', '压缩或原图'],
		countIndex: 8,
		count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
		isVerify: false,
		inviteCode: '',
		verifyCodeTime: '获取验证码',
		verifyNumber: '',
		phoneNumber: '',
		tagVal: '',
		tagArr: [],
		tags: [],
		buttonDisable: false,
		regButtonDisable: true,
		myTagObj: {
			tagArr: [],
			tags: []
		}
	},
	sourceTypeChange: function (e) {
		this.setData({
			sourceTypeIndex: e.detail.value
		})
	},
	sizeTypeChange: function (e) {
		this.setData({
			sizeTypeIndex: e.detail.value
		})
	},
	countChange: function (e) {
		this.setData({
			countIndex: e.detail.value
		})
	},
	chooseImage: function () {
		var that = this
		wx.chooseImage({
			sourceType: sourceType[this.data.sourceTypeIndex],
			sizeType: sizeType[this.data.sizeTypeIndex],
			count: this.data.count[this.data.countIndex],
			success: function (res) {
				var tempFilePaths = res.tempFilePaths;
				console.log(tempFilePaths)
        		app.uploadFileAjax(function(data, that){
        			console.log(data)
        		}, tempFilePaths[0], that)
				
			}
		})
	},
	previewImage: function (e) {
		var current = e.target.dataset.src,
			urls = this.data.imageList,
			imgUrlArr = [];
		console.log(urls[0][0])
		for(var i = 0; i < urls.length; i++){
			imgUrlArr.push(urls[i][0])
		}
		wx.previewImage({
			current: current,
			urls: imgUrlArr
		})
	},
	onLoad: function(options) {   
		var that = this;
		that.setData({    
			isVerify: options.verifyNumber != undefined || false,
			verifyNumber: options.verifyNumber
		});
		app.getListTagAjax(function(data, that){
			var newArr = [];
			data.result.forEach(function(item, i){
				newArr.push(item.tagName);
			});
			that.setData({
				tagArr: newArr
			});
			that.setData({
				myTagObj: {
					tagArr: newArr
				}
			})

		}, that);
	},
	formSubmit: function(e){
		var that = this;
		var param = {
			phoneNumber: e.detail.value.phoneNumber,
			openId: app.globalData.openid,
			inviteCode: that.data.inviteCode,
			tags: that.data.tags.join(',')
		}

		if(e.detail.value.phoneNumber != '' && that.data.tags.length > 4 ){
			console.log('regbegin')
			app.regAjax(function(res){

				app.globalData.userinfo = res.user;
				app.globalData.isRegister = true;
      			wx.navigateTo({
					url: '../uploadPic/uploadPic'
				});
			}, param);
	    }else{
	    	if(that.data.tags.length < 5 ){
	    		wx.showToast({
			    	title:'选择5个标签以上！'
			    })
	    	}
	    	
	    }
	},
	inviteInputEvent: function(e){
		var inviteCode = e.detail.value,
			param = {
				inviteCode: inviteCode
			},
			that = this;
		if(inviteCode.length == 8){
			app.verifyInviteCodeAjax(function(data){
				that.setData({
					inviteCode: inviteCode
				})
			}, param)
		}else{
			wx.showModal({
				title: '提示',
				content: '邀请码不是8位数',
				showCancel: false
			})
		}
	},
	mobileInputEvent:function(e){
		this.setData({
			phoneNumber: e.detail.value
		})
	},
	verifyNumberEvent: function(e){
		var that = this;
		var param = {
			phoneNumber: this.data.phoneNumber,
			verifyNumber: e.detail.value
		}
		if(param.verifyNumber.length == 6 && param.phoneNumber != ''){
			app.verifyAjax(function(data, that){
				
				that.setData({
					regButtonDisable: false
				})
			}, param, that)
		}else{
			if(param.phoneNumber == ''){
				wx.showModal({
					title: '提示',
					content: '手机号码不能为空！',
					showCancel: false
				});
				return false;
			}
			wx.showModal({
				title: '提示',
				content: '校验码输入有误',
				showCancel: false
			})
		}
	},
	verifyCodeEvent: function(){		
		var that = this;
		var phoneNumber = that.data.phoneNumber;
		var regMobile = /^1\d{10}$/;
		if(!regMobile.test(phoneNumber)){
		    wx.showToast({
		    	title:'手机号有误！'
		    })
		    return false;
		}

		if(this.data.buttonDisable) return false;
		
		var c = 60;
		var intervalId = setInterval(function(){
			c = c-1;
			that.setData({
				verifyCodeTime: c + 's后重发',
				buttonDisable: true
			})
		  	if(c==0){
				clearInterval(intervalId);
				that.setData({
					verifyCodeTime: '获取验证码',
					buttonDisable: false
				})
		  	}
		},1000);

		//获取短信验证码接口
		app.sendVerifyCodeAjax(function(){}, phoneNumber);
	},
	tagInputEvent: function(e){
		this.setData({
			tagVal: e.detail.value
		})
	},
	addTagEvent: function(e){
		if(this.data.tagVal == ''){ return false}
		var tagVal = this.data.tagVal.split(',');
		var regTagVal = /^[a-z0-9A-Z\u4e00-\u9fa5]+$/;
		if(!regTagVal.test(tagVal)){
		    wx.showToast({
		    	title:'只支持汉字、英文字母或数字。'
		    });
		    return false;
		}
		//数组去重 去空
		this.setData({
			tagVal: '',
			tags: this.data.tags.concat(tagVal)
		})
	},
	tagChangeEvent: function(e){
		var that = this,
			newTag = that.data.tags;

		//数组去重 去空
		newTag.push(e.target.dataset.item);
		that.setData({
			tags: newTag
		})
	},
	tagChangeRemoveEvent: function(e){

		var newTags = this.data.tags,
			tagItem = e.target.dataset.item;
	
		if (newTags.indexOf(tagItem) > -1) {
			newTags.splice(newTags.indexOf(tagItem), 1);
		}
		this.setData({
			tags: newTags
		})
		
	}
});