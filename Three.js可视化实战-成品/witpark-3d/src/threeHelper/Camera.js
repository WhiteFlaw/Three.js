import * as THREE from 'three';

// 多机位
export class Cameras {
    constructor(fov = 75, min = 1, max = 10000) {
        this.cameraMap = new Map();
        this.camera = new THREE.PerspectiveCamera(fov, window.innerHeight / window.innerHeight, min, max);
        this.cameraMap.set('default', this.camera);
    }

    addPerspectiveCamera(fov = 75, min = 1, max = 10000) {
        const camera = new THREE.PerspectiveCamera(fov, window.innerHeight / window.innerHeight, min, max);
        return camera;
    }

    rePos(x, y, z) {
        this.camera.position.set(x, y, z);
    }

    activeCamera(name) { // 当前激活机位
        this.camera = this.cameraMap.get(name);
        return this.camera;
    }

    setCamera(name, camera) { // 增加机位
        this.cameraMap.set(name, camera);
    }
}