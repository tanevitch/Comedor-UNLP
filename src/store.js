import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist'
const vuexLocal = new VuexPersistence({
    storage: window.localStorage
  })

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        autenticado: false,
        rol: null,
        user_id: null, 
        carrito: []
    },
    getters: {
        estaAutenticado: state => state.autenticado,
        esAdmin: state => state.rol == "administrador",
        userId: state => state.user_id,
        carrito: state => state.carrito
    },
    mutations: {
        login(state, user_id) {
            state.autenticado= true
            state.user_id= user_id
        },
        logout(state) {
            state.autenticado= false
            state.rol = null
            state.carrito= []
        },
        setRol(state, rol) {
            state.rol= rol
        },
        addMenu(state, menu){
            menu.vianda= false
            state.carrito.push(menu)
        },
        removeMenu(state, menu){
            state.carrito=state.carrito.filter(item => item != menu)
        },
        vaciarCarrito(state){
            state.carrito=[]
        }
    },
    plugins: [vuexLocal.plugin]
});