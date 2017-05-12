var app = getApp();
Page({  
	data: {    
		// tab切换  
		currentTab: 0,
		dataList: [],
		impressionObj: {
			impressionArr: [],
			impression_descriptionArr: null
		},
		myTagObj: {
			title: '请描述对我的印象',
			tagArr: null,
			tags: null,
			tagVal: ''
		}
	},  
	onLoad: function() {  
		
		var that = this;  
		app.getListTagAjax(function(data, that){
			var newArr = [];
			data.result.forEach(function(item, i){
				newArr.push(item.tagName);
			});
			var tagsArr = that.data.myTagObj.tags,
				tagVal = that.data.myTagObj.tagVal;
			
			that.setData({
				myTagObj: {
					title: '请描述对我的印象',
					tagVal: tagVal,
					tagArr: newArr,
					tags: tagsArr
				}
			})
		}, that);


		app.getImpressionListAjax(function(data, that){
			var newArr = [],
				newOneArr = [];
			if(data.impression_count.length != 0){
				data.impression_count.forEach(function(item, i){
					var newJson = {
						impressionName: item.impressionName,
						impressionCount: item.impressionCount
					}
					newArr.push(newJson);
				});
			}else{
				newArr = null
			}

			if(data.impression_description.length != 0){
				data.impression_description.forEach(function(item, i){
					var newJson = {
						friendName: item.friendName,
						impressionName: item.impressionName,
						day: item.day
					}
					newOneArr.push(newJson);
				});
			}else{
				newOneArr = null
			}
			
			
			that.setData({
				impressionObj: {
					impressionArr: newArr,
					impression_descriptionArr: newOneArr
				}
			})
		}, that);

		app.getMyTagListAjax(function(data, that){

			var newArr = [];
			
			if(data.tags.length != 0){
				data.tags.forEach(function(item,o){
					var _arr = {
						tagName: item.tagName,
						id: item.id
					}
					newArr.unshift(_arr);
				});
			}else{
				newArr = null;
			}

			var tagsArr = that.data.myTagObj.tagArr,
				tagVal = that.data.myTagObj.tagVal;

			that.setData({
				myTagObj: {
					title: '请描述对我的印象',
					tagVal: tagVal,
					tagArr: tagsArr,
					tags: newArr
				}
			})
		}, that);
		
		 
	},  
	/** 
	 * 滑动切换tab 
	 */  
	bindChange: function( e ) {  
		var that = this;  
		that.setData({ currentTab: e.detail.current });  
	}, 
	/** 
	* 点击tab切换 
	*/  
	swichNav: function( e ) {  
		var that = this;  
		var status = e.target.dataset.id;
		if( this.data.currentTab === e.target.dataset.current ) {  
			return false;  
		} else {  
			that.setData({  
				currentTab: e.target.dataset.current  
			})  
		} 
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
	

		app.addMyTagAjax(function(data, that){
			var _arr = {
				tagName: data.userTag.tagName,
				id: data.userTag.id
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
					title: '请描述对我的印象',
					tagVal: '',
					tagArr: newArr,
					tags: tags
				}			
			})
		}, that, {
			tagName: tagVal
		});

		
	},
	tagChangeEvent: function(e){
		var that = this,
			tagsArr = that.data.myTagObj.tags,
			newArr = that.data.myTagObj.tagArr;
		
	
		app.addMyTagAjax(function(data, that){
			var _arr = {
				tagName: data.userTag.tagName,
				id: data.userTag.id
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
					title: '请描述对我的印象',
					tagVal: '',
					tagArr: newArr,
					tags: tags
				}			
			})
		}, that, {
			tagName: e.target.dataset.item
		});
	},
	tagChangeRemoveEvent: function(e){
		var newTags = this.data.myTagObj.tags,
			tagItem = e.target.dataset.tagname,
			tagId = e.target.dataset.id,
			newArr = this.data.myTagObj.tagArr;
		newTags.forEach(function(item, i){
			if(item.tagName == tagItem){
				newTags.splice(i, 1);
			}
		});
		
		if(newTags.length == 0){
			newTags = null
		}
		// 删除接口
		app.deleteMyTagAjax(function(data, that){
			if(data.status == 'SUCCESS'){
				that.setData({
					myTagObj: {
						title: '请描述对我的印象',
						tagArr: newArr,
						tags: newTags
					}
				})
			}
		}, this, {
			id: tagId
		})
			
	}
	// 标签列表 标签添加 begin
})  