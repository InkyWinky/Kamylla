<template>
    <div class ="loader">
  <div
        uk-grid=""
        class="
          uk-card
          uk-card-hover
          uk-card-small
          uk-card-default
          uk-grid-collapse
          uk-margin
          uk-margin-bottom
          uk-grid
        "
      >
        <div
          class="
            uk-card-media-left uk-cover-container uk-width-1-6 uk-first-column
          "
        >
          <div
            class="uk-flex uk-flex-center uk-flex-middle"
            style="height: 100%"
          >
           <div uk-spinner="ratio: 2" class="uk-icon uk-spinner">
              <!-- <svg
                width="60"
                height="60"
                viewBox="0 0 30 30"
                xmlns="http://www.w3.org/2000/svg"
                data-svg="spinner"
              > --> 
                <circle
                  fill="none"
                  stroke="#000"
                  cx="15"
                  cy="15"
                  r="14"
                  style="stroke-width: 0.5px"
                ></circle>
              <!-- </svg> -->
            </div>
          </div>
        </div>
        <div class="uk-width-expand">
          <div class="uk-card-body">
            <div class="text-input__loading">
              <div class="text-input__loading--line"></div>
              <div class="text-input__loading--line"></div>
              <div class="text-input__loading--line"></div>
              <div class="text-input__loading--line"></div>
            </div>
          </div>
        </div>
      </div>
    
    </div>
</template>

<script>
export default {
  
}
</script>
<style scoped>
.loader {
    width: 100vw;
}
.text-input__loading{
    width:80%;
}
</style>