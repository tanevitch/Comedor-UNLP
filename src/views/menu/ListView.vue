<template>
  <div class="container bg" style="margin-top: 5%; min-height: 100vh"  >
       <div v-show="loading" >
          <div class="progress"><div class="indeterminate"></div></div>
          <h4 style="text-align: center">Cargando...</h4>
          
      </div>
      <div v-show="!loading">
        <div class="card " style="padding: 3%">
        <div class="row">
          <div class="col">
            <h4>MENÚS</h4>
            <p>Crear menús, habilitarlos, ver los días en que se ofrece determinado menú
            </p>
          </div>
      </div>
        <div class="row valign-wrapper">
          <div class="input-field col s4">
            <select v-model="dias" multiple>
              <option value="lunes">Lunes</option>
              <option value="martes">Martes</option>
              <option value="miercoles">Miércoles</option>
              <option value="jueves">Jueves</option>
              <option value="viernes">Vienes</option>
            </select>
            <label>Filtrar por día</label>
          </div>
          <div class="input-field col s4">
            <select v-model="turnos" multiple>
              <option value="almuerzo">Almuerzo</option>
              <option value="cena">Cena</option>
            </select>
            <label>Filtrar por turno</label>
          </div>
          <div class="col s4">
            <a class="waves-effect waves-light btn red darken-4" @click="limpiar"><i class="material-icons left">delete</i>Limpiar búsqueda</a>
          </div>
        </div>
        <div class="row" v-if="esAdmin">
          <router-link class="waves-effect waves-light btn" :to="{ name: 'menu_nuevo'}" >Nuevo Menú</router-link>
        </div>
      </div>
      <div v-if="menus.length > 0">
      <div class="row" >
        <div class="col l4 m6 s12" v-for="menu in menus" :key="menu.id">
          <ItemMenuComponent :menu="menu" />
        </div>
      </div>
      <PaginatorComponent :paginaActual="paginaActual" @actualizarPag="paginaActual= $event; " :totalPaginas="totalPaginas"/>
      </div>
    <div class="row" v-else style="height: 75vh">
      <h1>No hay menús cargados</h1>
    </div>
      </div>
  </div>
</template>

<script>
import PaginatorComponent from "../../components/PaginatorComponent.vue";
import ItemMenuComponent from "../../components/ItemMenuComponent.vue";

import M from "materialize-css";

export default {
  components: {
    PaginatorComponent,
    ItemMenuComponent,
  },
  mounted(){
    M.AutoInit();
    this.obtenerData()
  },
  data() {
    return {
      paginaActual: 1,
      totalPaginas: null,
      menus: [],
      totalPaginasCacheado: null,
      dias: [],
      turnos: [],
      loading: true
       
    };
  },
  methods:{
    obtenerData(){
       this.$axios.get("http://127.0.0.1:8000/menu/listaMenu/"+this.paginaActual)
        .then(res => {
          this.menus= res.data.items
          this.totalPaginas = res.data.total_paginas
          this.loading= false
        })
        .catch( (error) => {
          this.$swal('Error', error.response.data.error, 'error')
          this.loading= false
        })
    },
    buscar(){
      var turnos = this.turnos
      var dias = this.dias
      if (this.turnos.length == 0){
        turnos = ["almuerzo", "cena"]
      }
      if (this.dias.length == 0){
        dias = ["lunes", "martes", "miercoles", "jueves", "viernes"]
      }

      let diasyturnos= {
        "dias": dias,
        "turnos": turnos
      }
      
      this.paginaActual=1
      this.loading= true
      this.$axios.post(
        "http://127.0.0.1:8000/menu/filtrar/"+this.paginaActual,
        diasyturnos
      ).then(
        res => {
          this.totalPaginasCacheado= this.totalPaginas
          this.menus= res.data.items
          this.totalPaginas = res.data.total_paginas
          this.loading= false
        }).catch( (error) => {
          this.$swal('Error', error.response.data.error, 'error')
          this.loading= false
        })
    },
    limpiar(){
      location.reload()
    }
  },
  computed:{
      esAdmin(){
        return this.$store.getters.esAdmin
      },
  },
  watch:{
      paginaActual: function(){
          this.obtenerData()
      },
      dias(){
      this.buscar()
    },
    turnos(){
      this.buscar()
    },
  },
};
</script>
