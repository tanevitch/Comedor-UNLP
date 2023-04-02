<template>
    <div class="container" style="margin-top: 5%">
       <div class="card " style="padding: 3%">
        <div class="row">
          <div class="col">
            <h4>MIS COMPRAS</h4>
            <p>Historial de compras realizadas
            </p>
          </div>
      </div>
        <div class="row valign-wrapper">
          <div class="input-field col s4">
            <input type="date" v-model="fecha" class="calender"/>
            <label>Filtrar por fecha</label>
          </div>
          <div class="col s2 ">
            <a class="waves-effect waves-light btn"  @click="buscar" :disabled="!habilitar"><i class="material-icons left">search</i>Buscar</a>
          </div>
        </div>
      </div>
      <div v-if="this.compras.length>0">
        <div class="col">
            <h4  v-if="busqueda" style="margin-bottom:4%; margin-top:3%">Resultado de busqueda</h4>
            <h4  v-else style="margin-bottom:4%; margin-top:3%">Todas las compras</h4>

          </div>
        <div class="row" >
            <table class="striped ">
                <thead>
                <tr class="teal lighten-4">
                    <th v-if="esAdmin" class="center-align">Usuario</th>
                    <th class="center-align">Fecha y Hora</th>
                    <th class="center-align">Cant. de Tickets</th>
                    <th class="center-align">Tickets</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="compra in compras" :key="compra.id" class="teal lighten-5">
                    <td v-if="esAdmin" class="center-align">{{compra.usuario}}</td>
                    <td class="center-align">{{compra.fechaYhora}}</td>
                    <td class="center-align">{{compra.cantTickets}}</td>
                    <td class="center-align"><router-link class="waves-effect waves-light btn" :to="{name: 'mis_tickets_compra', params: { id: compra.id }}">Tickets Comprados</router-link></td>
                </tr>
                </tbody>
            </table>
        </div>
        <div v-if="busqueda" class="right-align" style="margin-bottom:5%">
          <button class="waves-effect waves-light btn" @click="recargar">Volver</button>
        </div>
        <div v-if="!busqueda">
          <PaginatorComponent :paginaActual="paginaActual" @actualizarPag="paginaActual= $event; " :totalPaginas="totalPaginas"/>
        </div>
      </div>
      <div class="row" v-else >
          <div v-if="!this.busqueda" class="col">
            <h2 class="center-align">No tenés compras realizadas</h2>
          </div>
          <div v-else  class="col">
            <h4 class="center-align">No hay resultados</h4>
            <div class="right-align">  
          <button class="waves-effect waves-light btn" @click="recargar">Volver</button>
          </div>
        </div>
          
      </div>
    </div>
</template>

<script>
import M from "materialize-css";
import PaginatorComponent from "../../components/PaginatorComponent.vue";

export default { 
  components: {
    PaginatorComponent
  },
  mounted(){
    M.AutoInit();
    this.obtenerData();
    this.busqueda=false;
  },
  data() {
    return {
      paginaActual: 1,
      totalPaginas: null,
      compras: [],
      fecha: null,
      fecha_buscada:null,
      busqueda:false,
    };
  },
  methods:{
    obtenerData(){
       this.$axios.get("http://127.0.0.1:8000/compras/realizadas/"+this.paginaActual)
        .then(res => {
          this.compras= res.data.items 
          this.totalPaginas = res.data.total_paginas
        })
        .catch( (error) => {
          this.$swal('Error', error.response.data.error, 'error')
        })
    },
    buscar(){
        let fecha= {
          "fecha": this.fecha,
      };
        this.$axios.post("http://127.0.0.1:8000/compras/realizadas/busqueda", fecha).then(res => {
          this.compras= res.data.items 
          this.totalPaginas = 0
        })
        .catch( (error) => {
          this.$swal('Error', error.response.data.error, 'error')
        });
          this.busqueda=true;
          this.fecha_buscada= this.fecha;
    },
    recargar(){
      window.location.reload();
    }
  },
  computed:{
      habilitar(){
        return this.fecha != null
      },
      esAdmin(){
        return this.$store.getters.esAdmin
      }
  },
  watch:{
      paginaActual: function(){
          this.obtenerData()
      }
  },
}
</script>
