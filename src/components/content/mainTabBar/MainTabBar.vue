<template>
  <tab-bar>
    <tab-bar-item path="/home" activeColor="deeppink">
      <template v-slot:icon>
        <img src="@/assets/img/tabbar/home.svg" alt="">
      </template>
      <template v-slot:icon-active>
        <img src="@/assets/img/tabbar/home_active.svg" alt="">
      </template>
      <template v-slot:text>
        <div>首页</div>
      </template>
    </tab-bar-item>

    <tab-bar-item path="/category">
      <template v-slot:icon>
        <img src="@/assets/img/tabbar/category.svg" alt="">
      </template>
      <template v-slot:icon-active>
        <img src="@/assets/img/tabbar/category_active.svg" alt="">
      </template>
      <template v-slot:text>
        <div>分类</div>
      </template>
    </tab-bar-item>

    <tab-bar-item path="/cart">
      <template v-slot:icon>
        <img src="@/assets/img/tabbar/shopcart.svg" alt="">
      </template>
      <template v-slot:icon-active>
        <img src="@/assets/img/tabbar/shopcart_active.svg" alt="">
      </template>
      <template v-slot:text>
        <div>购物车</div>
      </template>
    </tab-bar-item>

    <tab-bar-item path="/profile">
      <template v-slot:icon>
        <img src="@/assets/img/tabbar/profile.svg" alt="">
      </template>
      <template v-slot:icon-active>
        <img src="@/assets/img/tabbar/profile_active.svg" alt="">
      </template>
      <template v-slot:text>
        <div>我的</div>
      </template>
    </tab-bar-item>

  </tab-bar>
</template>

<script>
import TabBar from "@/components/common/tabbar/TabBar";
import TabBarItem from "@/components/common/tabbar/TabBarItem";
export default {
  name: "MainTabBar",
  components: {
    TabBarItem,
    TabBar
  }
}
</script>

<style>

</style>
