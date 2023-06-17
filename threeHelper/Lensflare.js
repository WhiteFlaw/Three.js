import * as THREE from 'three';

export class Lensflare {
    constructor() {
        this.lensflares = new Map();
        this.max = -1;
    }

    create(configArr, name = `lensflare${thia.max}`) {
        this.max++;
        const lensflare = new LensflareTool();
        for (let i = 0; i < configArr[0].length; i++) {
            lensflare.addElement(...configArr[0][i]);
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