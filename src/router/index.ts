import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { title: 'Login' },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { title: 'Criar Conta' },
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
          meta: { title: 'Dashboard' },
        },
        {
          path: '/customers',
          name: 'customers-list',
          component: () => import('@/views/customers/CustomerListView.vue'),
          meta: { title: 'Clientes' },
        },
        {
          path: '/customers/create',
          name: 'customer-create',
          component: () => import('@/views/customers/CustomerFormView.vue'),
          meta: { title: 'Novo Cliente' },
        },
        {
          path: '/customers/:id',
          name: 'customer-edit',
          component: () => import('@/views/customers/CustomerFormView.vue'),
          meta: { title: 'Editar Cliente' },
        },
        {
          path: '/products',
          name: 'products-list',
          component: () => import('@/views/products/ProductListView.vue'),
          meta: { title: 'Produtos' },
        },
        {
          path: '/products/create',
          name: 'product-create',
          component: () => import('@/views/products/ProductFormView.vue'),
          meta: { title: 'Novo Produto' },
        },
        {
          path: '/products/:id',
          name: 'product-edit',
          component: () => import('@/views/products/ProductFormView.vue'),
          meta: { title: 'Editar Produto' },
        },
        {
          path: '/orders',
          name: 'orders-list',
          component: () => import('@/views/orders/OrderListView.vue'),
          meta: { title: 'Pedidos' },
        },
        {
          path: '/orders/create',
          name: 'order-create',
          component: () => import('@/views/orders/OrderFormView.vue'),
          meta: { title: 'Novo Pedido' },
        },
        {
          path: '/orders/:id/edit',
          name: 'order-edit',
          component: () => import('@/views/orders/OrderFormView.vue'),
          meta: { title: 'Editar Pedido' },
        },
        {
          path: '/orders/:id',
          name: 'order-detail',
          component: () => import('@/views/orders/OrderDetailView.vue'),
          meta: { title: 'Detalhe do Pedido' },
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import('@/views/profile/ProfileView.vue'),
          meta: { title: 'Meu Perfil' },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Página não encontrada' },
    },
  ],
})

router.beforeEach((to) => {
  const token = localStorage.getItem('accessToken')

  const pageTitle = to.meta.title as string | undefined
  document.title = pageTitle ? `${pageTitle} - Tek-System` : 'Tek-System'

  if (to.meta.requiresAuth && !token) {
    return { name: 'login' }
  }

  if (to.name === 'login' && token) {
    return { name: 'dashboard' }
  }
})

export default router
