<template>
  <ul class="pagination">
    <li :class="[{'disabled': paginaActual == 1}]"><a ><i class="material-icons"  @click="actualizarPagina(paginaActual-1)">chevron_left</i></a></li>
    <li  :class="[{'active': paginaActual == pagina}]" v-for="pagina in totalPaginas" :key="pagina"><span @click="actualizarPagina(pagina)">{{pagina}}</span></li>
    <li class="waves-effect" :class="[{'disabled': paginaActual == totalPaginas}]"><a ><i class="material-icons"  @click="actualizarPagina(paginaActual+1)">chevron_right</i></a></li>
  </ul>
          
</template>

<script>
export default {
   props:[
        "paginaActual",
        "totalPaginas"
    ],
   methods: {
        actualizarPagina(pagina){
          if (pagina >=1 && pagina <=this.totalPaginas)
            this.$emit("actualizarPag", pagina)
        }
    },
}
</script>
<style scoped>
    .active{
        background-color: #26a69a !important;
    }

    .active span{
      color: white;
    }

    span{
      color: #000;
      padding: 0 10px;
      line-height: 30px;
      font-size: 1.2rem;
    }
    .pagination{
    margin-top: 4%;
    margin-bottom: 4%;

}
</style>
