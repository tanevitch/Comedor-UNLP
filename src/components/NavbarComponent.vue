<template>
  <div>
    <div class="navbar-fixed">
      <nav class="white nav-extended nav-center" >
      <div class="container nav-wrapper">
        <router-link class="brand-logo black-text" to="/" v-if="!estaAutenticado">Home</router-link>
        <span class="brand-logo black-text" v-else>Home</span>
        <a href="#" data-target="mobile-demo" class="sidenav-trigger">
          <i class="material-icons" style="color: black">menu</i>
        </a>
        <ul class="right hide-on-med-and-down">
          <div v-if="!estaAutenticado">
            <li>
              <router-link class="waves-effect waves-light btn" to="/ingresar"
                >Ingresar</router-link
              >
            </li>
            <li>
              <router-link
                class="waves-effect waves-light btn"
                to="/registrarse"
                >Registrarse</router-link
              >
            </li>
          </div>
          <div v-if="estaAutenticado">
            <li>
              <router-link v-if="!esAdmin" to="/tickets/carrito" class="waves-effect waves-light btn grey lighten-2 tooltipped" data-tooltip="MI CARRITO">
              <span class="notification-icon--fixed" v-if="this.$store.getters.carrito.length>0">
                <small class="notification-badge">{{this.$store.getters.carrito.length}}</small>
              </span>
              <i v-if="this.$store.getters.carrito.length==0" class="material-icons" style="color: black">shopping_cart</i>

              <i v-if="this.$store.getters.carrito.length>0" class="material-icons left" style="color: black">shopping_cart</i>
              </router-link>      
              
                        
            </li>
            <li @click="cerrarSesion">
              
              <router-link class="waves-effect waves-light btn" to="/ingresar"
                >Cerrar Sesión</router-link
              >
            </li>
          </div>
        </ul>
      </div>
      <ul class=" hide-on-med-and-down">
      <div class="nav-content "  v-if="estaAutenticado">
        <ul class="tabs ">
          <li class="tab" v-if="esAdmin"><router-link :class="[{'active': this.currentRouteName() == '/admin/solicitudes'}]" :to="{name: 'solicitudes'}">👥  Gestionar Solicitudes</router-link></li>
          <li class="tab" v-if="esAdmin"><router-link :class="[{'active': this.currentRouteName() == '/admin/menu'}]"  :to="{name: 'menu'}">🍔  Gestionar Menús</router-link></li>
          <li class="tab"><router-link :class="[{'active': this.currentRouteName() == '/grilla'}]"  :to="{name: 'grilla'}">📆  Grilla de Menús</router-link></li>
          <li class="tab" v-if="!esAdmin"><router-link :class="[{'active': this.currentRouteName() == '/tickets/misTickets'}]"  :to="{name: 'mis_tickets'}">🎫  Tickets pendientes</router-link></li>
          <li class="tab" v-if="!esAdmin"><router-link :class="[{'active': this.currentRouteName().includes('compras')}]"  :to="{name: 'mis_compras'}">&#128722;  Mis Compras</router-link></li>
          <li class="tab" v-if="esAdmin"><router-link :class="[{'active': this.currentRouteName() == '/admin/menu/visualizarStock'}]"  :to="{name: 'visualizar_stock'}"> 📊 visualizar stock</router-link></li>
          <li class="tab" v-if="esAdmin"><router-link :class="[{'active': this.currentRouteName() == '/admin/validarTicket'}]"  :to="{name: 'validar_ticket'}"> validar ticket</router-link></li>

        </ul>
      </div>
      </ul>
    </nav>
    </div>

    <ul class="sidenav" id="mobile-demo">
      <div v-if="!estaAutenticado">
        <li>
          <router-link class="waves-effect waves-light btn" to="/ingresar">Ingresar</router-link>
        </li>
        <li>
          <router-link class="waves-effect waves-light btn" to="/registrarse">Registrarse</router-link>
        </li>
      </div>
      <div v-if="estaAutenticado">
        <li @click="cerrarSesion"><router-link class="waves-effect waves-light btn" to="/ingresar">Cerrar Sesión</router-link></li>
          <li class="tab" v-if="esAdmin"><router-link :class="[{'active': this.currentRouteName() == '/admin/solicitudes'}]" :to="{name: 'solicitudes'}">👥  Gestionar Solicitudes</router-link></li>
          <li class="tab" v-if="esAdmin"><router-link :class="[{'active': this.currentRouteName() == '/admin/menu'}]"  :to="{name: 'menu'}">🍔  Gestionar Menús</router-link></li>
          <li class="tab"><router-link :class="[{'active': this.currentRouteName() == '/grilla'}]"  :to="{name: 'grilla'}">📆  Grilla de Menús</router-link></li>
          <li class="tab" v-if="!esAdmin"><router-link :class="[{'active': this.currentRouteName() == '/tickets/misTickets'}]"  :to="{name: 'mis_tickets'}">🎫  Tickets pendientes</router-link></li>
          <li class="tab" v-if="!esAdmin"><router-link :class="[{'active': this.currentRouteName().includes('compras')}]"  :to="{name: 'mis_compras'}">&#128722;  Mis Compras</router-link></li>
          <li class="tab" v-if="esAdmin"><router-link :class="[{'active': this.currentRouteName() == '/admin/menu/visualizarStock'}]"  :to="{name: 'visualizar_stock'}"> 📊 visualizar stock</router-link></li>
          <li class="tab" v-if="esAdmin"><router-link :class="[{'active': this.currentRouteName() == '/admin/validarTicket'}]"  :to="{name: 'validar_ticket'}"> validar ticket</router-link></li>

      </div>
    </ul>
  </div>
</template>

<script>
import M from "materialize-css";

export default {
  mounted() {
    M.AutoInit();
  },
  computed: {
    
    estaAutenticado(){
      return this.$store.getters.estaAutenticado
    },
    esAdmin(){
      return this.$store.getters.esAdmin
    }
  },
  methods: {
    currentRouteName() {
          return window.location.pathname;
    },
    cerrarSesion() {
      window.localStorage.clear();
      this.$store.commit("logout");
    },
  },

};
</script>

<style>

.notification-icon--fixed {
  position: relative;
  color: #fff;
  background-color: #e66327;
  border-radius: 50%;
  font-family: "Roboto";
  
  /* Alignment */
  line-height: 0;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  
  /* Adjust as required: */
  padding: 10px;
}

/* Height = width */
.notification-icon--fixed::after {
  content: "";
  display: block;
  padding-bottom: 100%;
}

.tabs .tab a {
  color: rgba(78, 83, 83, 0.7) !important;
}

.tabs .tab a.active {
  color: #26a69a !important;
}

.tabs .tab a:hover {
  color: #26a69a !important;
}

.tabs .tab a:focus.active {
  color: #26a69a !important;
  background-color: rgba(38, 166, 154, 0.2) !important;
}

.tabs .tab a:focus {
  color: #26a69a !important;
  background-color: rgba(38, 166, 154, 0.2) !important;
}

.tabs .indicator {
  background-color: #26a69a !important;
}

nav.nav-center ul {
    text-align: center;
}
nav.nav-center ul li {
    display: inline;
    float: none;
}
nav.nav-center ul li a {
    display: inline-block;
}
</style>
