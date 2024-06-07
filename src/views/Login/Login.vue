<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { LocaleSwitch } from "@/components/LocaleSwitch"
import { ThemeSwitch } from "@/components/ThemeSwitch"
import type { TabsPaneContext } from "element-plus"
import LoginForm from "./components/LoginForm.vue"
import { Qrcode } from "@/components/Qrcode"
import { useI18n } from "@/hooks/useI18n"

const activeName = ref("login")
const { t } = useI18n()

const handleClick = (tab: TabsPaneContext) => {
  console.log("tab切换监听：", tab.index)
}

const vxTitle = import.meta.env.VITE_APP_TITLE
const isAnimate = ref(false)
const logoUrl = new URL("@/assets/imgs/VxLogo.png", import.meta.url).href

onMounted(() => {
  isAnimate.value = true
})
</script>
<template>
  <div class="vx-login">
    <ElContainer>
      <ElHeader>
        <ElRow :gutter="24">
          <ElCol :span="16"><div class="grid-content ep-bg-purple" /></ElCol>
          <ElCol :span="8">
            <div class="vx-login__avatar">
              <LocaleSwitch />
              <ThemeSwitch />
            </div>
          </ElCol>
        </ElRow>
      </ElHeader>
      <ElMain class="vx-login__main">
        <div class="loginBox">
          <div class="loginBox__title">
            <img :src="logoUrl" />
            <span>{{ vxTitle }}</span>
          </div>
          <div class="loginBox__desp">{{ t("login.tips") }}</div>
          <div class="loginBox__container">
            <ElTabs class="loginBox__tabs" v-model="activeName" @tab-click="handleClick">
              <ElTabPane :label="t('login.login')" name="login"><LoginForm /></ElTabPane>
              <ElTabPane :label="t('login.tabQrLogin')" name="qr-login">
                <div class="qrcode-login">
                  <Qrcode value="http://hytql8.top" />
                </div>
              </ElTabPane>
            </ElTabs>
          </div>
        </div>
      </ElMain>
    </ElContainer>
  </div>
</template>
<style lang="scss">
@use "./Login.scss";
</style>
