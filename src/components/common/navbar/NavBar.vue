<template>
	<div class="tab-nav">
		<div class="left"><slot name="left"></slot></div>
		<div class="center"><slot name="center"></slot></div>
		<div class="right"><slot name="right"></slot></div>
	</div>
</template>

<script>
	export default {
		name: 'NavBar'
	}
</script>

<style scoped>
	.tab-nav {
    height: 44px;
    line-height: 44px;
    display: flex;
    text-align: center;
    box-shadow: 0 1px 1px rgba(100, 100, 100, .1);
    }

  .left {
    width: 60px;
  }
  .center {
    flex: 1;
  }
  .right {
    width: 60px;
  }
</style>
