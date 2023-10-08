/*
*   Thanks to https://github.com/MariusBallot/Sound-Reactor for the original NPM Package Library.
*   Sound Pillars Project created by Jesus Perez Arias. More GitHub projects at https://github.com/JayDevelops
* */
import RAF from "@/utils/RAF";
class SoundReactor {

    constructor(audioUrl) {
        this.ctx
        this.audio
        this.audioSource
        this.analyser
        this.fdata
        this.url = audioUrl
        this.playFlag = false

        this.bind()
    }

    init() {
        this.ctx = new AudioContext();
        this.audio = new Audio(this.url);
        this.audioSource = this.ctx.createMediaElementSource(this.audio);
        this.analyser = this.ctx.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.8

        this.audioSource.connect(this.analyser);
        this.audioSource.connect(this.ctx.destination);
        this.fdata = new Uint8Array(this.analyser.frequencyBinCount);

        //  TODO: come back later to pass props
        this.audio.currentTime = 33

    }

    play() {
        this.audio.play()
        this.playFlag = true
        RAF.subscribe('soundReactorUpdate', this.update)
    }

    pause() {
        this.audio.pause()
        this.playFlag = false
        RAF.unsubscribe('soundReactorUpdate')
    }

    update() {
        this.analyser.getByteFrequencyData(this.fdata);
    }

    bind() {
        this.update = this.update.bind(this)
        this.init = this.init.bind(this)
    }

}

const _instance = new SoundReactor('assets/sounds/This-Game-Remix.mp3')
export default _instance;