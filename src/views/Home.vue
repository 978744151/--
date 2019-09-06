<template>
  <div class="home-index">
    <!-- <div class="screen-hidden"> -->
    <div class="screen-box" id="video-body">
      <!-- <div class="screen-height">
        <div class="screen-text" >
           
        </div>
      </div> -->
    </div>
    <!-- </div> -->

    <div class="home-index-end" v-if="showEnd">
      <div class="index-end-center">
        <p class="end-title">哈尼, 本场直播已经结束了....</p>
        <div class="index-end-end">
          <div class="see-old-video" @click="seeOldVideo">看回放</div>
          <div class="see-video-other">看别的</div>
        </div>
      </div>
    </div>
    <img
      class="video-is-play"
      v-if="videoBegin"
      @click.stop="videoStart"
      src="https://p6.suibianyuming.com.cn/ct/video/bofang.png"
    />
    <div id="content" class="video-index"></div>
    <!-- <video
      :controls="control"
      src="https://p6.suibianyuming.com.cn/ct/video/shop1566357543887494.mp4"
      class="video-index"
    ></video>-->
    <div class="item-info-zindex">
      <img class="info-zindex-image" :src="videoInfo.img" />
      <!-- joinInfo.data.latest_user[0].img_s {{joinInfo.data.latest_user[0].nickname}} -->
      <div class="goods-title">{{videoInfo.nickname}}</div>
      <!-- <div class="goods-attent" bindtap="attent">
        <img src="https://p6.suibianyuming.com.cn/ct/video/shopattention.png" />
      </div>
      <div class="goods-attent" bindtap="attent">
        <img src="https://p6.suibianyuming.com.cn/ct/video/shopallreadyRember.png" />
      </div>-->
    </div>
    <div class="shop-share-shandom">
      <img class="shop-share" src="https://p6.suibianyuming.com.cn/ct/video/shopfx.png" alt />
    </div>
    <form class="view-shop-input" action="javascript:void 0">
      <input
        id="send"
        @keyup.13="confirmInput"
        v-model="txtInput"
        type="text"
        class="view-shop-inputs"
        placeholder="跟主播聊点什么?"
      />
      <div class="look-shop" @click="pause">
        <img src="https://p6.suibianyuming.com.cn/ct/video/shopshangpin@2x.png" alt />
        <span>查看商品</span>
      </div>
      <img
        class="view-shop-like"
        src="https://p6.suibianyuming.com.cn/ct/video/shop/like@2x.png"
        alt
      />
    </form>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      videoInfo: "",
      show: true,
      control: true,
      showEnd: false,
      videoBegin: true,
      txtInput: "",
      chatRoom: "",
      id: 0,
      commentBox: [],
      rytokenInfo: "",
      joinInfo: "",
      goodlist: "",
      temLiveId:false
    };
  },
  methods: {
    pause() {
      this.player.pause();
    },
    videoStart() {
      this.player.play();
      this.videoBegin = false;
    },
    videoPlay() {
      const player = new QPlayer({
        url: this.joinInfo.push_url,
        // url:"http://pili-media.www.0gow.com/recordings/z1.0gow-live.5d5e8410a3d5ec42f5147f7b/5330.m3u8",
        container: document.getElementById("content"),
        isLive: true,
        autoplay: false,
        muted: true,
        hls: {
          qualityName: ["低清", "标清", "高清", "超清"]
        },
        defaultViewConfig: {
          // playIcon: "https://p6.suibianyuming.com.cn/ct/video/shop/like@2x.png",
          // pauseIcon: "https://p6.suibianyuming.com.cn/red@2x.png",
          // volumeOffIcon: "https://p6.suibianyuming.com.cn/red@2x.png",
          showControls: false,
          inactiveTimeout: 1500,
          noControls: true,
          // fullscreenIcon: none,
          settingsIcon:
            "https://p6.suibianyuming.com.cn/ct/video/shopmessage@2x.png"
        }
      });
      this.player = player;
      player.on("ended", () => {
        this.showEnd = true;
      });
    },

    seeOldVideo() {
      this.showEnd = false;
      this.player.play();
    },
    getGoodList() {
      var params = {
        uid: this.$route.query.uid,
        live_id: this.temLiveId || this.videoInfo.id 
      };
      this.api.liveGoodslist(params).then(data => {
        this.goodlist = data.data;
      });
    },
    top() {
      $(".screen-box").scrollTop($(".screen-box")[0].scrollHeight);
    },
    updateDanmu(message,name) {
      var that = this;
      $("#video-body").append(message);
      this.txtInput = "";
    },
    getRandomColor(){
            var colorArr = ['1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
            var color = "";
            for(var i = 0; i < 6; i++){
                color += colorArr[Math.floor(Math.random()*15)];
            }
            return "#"+color;
     },
    getTmp(name,txtInput,color){
      return '<div style="padding-left:10px;"><span style=color:'+ color +';font-size:14px;>' + name +":</span><span style='color:white;font-size:14px;'>"+  txtInput +'</span></div>'
    },
    confirmInput() {
      if (this.txtInput.trim() == "") {
        alert("输入内容");
        return;
      }
      var that = this;
      var chatRoom = this.chatRoom;
      
      var content = that.getTmp(that.rytokenInfo.info.nickname, that.txtInput,this.getRandomColor() )
      // var content = '<div style="padding-left:10px;"><span style=color:'+ that.getRandomColor() +';font-size:14px;>' + that.rytokenInfo.info.nickname +":</span><span style='color:white;font-size:14px;'>"+  that.txtInput +'</span></div>'
      this.sendInfo(content);
      //聊天室信息
      this.chatRoom.getInfo(
        {
          order: RongIMLib.GetChatRoomType.REVERSE, // 排序方式。
          memberCount: 10 // 0 - 20
        },
        {
          onSuccess: function(chatRoomInfo) {
            console.log("获取聊天室信息成功");
            console.log(chatRoomInfo);
          },
          onError: function(error) {}
        }
      );
    },
    sendInfo(content,name) {
      var that = this;
      that.chatRoom.sendMessage(
        { content: content },
        {
          onSuccess: function(message) {
            console.log("发送聊天室消息成功");
            that.updateDanmu(content,name);
            setTimeout(that.top, 100);
          },
          onError: function(errorCode, message) {
            console.log("发送聊天室消息失败", errorCode);
          }
        }
      );
    },
    liveInfo() {
      var params = {
        uid: this.$route.query.uid
      };
      this.api.gorytoken(params).then(data => {
        this.rytokenInfo = data;
        this.sever(this.rytokenInfo).then((res)=>{
          this.livejoin()
        });
      });
      this.api.liveList().then(data => {
        this.videoInfo = data.list[0];
        this.getGoodList()
      });
    },
    livejoin() {
      var params = {
        live_id: this.temLiveId || this.videoInfo.id,
        uid: this.$route.query.uid
      };
      var content
      this.api.livejoin(params).then(data => {
        this.joinInfo = data.data;
        var Comment2 = this.getTmp(data.data.common_msg,'','red' )
        
        $('#video-body').append(Comment2);
        // this.commentBox.push(Comment2);
        this.videoPlay()
        content = this.getTmp(this.joinInfo.latest_msg, '','white' )
        this.sendInfo(content);
      });
    },
    sever(rytokenInfo) {
      var that = this
      var appInfo = {
        appKey: rytokenInfo.key,
        token: rytokenInfo.token
        // appKey:"25wehl3u2gruw",
        // token:"abpc7F/CgEZrrIhtr6rvKXyawc7RA6O2wh6eIzvzG7XNWQGPGkaAUWIkyyhD3yXpyVr4UQIWsWHZ6i84ljTyBQ=="
      };
      var chatRoomInfo = {
        chatRoomId:this.temLiveId || this.videoInfo.id,
        count: 0
      };
      return new Promise((reslove, reject) => {
        RongChatRoom.init(appInfo, chatRoomInfo, {
          onSuccess: function(chatRoom) {
            console.log(1,chatRoom);
            //注册自定义消息
            var propertys = ["title", "submitAPI", "questions"]; // 消息类中的属性名。
            registerMessage("QA", propertys);
            // 加入聊天室成功。
            console.log("加入聊天室成功");
            that.chatRoom = chatRoom;
            reslove()
            //调用示例
          },
          onError: function(error) {
            alert("加入聊天室失败。");
            // 加入聊天室失败
          },
          onMessage: function(message) {
            console.log(message);
            // if (message.objectName == "s:QA" && !message.offLineMessage) {
            //   // qaLive(message.content);
            // }
            that.updateDanmu(message.content.content);
            setTimeout(that.top, 100);
          }
        });
      });

      function registerMessage(type, propertys) {
        var messageName = type; // 消息名称。
        var objectName = "s:" + type; // 消息内置名称，请按照此格式命名 *:* 。
        var mesasgeTag = new RongIMLib.MessageTag(true, true); //true true 保存且计数，false false 不保存不计数。
        RongIMClient.registerMessageType(
          messageName,
          objectName,
          mesasgeTag,
          propertys
        );
      }
    }
  },
  created() {
   
  },

  mounted() {
     this.liveInfo()
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.screen-box {
  position: absolute;
  height: 130px;
  z-index: 123;
  // margin-top: 4px;
  bottom: 38px;
  left: 0px;
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  overflow: scroll;
  background: rgba(0, 0, 0, 0.3);
}
.scroll-height {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
}
.screen-hidden {
  position: absolute;
  height: 100px;
  z-index: 123;
  margin-top: 4px;
  bottom: 38px;
  left: 0px;
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  overflow: hidden;
}
.screen-text {
}
.screen-br {
  padding: 3px 16px;
  margin: 4px 0;
  font-size: 12px;
  // background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
}
.screen-text span {
  color: #eaceff;
}

.screen-text p {
  color: white;
  display: inline;
}
.video-index {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
}
.home-index {
  width: 100%;
  height: 100%;
  position: relative;
}
.item-info-zindex {
  display: flex;
  line-height: 40px;
  margin-top: 12px;
  position: absolute;
  top: 12px;
  left: 16px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 40px;
  padding: 0 8px 0 4px;
  z-index: 10;
}
.info-zindex-image {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
  margin-top: 4px;
}

.goods-title {
  color: white;
}

.goods-attent {
  width: 61px;
  height: 24px;
  background: rgba(244, 103, 103, 1);
  opacity: 1;
  border-radius: 12px;
  color: white;
  font-size: 12px;
  line-height: 20px;
  margin: 8px 0px 0 10px;
}

.goods-attent img {
  width: 100%;
  height: 100%;
  /* margin-left: 20rpx; */
}

.shop-share {
  width: 17px;
  height: 17px;
}
.shop-share-shandom {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.16);
  border-radius: 50%;
  opacity: 1;
  display: inline-block;
  text-align: center;
  margin-left: 13px;
  position: absolute;
  top: 16px;
  right: 16px;
  margin-top: 7px;
  margin-right: 1px;
  z-index: 10;
}
.view-shop-input {
  width: 100%;
  height: 38px;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  bottom: 0px;
  text-align: left;
  // padding-left: 42px;
  display: flex;
  z-index: 1;
}
.qplayer-controls {
  z-index: 10 !important;
}
// .view-shop-input img {
//   width: 23px;
//   height: 22px;
//   position: absolute;
//   top: 11px;
//   left: 28px;
// }

.view-shop-inputs {
  width: 45%;
  height: 30px;
  background: rgba(44, 43, 42, 0.7);
  border-radius: 20px;
  // margin: 4px 0;
  padding-left: 16px;
  box-sizing: border-box;
  font-size: 14px;
  color: #fff;
  border: none;
  box-sizing: border-box;
  position: absolute;
  bottom: 5px;
  left: 5%;
  font-size: 14px;
}
.look-shop {
  width: 90px;
  height: 30px;
  background: linear-gradient(
    45deg,
    rgba(33, 212, 253, 1) 0%,
    rgba(183, 33, 255, 1) 100%
  );
  opacity: 1;
  border-radius: 40px;
  line-height: 30px;
  position: absolute;
  text-align: center;
  bottom: 5px;
  left: 57%;
  z-index: 10;
}
.look-shop img {
  width: 14px;
  height: 15px;
  display: inline-block;
  position: absolute;
  top: 8px;
  left: 12px;
}
.look-shop span {
  font-size: 12px;
  color: #fff;
  font-weight: 500;
  display: inline-block;
  margin-left: 15px;
}
.view-shop-like {
  width: 30px;
  height: 30px;
  position: absolute;
  z-index: -1;
  right: 16px;
  top: 5px;
}
.home-index-end {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 1;
  position: absolute;
  top: 0%;
  left: 0%;
  right: 0;
  bottom: 0;
  z-index: 99;
}
.index-end-center {
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: rgba(255, 255, 255, 1);
}
.end-title {
  width: 100%;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  font-size: 17px;
}
.see-old-video {
  width: 96px;
  height: 30px;
  background: rgba(33, 160, 253, 1);
  opacity: 1;
  border-radius: 20px;
  line-height: 30px;
  text-align: center;
}
.see-video-other {
  width: 96px;
  height: 30px;
  border: 1px solid rgba(244, 103, 103, 1);
  opacity: 1;
  border-radius: 20px;
  line-height: 30px;
  text-align: center;
  margin-left: 12px;
}
.index-end-end {
  display: flex;
  margin-top: 16px;
  justify-content: center;
}
.video-is-play {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  z-index: 11;
  width: 57px;
  height: 57px;
}
// .screen-box {
//   // height: 200px;
//   // background: rgba(0, 0, 0, .5);
//   // width: 100%;
// }
</style>