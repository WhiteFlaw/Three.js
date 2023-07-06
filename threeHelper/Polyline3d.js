import * as THREE from 'three';
import { SpriteText } from './SpriteText';

const dataExamples = [
    {
        name: '第一季度',
        value: 2,
    },
    {
        name: '第二季度',
        value: 4,
    },
    {
        name: '第三季度',
        value: 6,
    },
    {
        name: '第四季度',
        value: 8,
    }
];

export class Polyline3d {
    constructor(data, space = 1) {
        data = data || dataExamples;
        this.mesh = new THREE.Group();
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        
        const color = new THREE.Color(Math.random() * 0xffffff);
        const lineMaterial = new THREE.LineBasicMaterial({ color: color });
        
        data.forEach((item, index) => {
            const points = [];
            shape.lineTo(index * space, item.value);
            
            points.push(new THREE.Vector3(index * space, item.value, 0));
            points.push(new THREE.Vector3(index * space, 0, 0));
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(lineGeometry, lineMaterial);
            this.mesh.add(line);

            let textPosition = new THREE.Vector3(index * space, item.value + 0.5, 0);
            let spriteText = new SpriteText("" + item.name + ':' + item.value, textPosition);
            this.mesh.add(spriteText.mesh);
        })

        shape.lineTo(data.length * space - space, 0);
        shape.lineTo(0, 0);

        const extrudeSettings = {
            steps: 1,
            depth: 0.1,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 1,
            vevelOffset: 0,
            bevelSegments: 5
        };

        const material = new THREE.MeshStandardMaterial({
            color: color,
            opacity: 1,
            transparent: true,
            side: THREE.DoubleSide
        })

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        const mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(-3, 0, 0);
        this.mesh.add(mesh)
    }
}