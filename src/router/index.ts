import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '/',
          redirect: '/dashboard',
        },
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue'),
        },
        {
          path: '/customers',
          name: 'customers-list',
          component: () => import('@/views/customers/CustomerListView.vue'),
        },
        {
          path: '/customers/create',
          name: 'customer-create',
          component: () => import('@/views/customers/CustomerFormView.vue'),
        },
        {
          path: '/customers/:id',
          name: 'customer-edit',
          component: () => import('@/views/customers/CustomerFormView.vue'),
        },
        {
          path: '/products',
          name: 'products-list',
          component: () => import('@/views/products/ProductListView.vue'),
        },
        {
          path: '/products/create',
          name: 'product-create',
          component: () => import('@/views/products/ProductFormView.vue'),
        },
        {
          path: '/products/:id',
          name: 'product-edit',
          component: () => import('@/views/products/ProductFormView.vue'),
        },
        {
          path: '/orders',
          name: 'orders-list',
          component: () => import('@/views/orders/OrderListView.vue'),
        },
        {
          path: '/orders/create',
          name: 'order-create',
          component: () => import('@/views/orders/OrderFormView.vue'),
        },
        {
          path: '/orders/:id/edit',
          name: 'order-edit',
          component: () => import('@/views/orders/OrderFormView.vue'),
        },
        {
          path: '/orders/:id',
          name: 'order-detail',
          component: () => import('@/views/orders/OrderDetailView.vue'),
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import('@/views/profile/ProfileView.vue'),
        }]},
  ],
})

router.beforeEach((to) => {
  const token = localStorage.getItem('accessToken')

  if (to.meta.requiresAuth && !token) {
    return { name: 'login' }
  }

  if (to.name === 'login' && token) {
    return { name: 'dashboard' }
  }
})

export default router
