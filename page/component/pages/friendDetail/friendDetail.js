var app = getApp();
Page({
	data: {    
		friendId: undefined,
		dataList: [],
		impressionObj: {
			impressionArr: null
		},
		myTagObj: {
			title: '请描述对好友的印象',
			tagArr: [],
			tags: [],
			tagVal: ''
		}
	},  
	onLoad: function(options){
		var that = this;
		console.log(options.id)
		that.setData({
			friendId: options.id
		})
		app.getListTagAjax(function(data, that){
			var newArr = [];
			data.result.forEach(function(item, i){
				newArr.push(item.tagName);
			});
			var tagsArr = that.data.myTagObj.tags,
				tagVal = that.data.myTagObj.tagVal;
			that.setData({
				myTagObj: {
					title: '请描述对好友的印象',
					tagVal: tagVal,
					tagArr: newArr,
					tags: tagsArr
				}
			})
		}, that);

		app.getFriendDetailAjax(function(data){
			console.log(data) 
			
			var newArr = []
			if(data.result.impressionStatisticList.length != 0){
				data.result.impressionStatisticList.forEach(function(item, i){
					
					var _arr = {
						tagName: item.impressionName,
						id: item.id
					}
					newArr.unshift(_arr);
				});
			}else{
				newArr = null
			}
			console.log(newArr)
			var tagsArr = that.data.myTagObj.tagArr,
				tagVal = that.data.myTagObj.tagVal;

			that.setData({
				myTagObj: {
					title: '请描述对好友的印象',
					tagVal: tagVal,
					tagArr: tagsArr,
					tags: newArr
				}
			})
			
		}, that, {friendId: that.data.friendId})

		
	},
	onReady: function () {  
    	//this.fnList();  
	},
	// 标签列表 标签添加 begin
	tagInputEvent: function(e){
		this.data.myTagObj.tagVal = e.detail.value		
	},
	addTagEvent: function(e){	
		var that = this,
			myTagObj = that.data.myTagObj,
			tagsArr = myTagObj.tags,
			newArr = myTagObj.tagArr,
			tagVal = myTagObj.tagVal;

		if(tagVal == ''){ return false}

		var regTagVal = /^[a-z0-9A-Z\u4e00-\u9fa5]+$/;
		if(!regTagVal.test(tagVal)){
		    wx.showToast({
		    	title:'只支持汉字、英文字母或数字。'
		    });
		    return false;
		}
	

		app.saveFriendImpressAjax(function(data, that){
			var _arr = {
				tagName: data.userImpression.impressionName,
				id: data.userImpression.id
			},
			tags = [];
			if(tagsArr != null){
				tags = tagsArr.concat(_arr)
			}else{
				tags.push(_arr) 
			}
			//数组去重 去空
			that.setData({
				myTagObj: {
					title: '请描述对好友的印象',
					tagVal: '',
					tagArr: newArr,
					tags: tags
				}			
			})
		}, that, {
			friendId: this.data.friendId,
			impressionName: tagVal
		});

		
	},
	tagChangeEvent: function(e){
		var that = this,
			tagsArr = that.data.myTagObj.tags,
			newArr = that.data.myTagObj.tagArr;
		
	
		app.saveFriendImpressAjax(function(data, that){

			var _arr = {
				tagName: data.userImpression.impressionName,
				id: data.userImpression.id
			},
			tags = [];
			if(tagsArr != null){
				tags = tagsArr.concat(_arr)
			}else{
				tags.push(_arr) 
			}
			//数组去重 去空
			that.setData({
				myTagObj: {
					title: '请描述对好友的印象',
					tagVal: '',
					tagArr: newArr,
					tags: tags
				}			
			})
		}, that, {
			friendId: this.data.friendId,
			impressionName: e.target.dataset.item
		});
	}
})