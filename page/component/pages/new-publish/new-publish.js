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
				console.log(res)
				var tempFilePaths = res.tempFilePaths;
        		that.upload(that, tempFilePaths);
				
			}
		})
	},
	upload: function(page, path){
		console.log('uploadBegin');
		wx.showToast({
			icon: "loading",
			title: "正在上传"
		}),
	    wx.uploadFile({
	      url: "https://www.kideep.pub/image/upload",
	      filePath: path[0], 
	      name: 'file',
	      header: { "Content-Type": "multipart/form-data" },
	      formData: {
	        //和服务器约定的token, 一般也可以放在header中
	        'session_token': wx.getStorageSync('session_token')
	      },
	      success: function (res) {
	      	console.log('uploadFile')
	        console.log(res);
	        if (res.statusCode != 200) { 
	          wx.showModal({
	            title: '提示',
	            content: '上传失败',
	            showCancel: false
	          })
	          return;
	        }
	        var data = res.data;
	        var imgArr = that.data.imageList;
				imgArr.unshift(res.tempFilePaths);
				console.log(imgArr[0])
				that.setData({
					imageList: imgArr
				})
	       /* page.setData({  //上传成功修改显示头像
	          src: path[0]
	        })*/
	      },
	      fail: function (e) {
	        console.log(e);
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
		    imgArr.push(value[0])
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
			console.log(param)
			wx.request({
		      	url: 'https://www.kideep.pub/demand/save',
		      	type: 'post',
		      	dataType: 'json',
			    data: param,
			    header: {
				      'content-type': 'application/x-www-form-urlencoded'
				  },
		      	success: function (res) {
		      		console.log(res.data.status)
		      		if(res.data.status == 'SUCCESS'){
		      			wx.navigateTo({
							url: '../publishList/publishList'
						})
		      		}
		      	}
		    });
		}
		/*var param = {

		}
		wx.request({
	      	url: 'https://www.kideep.pub/demand/save',
	      	type: 'post',
		    data: param,
	      	success: function (res) {
	      		console.log(res)
	      	}
	    });*/
	}
})
