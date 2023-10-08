/*
*   FileName: ParticleSystem.js
*   Thanks to https://github.com/MariusBallot/Sound-Reactor for the original NPM Package Library.
*   Sound Pillars Project created by Jesus Perez Arias, created on October 2023.
*   Jesus' GitHub projects hosted at https://github.com/JayDevelops
* */
import * as THREE from 'three';
import MyGUI from "@/utils/MyGUI";

class ParticleSystem {
    constructor() {
        this.bind();
        this.params = {
            particleCount: 5000,
            boxSize: 30,
            particleColor: 0xffffff,
        }
    }

    init(scene) {
        this.scene = scene
        this.particlesGeom = new THREE.BufferGeometry()
        this.particlesPos = []

        for (let p = 0; p < this.params.particleCount; p++) {

            let x = Math.random() * this.params.boxSize - this.params.boxSize / 2;
            let y = Math.random() * this.params.boxSize - this.params.boxSize / 2;
            let z = Math.random() * this.params.boxSize - this.params.boxSize / 2;

            // Create the vertex
            this.particlesPos.push(x, y, z);
        }

        this.particlesGeom.setAttribute('position', new THREE.Float32BufferAttribute(this.particlesPos, 3));

        this.particleMaterial = new THREE.PointsMaterial(
            {
                color: this.params.particleColor,
                size: 0.02,
            });

        this.particleSystem = new THREE.Points(this.particlesGeom, this.particleMaterial);
        this.scene.add(this.particleSystem)
    }

    update() {
        let i = 0
        while (i < this.params.particleCount) {
            this.particlesGeom.attributes.position.array[i * 3 + 1] += 0.01

            //  If the particles are above the box size, move them back to initial box position
            //  so the particles start their animation from the bottom again
            if (this.particlesGeom.attributes.position.array[i * 3 + 1] > this.params.boxSize / 2) {
                this.particlesGeom.attributes.position.array[i * 3 + 1] =- this.params.boxSize / 2
            }
            i++
        }

        this.particlesGeom.attributes.position.needsUpdate = true;
    }

    bind() {
        this.init = this.init.bind(this)
        this.update = this.update.bind(this)
    }

}

const _instance = new ParticleSystem()
export default _instance