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

export class Pie3d2 {
    constructor(data, camera, depth = 1) {
        this.sum = 0;
        this.camera = camera;
        data = data || dataExamples;
        this.mesh = new THREE.Group();

        let sumRotation = 0;

        data.forEach((item) => {
            this.sum += item.value;
        })

        data.forEach((item) => {
            let rotation = (item.value / this.sum) * 2 * Math.PI; // 占据角度值

            const shape = new THREE.Shape();
            shape.moveTo(0, 0);
            // 先把扇形一边贴向xz平面, 然后扇形边用while画, 每次画一边, 角度增加0.05
            let rad = 0;
            while (rad < rotation) {
                shape.lineTo(3 * Math.cos(rad), 3 * Math.sin(rad));
                rad += 0.05;
            }
            // x轴为平面, 线极远点y为: 线长 * sin(角度);
            // x轴为平面, 线极远点x为: 线长 * cos(角度);
            // 最后扇形边在最终旋转值处结束
            shape.lineTo(3 * Math.cos(rotation), 3 * Math.sin(rotation));
            // 连接到原点封口
            shape.lineTo(0, 0);

            const extrudeSettings = {
                steps: 1,
                depth: depth,
                bevelEnabled: false,
                bevelThickness: 1,
                bevelSize: 1,
                vevelOffset: 0,
                bevelSegments: 5
            };

            let color = new THREE.Color(Math.random() * 0xffffff);

            const material = new THREE.MeshStandardMaterial({
                color: color,
                opacity: 0.8,
                transparent: true,
                side: THREE.DoubleSide
            })

            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

            const cylinder = new THREE.Mesh(geometry, material);
            cylinder.rotation.z = sumRotation; // 此时扇形有一扇边在xz平面, 需要旋转
            this.mesh.add(cylinder);

            let textPosition = new THREE.Vector3(
                Math.sin(rotation) * 1.5,
                Math.cos(rotation) * 1.5,
                item.value / 2 + 0.5
            )

            let spriteText = new SpriteText(item.name, textPosition);
            cylinder.add(spriteText.mesh);

            sumRotation += rotation;
        })

        this.mesh.rotation.x = -Math.PI / 2;
        // this.addMouseHover();
    }

    addMouseHover() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(1, 1);
        this.timeline = gsap.timeline();
        this.currentModule = null;

        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / (1080 * (window.innerWidth / 1920))) * 2 + 1;
        })
    }

    update() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(
            this.mesh.children,
            false
        );
        if (
            intersects.length > 0 &&
            this.currentModule == null &&
            this.currentModule != intersects[0].object &&
            this.timeline.isActive()
        ) {
            this.timeline.to(this.currentModule.position, {
                x: 0,
                y: 0,
                duration: 0.1
            })

            this.currentModule = intersects[0].object;
            this.timeline.to(this.currentPie.position, {
                x: Math.cos(this.currentModule.rotation.z),
                y: Math.sin(this.currentModule.rotation.z),
                duration: 0.5
            })
        }

        if (
            intersects.length === 0 &&
            currentModule &&
            !this.timeline.isActive()
        ) {
            this.timeline.to(this.currentPie.position, {
                x: 0,
                y: 0,
                duration: 0.5,
                onComplete: () => {
                    console.log('complete');
                    this.currentModule = null;
                }
            })
        }
    }
}