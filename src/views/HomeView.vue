<template>
  <div style="min-height: 100vh">
    <div class="carousel carousel-slider center">
      <div class="carousel-item home-bg white-text">
        <div>
          <h3>
            BIENVENIDOS AL SISTEMA DE GESTIÓN <br />
            DEL COMEDOR UNIVERSITARIO
          </h3>
          <p class="white-text">This is your first panel</p>
        </div>
      </div>
       <div class="carousel-item home2-bg white-text">
        <div>
          <h3>
            BIENVENIDOS AL SISTEMA DE GESTIÓN <br />
            DEL COMEDOR UNIVERSITARIO
          </h3>
          <p class="white-text">This is your first panel</p>
        </div>
      </div>
    </div>

    <div class="row container center">
        <h4>
          NUESTRO COMPROMISO
        </h4>
      <div class="col s12 m6 l4">
        <div class="card-panel grey lighten-2">
          <span
            >I am a very simple card. I am good at containing small bits of
            information. I am convenient because I require little markup to use
            effectively. I am similar to what is called a panel in other
            frameworks.
          </span>
        </div>
      </div>
      <div class="col  s12 m6 l4">
        <div class="card-panel grey lighten-2">
          <span
            >I am a very simple card. I am good at containing small bits of
            information. I am convenient because I require little markup to use
            effectively. I am similar to what is called a panel in other
            frameworks.
          </span>
        </div>
      </div>
      <div class="col  s12 m6 l4">
        <div class="card-panel grey lighten-2">
          <span
            >I am a very simple card. I am good at containing small bits of
            information. I am convenient because I require little markup to use
            effectively. I am similar to what is called a panel in other
            frameworks.
          </span>
        </div>
      </div>
    </div>
    <div>
      
    </div>
     <div class="parallax-container">
      <div class="parallax"><img src="../assets/background/parallax.png"></div>
    </div>
  </div>
</template>

<script>
import M from "materialize-css";

export default {
  mounted() {
    M.AutoInit();

     document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.carousel');
     M.Carousel.init(elems, {
      fullWidth: true,
      indicators: true,
     });
  });
    document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.parallax');
     M.Parallax.init(elems);
  });

  },
};
</script>

<style scoped>
.home-bg {
  background-image: linear-gradient(rgba(19, 11, 11, 0.5), rgba(10, 7, 7, 0.5)),
    url("../assets/background/home.jpg");
  background-position: center;
}

.home2-bg {
  background-image: linear-gradient(rgba(19, 11, 11, 0.5), rgba(10, 7, 7, 0.5)),
    url("../assets/background/home2.jpg");
  background-position: bottom;
  background-size: cover;
}

.row {
  margin-top: 4% !important;
  margin-bottom: 4% !important;
}

.parallax-container {
      height: 200px !important;
    }

 h3, h4{

  font-weight: 600;

} 

</style>

