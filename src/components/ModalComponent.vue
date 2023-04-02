<template>
  <div id="modal1" class="modal ">
    <div class="modal-content">
      <slot name="header"/>
      <div style="display: flex; justify-content: center">
        <slot name="body"></slot>
      </div>
    </div>
    <div class="modal-footer">
      <button
        class="
          modal-close
          waves-effect waves-light
          red
          darken-4
          white-text
          btn-flat"
       @click=cerrar>Cerrar</button>
    </div>
  </div>
</template>

<script>
import M from "materialize-css";

export default {
  mounted() {
    M.AutoInit();
  },  
  methods:{
    cerrar(){
      this.$emit("close")
    }
  }

};
</script>
