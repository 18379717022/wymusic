// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../utils/request'

const appInstance=getApp()//获取全局实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,//音乐是否播放
    song:{},//歌曲详情对象
    musicId:'',//音乐的id
    musicLink:'',//音乐播放的链接
    currentTime:'00:00',//当前时长
    durationTime:'',//音乐总时长
    currentWidth:0,//进度条起始宽度
  },
  //点击播放或者暂停的回调
  musicPlay(){
    this.setData({
      isPlay:!this.data.isPlay
    })
    let {musicId,musicLink}=this.data
    let {isPlay}=this.data
    this.musicControl(isPlay,musicId,musicLink)
  },
  //控制音乐播放/暂停的功能函数
  async musicControl(isPlay,musicId,musicLink){
   
    if(isPlay){
      //音乐播放
      if(!musicLink){
        let musicLinkData=await request('/song/url',{id:musicId})
        let musicLink=musicLinkData.data[0].url//获取播放链接
        this.setData({
          musicLink
        })
      }
      let{musicLink}=this.data
      this.backgroundAudioManager.src=musicLink
      this.backgroundAudioManager.title=this.data.song.name
    }else{
       //音乐暂停
       this.backgroundAudioManager.pause()
    }
  },
  //点击切歌的回调
  handleSwitch(event){
    let type=event.currentTarget.id;
    //关闭当前播放的音乐
    this.backgroundAudioManager.stop()
    //订阅来自recommendSong页面发布的musicId消息
    PubSub.subscribe('musicId',(msg,musicId)=>{
      console.log(musicId)
      //取消订阅
      PubSub.unsubscribe('musicId')
      //获取音乐的详情信息
      this.getMusicInfo(musicId)
      //自动播放当前的音乐
      this.musicControl(true,musicId)
    })
    //发布消息数据给recommendSong页面
    PubSub.publish('switchType',type)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId=options.song
    this.getMusicInfo(musicId)
    this.setData({
      musicId
    })
    //判断当前页面音乐是否在播放
    if(appInstance.globalData.isMusicPlay&&appInstance.globalData.musicId===musicId){
      //修改当前音乐播放状态为true
      this.setData({
        isPlay:true
      })
    }
     //创建控制音乐播放的实例
     this.backgroundAudioManager=wx.getBackgroundAudioManager();
     this.backgroundAudioManager.onPlay(()=>{
       this.changePlayState(true)
       appInstance.globalData.musicId=musicId
     });
     this.backgroundAudioManager.onPause(()=>{
       this.changePlayState(false)
     });
     this.backgroundAudioManager.onStop(()=>{
       this.changePlayState(false)
     });
     //监听音乐自然播放结束
     this.backgroundAudioManager.onEnded(()=>{
       //自动切换到下一首音乐,并自动播放
       PubSub.publish('switchType','next')
       //将实时进度条的长度还原为0,实时播放的时间也还原成0
       this.setData({
         currentWidth:0,
         currentTime:'00:00'
       })

     })
     //监听音乐实时播放的进度
     this.backgroundAudioManager.onTimeUpdate(()=>{
       let currentTime=moment(this.backgroundAudioManager.currentTime*1000).format('mm:ss')
       let currentWidth=this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration*450
       this.setData({
         currentTime,
         currentWidth
       })
     })
  },
  //修改播放状态的功能函数
  changePlayState(isPlay){
    this.setData({
      isPlay:isPlay
    })
    appInstance.globalData.isMusicPlay=isPlay;
  },
  //获取音乐详情的功能函数
  async getMusicInfo(musicId){
    let songData=await request('/song/detail',{ids:musicId})
    let durationTime=moment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song:songData.songs[0],
      durationTime
    })
    //动态修改窗口的标题
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})