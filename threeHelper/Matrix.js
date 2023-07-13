import * as THREE from 'three';

export class MatrixAxis {
    constructor(space = 10, density = 11, geometry, texture) {
        const particleGeometry = geometry || new THREE.BufferGeometry();

        if (density % 2 === 0) {
            density++;
        }

        const amount = density;
        const positions = []; // 3个一组
        const colors = [];

        const offset = (amount - 1) / 2;
        for (let x = 0; x < amount; x++) { // x由0递增, 最大10
            for (let y = 0; y < amount; y++) {
                for (let z = 0; z < amount; z++) {
                    positions.push((offset - x) * space, (offset - y) * space, (offset - z) * space)
                    colors.push(0xffffff, 0xffffff, 0xffffff);
                }
            }
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

        const material = new THREE.PointsMaterial();

        if (!texture) {
            const canvas = document.createElement("canvas");
            canvas.width = 1024;
            canvas.height = 1024;
            const context = canvas.getContext("2d");
            this.context = context;
            // context.fillStyle = "rgba(90, 90, 90, 0.7)";
            context.fillRect(0, 256, 1024, 512);
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.font = "bold 1200px Arial";
            context.fillStyle = "rgba(255, 255, 255, 1)";
            context.fillText('+', canvas.width / 2, canvas.height / 2);

            let texture = new THREE.CanvasTexture(canvas);

            material.map = texture;
            material.alphaMap = texture;
        }
        material.size = 1;
        // material.color.set(0xfff000);
        material.sizeAttemuation = true;
        material.transparent = true;
        material.depthWrite = false;
        material.vertexColors = true;
        material.blending = THREE.AdditiveBlending;

        const points = new THREE.Points(particleGeometry, material);


        this.mesh = points;
    }
}