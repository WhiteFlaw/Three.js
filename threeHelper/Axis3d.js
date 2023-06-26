import * as THREE from 'three';
import { SpriteText } from './SpriteText.js';

let dataExamples = [
    '周一',
    '周二',
    '周三',
    '周四',
    '周五',
    '周六',
    '周日'
]

export class Axis3d {
    constructor(category, space = 1, size = new THREE.Vector3(8, 6, 4)) {
        this.mesh = new THREE.Group();
        // 水平面网格
        let gridHelper = new GridHelper(size.x, size.y);
        this.mesh.add(gridHelper);
        // 垂直面网格
        let gridVHelper = new GridHelper(size.z, size.y);
        gridVHelper.rotation.z = Math.PI / 2;
        gridVHelper.position.set(-size.x / 2, size.z / 2, 0);
        this.mesh.add(gridVHelper);
        // 侧面网格
        let gridZHelper = new GridHelper(size.x, size.z);
        gridZHelper.rotation.x = Math.PI / 2;
        gridZHelper.position.set(0, size.z / 2, -size.y / 2);
        this.mesh.add(gridZHelper);

        this.addAxisLabel(category, space);
    }

    addAxisLabel(category, space) {
        const data = category || dataExamples;
        data.forEach((item, i) => {
            const x = i === 0 ? i - data.length / 2 - 1 : i - data.length / 2 - 1 + i * space;
            let textPosition = new THREE.Vector3(x, -0.5, 0);
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