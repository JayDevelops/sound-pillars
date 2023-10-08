/*
*   FileName: MainThreeScene.js
*   Sound Pillars Project created by Jesus Perez Arias, created on October 2023.
*   Jesus' GitHub projects hosted at https://github.com/JayDevelops
*
* */
import * as THREE from "three"

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import RAF from '@/utils/RAF'
import config from '@/utils/config'
import MyGUI from '@/utils/MyGUI'

import SpherePillars from '@/classes/SpherePillarsClass'   //  Import SpherePillarsClass which are the pillars
import Floor from '@/classes/FloorClass'   //  Import FloorClass which is the floor
import Spectrum from '@/classes/SpectrumClass' // Import Spectrum Class which is the effects
import ParticleSystem from '@/classes/ParticleSystem'   //  Import ParticleSystem which is the particles
import CameraParallax from "@/classes/CameraParallax";

class MainThreeScene {
    constructor() {
        this.bind()
        this.camera
        this.scene
        this.renderer
        this.controls
    }

    init(container) {
        //RENDERER SETUP
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.debug.checkShaderErrors = true
        this.renderer.outputEncoding = THREE.LinearEncoding
        container.appendChild(this.renderer.domElement)

        //MAIN SCENE INSTANCE
        const color = new THREE.Color(0x151515)
        const fog = new THREE.Fog(color, 15, 25)
        this.scene = new THREE.Scene()
        this.scene.fog = fog
        this.scene.background = color

        //CAMERA AND ORBIT CONTROLLER
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.camera.position.set(0, 0, 7)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enabled = false
        this.controls.maxDistance = 25
        this.controls.minDistance = 3
        // In orbit controls, do not allow the camera to go below the floor
        this.controls.minPolarAngle = 0
        this.controls.maxPolarAngle = Math.PI / 2 + 0.3
        CameraParallax.init(this.camera)

        //  Import the Helper Classes below and initialize it to the scene
        SpherePillars.init(this.scene)
        Floor.init(this.scene)
        Spectrum.init(this.scene)
        ParticleSystem.init(this.scene)

        //  GUI settings
        MyGUI.hide()
        if (config.myGui) {
            MyGUI.show()
        }


        //  TODO: Add Camera GUI Options
        const cameraFolder = MyGUI.addFolder('Camera Folder')
        cameraFolder.open()
        cameraFolder.add(this.controls, "enabled").onChange(() => {
            if(this.controls.enabled) {
                CameraParallax.active = false
            }
        }).listen().name('Orbit Controls')

        cameraFolder.add(CameraParallax, "active").onChange(() => {
            if(CameraParallax.active) {
                this.controls.enabled = true
            }
        }).listen().name('Camera Parallax')

        cameraFolder.add(CameraParallax.params, "intensity", 0.001, 0.01)
        cameraFolder.add(CameraParallax.params, "ease", 0.01, 0.1)


        //RENDER LOOP AND WINDOW SIZE UPDATER SETUP
        window.addEventListener("resize", this.resizeCanvas)
        RAF.subscribe('threeSceneUpdate', this.update)
    }

    update() {
        this.renderer.render(this.scene, this.camera);
        this.scene.rotateY(0.0012)
        SpherePillars.update()
        Spectrum.update()
        ParticleSystem.update()
        CameraParallax.update()
    }

    resizeCanvas() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
    }

    bind() {
        this.resizeCanvas = this.resizeCanvas.bind(this)
        this.update = this.update.bind(this)
        this.init = this.init.bind(this)
    }
}

const _instance = new MainThreeScene()
export default _instance