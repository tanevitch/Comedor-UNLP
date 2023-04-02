<template>
    <div class="container" style="margin-bottom: 3%; margin-top: 5%; min-height: 100vh">
      <div class="card" style="padding: 3%">
         <div class="row">
                <div class="col">
                  <h4>VISUALIZADOR DE STOCK</h4>
                  <p>
                    Lleva un control de stock con las compras de los menus<br>
                  </p>
                </div>
          </div>
          <div class="row">
            <div class="input-field col s4">
              <p id="label">Seleccionar una sede</p>
              <select class="browser-default" v-model="sede" id="sede" required>
                <option v-for="s in this.listaSedes" :key="s.id" :value="s.id">{{s.nombre}}</option>
              </select>
            </div>
            <div class="input-field col s4">
            <input type="date" v-model="fecha"/>
            <label>Filtrar por fecha</label>
          </div>
          
           
            <div class="input-field col s4">
              <select id="turnos" v-model="turnos">
                <option value="almuerzo">Almuerzo</option>
                <option value="cena">Cena</option>
              </select>
              <label>Filtrar por turno</label>
            </div>
        </div>
            <div class="col s4">
              <a class="waves-effect waves-light btn" style="margin-right: 3%"  @click="buscar" :disabled="!habilitar"><i class="material-icons left">search</i>Buscar</a>
               <a class="waves-effect waves-light btn red darken-4" @click="limpiar" v-show="habilitar"><i class="material-icons ">delete</i></a>
  
            </div>
        
        </div>
        <div>
            <div v-if="this.stock.length<1">

                <h4 style="text-align:center"> 
                no hay datos para mostrar
                </h4>
            </div>
      <div v-if="this.stock.length>0">
        <h4 style="text-align:center">
        SEDE
        {{sedeSeleccionada}}
      </h4>
        <div class="row" >
            <table class="striped ">
                <thead>
                <tr class="teal lighten-4">
                    <th class="center-align">Menu</th>
                    <th class="center-align">Cantidad vendidos</th>
                    <th class="center-align">Cantidad en stock</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="s in stock" :key="s.id" class="teal lighten-5">
                    <td class="center-align">{{s.nombre}}</td>
                    <td class="center-align">{{s.tickets_comprados}}</td>
                    <td class="center-align" v-if="s.limite_porciones>0">{{s.limite_porciones}}</td>
                    <td class="center-align" v-if="s.limite_porciones==null">Sin limite de stock</td>
                </tr>
                </tbody>
            </table>
        </div>
        <PaginatorComponent :paginaActual="paginaActual" @actualizarPag="paginaActual= $event; " :totalPaginas="totalPaginas"/>
      </div>
      
        </div>
     
     
    </div>
</template>
  
<script>
  import M from "materialize-css";
  import PaginatorComponent from "../components/PaginatorComponent.vue";
  export default { 
  components: {
    PaginatorComponent
  },
  mounted(){
    M.AutoInit();
    this.$axios.get("http://127.0.0.1:8000/sede").then(
      res => {
        this.listaSedes= res.data
    })
},
  data() {
    return {
      paginaActual: 1,
      totalPaginas: null,
        compras: [],
        stock: [],
      listaSedes: [],
      sede: null,
      sedeSeleccionada: null,
      turnos: null,
     fecha: null,
    };
  },
  methods:{
    
    buscar(){
        this.sedeSeleccionada = this.listaSedes.find(sede => sede.id == this.sede).nombre
       
        this.$axios.post( `http://127.0.0.1:8000/reservas/verStock/`, {
            "sede": this.sede,
            "turno": this.turnos,
            "fecha": this.fecha
            })
              
               .then(
            res => {
                this.stock = res.data
            }
        ).catch( (error) => {
            this.$swal('Error', error.response.data.error, 'error')
          })

    },
    limpiar(){
      this.sede = null
      this.turnos = null
      this.fecha = null
      this.sedeSeleccionada = null
    }
  },
  computed:{
      habilitar(){
        return  this.sede != null && this.turnos != null && this.fecha != null
      },
  },
  watch:{
      paginaActual: function(){
          this.obtenerData()
      }
  },



}
  </script>
  <style  >
  
  ::-webkit-scrollbar {
    width: 0px;
  }
  ::-webkit-scrollbar-track {
    display: none;
  }
  
  .custom-calendar.vc-container {
    --day-border: 1px solid #b8c2cc;
    --day-border-highlight: 1px solid #b8c2cc;
    --day-width: 90px;
    --day-height: 90px;
    --weekday-bg: #f8fafc;
    --weekday-border: 1px solid #eaeaea;
    border-radius: 0;
    width: 100%;
      border: 1px solid rgb(230, 230, 230);
  
  }
  
  .custom-calendar .vc-day{
      text-align: center;
      border: 1px solid rgb(230, 230, 230);
      margin: 1%;
      
  }
  .vc-day .almuerzo{
      background-color: #e0daed;
      padding: 2%;
  }
  
  .vc-header{
      background-color: #26a69a;
  }
  
  .vc-title{
    color: white !important;
    padding-bottom: 1%;
  }
  
  .vc-arrow{
    color: white ;
  }
  .vc-arrow:hover{
    color: #26a69a;
  }
  
  .vc-weekday{
    color: #26a69a !important; 
    margin: 2% !important;
  
  }
  
  .vc-day .cena{
      background-color: #392466;
      color: white;
      padding: 2%;
  }
  
  li.almuerzo, li.cena{
     cursor: pointer;
  }
  
  #label{
    font-size: 0.8rem !important;
    color: #9e9e9e;
    margin: 0;
    margin-bottom: 1%;
  }
  
  #sede{
    padding: 0;
  }
  
  </style>
  
  