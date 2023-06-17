import * as THREE from 'three';
import { Light } from './Light';

export class Sun {
    constructor(x, y, z, color) {
        this.sun = null;
        this.light = null;
        this.create(x, y, z, color);
    }

    create(x, y, z, color) {
        let sunGeometry = new THREE.SphereGeometry(100, 32, 32);
        let sunMaterial = new THREE.MeshStandardMaterial({ color: color, emissive: 0xffffcc });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.sun.position.set(x, y, z);
        
        this.light = new Light();
        let sunLight = this.light.create('directional', color, 2);
        sunLight.setCameraArea(1000, 1000, 1000, 1000);
        sunLight.setCameraLength(0.1, 10000);
        sunLight.setRadius(5);
        this.sun.add(sunLight);
        return sun;
    }

    move(time) {
        this.sun.position.z = Math.cos(((time - 6) * 2 * Math.PI) / 24) * 4000;
        this.sun.position.y = Math.sin(((time - 6) * 2 * Math.PI) / 24) * 4000;
    }
}