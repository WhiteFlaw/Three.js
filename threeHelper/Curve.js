import * as THREE from 'three';

export class Curve {
    constructor(path, color = 0xffffff) { // Curve不支持调节宽度, 有宽度需求用tube
        path = path || [
            new THREE.Vector3(-10, 0, 10),
            new THREE.Vector3(-5, 5, 5),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(5, -5, 5),
            new THREE.Vector3(-10, 0, 10)
        ]

        this.curve = new THREE.CatmullRomCurve3(path);

        const points = this.curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const material = new THREE.LineBasicMaterial({ color: color });

        // Create the final object to add to the scene
        const curveObject = new THREE.Line(geometry, material);
        this.mesh = curveObject;
    }

    getPoint(part) {
        return this.curve.getPoint(part);
    }
}