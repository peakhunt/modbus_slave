import Vue from 'vue'
import Router from 'vue-router'
import ModbusSlave from '@/components/ModbusSlave'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'modbus-slave-view',
      component: ModbusSlave
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
