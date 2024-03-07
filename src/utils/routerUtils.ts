import { cloneDeep, remove } from "lodash-es"
import type { RouteRecordRaw } from "vue-router"
import { isUrl } from "./is"

const Layout = () => import("@/layout/src/index.vue")

// 处理静态路由，降级，keepalive最多只支持缓存二级, 此方法直接使用forEach直接改变传入的routes
/**  
@param routes 传入的原始路由
@param level 原始level（不建议改变，如果要改，请注意expectedLevel需要＞level的值）
@param parentRoute 临时暂存的parent节点，用于赋值
@param expectedLevel 需要降级为最多几级，比如level === 1 ，expectedLevel === 2时，此时最多有（expectedLevel - level + 1） = 2级路由 
**/
const toLowerRoutes = (
  routes: RouteRecordRaw[],
  level: number = 1,
  parentRoute: Nullable<RouteRecordRaw> = null,
  expectedLevel: number = 2
) => {
  routes.forEach((route, index) => {
    if (route?.children?.length) {
      if (level === expectedLevel) {
        let routeEntity: RouteRecordRaw = {
          path: route.path,
          name: route.name,
          component: route.component,
          meta: route.meta,
          children: []
        }
        // 将level > expectedLevel的路由项移动到对应的level === expectedLevel的父级路由下
        routes[index] = routeEntity
        parentRoute = routeEntity
      }
      if (level > expectedLevel && parentRoute !== null) {
        let routeEntity: RouteRecordRaw = {
          path: route.path,
          name: route.name,
          component: route.component,
          meta: route.meta,
          children: []
        }
        // 将level > 2的路由项移动到对应的level === 2的父级路由的children数组中
        parentRoute.children.push(routeEntity)
      }
      toLowerRoutes(route.children, level + 1, parentRoute) // 递归调用修改子路由
    } else {
      // 当level > expectedLevel且 route?.children?.length === false时说明此节点是最底层子节点
      if (level > expectedLevel) {
        let routeEntity: RouteRecordRaw = {
          path: route.path,
          name: route.name,
          component: route.component,
          meta: route.meta,
          children: []
        }
        // 将level > 2的路由项移动到对应的level === 2的父级路由的children数组中
        parentRoute.children.push(routeEntity)
      }
    }
  })
}

// 处理静态路由，降级，keepalive最多只支持缓存二级, 此方法使用deepClone处理，返回一个新的路由，不改变原始router
/**  
@param routes 传入的原始路由
@param level 原始level（不建议改变，如果要改，请注意expectedLevel需要＞level的值）
@param parentRoute 临时暂存的parent节点，用于赋值
@param expectedLevel 需要降级为最多几级，比如level === 1 ，expectedLevel === 2时，此时最多有（expectedLevel - level + 1） = 2级路由 
**/

const generateLowerRoutes = (
  routes: RouteRecordRaw[],
  level: number = 1,
  parentRoute: Nullable<RouteRecordRaw> = null,
  expectedLevel: number = 2
): Nullable<RouteRecordRaw[]> => {
  if (!routes?.length) {
    return null
  }
  let cloneRoutes: RouteRecordRaw[] = cloneDeep(routes)
  if (!cloneRoutes?.length) {
    return null
  }
  toLowerRoutes(cloneRoutes, level, parentRoute, expectedLevel)
  return cloneRoutes
}

// 生成菜单渲染的expectedLevel级的路由 ,当前加载的路由需要去掉根目录， login和错误页面路由
/**  
@param staticRouter 传入的原始路由
**/
const createMenuRoutes = (staticRouter: RouteRecordRaw[]): RouteRecordRaw[] => {
  const localRoutes: RouteRecordRaw[] = cloneDeep(staticRouter)
  remove(localRoutes, route => route.path === "/" || route.name === "404" || route.name === "Login")
  toLowerRoutes(localRoutes)
  return localRoutes
}

// 处理路由：全部打平为一级
/**  
@param staticRouter 传入的原始路由
**/
const flattenRoutes = (routes: RouteRecordRaw[]): RouteRecordRaw[] => {
  let flattenedRoutes: RouteRecordRaw[] = []

  routes.forEach(route => {
    const { children, ...args } = route

    flattenedRoutes.push(args as RouteRecordRaw) // 将当前路由项加入结果数组

    if (children && children.length > 0) {
      const childRoutes = flattenRoutes(children) // 递归处理子路由
      flattenedRoutes.push(...childRoutes) // 将子路由项加入结果数组
    }
  })
  return flattenedRoutes
}

// 根据传入路由找到父级路由
/**
@param routes 原始路由
@param path 需要获取当前路由的path 默认为空
 */
const findRoutePath = (routes: RouteRecordRaw[], path: string) => {
  for (const route of routes) {
    let findPath = route.path.split("/")
    if (findPath[findPath.length - 1] === path) {
      return route.path
    }
    if (route.children?.length) {
      findRoutePath(route.children, path)
    }
  }
}

// 根据传入父级path和当前的path找到当前应指向并跳转的路由
/**
@param parentPath 父级path
@param path 当前path
 */
const pathResolve = (parentPath: string, path: string) => {
  if (isUrl(path)) return path
  const childPath = path.startsWith("/") || !path ? path : `/${path}`
  return `${parentPath}${childPath}`.replace(/\/\//g, "/")
}

/**
 * @description 处理异步/动态路由
 * @param routers 异步/动态路由
 */
const generateDynamicRouters = (routers: RouteRecordRaw[]) => {
  let returnRouters = [] as RouteRecordRaw[]
  let backupRouters = cloneDeep(routers)
  returnRouters = traverseRouting(backupRouters)
  return returnRouters
}

const traverseRouting = (routers: RouteRecordRaw[]): RouteRecordRaw[] => {
  for (let v of routers) {
    let component = v.component as any
    component = component === "layout" ? Layout : null
    if (v.children && v?.children?.length) {
      traverseRouting(v.children)
    }
  }
  return routers
}

export { toLowerRoutes, generateLowerRoutes, createMenuRoutes, flattenRoutes, findRoutePath, pathResolve, generateDynamicRouters }
