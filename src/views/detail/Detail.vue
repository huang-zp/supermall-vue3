<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            :pull-up-load="true"
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>

      <detail-param-info :param-info="paramInfo" ref="params"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
      <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>
    <back-top @click.native="backTop" v-show="isShowBackTop"/>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
  </div>
</template>

<script>
import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
import {getDetail, getRecommend, Goods, Shop, GoodsParam} from "@/network/detail";
import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
import Scroll from "@/components/common/scroll/Scroll";
import DetailGoodsInfo from "@/views/detail/childComps/DetailGoodsInfo";
import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
import GoodsList from "@/components/content/goods/GoodsList";
import {itemListenerMixin, backTopMixin} from "@/common/mixin";
import {debounce} from "@/common/untils";
import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";

export default {
  name: "Detail",
  components: {
    DetailParamInfo,
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar
  },
  mixins:[itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [1],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getthemeTopYs: null,
      currentIndex: 0
    }
  },
  created() {
    this.iid = this.$route.params.iid

    getDetail(this.iid).then(res => {
      const data = res.result
      this.topImages = data.itemInfo.topImages;

      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      this.shop = new Shop(data.shopInfo)
      this.detailInfo = data.detailInfo;
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }

      //因为数据可能返回不过来，DOM可能没渲染，函数执行太多次（加了节流）
      // 放到图片加载完的响应事件函数中去执行
      this.getthemeTopYs = debounce(() => {
        this.themeTopYs = []

        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
      }, 100)
    })

    getRecommend().then(res => {
      this.recommends = res.data.list
    })

  },
  methods: {
    imageLoad() {
      if(this.$refs.scroll){
        this.$refs.scroll.refresh()
      }
      // 图片加载完后计算各个模块的高度
      this.getthemeTopYs()
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
    },
    contentScroll(position) {
      //获取Y值
      const positionY = -position.y

      let length = this.themeTopYs.length
      for (let i = 0; i < length - 1; i++) {

        if (this.currentIndex !== i && ((positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]))) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }

      // 判断BackTop是否显示
      this.isShowBackTop = (-position.y) > 1000
    },
    addToCart() {
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      this.$store.dispatch('addCart', product).then( res => {
          this.$toast.show(res, {
            position: 'top',
            duration: 500
          })
        }
      )

    }
  },
  // 组件消失，取消监听事件总线
  unmounted() {
    this.emitter.off('itemImageLoad', this.itemImageListener)
  },

}
</script>

<style scoped>
#detail {
  height: 100vh;
  position: relative;
  z-index: 1;
  background-color: #fff;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
.content {
  background-color: #fff;
  height: calc(100% - 44px - 49px);
  overflow: hidden;
}
</style>
