import * as THREE from 'three';

export class Tube { // 宽度需求用tube
    constructor(scale = 10, tubularSegments = 20, radius = 0.2, radialSegments = 8, color = 0xffffff) {
        const path = new CustomSinCurve(scale);
        const geometry = new THREE.TubeGeometry(path, tubularSegments, radius, radialSegments, false);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide
        });
        this.mesh = new THREE.Mesh(geometry, material);
    }
}

class CustomSinCurve extends THREE.Curve {

    constructor(scale = 1) {
        super();
        this.scale = scale;
    }

    getPoint(t, optionalTarget = new THREE.Vector3()) {

        const tx = t * 3 - 1.5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;

        return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
    }
}