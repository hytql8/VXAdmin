<script lang="tsx" setup>
import { computed, unref } from "vue"
import { useAppStore } from "@/store/modules/app"
import { getStaticSource } from "@/utils"

const appStore = useAppStore()
const isFold = computed(() => appStore.getIsFold)

const menuWidth = computed(() => (unref(isFold) ? "0" : "148.5px"))

const logoUrl = getStaticSource("@/assets/imgs/VxLogo.png")
const vxTitle = import.meta.env.VITE_APP_TITLE
</script>
<template>
  <div class="vx-logo">
    <div class="vx-logo__image">
      <img :src="logoUrl" />
    </div>
    <div class="vx-logo__title">
      <span>{{ vxTitle }}</span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use "./Logo.scss";
.vx-logo__title {
  width: v-bind(menuWidth);
}
</style>
