import * as THREE from 'three';

export class Tube { // 宽度需求用tube
    constructor(path, tubularSegments = 20, radius = 0.2, radialSegments = 8, color = 0xffffff) {
        const path = path || [
            new THREE.Vector3(-10, 0, 10),
            new THREE.Vector3(-5, 5, 5),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(5, -5, 5),
            new THREE.Vector3(-10, 0, 10)
        ]
        const geometry = new THREE.TubeGeometry(path, tubularSegments, radius, radialSegments, false);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide
        });
        this.mesh = new THREE.Mesh(geometry, material);
    }
}
