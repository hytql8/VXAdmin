<script lang="tsx" setup>
import { reactive, ref, computed, unref } from "vue"
import { Form } from "@/components/Form"
import { FormSchema } from "@/components/Form"
import { useForm } from "@/hooks/useForm"
import { useValidator } from "@/hooks/useValidator"
import { useI18n } from "@/hooks/useI18n"
import { ElButton, ElMessage } from "element-plus"
import { login } from "@/api/user"
import { useDebounceFn } from "@vueuse/core"
import { omit } from "lodash-es"
import { staticRouter } from "@/router"
import { useRoutersStore } from "@/store/modules/router"
import { RouteRecordRaw, useRouter } from "vue-router"
import { useAppStore } from "@/store/modules/app"
const appSotre = useAppStore()

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods
const { required } = useValidator()
const { t } = useI18n()
const { push } = useRouter()
const routersStore = useRoutersStore()

const routerMode = computed(() => appSotre.getRouterMode)
const rules = {
  username: [required()],
  password: [required()]
}

const loading = ref(false)
const schema = reactive<FormSchema[]>([
  {
    field: "username",
    label: t("login.username"),
    value: "admin",
    component: "Input",
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: "admin or test"
    }
  },
  {
    field: "password",
    label: t("login.password"),
    value: "admin",
    component: "Input",
    componentProps: {
      type: "password"
    },
    colProps: {
      span: 24
    }
  },
  {
    field: "login",
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <ElButton style="width: 100%;" loading={loading.value} type="primary" onClick={signIn}>
                {t("login.login")}
              </ElButton>
            </>
          )
        }
      }
    }
  }
])

const signIn = async () => {
  const formRef = await getElFormExpose()
  const vali = await formRef?.validate()
  if (vali) {
    // 发送请求
    const formData = await getFormData()
    Login(formData)
    return
  }
  ElMessage.error("登录失败，校验不通过")
}

const Login = useDebounceFn(async ({ username, password }) => {
  const loginRes = await login({
    username,
    password
  })
  let user = omit(loginRes.data.data, "routers")
  // 存储user信息
  routersStore.setUser(user)
  // 写入router
  routersStore.setRouters(unref(routerMode) === "static" ? staticRouter : (loginRes.data.data.routers as RouteRecordRaw[]))
  if (loginRes.data.code === 200) {
    push({
      name: "Redirect",
      params: {
        path: "dashboard/workplace",
        type: "async"
      }
    })
  }
}, 300)
</script>
<template>
  <Form :schema="schema" :rules="rules" label-position="top" hide-required-asterisk size="large" @register="formRegister" />
</template>
