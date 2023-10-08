/*
*   FileName: SpectrumClass.js
*   Sound Pillars Project created by Jesus Perez Arias, created on October 2023.
*   Jesus' GitHub projects hosted at https://github.com/JayDevelops
*
* */
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import MyGUI from "@/utils/MyGUI";
import LoadingController from "@/classes/LoadingController";

import spectrumFrag from '../shaders/spectrum.frag'
import spectrumVert from '../shaders/spectrum.vert'

class SpectrumClass {
    constructor() {
        this.bind()
        this.modelLoader = new GLTFLoader(LoadingController)
        this.textureLoader = new THREE.TextureLoader(LoadingController)
    }

    init(scene) {
        this.scene = scene

        this.uniforms = {
            uMatCap: {
                value: this.textureLoader.load('./assets/textures/blackMetal.png')
            },
            uSpecterSize: {
                value: 0.6
            },
            uWaveBorder: {
                value: 0.3
            },
            uWaveSpeed: {
                value: 0.1
            },
            uBorderColor: {
                value: new THREE.Color("hsl(355, 80%, 65%)")
            },
            uTime: {
                value: 0.0
            }
        }

        const shaderFolder = MyGUI.addFolder('Spectrum Color')
        shaderFolder.open()
        shaderFolder.add(this.uniforms.uSpecterSize, 'value', -1, 1).name('Spectrum Size')
        shaderFolder.add(this.uniforms.uWaveBorder, 'value', 0, 1).name('Wave Border')
        shaderFolder.add(this.uniforms.uWaveSpeed, 'value', 0, 1).name('Wave Speed')

        this.shaderMaterial = new THREE.ShaderMaterial({
            fragmentShader: spectrumFrag,
            vertexShader: spectrumVert,
            uniforms: this.uniforms,
            transparent: true,
        })

        this.modelLoader.load('./assets/models/spectrum.glb', (glb) => {
            glb.scene.traverse((child) => {
                if(child instanceof THREE.Mesh) {
                    child.material = this.shaderMaterial
                    child.scale.multiplyScalar(2.85)
                    child.position.y = -3
                }
            })
            this.scene.add(glb.scene)  //  add the floor object to the scene
        })
    }

    update() {
        this.uniforms.uTime.value += 1

    }

    bind() {

    }
}

const _instance = new SpectrumClass()
export default _instance