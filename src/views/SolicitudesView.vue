<template>
  <div class="container" style="margin-top: 5%; min-height: 100vh" >
    <div class="card" style="padding: 3%">
      <div class="row">
          <div class="col">
            <h4>GESTIÓN DE SOLICITUDES</h4>
            <p>
              En esta sección podrás ver el detalle de la información de los usuarios del sistema, aprobar o rechazar peticiones. Se enviará un mail a la casilla del postulante con el resultado de su evaluación.
            </p>
          </div>
      </div>
      <div class="row">
        <div class="input-field col s6">
          <select v-model="estado">
            <option value="Todas" selected>Todas</option>
            <option value="pendiente">Pendientes</option>
            <option value="aprobado">Aprobados</option>
            <option value="rechazado">Rechazadas</option>
          </select>
          <label>Filtrar por estado</label>
        </div>
      </div>
    
    </div>
    <div v-show="this.personas.length>0">
      <div class="col" v-if="busqueda">
            <h4 class="center-align" style="margin-bottom:4%; margin-top:3%">Resultado de busqueda: {{this.estado}}</h4>
      </div>
      <ul class="collapsible popout">
        <ItemSolicitudComponent :persona="item" v-for="item in personas" :key="item.id" />
      </ul>
      <PaginatorComponent :paginaActual="paginaActual" @actualizarPag="paginaActual= $event; " :totalPaginas="totalPaginas" v-if="!this.busqueda"/>
    </div>
    <div v-show="this.personas.length==0">
      <div class="col">
            <h4 class="center-align" style="margin-bottom:4%; margin-top:3%">{{this.mensaje}}</h4>
      </div>
    </div>

  </div>
</template>

<script>
import M from "materialize-css";
import ItemSolicitudComponent from "../components/ItemSolicitudComponent.vue";
import PaginatorComponent from "../components/PaginatorComponent.vue";

export default {
  components: {
    ItemSolicitudComponent,
    PaginatorComponent,
  },
  mounted() {
    M.AutoInit();
    document.addEventListener("DOMContentLoaded", function () {
      var elems = document.querySelectorAll(".collapsible");
      M.Collapsible.init(elems, []);
    });

    this.obtenerData()
  },
  data() {
    return {
      paginaActual: 1,
      totalPaginas: null,
      busqueda: false,
      estado: "Todas",
      personas: [],
      mensaje:"",
    };
  },
  methods:{
    obtenerData(){
       this.$axios.get("http://127.0.0.1:8000/user/"+this.paginaActual).then(
        res => {
          this.personas= res.data.items
          this.totalPaginas = res.data.total_paginas
        })
        .catch( (error) => {
          this.$swal('Error', error.response.data.error, 'error')
        });
      this.modificar_mensaje();
    },
    buscar(){
      let estado ={
        "estado":this.estado
      }
      this.$axios.post("http://127.0.0.1:8000/user/filtrado", estado).then(
        res => {
          this.personas= res.data.items
          this.totalPaginas = 0
        })
        .catch( (error) => {
          this.$swal('Error', error.response.data.error, 'error')
        })
      this.busqueda=true;
      this.modificar_mensaje();
    },
    modificar_mensaje(){
      if (!this.busqueda){
        this.mensaje="No tenes solicitudes";
      }else{
        this.mensaje="No se obtubieron datos de: "+this.estado;
      }
    },
    limpiar(){
      location.reload();
    }
  },
  watch:{
      paginaActual: function(){
          this.obtenerData()
      },
      estado(){
        this.buscar()
      }
  },
  computed:{
    habilitar(){
        return this.estado != null
      }
  }
};
</script>

<style scoped>
#modal1 {
  width: 80%;
}
.collapsible.popout {
  margin-top: 4%;
  margin-bottom: 4%;
}
.dropdown-content li {
  padding: 14px 16px;
}
</style>

