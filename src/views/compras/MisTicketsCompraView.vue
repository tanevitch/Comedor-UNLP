<template>
    <div class="container" style="margin-top: 5%">
      <div class="card valign-wrapper" style="padding: 3%">
        <div class="row">
          <div class="col">
            <h4 >MIS Tickets de la compra: {{this.compra.fechaYhora}}</h4>
          </div>
        </div>
      </div>
      <div>
        <div class="row">
            <div class="col l4 m6 s12" v-for="ticket in this.compra.tickets" :key="ticket.id">
            <ItemMenuComponent :menu="ticket.menu">
              <template slot="cuerpoItem">
                
                <div v-if="ticket.retiro" class="ribbon-2"><span style="padding-top: 30%; padding-bottom: 30%;">VIANDA</span></div>

                <div class="row">
                  <div class="col">
                    <i>{{ticket.fecha}} TURNO {{ticket.turno.toUpperCase()}}</i>
                    <br>
                    <i>SEDE {{ticket.sede.toUpperCase()}}</i>
                  </div>
                </div>
              </template>
            </ItemMenuComponent>
            </div>
        </div>
      </div>
      <div class="right-align" style="margin-bottom:5%">  
        <router-link class="waves-effect waves-light btn" :to="{name: 'mis_compras'}">Volver</router-link>
      </div>
    </div>
</template>

<script>
import M from "materialize-css";
import ItemMenuComponent from "../../components/ItemMenuComponent.vue";

export default { 
  components: {
    ItemMenuComponent
  },
  mounted(){
    if (this.$route.params.id != undefined)
      this.$axios.get("http://127.0.0.1:8000/compras/realizadas/"+this.$route.params.id+"/tickets")
        .then(res => {
          this.compra= res.data.compra;
        })
        .catch( (error) => {
          this.$swal('Error', error.response.data.error, 'error')
        })    
    M.AutoInit();
    
  },
  data() {
    return {
      compra: [],
       
    };
  },
  methods:{
    obtenerData(){
        this.$axios.get("http://127.0.0.1:8000/compras/realizadas/"+this.$route.params.id+"/tickets")
        .then(res => {
          this.compra= res.data.compra
        })
        .catch( (error) => {
          this.$swal('Error', error.response.data.error, 'error')
        })
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