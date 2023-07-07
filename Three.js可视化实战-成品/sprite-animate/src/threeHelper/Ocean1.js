import * as THREE from 'three';
import { Water } from "three/examples/jsm/objects/Water";

export class Ocean1 {
    constructor(flowTexturePath, length, width, density, color) {
        this.length = length;
        this.width = width;
        this.density = density;
        this.velocity = 2.0;
        this.flowTexture = null;
        this.color = color;
        this.mesh = null;

        if (flowTexturePath) {
            const loader = new THREE.TextureLoader();
            this.flowTexture = loader.load(flowTexturePath, (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            })
        }

        const oceanGeometry = new THREE.PlaneGeometry(width, length);
        this.mesh = new Water(oceanGeometry, {
            textureWidth: this.density, // 浑浊程度(密度)
            textureHeight: this.density, // 浑浊程度(密度)
            waterNormals: this.flowTexture,
            waterColor: this.color
        });
        this.mesh.rotation.x = Math.PI * -0.5;
    }

    setFlowTexture(flowTexturePath) {
        const loader = new THREE.TextureLoader();
        this.mesh.waterNormals = loader.load(flowTexturePath, (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        })
    }

    setColor(color) {
        this.mesh.color = color;
    }

    setSize(length, width) { // 性能不好
        const oceanGeometry = new THREE.PlaneGeometry(width, length);
        this.mesh = new Water(oceanGeometry, {
            textureWidth: this.density, // 浑浊程度(密度)
            textureHeight: this.density, // 浑浊程度(密度)
            waterNormals: this.flowTexture,
            waterColor: this.color
        });
        this.mesh.rotation.x = Math.PI * -0.5;
    }

    waterTexture() {
        if (this.flowTexture) {
            return true;
        }
        return false;
    }

    setDensity(density) {
        if (!this.waterTexture()) {
            console.warn('体现密度需要水纹贴图');
            return;
        }
        this.mesh.textureWidth = textureHeight = density;
    }

    setVelocity(velocity) {
        if (!this.waterTexture()) {
            console.warn('体现流速需要水纹贴图');
            return;
        }
        let s = 0;
        if (velocity > 15) { // 再快看起来会有点恐怖
            s = 15;
        } else {
            s = velocity;
        }
        this.velocity = s;
    }
    
    flow() {
        this.mesh.material.uniforms['time'].value += this.velocity / 60.0;
    }
}

  // 起初只是一个创建水的函数
  // 后续完善了密度变更方法之类
  // 只是让对水的各种操作变的更加容易追溯