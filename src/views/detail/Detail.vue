<template>
  <detail-nav-bar></detail-nav-bar>
  <detail-swiper :top-images="topImages"></detail-swiper>
  <detail-base-info :goods="goods"></detail-base-info>
</template>

<script>
import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
import {getDetail, Goods, Shop, GoodsParam} from "@/network/detail";
import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo
  },
  data() {
    return {
      iid: null,
      topImages: [1],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {}
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
    })

  }
}
</script>

<style scoped>

</style>
