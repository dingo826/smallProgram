var app = getApp();
/*const WSDK = require('../../../../util/wsdk-2.0.0');*/
	

Page({
	onLoad : function(){
		/*console.log(WSDK)
		sdk = new WSDK();
		console.log(sdk)*/
		var Fun = this;
		/*Fun.fnSwiper();*/
        Fun.fnUserLogin(type, function(id, type){
            Fun.initScrollFun(id);
            //获取历史信息的一切操作
            Fun.getHistory(id, nextkey, function(data){
                
                nextkey = data.data.nextKey;
                Fun.renderHistoryMsg(data.data);
            });    

            //获取最近联系人列表
            Fun.getRecentContact(function (data) {
                if (data.resultText == "SUCCESS") {
                    //解析数据并且加载页面展示
                    Fun.loadContact(data.data.cnts);
                    COM.dialog && COM.dialog.remove();
                } else {
                    dialog && dialog.remove();
                    COM.hint("获取最近联系人列表失败！");
                }
            });
            //开始接收当前登录用户所有的聊天消息
            Fun.startListenAllMsg(function (data) {
                if (data.resultText == "SUCCESS") {
                    //解析数据并且加载页面展示
                    Fun.renderUserMsg(data.data.msgs[0].msg);
                } else {
                    COM.hint("新消息加载联系人失败！");
                }
            });

            $('.chat-btn').on('click', function(){
                var i = $(this).index('.chat-btn'),
                    domType = $('.chat-btn-add :visible').attr('data-type'),
                    msg = $('#input').val();
                if(domType == 'img'){
                    $('.footer').css("bottom", '135px')
                    $('.tab-content').addClass('active');
                    $('.tab-content .tab-content-item').hide().eq(i).show();
                }else if(domType == 'em'){
                    Fun.sendMsg(id, msg);
                }
                
            });
        });   
        
        
    },
    initScrollFun: function(id){  
        var myScroll,  
            pullDown = $("#pullDown"),  
            //pullUp = $("#pullUp"),  
            pullDownLabel = $(".pullDownLabel"),  
           // pullUpLabel = $(".pullUpLabel"),  
            container = $('.chat-scroller'),  
            loadingStep = 0;//加载状态0默认，1显示加载状态，2执行加载数据，只有当为0时才能再次加载，这是防止过快拉动刷新  

            pullDown.hide();  
            //pullUp.hide();  
  
            myScroll = new IScroll(".chat-scroll-wrapper", {  
                probeType: 2,  
                scrollbars: true,//有滚动条  
                mouseWheel: true,//允许滑轮滚动  
                fadeScrollbars: true,//滚动时显示滚动条，默认影藏，并且是淡出淡入效果  
                bounce:true,//边界反弹  
                interactiveScrollbars:true,//滚动条可以拖动  
                shrinkScrollbars:'scale',// 当滚动边界之外的滚动条是由少量的收缩。'clip' or 'scale'.  
                click: true ,// 允许点击事件  
                keyBindings:true,//允许使用按键控制  
                momentum:true// 允许有惯性滑动  
            });  
            myScroll.on("scrollMove",function(){ 
                
                //if(loadingStep == 0 && !pullDown.attr("class").match('refresh|loading') && !pullUp.attr("class").match('refresh')){  
                if(loadingStep == 0){ 
                    if(this.y > 40){//下拉刷新操作  
                        console.log('松手刷新数据'); 
                        pullDown.addClass("refresh").show();  
                        pullDownLabel.text("松手刷新数据");  
                        loadingStep = 1;  
                        myScroll.refresh();  
                    }else if(this.y < (this.maxScrollY - 14)){//上拉加载更多  
                        /*console.log('正在载入');
                        pullUp.addClass("refresh").show();  
                        pullUpLabel.text("正在载入");  
                        loadingStep = 1;  
                        pullUpAction(); */ 
                    }  
                }  
            });  
            myScroll.on("scrollEnd",function(){  
                if(loadingStep == 1){  
                    console.log(pullDown.attr("class").match("refresh"))
                    if( pullDown.attr("class").match("refresh") ){//下拉刷新操作  
                        pullDown.removeClass("refresh").addClass("loading");  
                        pullDownLabel.text("正在刷新");  
                        loadingStep = 2;  
                        _pullDownAction();  
                    }  
                }  
            });  

        function _pullDownAction(){ 
          
                Fun.getHistory(id, nextkey, function(data){
                    nextkey = data.data.nextKey;
                    Fun.renderHistoryMsg(data.data);
                    pullDown.attr('class','').hide();  
                    myScroll.refresh();  
                    loadingStep = 0;   
                }); 
            
        }  
        function _pullUpAction(){}  

        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);  
    },
    fnSwiper: function(){
    	var swiper = new srcSwiper('.swiper-container', {
			pagination: '.swiper-pagination',
			paginationClickable: true
		});
    },
    fnJoinTribeAjax: function(id, userId){
        return new Promise(function (resolve, reject) {
            COM.ajax({
                url: '/openim/joinTribe?demandId=' + id + '&userId=' + userId,
                type: 'post',
                suc: function (res) {
                    
                    resolve(res);  
                }
            })
        });
    },
    fnUserLogin: function(type, callbackA){
        //callbackA  登录后执行
        if(type == 'reply'){
            //加入群
            Fun.fnJoinTribeAjax(demandId, userId).then(function(data){
                var data = data.result,
                    param = {
                        appKey: data.appKey,
                        currentUid: data.userId,
                        currentCredential: data.password,
                        tribeId: data.tribeId,
                        type: type
                    };

                userLogin(param);
            });
        }else{
            var param = {
                    appKey: '23748930',
                    currentUid: '00001',
                    currentCredential: '123456',
                    tribeId: '143363721',
                    type: type
                }
            userLogin(param);
        }
        function userLogin(param){               
            Fun.userLogin(param.currentUid, param.appKey, param.currentCredential, function (data) {

                
                if (data && data.resultText == "SUCCESS" || data.resultText == "ALREADY_LOGIN") {
                    
                    callbackA&callbackA(param.tribeId, param.type);
                    

                    //开始给服务端发送心跳
                    //开始给服务端发心跳                                                         var timer1 =  setInterval(function () {
                   /* setInterval(function () {
                        $.ajax({
                            url: weixinAPIUri + '/im/send_heartbeat.html?type=0&brandId=' + brandId + '&id=' + customId,
                            type: 'get',
                            //data : requestData,
                            success: function (res) {
                                console.info(res);
                            }
                        });

                    }, 60000);*/

                } else {
                   // dialog && dialog.remove();
                    //COM.hint("登录失败！");

                }
            });
        }
    },
    //用户登录
    userLogin: function (uid, appKey, credential, callback) {            	
        sdk.Base.login({
            uid: uid,
            appkey: appKey,
            credential: credential,
            
            success: function (data) {
                console.log(data)
                if (callback) {
                    callback(data)
                }
            },
            error: function (error) {
                if (callback) {
                    callback(error);
                }
            }
        });
    },

    //获取去除前缀的nick
    getNick: function (longnick) {
        return sdk.Base.getNick(longnick);
    },
    //最近联系人(getRecentContact)
    getRecentContact: function (callback) {
        sdk.Base.getRecentContact({
            count: 10,
            success: function (data) {
                callback(data);
            },
            error: function (error) {
                callback(error);
            }
        });
    },
    //开始接收当前登录用户所有的聊天消息
    startListenAllMsg: function (callback) {
        
        sdk.Event.on('TRIBE.MSG_RECEIVED', function (data) {                    
            if (callback) {
                callback(data);
            }
        });
        sdk.Base.startListenAllMsg();
    },
    //未读消息数
    getUnreadMsgCount: function (callback) {
        sdk.Base.getUnreadMsgCount({
            count: 10,
            success: function (data) {
                callback(data);
            },
            error: function (error) {
                callback(error);
            }
        });
    },
    //设置消息已读(setReadState)
    setReadStateFun: function (touid, callback) {
        sdk.Chat.setReadState({
            touid: touid,
            hasPrefix: false,
            timestamp: Math.floor((+new Date()) / 1000),
            success: function (data) {
                callback(data);
            },
            error: function (error) {
                callback(error);
            }
        });
    },
    loadContact: function (contactList) {
        //新的联系人列表
        var newContactList = new Array();
        //导购id 列表
        var guideUids = new Array();
        for (var i = (contactList.length - 1); i >= 0; i--) {
            var contact = contactList[i];
            var temp_guide = Fun.getNick(contact.uid);
            guideUids.push(temp_guide);
            if (contact.msg.customize) {
                continue;
            }
            var msgContext = (contact.msg[0])[1];
            if (msgContext.indexOf("?type=1") > 0) {
                msgContext = '[图片]';
            } else if (msgContext.indexOf("http://img.amugua.com") >= 0) {
                msgContext = '[图片]';
            }
            var obj = {
                guideUid: temp_guide, //导购Id
                smallHead: "", //导购头像
                nickName: "", //导购昵称
                isExclusiveGuide: 0, //是否是专属导购 0 否 1 是
                unReadMsgCount: 0, //未读消息数量
                lastMsgContext: msgContext, //最新消息内容
                lasgMsgtime: contact.time //最新消息发送时间
            }
           // contactMap.put(temp_guide, obj);

        }

    },
    getHistory: function(tribeId, nextkey, callback ){
        sdk.Tribe.getHistory({
            tid: tribeId,
            nextkey, nextkey,
            count: 10,
            success: function(data){
                callback(data);
                nextkey = data.data && data.data.next_key;
                /*console.log('get history msg success', data);
                nextkey = data.data && data.data.next_key;*/
            },
            error: function(error){
                console.log('get history msg fail', error);
            }
         });
    },
    sendMsg: function(tribeId, msg){
      
        //群发信息   
        sdk.Tribe.sendMsg({
            tid: tribeId,
            msg: msg,
            success: function(data){
                Fun.renderUserMsg(msg, 'reply');
                //聊天恢复正常
                $('#input').val('');
                var scrollHeight = $(".chat-scroller").outerHeight(),
                    wrapHeight = $(window).height() - 50,
                    top = scrollHeight - wrapHeight;
                $('.chat-scroll-wrapper').scrollTop(top);
                $('.chat-btn-add').find('em').addClass('hide');
                $('.chat-btn-add').find('img').removeClass('hide');
            },
            error: function(error){
                console.log(error);
            }
        });
    },
    renderUserMsg: function(msg, type) {
        //type: reply  的时候采用回复者的模板
        var data = {
            msg: msg, //msgHandler(msg) 图标处理 以及文件处理
            headImgSrc: ''  //通过微信获取用户信息
        }
        if(type == 'reply'){
            $('.chat-scroller').append(tplChatInfoUser(data));
        }else{
            $('.chat-scroller').append(tplChatInfoGuider(data));
        }
        
        
    },
    renderHistoryMsg: function(data){
        var userId = Fun.getNick(data.uid);
        $.each(data.msgs, function(i, o){
            var id = Fun.getNick(o.from);
            var data = {
                    msg: o.msg, //msgHandler(msg) 图标处理 以及文件处理
                    headImgSrc: ''  //通过微信获取用户信息
                }
            if(id == userId){                        
                $('.chat-scroller').prepend(tplChatInfoUser(data));
            }else{
                
                $('.chat-scroller').prepend(tplChatInfoGuider(data));
            }
        });
    }
})