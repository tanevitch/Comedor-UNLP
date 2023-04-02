<template>
  <div >
    <FormComponent>
    <template slot="form-name">
    <h4>Iniciar Sesión</h4>
    </template>
    <template slot="form" >
        <div class="row " >
          <form class="col" @submit.prevent>
             <div class="row">
                <div class="input-field col">
                  <i class="material-icons prefix">account_circle</i>
                  <input v-model="dni" id="icon_prefix" 
                  type="text" 
                  onkeypress="return /^-?[0-9]*$/.test(this.value+event.key)"
                  maxlength = "8"
                  required/>
                  <label for="icon_prefix">DNI *</label>
                </div>
              </div>
              <div class="row">
            
                <div class="input-field col">
                    <i class="material-icons prefix">key</i>
                    <input v-model="clave" id="icon_telephone" type="password" required/>
                    <label for="icon_telephone">Clave *</label>
                </div>
              </div>
             
              <button class="waves-effect waves-light btn" @click="iniciarSesion" :disabled="!habilitar">Iniciar Sesión</button>
          </form>
        </div>
        <div class="row" v-if="false">
          <router-link  to="/reestablecer">Olvidé mi clave</router-link>
        </div>
    </template>
    </FormComponent>
  </div>
</template>

<script>
import FormComponent from "../../components/FormComponent.vue";

export default {
 components: {
    FormComponent
  },
  data(){
    return{
      dni: "",
      clave: ""
    }
  },
  methods:{
    iniciarSesion(){
      this.$axios.post(
        "http://127.0.0.1:8000/auth/login",
        {
          "dni": this.dni,
          "password": this.clave
        }
        ).then( (res) => {
          localStorage.setItem( 'token', JSON.stringify(res.data.token) );
          this.$store.commit("login", res.data.id)
          this.$store.commit("setRol", res.data.rol)
          if (this.$store.getters.esAdmin){
            window.location.href= "/admin/menu"         
          }
          else{
            window.location.href= "/grilla"       

          }
        }).catch( (error)  => {
          console.log(error)
          this.$swal('Falló el envío de solicitud', error.response.data.error, 'error')})
      }
    
  },
  computed: {
    habilitar(){
      return this.dni!="" && this.clave !=""
    },
  }
};
</script>

<style>
 a{
  color: #26a69a
 }
</style>
