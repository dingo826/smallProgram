const app = getApp()
import { formatTime } from '../../../../util/util'
import socket from '../../../../util/socket'


Page({
    data:{
		list: []
    },
    goPage(e) {
        let newlist = this.data.list
        const index = e.currentTarget.dataset.index
        newlist[index].count=0;
        this.setData({
            list: newlist
        })
        wx.navigateTo({
            url: '../message/message?name='+e.currentTarget.dataset.name+"&id="+e.currentTarget.dataset.id
        })
    },
    onLoad() {
        var that = this;
        app.getTribeListAjax(function(res, that){           
            that.setData({
                list: res.result
            }) 
        }, {}, that)
       
        /*socket.onMessage((data)=>{
            console.log(data)
            if(data.cmd != "CMD" || data.subCmd != 'ROOMS')
                return
            data.rooms.forEach((room)=>{
                room.updated = formatTime(room.updated)
            })
            if(data.cmd == 'CMD' && data.subCmd == 'ROOMS'){
                this.setData({
                    list: data.rooms
                })
            }
        })
        setTimeout(()=>{
       
            socket.sendMessage({
                cmd:'ROOMS'
            })
        }, 2000)*/
    }
})