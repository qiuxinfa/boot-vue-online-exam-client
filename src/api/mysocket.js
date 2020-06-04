import WebSocket from 'websocket.js'
import store from '@/store'
import { setToken,getUserId } from '@/utils/auth'
var socket;

//开启连接
 export  function openSocket(userId) {
        if(typeof(WebSocket) == "undefined") {
            console.log("您的浏览器不支持WebSocket");
        }else{
            console.log("您的浏览器支持WebSocket");
            var socketUrl="ws://localhost:8888/ws/"+getUserId()
            // socketUrl=socketUrl.replace("https","ws").replace("http","ws")
            console.log(socketUrl);
            if(socket!=null){
                socket.close()
                socket=null
            }
            socket = new WebSocket(socketUrl)
            //打开事件
            socket.onopen = function() {
                console.log("websocket:已建立连接")
            };
            //获得消息事件
            socket.onmessage = function(msg) {
                //console.log("收到消息：" + msg.data)
                store.commit('user/SET_TOKEN',msg.data)
                setToken(msg.data)
            };
            //关闭事件
            socket.onclose = function() {
                console.log("websocket已关闭")
            };
            //发生了错误事件
            socket.onerror = function() {
                console.log("websocket发生了错误")
            }
        }
    }

// 关闭连接
 export  function closeSocket() {
        if (socket){
          socket.close()
        }
    }
