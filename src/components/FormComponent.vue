<template>
  <div class="form-bg valign-wrapper center" >
    <div class="row">
      <div class="col">
        <div class="card white darken-1" >
          <div class="card-content" style="padding: 2em">
            <slot name="form-name"></slot>
            <slot name="form"></slot>
            <slot name="form-buttons"></slot>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-bg {
  background-image: linear-gradient(rgba(19, 11, 11, 0.5), rgba(10, 7, 7, 0.5)),
    url("../assets/background/form.jpg");
  background-position: center;
  min-height: 100vh;
  padding-top: 2%;
  padding-bottom: 1%;
}
</style>
