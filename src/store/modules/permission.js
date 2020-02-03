import { asyncRoutes, constantRoutes } from '@/router'
import { getRoutes } from '@/api/role'
import Layout from '@/layout'
import { menuDg } from '@/utils/common'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

/**
 * 后台查询的菜单数据拼装成路由格式的数据
 * @param routes
 */
export function generaMenu(routes, data) {
  data.forEach(item => {
    // alert(JSON.stringify(item))
    const menu = item
    routes.push(menu)
  })
}
const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // const loadMenuData = []
      // 先查询后台并返回左侧菜单数据并把数据添加到路由
      // getRoutes().then(response => {
      //   let data = response
      //   if (0) {
      //     this.$message({
      //       message: '菜单数据加载异常',
      //       type: 0
      //     })
      //   } else {
      //     data = [
      //
      //       {
      //         path: '/roles',
      //         component: Layout,
      //         meta: {
      //           title: '角色',
      //           icon: 'peoples',
      //           roles: ['admin', 'editor'] // you can set roles in root nav
      //         },
      //         children: [
      //           {
      //             path: 'index',
      //             component: () => import('@/views/roles/index'),
      //             name: 'Roles',
      //             meta: { title: '角色主界面', icon: 'peoples', noCache: true }
      //           },
      //           {
      //             path: 'add',
      //             component: () => import('@/views/roles/add'),
      //             name: 'Addrole',
      //             meta: { title: '增加角色', icon: 'peoples', noCache: true }
      //           }
      //         ]
      //       }
      //     ]
      //     Object.assign(loadMenuData, data)
      //     console.log(loadMenuData)
      //     generaMenu(asyncRoutes, loadMenuData)
      //     console.log(data)
      //     console.log(asyncRoutes)
      //     let accessedRoutes
      //
      //     if (roles.includes('admin')) {
      //       // alert(JSON.stringify(asyncRoutes))
      //       accessedRoutes = asyncRoutes || []
      //     } else {
      //       accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      //     }
      //     console.log(accessedRoutes)
      //     commit('SET_ROUTES', accessedRoutes)
      //     resolve(accessedRoutes)
      //   }
      //   // generaMenu(asyncRoutes, data)
      // }).catch(error => {
      //   console.log(error)
      // })
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = menuDg(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
