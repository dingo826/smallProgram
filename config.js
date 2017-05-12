/**
 * 小程序配置文件
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la

var host = "14592619.qcloud.la",
    myHost = 'www.kideep.pub',
    apiHost = 'api.weixin.qq.com',
    appid = 'wxd7967190aa2e400c',
    secret = '4cab7a04f975df429d2f7aa086294929'/*,
    appid = 'wx2ce77aebe65c1f3b',
    secret = '3ed89ca462fd9917d93abed770cf6d06'*/
 
var config = {
    appid,
    secret,

    // 下面的地址配合云端 Server 工作
    host,

    // 登录地址，用于建立会话
    loginUrl: `https://${host}/login`,

    // 测试的请求地址，用于测试会话
    requestUrl: `https://${host}/testRequest`,

    // 用code换取openId
    openIdUrl: `https://${apiHost}/sns/jscode2session?appid=${appid}&secret=${secret}&grant_type=authorization_code&js_code=`,

    // 测试的信道服务接口
    tunnelUrl: `https://${host}/tunnel`,

    // 生成支付订单的接口
    paymentUrl: `https://${host}/payment`,

    // 发送模板消息接口
    templateMessageUrl: `https://${host}/templateMessage`,

    // 上传文件接口   image/upload  demand/uploadImage
    uploadFileUrl: `https://${myHost}/image/upload`,

    // 下载示例图片接口
    downloadExampleUrl: `https://${host}/static/weapp.jpg`,

    // 获取短信接口
    sendVerifyUrl: `https://${myHost}/register/sendVerify`,

    // 获取标签列表接口
    getTagListUrl: `https://${myHost}/tag/getTagList`,

    // 获取好友印象列表接口
    getImpressionListUrl: `https://${myHost}/impression/getImpressionList`,

    // 获取我的标签列表接口
    myTagListUrl: `https://${myHost}/user/myTag`,

    // 获取我的好友列表接口
    getFriendListUrl: `https://${myHost}/friend/getFriendList`,

    // 获取我的好友详情表接口
    getFriendDetailUrl: `https://${myHost}/friend/detail`,


     // 更新我的好友详情表接口
    updateFriendDetailUrl: `https://${myHost}/friend/update`,

    // 删除我的好友详情表接口
    deleteFriendDetailUrl: `https://${myHost}/friend/delete?friendId=`,


    // 给好友打标签
    saveFriendImpressUrl: `https://${myHost}/impression/save`,


    addMyTagUrl: `https://${myHost}/user/addTag`,

    deleteMyTagMyUrl: `https://${myHost}/user/deleteTag`,
 
    // 注册接口
    regUrl: `https://${myHost}/register/save`,

    payCodeUrl: `https://${myHost}/register/payCodeSave`,

    // 验证码验证接口
    verifyUrl: `https://${myHost}/register/verify`,

    // 邀请码验证接口
    verifyInviteCodeUrl: `https://${myHost}/register/verifyInviteCode`,

    IsRegisterUrl: `https://${myHost}/register/isRegister?openId=`,

    getInviteFriendsUrl: `https://${myHost}/friend/getInviteFriends`,

    getTribeListUrl: `https://${myHost}/tribe/getTribeList`,

    

};

module.exports = config
