<template>
    <div class="container" style="margin-top: 5%; min-height: 100vh">
       <div class="card " style="padding: 3%">
        <div class="row">
          <div class="col">
            <h4>Validar Ticket</h4>
          </div>
      </div>
        <div class="row">
          <div >
            <div class="input-field col s4">
                <input v-model="dni"
                  id="dni"
                  type="text" 
                  onkeypress="return /^-?[0-9]*$/.test(this.value+event.key)"
                  maxlength = "8"
                  required
                />
                <label>DNI</label>
            </div>
          
            <div class="input-field col s12 m6"  style="text-align: left" >
                <select v-model="turno" id="turno" required>
                  <option value="" disabled selected>Seleccionar Turno</option>
                  <option value="cena">Cena</option>
                  <option value="almuerzo">Almuerzo</option>
                </select>
            </div>
          </div>
          <div >
            <div class="input-field col s8">
              <select  v-model="sede" id="sede" required v-show="listaSedes.length>0">
                <option v-for="s in this.listaSedes" :key="s.id" :value="s.id">{{s.nombre}}</option>
              </select>
              <label>Seleccionar una sede</label>
            </div>
            <div class="col s2 ">
                <a class="waves-effect waves-light btn"  @click="this.buscar" :disabled="!habilitar"><i class="material-icons left">search</i>Buscar</a>
            </div>
          </div>
        </div>
      </div>
      <div class="card center-align" style="padding: 3%" v-if="(this.busqueda)">
        <div class="col" v-if="(this.ticket!=null)">
          <div class="row center-align" >
            <div class="col">
              <h4>Resultado de la busqueda</h4>
            </div>
          </div>
          <div class="row valign-wrapper">
            <div class="col">
              <h4>El usuario con el dni {{this.dni}} tiene vigente el menu: {{this.ticket.menu}}</h4>
            </div> 
          </div>
          <div class="col s2 center-align">
            <a class="waves-effect waves-light btn red"  @click="cancelar" style="margin-right: 2%;">Cancelar</a>
            <a class="waves-effect waves-light btn"  @click="consumir" >Consumir</a>
          </div>
        </div>
        <div class="col" v-else>
          <h4>{{this.mensaje}}</h4>
        </div> 
      </div>
    </div>
    
</template>

<script>
import M from "materialize-css";

export default { 
  components: {
  },
  mounted(){
    this.$axios.get("http://127.0.0.1:8000/sede").then(
      res => {
        this.listaSedes= res.data
        
    }).then( () =>  {
        M.AutoInit()
    })
  },
  data() {
    return {
      dni:null,
      turno:null,
      busqueda:false,
      ticket:null,
      sede:null,
      listaSedes:[],
      paso:false,
      mensaje:"",
    };
  },
  methods:{
    buscar(){
      let datos= {
          "dni": this.dni,
          "turno": this.turno,
          "sede": this.sede
      };
         this.$axios.post("http://127.0.0.1:8000/compras/realizadas/validarTicket", datos).then(res => {
          this.ticket= res.data.ticket;
        })
        .catch( (error) => {
          this.$swal('Advertencia', error.response.data.error, 'mensaje')
        });
        this.busqueda=true;
        if (this.ticket!= null){
          this.mensaje=null;
        }else{
          this.mensaje= "No se encontro un ticket vigente para el DNI "+this.dni;
        }
    },
    consumir(){
      this.$axios.get("http://127.0.0.1:8000/compras/realizadas/ticket/"+this.ticket.id)
        .then(res => {
          this.paso=res.data.paso;
        })
        .catch( (error) => {
          this.$swal('Error', error.response.data.error, 'error')
        });
        if (this.paso){
          this.$swal("El ticket se consumio correctamente");
          this.busqueda=false;
        }
        
    },
    cancelar(){
      this.$swal({
                    title: 'CANCELAR ACCIÓN',
                    text: "Se cancelará el consumo del ticket. ¿Continuar?",
                    icon: 'warning',
                    showCancelButton: true,
                    showLoaderOnConfirm: true
                }).then((result) => {
                    if(result.value) {
                        window.location.href= "/validarTicket"
                    }
                })
    },
  },
  computed:{
      habilitar(){
        return this.dni != null && this.turno!= null && this.sede != null
      }
  }
}
</script>
