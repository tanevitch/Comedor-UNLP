<template>
  <div >
    <FormComponent >
      <template slot="form-name">
        <h4>Registrarse</h4>
      </template>
      <template slot="form">
        <div class="row">
          <form class="col s12" @submit.prevent>
            <div class="row">
              <div class="input-field col s12 m6">
                <input v-model="dni"
                  id="dni"
                  type="text" 
                  onkeypress="return /^-?[0-9]*$/.test(this.value+event.key)"
                  maxlength = "8"
                  required
                />
                <label for="dni">DNI *</label>
              </div>
             <div class="input-field inline col s12 m6 l6">
                  <input v-model="email" id="email" type="email" required/>
                  <label for="email">Correo electrónico *</label>
                </div>
            </div>
            <div class="row">
              <div class="input-field col s12 m6 l6">
                <input v-model="nombre" id="nombre" type="text" required/>
                <label for="nombre">Nombre *</label>
              </div>
              <div class="input-field col s12 m6 l6">
                <input v-model="apellido" id="apellido" type="text" required/>
                <label for="apellido">Apellido *</label>
              </div>
            </div>
            <div class="row">
                <div class="input-field col s12 m6 l6">
                <input v-model="clave" id="clave" type="password" required />
                <label for="clave">Clave *</label>
              </div>
               <div class="input-field col s12 m6"  style="text-align: left" >
                <span class="simillabel">Facultad *</span>

                <select v-model="facultad" id="facultad" required>
                  <option value="" disabled selected>Seleccionar opción</option>
                  <option v-for="facultad in this.listaFacultades" :key="facultad.id" :value="facultad.id">{{facultad.nombre}}</option>
                </select>
              </div>
              
            
            </div>
            <div class="row valign-wrapper">
              <div class="input-field col s12 m6 l6" style="text-align: left">
                 <span class="simillabel">Relación académica *</span>
                <select v-model="relacionAcademica" id="rel_academica" required>
                  <option value="" disabled selected>Seleccionar opción</option>
                  <option value="estudiante">Alumno</option>
                  <option value="docente">Docente</option>
                  <option value="nodocente">No Docente</option>
                </select>
              </div>
              <div class="col s12 m6 l6" >
              <span class="simillabel" style="text-align: left !important; ">Certificado de relacion académica *</span>
               <div class = "file-field input-field" style="margin: 0; padding: 0">
                  <div class = "btn">
                     <span>Buscar</span>
                     <input ref="certificado" @change="cargarArchivo" type = "file" accept="application/pdf" required/>
                  </div>
                  
                  <div class = "file-path-wrapper">
                     <input class = "file-path validate" type = "text"
                        placeholder = "Subir Certificado" />
                  </div>
               </div>
              </div>

              
            </div>
            
              <button class="waves-effect waves-light btn" @click="registrarse" :disabled="!habilitar">Registrarme</button>

          </form>
        </div>
      </template>
    </FormComponent>
  </div>
</template>

<script>
import FormComponent from "../../components/FormComponent.vue";
import M from "materialize-css";

export default {
  components: {
    FormComponent,
  },
  mounted(){
    
    this.$axios.get("http://127.0.0.1:8000/utils/facultades")
    .then(
      res => {
        this.listaFacultades= JSON.parse(JSON.stringify(res.data));
        M.AutoInit();

      }
    ).then( () =>  {
        M.AutoInit()
    })
      
  },
  data(){
    return{
      dni: "",
      nombre: "",
      apellido: "",
      email: "",
      clave: "",
      relacionAcademica: "",
      certificado: "",
      facultad: "",
      listaFacultades: []

    }
  },
  computed: {
    habilitar(){
      return this.certificado!="" 
            && this.nombre != ""
            && this.apellido != ""
            && this.email != ""
            && this.dni != ""
            && this.clave != ""
            && this.relacionAcademica != ""
            && this.facultad !=""
    },
  },
  methods: {
    cargarArchivo(){ 
      let cert = this.$refs.certificado.files[0]; 
      this.getBase64(cert).then( 
        data => this.certificado=data 
      ); 
    }, 
    getBase64(file) { 
      return new Promise((resolve) => { 
        const reader = new FileReader(); 
        reader.readAsDataURL(file); 
        reader.onload = () => resolve(reader.result); 
      });
    },

    registrarse(){
      let solicitud= {
          "dni": this.dni,
          "nombre": this.nombre,
          "apellido": this.apellido,
          "email": this.email,
          "password": this.clave,
          "rol": this.relacionAcademica,
          "archivoBase64": this.certificado,
          "idFacultad": this.facultad
      }
      this.$axios.post(
        "http://127.0.0.1:8000/auth/registrar",
        solicitud
      ).then(
        res => {
          if (res.status == 200){
            this.$swal('Solicitud enviada', 'En los próximos días recibirás una notificación por correo informando el estado del proceso', 'success')
            .then(() => {
                window.location.href= "/"
            })
            
          }
        }
      ).catch( error => {
        this.$swal('Falló el envío de solicitud', error.response.data.error, 'error')})
        
    }

  }
};
</script>

<style scoped>
  p{
    color: #9e9e9e
  }
  select{
    color: #505050
  }
</style>