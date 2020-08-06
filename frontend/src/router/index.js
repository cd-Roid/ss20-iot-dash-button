import Vue from 'vue';
import VueRouter from 'vue-router';
import OrderMode from '@/views/OrderMode.vue';
import ActionMode from '@/views/ActionMode.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Order view',
    component: OrderMode,
  },
  {
    path: '/action',
    name: 'Action Mode',
    component: ActionMode,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
