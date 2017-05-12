var app = getApp();
Page({
	data: {   
		title: '', 
		array:['狐朋', '狗友'],
		index: 0,
		friendId: undefined,
		dataIfo: null
	},  
	onLoad: function(options){
		var that = this;
		
		that.setData({ 
			friendId: options.id 
		});
		app.getFriendDetailAjax(function(data){
			console.log(data.result)
			that.setData({
				dataIfo: data.result,
				index: parseInt(data.result.category) -1,
			})
		}, that, {friendId: that.data.friendId})
	},
	onReady: function () {  
    	//this.fnList();  
	},
	bindPickerChange: function(e) {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		this.setData({
			index: e.detail.value
		})
	},
	formSubmit: function(e){
		var that = this,
			param = e.detail.value;
		
		var params = {
			userFriend: that.data.friendId,
			category: that.data.index + 1,
			remark: param.title
		}
		app.updateFriendDetailAjax(function(data){
			console.log(data)
		}, that, params);
	},
	deleteFn: function(){
		console.log(1)
	}
})