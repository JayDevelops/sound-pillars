/*
*   FileName: CameraParallax.js
*   Thanks to https://github.com/MariusBallot/Sound-Reactor for the original NPM Package Library.
*   Sound Pillars Project created by Jesus Perez Arias, created on October 2023.
*   Jesus' GitHub projects hosted at https://github.com/JayDevelops
* */
class CameraParallax {
    constructor() {
        this.bind()
        this.active = true
        this.mousePos = { x: 0, y: 0 }
        this.params = {
            intensity: 0.008,
            ease: 0.08,

        }
    }

    init(camera) {
        this.camera = camera
        this.initZ = this.camera.position.z
        window.addEventListener('mousemove', this.onMouseMove)
    }

    onMouseMove(e) {
        this.mousePos.x = (e.clientX - window.innerWidth / 2) * this.params.intensity
        this.mousePos.y = (e.clientY - window.innerHeight / 2) * this.params.intensity

        //  Do not allow the camera to go below the floor
        const yLimit = -3.4

        if(this.mousePos.y < yLimit) {
            this.mousePos.y = yLimit
        }
    }

    update() {
        if (!this.active)
            return
        this.camera.position.x += (this.mousePos.x - this.camera.position.x) * this.params.ease
        this.camera.position.y += (this.mousePos.y - this.camera.position.y) * this.params.ease
        this.camera.position.z += (this.initZ - this.camera.position.z) * this.params.ease
        this.camera.lookAt(0, 0, 0);
    }

    bind() {
        this.onMouseMove = this.onMouseMove.bind(this)
    }
}

const _instance = new CameraParallax()
export default _instance