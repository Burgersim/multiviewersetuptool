import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Buefy)
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {title: 'MULTIVERZE LAY-Z'},
    mode: 'undefined'
  },
  {
    path: '/phase',
    name: 'Phase',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Phase.vue'),
    meta: {title: 'MULTIVERZE PHASE'}
  }
]

const router = new VueRouter({
  routes
})

export default router
