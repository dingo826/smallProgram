
var app = getApp();
var sourceType = [ ['camera'], ['album'], ['camera', 'album'] ]
var sizeType = [ ['compressed'], ['original'], ['compressed', 'original'] ]
Page({
	data: {
		imageList: null,
		sourceTypeIndex: 2,
		sourceType: ['拍照', '相册', '拍照或相册'],
		sizeTypeIndex: 2,
		sizeType: ['压缩', '原图', '压缩或原图'],
		countIndex: 8,
		count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
		isVerify: false,
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
        		app.uploadFileAjax(function(data, that){
        			
        			that.setData({
						imageList: data
					})
        		}, tempFilePaths[0], that)
				
			}
		})
	},
	previewImage: function (e) {
		var current = e.target.dataset.src,
			urls = [];
			urls.push(this.data.imageList);
		
		wx.previewImage({
			current: current,
			urls: urls
		})
	},
	onLoad: function(options) {   
		var that = this;
		if(app.globalData.userinfo.paycodeImgUrl != null){
			that.setData({
				imageList: app.globalData.userinfo.paycodeImgUrl
			})
		}
	},
	formSubmit: function (e) {
	
		var that = this;
		app.payCodeSaveAjax(function(data){
			app.globalData.userinfo.paycodeImgUrl = that.data.imageList;
			wx.navigateTo({
				url: '../info/info'
			});
		}, {
			paycodeImgUrl: that.data.imageList
		})
	}
});