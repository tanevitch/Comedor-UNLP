import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { store } from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/ingresar',
    name: 'ingresar',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/auth/IniciarSesionView.vue')
  },
  {
    path: '/registrarse',
    name: 'registrarse',
    component: () => import('../views/auth/RegistrarseView.vue')
  },
  {
    path: '/admin/solicitudes',
    name: 'solicitudes',
    component: () => import('../views/SolicitudesView.vue')
  },
  {
    path: '/admin/menu',
    name: 'menu',
    component: () => import('../views/menu/ListView.vue')
  },
  {
    path: '/admin/menu/nuevo',
    name: 'menu_nuevo',
    component: () => import('../views/menu/FormView.vue')
  }
  ,
  {
    path: '/admin/menu/editar/:id',
    name: 'menu_editar',
    component: () => import('../views/menu/FormView.vue')
  },
  {
    path: '/admin/menu/habilitar/:id',
    name: 'menu_habilitar',
    component: () => import('../views/menu/HabilitarView.vue'),

  },
  {
    path: '/grilla',
    name: 'grilla',
    component: () => import('../views/GrillaMenuView.vue')
  },
  {
    path: '/tickets/misTickets',
    name: 'mis_tickets',
    component: () => import('../views/tickets/MisTicketsView.vue')
  },
  {
    path: '/tickets/carrito',
    name: 'carrito',
    component: () => import('../views/tickets/CarritoView.vue')
  },
  {
    path: "*",
    component: HomeView
  },
  {
    path: '/compras/misCompras',
    name: 'mis_compras',
    component: () => import('../views/compras/MisComprasView.vue')
  },
  {
    path: '/compras/mis_compras/tickets/:id',
    name: 'mis_tickets_compra',
    component: () => import('../views/compras/MisTicketsCompraView.vue')
  },
  {
    path: '/admin/menu/visualizarStock',
    name: 'visualizar_stock',
    component: () => import('../views/VisualizarStock.vue')
  },
  {
    path: '/admin/validarTicket',
    name: 'validar_ticket',
    component: () => import('../views/tickets/ValidarTicketView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  const loggedIn = store.state.autenticado;
  if ((to.name != "ingresar" && to.name != "home" && to.name != "registrarse") && !loggedIn) {
    next({
      name: "ingresar",
    });
  } else {
    if (to.path.startsWith("/admin") && store.state.rol != "administrador") {
      next({
        name: "home"
      })
    }

    next();
  }

})

export default router
