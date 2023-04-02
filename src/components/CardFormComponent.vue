<template>
    <div>
    <div id="modalPagar" class="modal modal-fixed-footer" style="min-height: 85vh">
        <div class="modal-content" >
        <h4><b>REALIZAR PAGO</b></h4>
        <p style="font-size: x-large">Total a pagar: ${{total}}</p>
        <VCreditCard :direction="'row'" @change="creditInfoChanged" :trans="translations"/>
        </div>
        <div class="modal-footer">
        <button  class="modal-close waves-effect waves-green btn red darken-4" style="margin-right: 1%">CANCELAR</button>
        <button @click="pagar" class="waves-effect waves-green btn" :disabled="!habilitar">PAGAR Y TERMINAR</button>
        </div>
    </div>
    </div>
</template>

<script>
import VCreditCard from 'v-credit-card';
const translations = {
    name: {
        label: 'Nombre completo',
        placeholder: 'Nombre completo'
    },
    card: {
        label: 'Número de tarjeta',
        placeholder: 'Número de tarjeta'
    },
    expiration: {
        label: 'Expiración'
    },
    security: {
        label: 'Código de seguridad',
        placeholder: 'Código'
    }
};
export default {
    props: ["total", "pedidos"],
    components: {
        VCreditCard
    },
    mounted(){
        document.getElementById("name").addEventListener('focusout', () => {
            if (this.name.length < 5){
                document.getElementById("name").style.border = "1px solid #FF0000"  
                if (!document.getElementById("alertaNombre")){
                    var span = document.createElement("span")
                    span.style.color = "#FF0000"
                    span.innerHTML = "El nombre debe tener al menos 5 caracteres"
                    span.id = "alertaNombre"
                    document.getElementsByClassName("field")[0].appendChild(span)             
                }
                else{
                    document.getElementById("alertaNombre").style.display= "block" 
                }

            }
            else{
                document.getElementById("name").style.border = "1px solid #dcdcdc"
                document.getElementById("alertaNombre").style.display= "none"
            }
        })
        document.getElementById("card-number").addEventListener('focusout', () => {
            if (this.cardNumber.length != 19){
                document.getElementById("card-number").style.border = "1px solid #FF0000"
                if (!document.getElementById("alertaTarjeta")){
                    var span = document.createElement("span")
                    span.style.color = "#FF0000"
                    span.innerHTML = "El número de tarjeta debe tener 16 caracteres"
                    span.id = "alertaTarjeta"
                    document.getElementsByClassName("field")[1].appendChild(span) 
                }
                else{
                    document.getElementById("alertaTarjeta").style.display= "block" 
                }
            }
            else{
                document.getElementById("card-number").style.border = "1px solid #dcdcdc"
                document.getElementById("alertaTarjeta").style.display= "none"

            }
        })
        document.getElementById("expirationdate").addEventListener('focusout', () => {
            
            if (this.expiration.length != 5) {
                document.getElementById("expirationdate").style.border = "1px solid #FF0000"
            }
            else if ((this.expiration.split("/")[1] < new Date().getFullYear().toString().substr(-2)) || (this.expiration.split("/")[1] == new Date().getFullYear().toString().substr(-2)) && (this.expiration.split("/")[0] < new Date().getMonth())){
                if (!document.getElementById("alertaExp")){
                    document.getElementById("expirationdate").style.border = "1px solid #FF0000"
                    var span = document.createElement("span")
                    span.style.color = "#FF0000"
                    span.id = "alertaExp"
                    span.innerHTML = "La fecha de expiración debe ser posterior a la actual"
                    document.getElementsByClassName("field")[2].appendChild(span) 
                }
                else{
                    document.getElementById("alertaExp").style.display= "block" 
                }
            }
            else{
                document.getElementById("expirationdate").style.border = "1px solid #dcdcdc"
                document.getElementById("alertaExp").style.display= "none"
            }
        })
        document.getElementById("securitycode").addEventListener('focusout', () => {
            if (this.security.length != 3){
                 if (!document.getElementById("alertaCod")){
                    document.getElementById("securitycode").style.border = "1px solid #FF0000"
                    var span = document.createElement("span")
                    span.style.color = "#FF0000"
                    span.innerHTML = "La clave debe tener tres números"
                    span.id = "alertaCod"
                    document.getElementsByClassName("field")[3].appendChild(span) 
                 }
                 else{
                    document.getElementById("alertaCod").style.display= "block" 

                 }
            }
            else{
                document.getElementById("securitycode").style.border = "1px solid #dcdcdc"
                document.getElementById("alertaCod").style.display= "none"

            }
        })
    },
    data() {
        return {
            translations,
            name: '',
            cardNumber: '',
            expiration: '',
            security: ''
        };
    },
    methods: {
        creditInfoChanged(values) {
            for (const key in values) {
                this[key] = values[key];
            }
        },
        pagar(){
            this.$swal({
                title: 'CONFIRMAR PAGO',
                text: "Se procesará el pago. ¿Confirmar compra?",
                icon: 'warning',
                showCancelButton: true,
                width: '800px',
                showLoaderOnConfirm: true
            }).then((result) => {
                if(result.value) {
                    console.log({
                        "pedidos": this.pedidos
                    })
                    this.$axios.post("http://127.0.0.1:8000/reservas/"+this.$store.getters.userId+"/comprar",
                    {
                        "pedidos": this.pedidos
                    }
                    )
                    .then(() => {
                        this.$store.commit("vaciarCarrito")
                        this.name= '',
                        this.cardNumber= '',
                        this.expiration= '',
                        this.security= ''
                        this.$swal("Compra exitosa!", "La transacción se realizó correctamente. Podrás ver los tickets pendientes en la seccion MIS TICKETS", "success")
                        .then( () => this.$router.push({"name": "mis_tickets"}) )
                    })
                    .catch( (error) => {
                    this.$swal('Error', error.response.data.error, 'error')
                    })
                }

            })
      
        }
    },
    computed: {
        habilitar(){
            return this.name.length >= 5 && this.cardNumber.length == 19 && (this.expiration.length == 5 && 
            (this.expiration.split("/")[1] > new Date().getFullYear().toString().substr(-2)) || 
            ((this.expiration.split("/")[1] == new Date().getFullYear().toString().substr(-2)) && 
            (this.expiration.split("/")[0] > new Date().getMonth()))
            
            ) && this.security.length == 3
        }
    }
}
</script>
