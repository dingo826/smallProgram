var url = "https://www.kideep.pub/demand/getDemandList";
var page = 0;
var page_size = 10;
var total_page = 1;
var fnNoop = function(){};
var isNoop = true;

var app = getApp();
// 获取数据的方法，具体怎么获取列表数据大家自行发挥
var GetList = function(that, status){
	
	if(isNoop){
		_getList(that, status);	
	}else{
		fnNoop();
	}
    
}
var _getList = function(that, status){
	var status = status || '';
	isNoop = false;
	
	that.setData({
        hidden:false
    });

    wx.request({
        url:url,
        header: {
      		Cookie:'JSESSIONID=' + app.globalData.sessionId
      	},
        data:{
        	size: page_size,
        	page: page,
        	status: ''
        },
        success:function(res){
        	console.log(res.data.result)
            //console.info(that.data.list);
            var list = [];
            total_page = Math.ceil(res.data.total / page_size) - 1;  

            var resArr = res.data.result;
			resArr.forEach(function(item, i){
				resArr[i].createTime = item.createTime.split(' ')[0];
			});

            that.setData({
                list : that.data.list.concat(resArr)
            });
            page ++;
            if(page > total_page){
            	isNoop = false;
            }else{
            	isNoop = true;
            }
            
            that.setData({
                hidden: true
            });
        }
    });
}
Page({  
	data: {    
		// tab切换  
		currentTab: 0,
		dataList: []
	},  
	onLoad: function() {  
		var that = this;  

		that.fnList();
		 
	},  
	/** 
	 * 滑动切换tab 
	 */  
	bindChange: function( e ) {  
		var that = this;  
		that.setData({ currentTab: e.detail.current });  
	},  
	cancleFn: function(e){
		var id = e.target.dataset.id;
		wx.request({
			url: 'https://www.kideep.pub/demand/cancle?demandId=' + id,
			header: {
	      		Cookie:'JSESSIONID=' + app.globalData.sessionId
	      	},
			success: function(res){
				console.log()
				if(res.data.status == 'SUCCESS'){
					wx.navigateTo({
						url: '../publishList/publishList'
					})
				}
				
			}
		})
	},
	fnList: function(e){
		var status = e || '',
			that = this;
		wx.request( {  
			url: 'https://www.kideep.pub/demand/getDemandList',
			data: {
				status: status
			},
			header: {
	      		Cookie:'JSESSIONID=' + app.globalData.sessionId
	      	},
			success: function( res ) {
				var resArr = res.data.result;
				resArr.forEach(function(item, i){
					resArr[i].createTime = item.createTime.split(' ')[0];
				});
				that.setData({
					dataList: resArr 
				});
			}  
		}); 
	},
	/** 
	* 点击tab切换 
	*/  
	swichNav: function( e ) {  
		var that = this;  
		console.log(e.target.dataset.id)
		var status = e.target.dataset.id;
		console.log(status)
		GetList(status)
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
	onPullDownRefresh: function () {  
		//this.fnList();  
		//wx.stopPullDownRefresh()  
	},
	upper: function(){
		console.log('upper')
		this.fnList();  
		wx.stopPullDownRefresh()  
		console.log('upper')
	},
	lower: function(){
		console.log('upper')
		this.fnList();  
		wx.stopPullDownRefresh()  
		console.log('upper')
	},
	scroll: function(){
		console.log('scroll')
	}
})  