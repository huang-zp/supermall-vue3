<template>
  <div id="home">
<nav-bar class="home-nav">
  <template v-slot:center>
    <div>购物车</div>
  </template>
</nav-bar>
    <tab-control class="tab-control"
                 :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 v-show="isTabShow"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
<home-swiper :banners="banners" @swiperImgLoad="swiperImgLoad"></home-swiper>
  <home-recommend-view :recommends="recommends"></home-recommend-view>
  <home-feature-view></home-feature-view>
    <tab-control :titles="['流行', '新款', '精选']" @tabClick="tabClick" ref="tabControl2"></tab-control>
    <goods-list :goods="goods[currentType].list"></goods-list>
  </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import NavBar from "@/components/common/navbar/NavBar";
  import {getHomeMultidata, getHomeGoods} from "@/network/home";
  import HomeSwiper from "@/views/home/childComps/HomeSwiper";
  import HomeRecommendView from "@/views/home/childComps/HomeRecommendView";
  import HomeFeatureView from "@/views/home/childComps/HomeFeatureView";
  import TabControl from "@/components/content/tabControl/TabControl";
  import GoodsList from "@/components/content/goods/GoodsList";
  import Scroll from "@/components/common/scroll/Scroll";
  import BackTop from "@/components/content/backTop/BackTop";
  import {debounce} from "@/common/untils";

  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      HomeRecommendView,
      HomeFeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data() {
      return {
        // 应该是轮播图的原因，当请求还没过来的时候，数据为空，轮播图那里会出问题
        banners: [1],
        recommends: [],
        goods: {
          'pop': {page:0, list:[]},
          'new': {page:0, list:[]},
          'sell': {page:0, list:[]}
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabShow: false
      }
    },
    created() {
      this.getHomeMultidata()

      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')


    },
    mounted() {
      const refresh = debounce(this.$refs.scroll.refresh, 50)
      this.emitter.on("itemImgLoad", () => {
        refresh()
      });
    },
    methods: {
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      getHomeMultidata() {
        getHomeMultidata().then(
          res => {
            this.banners = res.data.banner.list
            this.recommends = res.data.recommend.list
          }
        )
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(
          res => {
            this.goods[type].list.push(...res.data.list)
            this.goods[type].page += 1

          }
        )
      },
      contentScroll(position) {
        this.isShowBackTop = (-position.y) > 1000
        this.isTabShow = (-position.y) > this.tabOffsetTop;
      },
      loadMore() {
        this.getHomeGoods(this.currentType)
        this.$refs.scroll.finishPullUp()
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0)
      },
      swiperImgLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
      activated() {
        this.$refs.scroll.scrollTo(0, this.saveY, 0)
        this.$refs.scroll.refresh();
      },
      deactivated() {
        this.saveY = this.$refs.scroll.scroll.y
      },
    }
  }
</script>
<style scoped>
#home {
  /*padding-top: 44px;*/
  height: 100vh;
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  /*position: fixed;*/
  /*left: 0;*/
  /*right: 0;*/
  /*top: 0;*/
  /*z-index: 9;*/
}

.content {
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
.tab-control {
  position: relative;
  z-index: 9;
}
</style>
