import {debounce} from "@/common/untils";
import BackTop from "@/components/content/backTop/BackTop";

export const itemListenerMixin = {
  data() {
    return {
      itemImageListener: null
    }
  },
  mounted() {
    // 1.图片加载完成的事件监听
    const refresh = debounce(this.$refs.scroll.refresh, 100)
    this.itemImageListener = () => {
      refresh()
    }
    // 监听到itemImgLoad事件，就执行itemImageListener函数，而itemImageListener正好是个防抖函数
    this.emitter.on("itemImgLoad", this.itemImageListener)

  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backTop() {
      this.$refs.scroll.scrollTo(0, 0, 1000)
    }
  }
}
