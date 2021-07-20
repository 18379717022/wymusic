// pages/viedo/viedo.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[],//导航标签数据
    navId:'',
    videoList:[],//视频列表数据
    videoId:'',
    videoUpdateTime:[],//记录video的播放时长
    isTriggered:false,//标识下拉刷新是否被触发
  },
  //切换导航的回调
  changeNav(event){
    let navId=event.currentTarget.id;//通过id向event传参的时候如果传的是number会自动转换成string
    this.setData({
      navId:navId*1,
      videoList:[]
    })
    //显示正在加载
    wx.showLoading({
      title: '正在加载',
    })
    //动态获取当前导航对应的视频数据
    this.getVideoList(this.data.navId)
  },
  //点击播放/继续播放的回调
  handlePlay(event){
    //需求
    //1.在点击播放的事件中需要找到上一个播放的视频
    //2.在播放新的视频之前关闭上一个正在播放的视频

    //关键:如何找到上一个视频的实例对象
    let vid=event.currentTarget.id
    //this.vid!==vid && this.videoContext && this.videoContext.stop()
    //this.vid=vid
    //更新data中videoId的状态数据
    this.setData({
      videoId:vid
    })
    //创建控制video标签的实例对象
    this.videoContext=wx.createVideoContext(vid)
    //判断当前的视频之前是否播放过,是否有播放记录,如果有,跳转到指定的播放位置
    let{videoUpdateTime}=this.data;
    let videoItem=videoUpdateTime.find(item=>item.vid===vid)
    if(videoItem){
      this.videoContext.seek(videoItem.currentTime)
    }
    this.videoContext.play()
    this.setData({
      videoId:vid
    })
  },
  //监听视频播放进度的回调
  handleTimeUpdate(event){
    let videoTimeObj={vid:event.currentTarget.id,currentTime:event.detail.currentTime};
    let {videoUpdateTime}=this.data;
    //判断记录播放时长的videoUpdateTime数组中是否有当前视频的播放记录
    //如果有,在原有的播放记录中修改播放时间为当前的播放时间
    //如果没有,需要在数组中添加当前视频的播放对象
    let videoItem=videoUpdateTime.find(item => item.vid===videoTimeObj.vid);
    if(videoItem){
      videoItem.currentTime=event.detail.currentTime
    }else{
      videoUpdateTime.push(videoTimeObj)
    }
    this.setData({
      videoUpdateTime
    })
  },
  //视频播放结束时调用
  handleEnded(event){
    //移除记录播放记录数组中的对象
    let{videoUpdateTime}=this.data;
    videoUpdateTime.splice(videoUpdateTime.findIndex(item=>item.vid===event.currentTarget.id),1)
  },
  //自定义下拉刷新的回调
  handleRefresher(){
    this.getVideoList(this.data.navId)
  },
  //自定义上拉触底的回调
  handleToLower(){
    //数据分页:1.后端分页,2.前端分页
    
  },
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupListData()
  },
  //获取导航数据
  async getVideoGroupListData(){
    let videoGroupListData=await request('/video/group/list')
    this.setData({
      videoGroupList:videoGroupListData.data.slice(0,14),
      navId:videoGroupListData.data[0].id
    })
    this.getVideoList(this.data.navId)
  },
  //获取视频列表数据
  async getVideoList(navId){
    if(!navId){
      return;
    }
    let videoListData=await request('/video/group',{id:navId})
    //关闭消息提示框
    wx.hideLoading()
    this.setData({
      videoList:videoListData.datas,
      isTriggered:false,//关闭下拉刷新
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
  onShareAppMessage: function ({from}) {
    if(from==='button'){
      return{
        title:'来自button的转发',
        page:'/pages/viedo/video',
        imageUrl:'/static/images/nvsheng.jpg'
      }
    }else{
      return{
        title:'来自menu的转发',
        page:'/pages/viedo/video',
        imageUrl:'/static/images/nvsheng.jpg'
      }
    }
  }
})