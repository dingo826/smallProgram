var url = "https://www.kideep.pub/recommend/getRecommendDemandList";
var page = 0;
var page_size = 10;
var total_page = 1;
var fnNoop = function(){};
var isNoop = true;

var app = getApp();
// 获取数据的方法，具体怎么获取列表数据大家自行发挥
var GetList = function(that){
	
	if(isNoop){
		_getList(that);	
	}else{
		fnNoop();
	}
    
}
var _getList = function(that){
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
            res.data.result.forEach(function(item, i){
            	list.push(item)
            });

            that.setData({
                list : that.data.list.concat(list)
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
	data:{
		hidden:true,
		list:[],
		scrollTop : 0,
		scrollHeight:0
	},
	onLoad:function(){
		//   这里要非常注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
	  var that = this;
	  wx.getSystemInfo({
	      success:function(res){
	          
	          that.setData({
	              scrollHeight:res.windowHeight
	          });
	      }
	  });
		var that = this;
		GetList(that);
	},
	onShow:function(){
		//   在页面展示之后先获取一次数据
		
	},
	bindDownLoad:function(){
		console.log('bindDownLoad')
		//   该方法绑定了页面滑动到底部的事件
		var that = this;
		GetList(that);
	},
	scroll:function(event){
	//   该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
		this.setData({
			scrollTop : event.detail.scrollTop
		});
	},
	refresh:function(event){
	//   该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
		var that = this;
		page = 0;
		that.setData({
			list : that.data.list,
			scrollTop : 0
		});
		GetList(this)
	}
})