function initChatRoom(appInfo, chatRoomInfo, callbacks, modules){
    var chatRoomId = chatRoomInfo.chatRoomId;
    var count = chatRoomInfo.count;

    window.chatRoomCallbacks = {};

    //公有云初始化
    var config = {
        //protobuf: 'https://cdn.ronghub.com/protobuf-2.3.1.min.js' //支持http(s)网络路径、本地相对路径
    };

    var initCallbacks = {
        onReady : function(_instance){
            // alert(_instance)
            // IM = _instance;
        },
        onMessage : function(message){
            // 判断消息类型

            // console.log("messageUId:" + message.messageUId + ",   messageId:" + message.messageId);
            // console.log(message);
            var onMessage = callbacks.onMessage;
            if (message.conversationType == 4 && message.targetId == chatRoomId) {
                onMessage(message);
            }
        },
        onConnected : function(IM, userInfo){
            //链接成功
            IM.joinChatRoom(chatRoomId, count, {
                onSuccess: function() {
                    var chatRoom = {
                        id : chatRoomId,
                        currentUser : userInfo.data,
                        getInfo : function (params,callbacks){
                            var order = params.order; //RongIMLib.GetChatRoomType.REVERSE;// 排序方式。
                            var memberCount = params.memberCount; // 获取聊天室人数 （范围 0-20 ）

                            IM.getChatRoomInfo(chatRoomId, memberCount, order,callbacks);
                        },
                        quit : function(callbacks){
                            IM.quitChatRoom(chatRoomId, callbacks);
                        },
                        sendMessage : function(content, callbacks){
                            var conversationType = RongIMLib.ConversationType.CHATROOM;
                            var msg = new RongIMLib.TextMessage(content);

                            IM.sendMessage(conversationType, chatRoomId, msg, callbacks);
                        }
                    };
                    callbacks.onSuccess && callbacks.onSuccess(chatRoom);
                },
                onError: function(error) {
                    callbacks.onError && callbacks.onError(error);
                }
            });
        }
    };
}
module.exports = {
    init:initChatRoom
}