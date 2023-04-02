<template>
    <div class="container" style="margin-top: 5%">
       <div class="card " style="padding: 3%">
        <div class="row">
          <div class="col">
            <h4>MIS TICKETS</h4>
            <p>Tickets pendientes de consumo
            </p>
          </div>
      </div>
        <div class="row valign-wrapper">
          <div class="col s12">
            <div class="row">
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
          <div class="input-field col s4">
            <select v-model="sedes" multiple>
              <option v-for="s in listaSedes" :key="s.id" :value="s.id">{{s.nombre}}</option>
            </select>
            <label>Filtrar por sede</label>
          </div>
            </div>
          </div>
        </div>
          <div class="row">
            <div class="col s6">
            <a class="waves-effect waves-light btn red darken-4" @click="limpiar" v-show="habilitar"><i class="material-icons left">delete</i>Quitar todos los filtros</a>

          </div>
          </div>
      </div>
      <div >
        <div v-show="tickets.length>0">
          <div class="row" >
            <div class="col l4 m6 s12" v-for="ticket in this.tickets" :key="ticket.id">
            <ItemMenuComponent :menu="ticket.menu_habilitacion.menu">
              <template slot="cuerpoItem">
                <div v-if="ticket.vianda" class="ribbon-2"><span style="padding-top: 30%; padding-bottom: 30%;">VIANDA</span></div>
                <div class="row">
                  <div class="col">
                    <i>{{new Date(ticket.menu_habilitacion.fecha).toLocaleDateString('es-ES')}} TURNO {{ticket.menu_habilitacion.turno.toUpperCase()}}</i>
                    <br>
                    <i>SEDE {{ticket.menu_habilitacion.sede.nombre.toUpperCase()}}</i>
                  </div>
                </div>
              </template>
            </ItemMenuComponent>
            </div>
        </div>
        <PaginatorComponent :paginaActual="paginaActual" @actualizarPag="paginaActual= $event; " :totalPaginas="totalPaginas"/>
      </div>

        </div>
        <h4 style="text-align: center" v-show="tickets.length==0">No hay resultados</h4>

        
     
    </div>
</template>

<script>
import M from "materialize-css";
import ItemMenuComponent from "../../components/ItemMenuComponent.vue";
import PaginatorComponent from "../../components/PaginatorComponent.vue";

export default { 
  components: {
    ItemMenuComponent,
    PaginatorComponent
  },
  mounted(){
    M.AutoInit();
    this.tickets= this.obtenerData();
  },
  data() {
    return {
      paginaActual: 1,
      totalPaginas: null,
      tickets: [],
      dias: [],
      turnos: [],
      sedes: [],
      listaSedes: [
          {
            id: "1",
            nombre: "Bosque Oeste"
          },
          {
            id: "2",
            nombre: "Bosque Este"
          },
          {
            id: "3",
            nombre: "ATULP"
          },
          {
            id: "4",
            nombre: "Club Everton"
          }
      ]
       
    };
  },
  methods:{
    obtenerData(){
      let filtro = {
            "dias": this.dias,
            "turnos": this.turnos,
            "sedes": this.sedes
          }
       this.$axios.post("http://127.0.0.1:8000/reservas/"+this.$store.getters.userId+"/pendientes/"+this.paginaActual,
        filtro
       )
        .then(res => {
          this.tickets= res.data.items 
          this.totalPaginas = res.data.total_paginas
        })
        .catch( (error) => {
          this.$swal('Error', error.response.data.error, 'error')
        })
    },
    limpiar(){
      location.reload()
    }
  },
  computed:{
      habilitar(){
        return this.dias.length != 0 || this.turnos.length != 0 || this.sedes.length!= 0
      },
  },
  watch:{
      paginaActual: function(){
          this.obtenerData()
      },
      dias(){
        this.obtenerData()
      },
      turnos(){
        this.obtenerData()
      },
      sedes(){
        this.obtenerData()
      }
  },
}
</script>

<style>
.ribbon-2 {
    --f: 10px; /* control the folded part*/
    --r: 15px; /* control the ribbon shape */
    --t: 20px; /* the top offset */
    
    position: absolute;
    inset: var(--t) calc(-1*var(--f)) auto auto;
    padding: 10px 10px 20px calc(10px + var(--r));
    clip-path: 
      polygon(0 0,100% 0,100% calc(100% - var(--f)),calc(100% - var(--f)) 100%,
        calc(100% - var(--f)) calc(100% - var(--f)),0 calc(100% - var(--f)),
        var(--r) calc(50% - var(--f)/2));
    background: #26a69a;
    color: white;
    font-weight: bold;
    box-shadow: 0 calc(-1*var(--f)) 0 inset #0005;
  }
</style>