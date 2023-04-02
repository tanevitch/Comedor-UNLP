<template>
  <div id="app" > 
    <NavbarComponent/>
    <router-view/>
    <FooterComponent/>
      
  </div>
</template>

<script>
import NavbarComponent from './components/NavbarComponent.vue';
import FooterComponent from './components/FooterComponent.vue'
export default {
  components: {
    NavbarComponent, 
    FooterComponent
  },

}
</script>

<style>
  h4{
    text-transform: uppercase;
    color: #26a69a;
    font-weight: bold;

  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  .btn.cancelar{
    background-color: #B71C1C;
    margin-right: 2em !important
  }

  p{
    font-size: large;
  }
  .simillabel{
    color: #9e9e9e;
    font-size: 0.8rem;
    padding: 0; 
    margin: 0
  }
</style>