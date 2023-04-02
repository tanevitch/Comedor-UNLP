<template>
<li>
      <div class="collapsible-header waves-effect waves-dark " style="justify-content: space-between">
        <div class="valign-wrapper"><i class="material-icons">account_circle</i>{{persona.nombre}} {{persona.apellido}}</div>
        <div v-if="estadoSolicitud=='pendiente'">
          
          <a class="waves-effect waves-light btn red darken-4" 
            @click="rechazarSolicitud">Rechazar</a>
          <a class="waves-effect waves-light btn"
            @click="aceptarSolicitud">Aceptar</a>
        </div>
        <div v-else>{{mensajePorEstados[estadoSolicitud]}}</div>
      </div>
      <div class="collapsible-body">
        <div class="row valign-wrapper">
          <div class="col s6">
            <ul>
              <li>Nombre: {{persona.nombre}} {{persona.apellido}}</li>
              <li>DNI: {{persona.dni}}</li>
              <li>Email: {{persona.email}}</li>
              <li>Relación académica: {{persona.rol}}</li>
              <li>Facultad: {{persona.facultad.nombre}}</li>
            </ul>
          </div>
          <div class="col s6 center">
            <button
              class="waves-effect waves-light btn modal-trigger"
              data-target="modal1" @click="ver=true"
              >Ver archivo adjunto</button
            >

          </div>
        </div>
      </div>
                

      <Modal v-if="ver" @close="ver=false">
      <template slot="header"><h5>CERTIFICADO</h5></template>
      <template slot="body" >
          <vue-pdf-embed :source="persona.archivoBase64" style="width: 100%"/>
      </template>
    </Modal>
    </li>
</template>

<script>
import Modal from "../components/ModalComponent.vue"
import VuePdfEmbed from 'vue-pdf-embed/dist/vue2-pdf-embed'
import emailjs from 'emailjs-com';

export default {
components: {
  Modal, 
  VuePdfEmbed
},
props: {
  persona : null
},
data(){
  return {
    estadoSolicitud: this.persona.estado,
    mensaje: "",
    ver: false,
    mensajePorEstados: {
      "aprobado": "Solicitud aprobada",
      "rechazado": "Solicitud rechazada"
    }
  }
},
methods:{
  sendEmail() {
      try {
        emailjs.send('service_0igho5c', 'template_j6hojzs', {
          to: this.persona.email,
          mensaje: this.mensaje
        }, 'p7cd-9c-3nigqL58N')

      } catch(error) {
           this.$swal('Error', error.text, 'error')
      }
      this.mensaje = ""
    },
  aceptarSolicitud(e){
    e.stopPropagation();
    this.$swal({
        title: 'ACEPTAR SOLICITUD',
        text: `Esta acción habilitará el ingreso al usuario. Se enviará un email a ${this.persona.nombre.toUpperCase()} ${this.persona.apellido.toUpperCase()} notificando su situación.`,
        icon: 'warning',
        showCancelButton: true,
        width: '800px',
        showLoaderOnConfirm: true
      }).then((result) => {
        if(result.value) {
          this.$axios.post(
            "http://127.0.0.1:8000/user/habilitar/"+this.persona.id,
            {
              "estadoSolicitud": "aprobado"
            }
            ).then( () => {
                this.estadoSolicitud= "aprobado"
                this.mensaje= "Su solicitud ha sido aprobada. Ya puede ingresar al sistema con su DNI y clave"
                this.sendEmail();
                this.$swal('Solicitud confirmada', 'Se envió un correo notificando la situacion', 'success')
              }
            )
            .catch( (error) => {
                this.$swal('Error', error.response.data.error, 'error')
            })
          }
        })
  },
  rechazarSolicitud(e){
    e.stopPropagation();
    this.$swal({
        title: 'RECHAZAR SOLICITUD',
        text: `Por favor, escribí debajo la causa de rechazo. Se enviará un email a ${this.persona.nombre.toUpperCase()} ${this.persona.apellido.toUpperCase()} notificando su situación.`,
        icon: 'warning',
        showCancelButton: true,
        input: 'textarea',
        preConfirm: (value) => {
        if (!value) {
          this.$swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Tenés que ingresar un texto para continuar'
          )
        }
      }
      }).then((result) => {
        if(result.value) {
          this.$axios.post(
            "http://127.0.0.1:8000/user/habilitar/"+this.persona.id,
            {
              "estadoSolicitud": "rechazado"
            }).then( () => {
                this.estadoSolicitud= "rechazado"
                this.mensaje= "Su solicitud ha sido rechazada. La causa del rechazo es: "+ result.value
                this.sendEmail();
                this.$swal('Solicitud rechazada', 'Se envió un correo notificando la situacion', 'success')
              })
              .catch( (error) => {
                this.$swal('Error', error.response.data.error, 'error')
              })
        }
    })
  }

}
}
</script>

