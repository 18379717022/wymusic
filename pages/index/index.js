// pages/index/index.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'向往未来',
    bannerList:[],
    recommendsong:{},
    topList:[]
  },
  //点击每日推荐,跳转至recommendSong页面
  toRecommendSong(){
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong',
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.getbannersdata()
    this.getrecommenddata()
    this.getnumdata()
  },
  async getbannersdata(){
    let bannerListData=await request('/banner',{type:2});
    this.setData({
      bannerList:bannerListData.banners
    })
  },
  async getrecommenddata(){
    let reson=await request('/personalized')
    let recommenddata=reson.result
    this.setData({
      recommendsong:recommenddata
    })
  },
  async getnumdata(){
    let index=0;
    let resultArr=[];
    while(index<5){
      let topListData=await request('/top/list',{idx:index++});
      let topListItem={name:topListData.playlist.name,tracks:topListData.playlist.tracks.slice(0,3)};
      resultArr.push(topListItem);
      this.setData({
        topList:resultArr
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成,页面全部加载完成
   */
  onReady: function () {
    console.log('onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload')
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