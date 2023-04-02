<template>
    <div>
      <div class="card ">
        <div class="card-image" style="background-color: black;">
          <img style="opacity: 0.5; height: 200px; width: 100%; object-fit:cover; " v-bind:src="menu.imagenBase64" >
          
        </div>
        <div class="card-content">
          <div class="row">
            <div class="col s8">
              <span class="card-title" style="font-weight: normal">{{menu.nombre}}</span>
              <div v-if="esAdmin">
                <button v-if="menu.dias_habilitados.length > 0" class="modal-trigger btn-flat" data-target="modal1" @click="ver=true"
                 >Ver días de menú</button>
                <div v-else>
                  Este menú aún no está habilitado
                </div>
              </div>
            </div>
            <div class="col s4">
              <div style="display: flex">
                  <img v-if="menu.aptoVegetariano" src="../assets/icons/apto-vegano.png" alt="Este menú es apto veganos" width="40%" height="40%">
                  <img v-if="menu.aptoCeliaco" src="../assets/icons/sin-tacc.png" alt="Este menú es apto celíacos" width="40%" height="40%">
              </div>
            </div>
          </div>
          <slot name="cuerpoItem"/>
        </div>
        <div class="card-action" v-if="esAdmin">
          <div>
              <router-link :to="{ name: 'menu_editar', params: { id: menu.id } }">Editar Menú</router-link>
              <br>
              <router-link :to="{ name: 'menu_habilitar', params: { id: menu.id, nombre : menu.nombre } }">Habilitar Menú</router-link>
          </div>
        </div>
      </div>
      <ModalComponent v-if="ver" @close="ver=false">
        <template slot="body">
          <v-calendar is-expanded :attributes="attributes" />
        </template>
      </ModalComponent>
    </div>
</template>

<script>
import ModalComponent from "@/components/ModalComponent.vue"
export default {
  components: {
    ModalComponent
  },
  props: ["menu"],
  data(){
    return {
      ver: false,
    }
  },
  computed: {
    esAdmin(){
      return this.$store.getters.esAdmin
    },
    menuCena() {
      return this.menu.dias_habilitados.filter(day => day.turno == "cena");
    },
    menuAlmuerzo() {
      return this.menu.dias_habilitados.filter(day => day.turno == "almuerzo");
    },
    attributes() {
      return this.menuAlmuerzo.map(dia_habilitacion => (
         {
          bar:  {
            style: {
              backgroundColor: '#c8bfdb',
            },
          },
          dates: dia_habilitacion.fecha,
          popover: {
            label: "Turno almuerzo. Precio: $"+dia_habilitacion.precio+". Sede: "
          }, 
        }
      )).concat(this.menuCena.map(dia_habilitacion => (
        {
          bar: {
            style: {
              backgroundColor: '#392466',
            },
          },
          dates: dia_habilitacion.fecha,
          popover: {
            label: "Turno cena. Precio: $"+dia_habilitacion.precio+". Sede: "
          }, 
        }
       
      )));
    },
    
  }
}
</script>
<style scoped>
  a{
    color: #26a69a !important
  }

  .btn-flat{
    padding: 0%;
    color: #26a69a !important
  }
</style>