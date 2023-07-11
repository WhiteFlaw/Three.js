import * as THREE from 'three';
import { SpriteText } from './SpriteText.js';

let dataExamples = [
    ["0%", "20%", "40%", "60%", "80%", "100%"],
    ["line0", "line1", "line2", "line3", "line4"]
]

export class Axis3d {
    constructor(category, bottom = 0, left = 2, size = new THREE.Vector3(8, 6, 4)) {
        this.mesh = new THREE.Group();
        // 水平面网格
        let gridHelper = new GridHelper(size.x, size.z);
        this.mesh.add(gridHelper);
        // 垂直面网格
        let gridVHelper = new GridHelper(size.y, size.z);
        gridVHelper.rotation.z = Math.PI / 2;
        gridVHelper.position.set(-size.x / 2, size.y / 2, 0);
        this.mesh.add(gridVHelper);
        // 侧面网格
        let gridZHelper = new GridHelper(size.x, size.y);
        gridZHelper.rotation.x = Math.PI / 2;
        gridZHelper.position.set(0, size.y / 2, -size.z / 2);
        this.mesh.add(gridZHelper);

        this.addAxisLabel(category, bottom, left, size);
    }

    addAxisLabel(category, bottom, left, size) {
        const data = category || dataExamples;
        data[0].forEach((item, i) => {
            const y = i === 0 ?
                bottom :
                (size.y - bottom) / (data[0].length - 1) * i + bottom;
            let textPosition = new THREE.Vector3(- size.x / 2 - 1, y, 0);
            let spriteText = new SpriteText(item, textPosition, 0);
            this.mesh.add(spriteText.mesh);
        })
        data[1].forEach((item, i) => {
            const x = i === 0 ?
                - (size.x / 2) + left :
                (size.x - left) / (data[1].length - 1) * i - (size.x / 2) + left;
            let textPosition = new THREE.Vector3(x, - 0.5, 0);
            let spriteText = new SpriteText(item, textPosition, 0);
            this.mesh.add(spriteText.mesh);
        })
    }
}

class GridHelper extends THREE.LineSegments {
    constructor(sizeX = 10, sizeY = 10, color1 = 0x444444, color2 = 0xffffff) {
        color1 = new THREE.Color(color1);
        color2 = new THREE.Color(color2);

        const step = 1;
        const halfSizeX = sizeX / 2;
        const halfSizeY = sizeY / 2;

        const vertices = [], colors = [];
        let j = 0;

        for (let i = 0, k = -halfSizeX; i <= sizeX; i++, k += step) {
            vertices.push(k, 0, -halfSizeY, k, 0, halfSizeY);

            const color = i == 0 || i == sizeX ? color2 : color1;

            color.toArray(colors, j);
            j += 3;
            color.toArray(colors, j);
            j += 3;
        }

        for (let i = 0, k = -halfSizeY; i <= sizeY; i++, k += step) {
            vertices.push(-halfSizeX, 0, k, halfSizeX, 0, k);

            const color = i == 0 || i == sizeY ? color2 : color1;

            color.toArray(colors, j);
            j += 3;
            color.toArray(colors, j);
            j += 3;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(vertices, 3)
        );
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.LineBasicMaterial({
            vertexColors: true,
            toneMapped: false
        })

        super(geometry, material);

        this.type = 'GridHelper';
    }
}