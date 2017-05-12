var sourceType = [ ['camera'], ['album'], ['camera', 'album'] ]
var sizeType = [ ['compressed'], ['original'], ['compressed', 'original'] ]
var app = getApp();
Page({
	data: {
		title: '',
		demandContent: '',
		isCheck: '',
		array: [],
		index: 0,
		date: '2016-09-01',
		time: '12:01',
		imageList: [],
		sourceTypeIndex: 2,
		sourceType: ['拍照', '相册', '拍照或相册'],
		sizeTypeIndex: 2,
		sizeType: ['压缩', '原图', '压缩或原图'],
		countIndex: 8,
		count: [1, 2, 3, 4, 5, 6, 7, 8, 9]
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
        			console.log(data)
        			var imgArr = that.data.imageList;
						imgArr.unshift(data);
					that.setData({
						imageList: imgArr
					})
        		}, tempFilePaths[0], that)
				
			}
		})
	},
	previewImage: function (e) {
		var current = e.target.dataset.src,
			urls = this.data.imageList,
			imgUrlArr = [];
		console.log(urls[0])
		for(var i = 0; i < urls.length; i++){
			imgUrlArr.push(urls[i])
		}
		wx.previewImage({
			current: current,
			urls: imgUrlArr
		})
	},
	onLoad: function(){
		var that = this//不要漏了这句，很重要
	    wx.request({
	      	url: 'https://www.kideep.pub/category/getAllCategory',
	      	header: {
	      		Cookie:'JSESSIONID=' + app.globalData.sessionId
	      	},
	      	success: function (res) {
	      		var categoryArr = [];
	      		res.data.result.forEach(function(value, index) {
				    categoryArr.push(value.categoryName)
				});
		        that.setData({
		           array: categoryArr
		        });
	      	}
	    });

	},
	bindPickerChange: function(e) {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		this.setData({
			index: e.detail.value
		})
	},
	bindDateChange: function(e) {
		this.setData({
			date: e.detail.value
		})
	},
	bindTimeChange: function(e) {
		this.setData({
			time: e.detail.value
		})
	},
	bindSubmit: function(){
		
	},
	formSubmit: function (e) {
		var that = this,
			param = e.detail.value,
			imgArr = [];
		this.data.imageList.forEach(function(value, index) {
		    imgArr.push(value)
		});
	
		param.demandAttachmentArray = imgArr.join(',');
		this.setData({
			title: param.title,
			demandContent: param.demandContent,
			isCheck: param.checkbox
		})
		param.expire = param.expire * 3600;
		if(that.data.title !='' && that.data.demandContent != '' && that.data.isCheck !=''){
			delete param.checkbox; 
			wx.request({
		      	url: 'https://www.kideep.pub/demand/save',
		      	type: 'post',
		      	dataType: 'json',
			    data: param,
			    header: {
			    	Cookie:'JSESSIONID=' + app.globalData.sessionId,
				    'content-type': 'application/x-www-form-urlencoded'
				},
		      	success: function (res) {
		      		if(res.data.status == 'SUCCESS'){
		      			wx.navigateTo({
							url: 'pages/publishList/publishList' 
						})
		      		}
		      	}
		    });
		}
	}
})
