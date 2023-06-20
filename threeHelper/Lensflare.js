import * as THREE from 'three';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';

export class Lensflares {
    constructor() {
        this.lensflares = new Map();
        this.max = -1;
    }

    create(configArr, name = `lensflare${this.max}`) {
        this.max++;
        const lensflare = new LensflareTool();
        for (let i = 1; i < configArr.length; i++) {
            lensflare.addElement(...configArr[i]);
        }
        lensflare.name = name;
        this.lensflares.set(name, lensflare);
        return lensflare;
    }

    check() {
        return this.lensflares.keys();
    }

    get(name) {
        return this.lensflares.get(name);
    }
}

class LensflareTool {
    constructor() {
        this.lensflare = new Lensflare();
        this.loader = new THREE.TextureLoader();
    }
    
    addElement(path, size, distance, color) { // 增加光晕点
        const texture = this.loader.load(path);
        this.lensflare.addElement(new LensflareElement(texture, size, distance, color));
    }

}