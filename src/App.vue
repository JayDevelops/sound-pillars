<template>
    <LoadingScreen />
    <ThreeScene />
    <AudioButton />
</template>

<script>
import ThreeScene from "@/components/ThreeScene.vue";
import AudioButton from "@/components/TitleScreen.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";

export default {
    name: "App",
    components: {
      ThreeScene,
      AudioButton,
      LoadingScreen,
    },
};
</script>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css2?family=Maven+Pro:wght@400;600&display=swap');

body {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Maven Pro', sans-serif;
}

</style>
