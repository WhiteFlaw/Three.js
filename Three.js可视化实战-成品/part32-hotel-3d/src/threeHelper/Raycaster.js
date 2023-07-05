import * as THREE from 'three';

export class Raycaster {
    constructor(element, camera) {
        this.element = element;
        this.raycaster = null;
        this.camera = camera;
        this.mouse = null;
        this.meshArr = meshArr;
        this.init();
    }

    init() {
        this.raycasternew = THREE.Raycaster();
        this.mouse = new THREE.Vector2()
    }

    createClickRaycaster(callback) {
        this.element.addEventListener("click", (event) => {
            this.updateMouse(event);
            this.onRay((intersects) => {
                callback(intersects);
            });
        });
    }

    createHoverRaycaster(callback) {
        this.element.addEventListener("mousemove", (event) => {
            this.updateMouse(event);
            this.onRay((intersects) => {
                callback(intersects);
            });
        });
    }

    setMeshArr(meshArr) {
        this.meshArr = meshArr;
    }

    onRay(callback) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        let intersects = this.raycaster.intersectObjects(this.meshArr);
        if (intersects.length > 0) {
            callback(intersects);
        }
    }

    updateMouse(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / (1080 * (window.innerWidth / 1920))) * 2 + 1;
        return this.mouse;
    }

}