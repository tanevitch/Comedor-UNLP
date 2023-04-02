<template>
<div class="card white darken-1" style="margin-top: 5%; " >
<div class="card-content" style="padding: 2em ">
  <div class="row container">
     <div class="col l3 s12">
        <img :src="menu.imagenBase64" id="foto" style="object-fit: cover; height: 70vh; width:15vw">
    </div>

    <div class="col l9">
        <h4>{{menu.nombre}}</h4>
        <form @submit.prevent>
          <div class="row center">
            <div class="input-field col s12 m12 l3">
              <input v-model="precio" id="precio"
                  type="number" 
                  onkeyup="value >= 1 ||(value='');"/>
              <label for="first_name">Precio*</label>
            </div>
            <div class="input-field col s7 m8 l5">
              <span>Establecer límite de porciones</span>
              <div class="switch">
                <label>
                  No
                  <input type="checkbox" v-model="limitarPorciones"/>
                  <span class="lever"></span>
                  Sí
                </label>
              </div>
            </div>
            <div v-if="limitarPorciones" class="input-field col s5 m4 l4">
              <input  v-model="cantidadPorciones" id="porciones" 
                  type="text" 
                  onkeypress="return /^[1-9][0-9]*$/.test(this.value+event.key)"
                  maxlength = "8"
                  />
              <label for="porciones">Cantidad de porciones *</label>
            </div>
          </div>
          <div class="row center">
            <div class="col l6 s12 m12 " style="margin-bottom: 3%" >
              <p style="background-color: #e0daed; padding: 3%;  font-weight: bold">Seleccionar fechas para almuerzo</p>
              <v-calendar
              is-expanded
              :color="'teal'" 
              :min-date="new Date()" 
              :maxDate="new Date((new Date()).setDate(new Date().getDate() + 15))" 
              :attributes="attributesAlmuerzo" 
              @dayclick="agregarFechaAlmuerzo" />
            </div>
            <div class="col l6 s12 m12 " >
              <p style="background-color: #392466; padding: 3%; color: white; font-weight: bold">Seleccionar fechas para cena</p>
              <v-calendar
                :color="'teal'" 
                :is-dark="true" 
                is-expanded
                :min-date="new Date()" 
                :maxDate="new Date((new Date()).setDate(new Date().getDate() + 15))" 
                :attributes="attributesCena" 
                @dayclick="agregarFechaCena"/>
            </div>
          </div>
          <div class="row">
            <div style="display: flex; flex-direction: row-reverse;">
              <button class="waves-effect waves-light btn" type="submit" @click="confirmarAccion" :disabled="!habilitar">Guardar</button>
              <button class="waves-effect waves-light btn red darken-4" @click="cancelarAccion">Cancelar</button >
            </div>
          </div>
        </form>
    </div>
  </div>
</div>
</div>
</template>

<script>
import M from "materialize-css";

export default {
 mounted(){
    if (this.$route.params.id != undefined)
        this.$axios.get("http://127.0.0.1:8000/menu/"+this.$route.params.id)
            .then(res => this.menu= res.data)
            .catch( (error) => {
                    this.$swal('Error', error.response.data.error, 'error')
                    .then( () => {
                        window.location.href= "/admin/menu"
                    })
                })
    M.AutoInit();
    },
data(){
  return {
    fechasDeshabilitadas: [new Date((new Date()).setDate(new Date().getDate() + 15)), new Date()],
    limitarPorciones: false,
    cantidadPorciones: null,
    calendarioAlmuerzo: false,
    calendarioCena: false,
    fechasCena: [],
    fechasAlmuerzo: [],
    precio: null,
    menu: {
      id: this.$route.params.id,
      nombre: "",
      imagenBase64: ""
    },
  }
},
methods: {
confirmarAccion(){
      this.$swal({
        title: 'HABILITAR MENÚ',
        html: `Se habilitará el menú ${this.menu.nombre} para el turno <br> <b>ALMUERZO: ${this.fechasAlmuerzoCortas}</b> <br> <b>CENA: ${this.fechasCenaCortas}</b>`,
        icon: 'warning',
        showCancelButton: true,
        width: '800px',
        showLoaderOnConfirm: true
      }).then((result) => {
        if(result.value) {
           this.$axios.post(
              `http://127.0.0.1:8000/menu/habilitar/${this.menu.id}`,
              {
                "precio": this.precio,
                "limite_porciones": (!this.limitarPorciones || this.cantidadPorciones==0)? null: this.cantidadPorciones,
                "turno_almuerzo": this.datesAlmuerzo,
                "turno_cena": this.datesCena,
              }
            ).then(
              res => {
                console.log(res.data)
                this.$swal('Solicitud confirmada', 'El menú se encuentra habilitado', 'success').then(
                  () => window.location.href= "/admin/menu"
                )
              })
              .catch( (error) => {
                  this.$swal('Error', error.response.data.error, 'error') 
              })
          
        }
      })
},

cancelarAccion(){
  this.$swal({
        title: 'CANCELAR ACCIÓN',
        text: "Se cancelará la carga. Esta acción no es reversible. ¿Continuar?",
        icon: 'warning',
        showCancelButton: true,
        showLoaderOnConfirm: true
      }).then((result) => {
        if(result.value) {
           window.location.href= "/admin/menu"
        }
      })
},
agregarFechaAlmuerzo(day) {
  const idx = this.fechasAlmuerzo.findIndex(d => d.id === day.id);
  if (idx >= 0) {
    this.fechasAlmuerzo.splice(idx, 1);
  } else {
    this.fechasAlmuerzo.push({
      id: day.id,
      date: day.date,
    });
  }
},
agregarFechaCena(day) {
  const idx = this.fechasCena.findIndex(d => d.id === day.id);
  if (idx >= 0) {
    this.fechasCena.splice(idx, 1);
  } else {
    this.fechasCena.push({
      id: day.id,
      date: day.date,
    });
  }
},
},
computed: {
  habilitar(){
    return this.precio>0 
          && ((this.limitarPorciones == true && this.cantidadPorciones>0) || this.limitarPorciones == false)
          && (this.fechasAlmuerzo != 0 || this.fechasCena.length != 0)
  },
  datesAlmuerzo() {
    return this.fechasAlmuerzo.map(day => day.date);
  },
  fechasAlmuerzoCortas() {
    return this.fechasAlmuerzo.map(day => day.date.toLocaleDateString());
  },
  datesCena() {
    return this.fechasCena.map(day => day.date);
  },
  fechasCenaCortas() {
    return this.fechasCena.map(day => day.date.toLocaleDateString());
  },
  attributesAlmuerzo() {
    return this.datesAlmuerzo.map(date => ({
      highlight: date>this.fechasDeshabilitadas[0] || date < this.fechasDeshabilitadas[1]? false: true,
      dates: date,
    }));
  },
  attributesCena() {
    return this.datesCena.map(date => ({
      highlight: date>this.fechasDeshabilitadas[0] || date < this.fechasDeshabilitadas[1]? false: true,
      dates: date,
    }));
  },
},
};
</script>

<style scoped>
@media only screen and (max-width: 1000px) {
  #foto{
    height: 15vh !important;  
    width: 100% !important
  }
}
@media only screen and (min-width: 1001px) {
  #foto{
    padding-right: 13% !important;
  }
}
.vc-container{
  border-radius: 0%;
}
</style>