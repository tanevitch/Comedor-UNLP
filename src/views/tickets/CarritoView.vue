<template>
     <div class="container" style="margin-top: 5%">
       <div class="card " style="padding: 3%">
        <div class="row">
          <div class="col">
            <h4>MI CARRITO</h4>
            <p>
                Seleccioná los menús que quieras retirar en modalidad vianda, podrás volver acá a modificar tu selección antes de confirmar el pago.
            </p>
            <button class="waves-effect waves-light btn" v-if="!seleccionandoVianda && menus.length>0" @click="seleccionandoVianda=true">Seleccionar días para vianda</button>
          </div>
      </div>

      </div>
       <ul class="collection" >
            <li class="collection-item" v-for="menu in menus" :key="menu.id">
                <div class="row valign-wrapper">
                    <div class="col s3">
                        <p v-if="seleccionandoVianda">
                        <label>
                            <input type="checkbox" :checked="menu.vianda"  @click="cambiarRetiroMenu($event.target.checked, menu)"/>
                            <span v-if="!menu.vianda">Tildar para vianda</span>
                            <span v-if="menu.vianda">Destildar para consumo en sede</span>
                        </label>
                        </p>
                        <b>{{menu.menu.toUpperCase()}}</b>
                        <br>
                        ${{menu.precio}}
                    </div>
                    <div  class="col s4" style="text-align: center">
                        <span>
                            {{new Date(menu.dia).toLocaleDateString("es", {weekday: "long"}).toUpperCase()}} {{new Date(menu.dia).toLocaleDateString("es")}}
                        </span>
                        <br>
                        <span>
                            {{menu.turno.toUpperCase()}}
                        </span>
                    </div>
                    <div  class="col s4">
                        <span>
                            {{menu.sede.nombre}}
                        </span>
                        <br>
                        <span v-if="menu.vianda">Vianda</span>
                        <span v-else>Consumo en sede</span>
                    </div>
                    <div class="col s1">
                    <button class="btn-floating btn-small waves-effect waves-light red darken-4" @click="removeMenu(menu)"><i class="material-icons">remove</i></button>
                    </div>

                </div>
            </li>
       </ul>


       <div style="display: flex; justify-content: flex-end; margin-bottom: 2%" class="valign-wrapper">
        

        <div style="margin-right: 2%; text-align: center">
            <span style="font-size: x-large; font-weight: bold; color: #009688">
                $ {{calcularTotal()}}
            </span>
            <br>
            <span>subtotal</span>
        </div>
        <button
              class="waves-effect waves-light btn modal-trigger"
              data-target="modalPagar"
              v-show=" menus.length>0 && !seleccionandoVianda"
              
              >Realizar Pago</button
            >
        <button v-show="seleccionandoVianda" class="waves-effect waves-light btn" @click="seleccionandoVianda=false">Terminar selección días para vianda</button>

       </div> 
      <CardFormComponent :total="calcularTotal()" :pedidos="this.menus"/>

    </div>
</template>

<script>
import CardFormComponent from "../../components/CardFormComponent.vue"
import M from "materialize-css";

export default {
    components: {
        CardFormComponent,
    },
    mounted() {
        M.AutoInit();
        
    },  
    data(){
        return{
            menus: this.$store.getters.carrito,
            seleccionandoVianda: false
        }
    },
    methods:{
        calcularTotal(){
            if (this.menus.length >0){
                return [...this.menus].map(menu => menu.precio).reduce((a, b) => a + b)
            }
            return 0
        },
        removeMenu(menu){
            this.$store.commit("removeMenu", menu)
            this.menus= this.$store.getters.carrito
        },
        cambiarRetiroMenu(e, menu){
            if (e){
                menu.vianda= true
            }
            else{
                menu.vianda= false
            }
        },
    }
}
</script>
