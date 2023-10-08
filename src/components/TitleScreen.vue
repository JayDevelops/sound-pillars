<template>
  <div class="titleScreen">
    <div class="topLeft">
      <h1>Sound Pillars <span class="model">Model</span></h1>
      <p>A real time animated visual with sound.</p>
    </div>
    <div class="bottomLeft">
      <p>
        Modeled and programmed by <a href="https://www.jesusperez.dev/" target="_blank">Jesus Perez</a>.
      </p>
    </div>
    <div class="buttons">
      <button
          @click="onPlay()"
          v-if="!playFlag"
      >
        Play
      </button>
      <button
          @click="onPause()"
          v-else
      >
        Pause
      </button>
    </div>
  </div>
</template>

<script>
import SoundReactor from "@/classes/SoundReactor";
export default {
  name: "AudioButton",
  data() {
    return {
      initFlag: false,
      playFlag: false,
    };
  },
  methods: {
    onPlay() {
      if(!this.initFlag) {
        this.initFlag = true
        SoundReactor.init()
      }
      SoundReactor.play()
      this.playFlag = true
    },
    onPause() {
      SoundReactor.pause()
      this.playFlag = false
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.titleScreen {
  .topLeft {
    position: absolute;
    top: 0;
    left: 0;
    color: white;
    padding: 100px;

    // Hide stuff so it fits on tinier screens with the GUI
    @media (max-width: 768px) {
      padding-top: 40px;
      padding-left: 20px;

      h2 {
        font-size: 18px;
      }

      p {
        font-size: 12px;
      }
      .model {
        opacity: 0;
      }
    }
  }
  .bottomLeft {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 100px;
    color: white;
    font-size: 14px;

    a {
      color: white;
      text-decoration: underline;

      &:hover {
        color: lightcoral;
      }
    }

    // Adjust so it fits on tinier screens
    @media (max-width: 768px) {
      text-align: center;
      padding-bottom: 20px;
      p {
        font-size: 10px;
      }
      .model {
        opacity: 0;
      }
    }
  }

  button {
    color: white;
    background: transparent;
    border-radius: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    width: 100px;
    height: 50px;
    position: absolute;
    bottom: 100px;
    right: 100px;
    border: solid lightcoral;
    transition: all 0.3s ease-in-out;

    &:hover {
      background: red;
    }

    //  Push the button a bit downwards
    @media (max-width: 768px) {
      bottom: 80px;
      right: 70px;
    }
  }
}
</style>
