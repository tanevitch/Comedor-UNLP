<template>
  <div>
    <FormComponent>
         <template slot="form-name">
    <h4>{{nombreForm}}</h4>
    </template>
    <template slot="form">
        <div class="row">
        <form class="col s12" @submit.prevent>
            <div class="row" v-if="this.$route.params.id">
               <div class="col s12"  >
                <img :src="menu.imagenBase64" style="object-fit: cover; width: 80vw; height: 30vh">
               </div>
            </div>
            <div class="row valign-wrapper" >
                <div class="input-field col s12 m6">
                    <i class="material-icons prefix">edit_note</i>
                    <input v-model="menu.nombre" type="text" class="validate" />
                    <label >Nombre *</label>
                </div>
                
                <div class="input-field col s12 m6"  v-if="this.$route.params.id" style="text-align: left">
                    <span class="simillabel">Reemplazar imagen</span>
                    <div class = "file-field input-field">
                        <div class = "btn">
                            <span>Buscar</span>
                            <input ref="imagenBase64" @change="cargarArchivo" type = "file" />
                        </div>
                        
                        <div class = "file-path-wrapper">
                            <input class = "file-path validate" type = "text"
                                placeholder = "Editar Imagen" />
                        </div>
                    </div>
                </div>
                <div class="input-field col s12 m6 " v-else  style="text-align: left">
                    <span class="simillabel">Subir imagen *</span>
                    <div class = "file-field input-field">
                        <div class = "btn">
                            <span>Buscar</span>
                            <input ref="imagenBase64" @change="cargarArchivo" type = "file" />
                        </div>
                        
                        <div class = "file-path-wrapper">
                            <input class = "file-path validate" type = "text"
                                placeholder = "Subir Imagen" />
                        </div>
                    </div>

                </div>
            </div>
            
            <div class="row" style="padding-bottom: 10% !important">
                <div class="input-field col s12 m6">
                    <label>
                        <input v-model="menu.aptoCeliaco" type="checkbox" />
                        <span>¿Apto celíaco?</span>
                    </label>
                </div>
                <div class="input-field col s12 m6">
                    <label>
                        <input v-model="menu.aptoVegetariano" type="checkbox" />
                        <span>¿Apto vegetariano?</span>
                    </label>
                </div>
            </div>
            <button class="waves-effect waves-light btn cancelar" @click="cancelar">Cancelar</button >
            <button class="waves-effect waves-light btn" @click="crear" :disabled="!habilitar">Guardar</button>
        </form>
    </div>
    </template>
    </FormComponent>
  </div>
</template>

<script>
import FormComponent from "../../components/FormComponent.vue"
import M from "materialize-css";

export default {
    components: {
        FormComponent,
    },
    mounted(){
        if (this.$route.params.id != undefined)
            // carga editar
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
            nombreForm : this.$route.params.id == undefined? "Nuevo menú" : "Editar menú",
            menu: {
                nombre: "",
                aptoCeliaco: false,
                aptoVegetariano: false,
                imagenBase64: ""
            } 
        }
    },
    methods: {
        cancelar(){
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

        cargarArchivo(){ 
            let cert = this.$refs.imagenBase64.files[0]; 
            this.getBase64(cert).then( 
                data => this.menu.imagenBase64=data 
            ); 
            }, 
        getBase64(file) { 
            return new Promise((resolve) => { 
                const reader = new FileReader(); 
                reader.readAsDataURL(file); 
                reader.onload = () => resolve(reader.result); 
            });
            },
        crear(){
                if (this.$route.params.id == undefined){
                    this.$axios.post(
                    "http://127.0.0.1:8000/menu/altaMenu",
                    {
                    "nombre": this.menu.nombre,
                    "aptoCeliaco":  this.menu.aptoCeliaco,
                    "aptoVegetariano":  this.menu.aptoVegetariano,
                    "imagen": this.menu.imagenBase64
                    }
                    ).then( () => {
                        this.$swal('Menú creado', "El menú se creó exitosamente", 'success').then( () => window.location.href= "/admin/menu")
                    }).catch( (error)  => {
                        this.$swal('Falló el envío de solicitud', error.response.data.error, 'error')
                    })
                }
                else{
                    this.$axios.post(
                    "http://127.0.0.1:8000/menu/editarMenu/"+this.$route.params.id,
                    {
                        "nombre": this.menu.nombre,
                        "aptoCeliaco":  this.menu.aptoCeliaco,
                        "aptoVegetariano":  this.menu.aptoVegetariano,
                        "imagen": this.menu.imagenBase64
                    }
                    ).then( () => {
                        this.$swal('Menú editado', "El menú se editado exitosamente", 'success').then( () => window.location.href= "/admin/menu")
                    }).catch( (error)  => {
                        this.$swal('Falló el envío de solicitud', error.response.data.error, 'error')
                    })
                }
            }
    },
    computed: {
        habilitar(){
            return this.menu.nombre!="" 
                    && this.menu.imagenBase64 != ""
            },
    },

    
}
</script>
