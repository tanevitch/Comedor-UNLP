<template>
  <div class="container" style="margin-top: 5%; margin-bottom: 3%; min-height: 100vh">
    <div class="card" style="padding: 3%"> 
       <div class="row">
              <div class="col">
                <h4>GRILLA DE MENÚS</h4>
                <div v-if="esAdmin">
                  <p>
                    Resumen de los menús ofrecidos cada día. Seleccioná la sede, filtrá por día y turno, y seleccioná los menús para ver el detalle.
                  </p>
                </div>
                <div v-else>
                   <p>
                  ¡Hacé las compras para la semana desde tu dispositivo! 
                  Seleccioná la sede donde querés comer, filtrá por día y turno, y seleccioná los menús que desees para agregarlos al carrito.
                  <br>
                  Podés comprar en distintas sedes.
                </p>
                </div>
              </div>
        </div>
        <div class="row">
          <div class="input-field col s8">
            <select  v-model="sede" id="sede" required v-show="listaSedes.length>0">
              <option v-for="s in this.listaSedes" :key="s.id" :value="s.id">{{s.nombre}}</option>
            </select>
            <label>Seleccionar una sede</label>
          </div>
        </div>
        <ul class="collapsible" v-show="sedeSeleccionada">
          <li>
            <div class="collapsible-header"><i class="material-icons">filter_alt</i>Filtrar resultados</div>
            <div class="collapsible-body">
              <div class="row valign-wrapper">
                <div class="input-field col s6">
                  <select id="dias" v-model="dias" multiple>
                    <option value="lunes">Lunes</option>
                    <option value="martes">Martes</option>
                    <option value="miércoles">Miércoles</option>
                    <option value="jueves">Jueves</option>
                    <option value="viernes">Vienes</option>
                  </select>
                  <label>Filtrar por día</label>
                </div>
                <div class="input-field col s6">
                  <select id="turnos" v-model="turnos" multiple>
                    <option value="almuerzo">Almuerzo</option>
                    <option value="cena">Cena</option>
                  </select>
                  <label>Filtrar por turno</label>
                </div>
              </div>
              <div class="row">
                 <a class="waves-effect waves-light btn red darken-4 col s4 valign-wrapper" @click="limpiar"><i class="material-icons left">delete</i>Quitar filtros</a>
              </div>
            </div>
          </li>
        </ul>
        
      </div>
      <div v-if="sedeSeleccionada">
          <h4 style="text-align:center">
        SEDE {{sedeSeleccionada}}
      </h4>
      <v-calendar v-show="attributes.length>0"
      
        class="custom-calendar "
        :attributes="attributes"
        is-expanded
      >
        <template v-slot:day-content="{ day, attributes }">
          <div>
            <span >{{ day.day }}</span>
            <div >
              <ul>
                <li style="margin: 2%"
                  v-for="attr in attributes"
                  :key="attr.key"
                  :class="attr.customData.turno"
                  @click="clickDia(attr)">
                  <b >{{ attr.customData.menu }}, ${{attr.customData.precio }}</b>
                </li>
              </ul>
              
            </div>
          </div>
        </template>
      </v-calendar>
      <h4 style="text-align: center" v-show="attributes.length==0">No hay resultados para los filtros aplicados</h4>
      </div>
  </div>
</template>

<script>
import M from "materialize-css";

export default {
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
      datos: [],
      attributes: [],
      dias: [],
      turnos: [],
      noMostrar: [],
      sede: null,
      sedeSeleccionada: null,
      listaSedes: []
    };
  },
  methods: {
    obtenerDatos(){
        this.$axios.get("http://127.0.0.1:8000/menu/grilla/user/"+this.$store.getters.userId+"?sede="+this.sede)
        .then(
          res => {
            this.datos= res.data
            this.attributes= this.mapearFormato
            this.noMostrar= Array.from(this.$store.getters.carrito)
            this.eliminar()
          }
        )
    },
    buscar(){
      var turnos = this.turnos
      var dias = this.dias
      if (this.turnos.length == 0){
        turnos = ["almuerzo", "cena"]
      }
      if (this.dias.length == 0){
        dias = ["lunes", "martes", "miércoles", "jueves", "viernes"]
      }

      this.attributes= this.datos.filter( dia => 
          turnos.includes(dia.turno) && 
          dias.includes(new Date(JSON.parse(JSON.stringify(dia.fecha))).toLocaleDateString('es', {weekday:'long'})))
          .map( dia => {
            return {
              key: dia.id,
              customData: {
                id: dia.id,
                dia: dia.fecha,
                menu: dia.menu.nombre,
                precio: dia.precio,
                aptoCeliaco: dia.menu.aptoCeliaco,
                aptoVegetariano: dia.menu.aptoVegetariano,
                stock: dia.limite_porciones,
                turno: dia.turno,
                img: dia.menu.imagenBase64,
                sede: dia.sede
              },
              dates: dia.fecha
            }
          })
      
    },
    limpiar(){
        var x = document.getElementsByClassName("collapsible")[0];
        var instance = M.Collapsible.getInstance(x); 
        instance.close()
        this.attributes= this.mapearFormato
        this.dias= []
        this.turnos= []
    },
    clickDia(menu_habilitacion){
    var fecha_del_menu= new Date(JSON.parse(JSON.stringify(menu_habilitacion.dates))[0].startTime).toLocaleDateString()
    if (this.esAdmin){
      this.$swal({
        html: `<div class="row" style="text-align: left">
              <img src="${menu_habilitacion.customData.img}" id="foto" style="object-fit: cover; height: 15vh; width:100%">
              <h4><b>${menu_habilitacion.customData.menu}</b></h4>
              <b>TURNO ${menu_habilitacion.customData.turno.toUpperCase()}</b>
              <div style="font-size: large">
                <ul>
                  <li>Día en venta: ${fecha_del_menu}</li>
                  <li> Apto Celiaco: ${menu_habilitacion.customData.aptoCeliaco ? "Sí" : "No"}</li>
                  <li> Apto Vegano: ${menu_habilitacion.customData.aptoVegetariano ? "Sí" : "No"}</li>
                  <li>Precio: $${menu_habilitacion.customData.precio}</li>
                  <li>Límite porciones: ${menu_habilitacion.customData.stock == null? "Ilimitado": menu_habilitacion.customData.stock}</li>
                </ul>
              </div>
            </div>`,
        width: '800px',
        showLoaderOnConfirm: true,
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: "Cerrar"

      })
        
    }
    else{
      this.$swal({
        html: `<div class="row" style="text-align: left">
              <img src="${menu_habilitacion.customData.img}" id="foto" style="object-fit: cover; height: 15vh; width:100%">
              <h4><b>${menu_habilitacion.customData.menu}</b></h4>
              <b>TURNO ${menu_habilitacion.customData.turno.toUpperCase()}</b>
              <div style="font-size: large">
                <ul>
                  <li>Día en venta: ${fecha_del_menu}</li>
                  <li> Apto Celiaco: ${menu_habilitacion.customData.aptoCeliaco ? "Sí" : "No"}</li>
                  <li> Apto Vegano: ${menu_habilitacion.customData.aptoVegetariano ? "Sí" : "No"}</li>
                  <li>Precio: $${menu_habilitacion.customData.precio}</li>
                  <li>Límite porciones: ${menu_habilitacion.customData.stock == null? "Ilimitado": menu_habilitacion.customData.stock}</li>
                </ul>
              </div>
            </div>`,
        width: '800px',
        showLoaderOnConfirm: true,
        showCancelButton: true,
        confirmButtonText:
        '<span><i class="material-icons left">add_shopping_cart</i>AGREGAR AL CARRITO</span>',
      })
      .then( (result) =>{
       if(result.isConfirmed){ 
          this.noMostrar.push(menu_habilitacion.customData)
          this.$store.commit("addMenu", menu_habilitacion.customData)
          this.eliminar()
          
       }
        
      })
    }
   },
   eliminar(){
      this.datos= this.datos.filter(ar => !this.noMostrar.find(rm => (rm.id == ar.id || (rm.dia == ar.fecha && rm.turno == ar.turno)) ))
      this.buscar()
    } 
  },
  computed: {
    esAdmin(){
      return this.$store.getters.esAdmin
    },
    mapearFormato(){
      return this.datos.map( dia => {
          return {
          key: dia.id,
          customData: {
            id: dia.id,
            dia: dia.fecha,
            menu: dia.menu.nombre,
            precio: dia.precio,
            aptoCeliaco: dia.menu.aptoCeliaco,
            aptoVegetariano: dia.menu.aptoVegetariano,
            stock: dia.limite_porciones,
            turno: dia.turno,
            img: dia.menu.imagenBase64,
            sede: dia.sede
          },
          dates: dia.fecha
        }})
      }
    
  },
  watch:{
    dias(){
      this.buscar()
    },
    turnos(){
      this.buscar()
    },
    sede(){
      this.sedeSeleccionada= document.getElementById("sede").childNodes[this.sede-1].label 
      this.limpiar()
      this.obtenerDatos()
    },
    
  }
  
};
</script>
<style  >

::-webkit-scrollbar {
  width: 0px;
}
::-webkit-scrollbar-track {
  display: none;
}

.custom-calendar.vc-container {
  --day-border: 1px solid #b8c2cc;
  --day-border-highlight: 1px solid #b8c2cc;
  --day-width: 90px;
  --day-height: 90px;
  --weekday-bg: #f8fafc;
  --weekday-border: 1px solid #eaeaea;
  border-radius: 0;
  width: 100%;
    border: 1px solid rgb(230, 230, 230);

}

.custom-calendar .vc-day{
    text-align: center;
    border: 1px solid rgb(230, 230, 230);
    margin: 1%;
    
}
.vc-day .almuerzo{
    background-color: #e0daed;
    padding: 2%;
}

.vc-header{
    background-color: #26a69a;
}

.vc-title{
  color: white !important;
  padding-bottom: 1%;
}

.vc-arrow{
  color: white ;
}
.vc-arrow:hover{
  color: #26a69a;
}

.vc-weekday{
  color: #26a69a !important; 
  margin: 2% !important;

}

.vc-day .cena{
    background-color: #392466;
    color: white;
    padding: 2%;
}

li.almuerzo, li.cena{
   cursor: pointer;
}

#label{
  font-size: 0.8rem !important;
  color: #9e9e9e;
  margin: 0;
  margin-bottom: 1%;
}

#sede{
  padding: 0;
}

.collapsible{
    box-shadow: none
}

</style>

