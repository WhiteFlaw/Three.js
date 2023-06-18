import * as THREE from 'three';
import { Light } from './Light';

export class Sun {
    constructor() {
        this.sun = null;
        this.light = null;
        this.create();
    }

    create() {
        let sunGeometry = new THREE.SphereGeometry(100, 32, 32);
        let sunMaterial = new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffffcc });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);

        const light = new Light();
        this.light = light.create('directional', 0xffffcc, 2);
        this.light.setCameraArea(1000, 1000, 1000, 1000);
        this.light.setCameraLength(0.1, 10000);
        this.light.setRadius(5);
        this.sun.add(this.light.light);
        return this.sun;
    }

    rePos(x, y, z) {
        this.sun.position.set(x, y, z);
    }
}