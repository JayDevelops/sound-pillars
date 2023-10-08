<template>
  <div class="loadingScreen" ref="loadingScreen">
    <div class="wrapper">
      <div class="loadingText">
        <h2>Loading...</h2>
      </div>
      <div class="progressBar">
        <div
            class="progressFill"
            :style="{width: progress + '%'}"
        >
        </div>
      </div>

      <div class="progressText">
        <p>{{ progressUrl }}</p>
      </div>
    </div>

  </div>
</template>

<script>
import LoadingController from "@/classes/LoadingController";
import RingLoader from "vue-spinner/src/RingLoader.vue"

export default {
  name: "LoadingScreen",
  data() {
    return {
      progress: 0,
      progressUrl: "",
    }
  },
  mounted() {
    LoadingController.onProgress = this.onProgress;
    LoadingController.onLoad = this.onLoad;
  },

  methods: {
    onProgress(url, loaded, total) {
      this.progressUrl = url;
      this.progress = Math.round(((loaded / total * 100) + Number.EPSILON) * 100) / 100
    },
    onLoad() {
      this.$refs.loadingScreen.classList.add('finished')
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.loadingScreen {
  width: 100vw;
  height: 100vh;
  background: #151515;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  color: white;
  font-size: 3em;
  transition: all 0.2s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
      margin-bottom: 20px;
      font-size: 1.5em;
    }

    .progressBar {
      width: 300px;
      height: 20px;
      border0-radius: 50px;
      background: black;

      .progressFill {
        width: 50%;
        height: 100%;
        background: red;
        transition: width 0.2s ease-in-out;
      }
    }

    .progressText {
      color: gray;
      margin-top: 20px;
      font-size: 0.5em;
    }

  }

  &.finished {
    opacity: 0;
    pointer-events: none;
  }
}


</style>
