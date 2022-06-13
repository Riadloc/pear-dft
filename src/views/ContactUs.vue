<template>
  <div class="contact-us h-screen flex flex-col justify-center items-center">
    <pear-navbar title="联系我们" fixed left-arrow />
    <van-image
      width="80vw"
      src="/mp.jpg"
    >
      <template v-slot:loading>
        <van-loading type="spinner" size="20" />
      </template>
    </van-image>
    <h3 class="mt-4 text-white font-medium text-lg">关注公众号了解更多资讯</h3>
    <a class="mt-2 text-green-500 text-sm underline" href="/mp.jpg" download="梨数字公众号.jpg">保存至手机</a>
  </div>
</template>
