import * as THREE from 'three';

export class Snow {
    constructor(geometry, color, texture) {
        const particleGeometry = geometry || new THREE.BufferGeometry();

        const count = 3000;
        const colors = new Float32Array(count * 3);
        const positions = new Float32Array(count * 3); // 3个一组

        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 100; // 0到-5之间
            colors[i] = color || 0xffffff;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial();
        
        if (texture) {
            material.map = texture;
            material.alphaMap = texture;
        }
        material.size = 0.1;
        material.color.set(0xfff000);
        material.sizeAttemuation = true;
        material.transparent = true;
        material.depthWrite = false;
        material.vertexColors = true;
        material.blending = THREE.AdditiveBlending;

        const points = new THREE.Points(particleGeometry, material);

        this.mesh = points;
    }
}