/*
*   FileName: SpherePillarsClass.js
*   Sound Pillars Project created by Jesus Perez Arias, created on October 2023.
*   Jesus' GitHub projects hosted at https://github.com/JayDevelops
*
* */
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import LoadingController from "@/classes/LoadingController";

import SoundReactor from "@/classes/SoundReactor";
import MyGUI from "@/utils/MyGUI";

class SpherePillarsClass {
    constructor() {
        this.bind()
        this.modelLoader = new GLTFLoader(LoadingController)
        this.textureLoader = new THREE.TextureLoader(LoadingController)

        //  GUI Params initialization below
        this.params = {
            waveSpeed: 1,
            subDivisions: 3,
            pillarsSize: 0.2,
        }
    }

    init(scene) {
        this.scene = scene  //  Init the global scene here
        this.upVector = new THREE.Vector3(0, 1, 0)  //  Init the upVector for pillars
        this.pillars = new THREE.Group()    // A group to hold the pillars
        this.pillar //  Pillar model itself

        //  Load the textures for the pillars below
        const greyTexture = this.textureLoader.load('./assets/textures/greyMetal.png')
        const blackTexture = this.textureLoader.load('./assets/textures/blackMetal.png')

        // Init the black and grey metal 'mad caps' shader textures
        this.greyMatCap = new THREE.MeshMatcapMaterial({
            matcap: greyTexture
        })
        this.blackMatCap = new THREE.MeshMatcapMaterial({
            matcap: blackTexture
        })

        //  TODO: Load the pillar with the black material texture
        this.modelLoader.load('./assets/models/pillar.glb', (glb) => {
            //  Traverse through the glTF scene and add materials
            glb.scene.traverse((child) => {

                // Target the base with the blackTexture
                if(child.name === "base") {
                    this.pillar = child
                    child.material = this.blackMatCap
                }

                // Target the base with their appropriate material
                if(child.name === "Cylinder") {
                    child.material = this.greyMatCap
                }
            })
            this.computePositions()
        })

        //  TODO: Initialize the SpherePillars GUI here
        const sphereFolder = MyGUI.addFolder('Sphere Pillars')
        sphereFolder.open()
        sphereFolder.add(this.params, 'waveSpeed', 0.001, 3).name('Wave Speed')
        sphereFolder.add(this.params,'subDivisions', 1, 5).step(1).name('IcoSphere Subdivisions').onChange(this.computePositions)
        sphereFolder.add(this.params, 'pillarsSize', 0.01, 0.60).name('Pillar Size').onChange(this.computePositions)
    }

    computePositions() {
        //  TODO: Redraw the IcoSphere, if one exists then clear otherwise let ico be the child
        let ico
        this.scene.traverse((child) => {
            if(child.name === "ico") {
                ico = child
            }
        })

        if(ico) {
            this.scene.remove(ico)
        }


        //  TODO: Create the main Icosahedron geometry, then place the material on a new Sphere Mesh Object
        const sphereGeometry = new THREE.IcosahedronGeometry(2, this.params.subDivisions)
        const sphereMaterial = this.greyMatCap
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

        this.scene.add(sphere)  //  Add the sphere object to the scene
        this.pillars.clear()    //  Clear the group of pillars when GUI is changed

        /*  Get the array of vertices from the sphere. you may log the sphereGeometry to see attributes.
        *   Each vertex is an array of 3 number pairs (x, y, z)
        * */
        const sphereVertices = sphereGeometry.attributes.position.array

        let vertexArray = []    //  Init the vertexArray consisting of x, y, z values

        //  For each vertex of the sphere (jumps by 3)
        for(let i = 0; i < sphereVertices.length; i += 3) {
            // Get the x, y, z values for each vertex
            const x = sphereVertices[i]
            const y = sphereVertices[i + 1]
            const z = sphereVertices[i + 2]
            vertexArray.push({
                x: x,
                y: y,
                z: z,
            })
        }

        //  TODO: Add the pillars to each vertex of the sphere
        let pillarPos = []

        //  This shaves off the vertices, saves cost when creating pillars onto the sphere
        for(let i = 0; i < vertexArray.length; i++) {
            let existsFlag = false
            for(let j = 0; j < pillarPos.length; j++) {
                //  If each vertex (x, y, z) pair matches then set the flag as true
                if (
                    pillarPos[j].x === vertexArray[i].x &&
                    pillarPos[j].y === vertexArray[i].y &&
                    pillarPos[j].z === vertexArray[i].z
                ) {
                    existsFlag = true
                }
            }

            //  If the vertex does not exist in the pillarPos array,
            if(!existsFlag) {
                pillarPos.push({
                    x: vertexArray[i].x,
                    y: vertexArray[i].y,
                    z: vertexArray[i].z,
                })

                //  TODO: Add the pillars to each vertex of the sphere
                const c = this.pillar.clone()
                const positionVector = new THREE.Vector3(vertexArray[i].x, vertexArray[i].y, vertexArray[i].z)

                c.scale.multiplyScalar(this.params.pillarsSize)
                c.position.copy(positionVector)

                //  Set the pillar clone to the rotation of the upVector in alignment to the positionVector of the sphere!
                c.quaternion.setFromUnitVectors(this.upVector, positionVector.normalize())
                this.pillars.add(c) // Add each pillar to the pillars group, holds reference
            }
        }
        this.scene.add(this.pillars)  //  Add the pillars to the after the loop

        // this.scene.add(sphere)  //  Add the sphere to the scene
    }

    update() {
        const sound = SoundReactor  //  Grab reference to SoundReactor class
        let pillars = this.pillars  //  Grab reference to the pillars group

        // GUI Settings parameters below
        let customWaveSpeed = this.params.waveSpeed //  Get the custom wave speed from the GUI

        //  If the sound is playing, update the position of the pillars to be animated to the song else default animation
        if(sound.playFlag) {
            //  Initialize the pillars position onto the icoSphere
            let i = 0
            while(i < pillars.children.length) {
                let frequency = sound.fdata[i] / 255
                pillars.children[i].children[0].position.y = frequency * 3.5
                i++
            }
        } else {
            //  Initialize the pillars position onto the icoSphere
            let i = 0

            while(i < pillars.children.length) {
                pillars.children[i].children[0].position.y = (Math.sin(Date.now() * 0.01 * customWaveSpeed + pillars.children[i].position.x) + 1) * 1.5
                i++
            }
        }


    }

    bind() {
        this.computePositions = this.computePositions.bind(this)
    }
}

const _instance = new SpherePillarsClass()
export default _instance