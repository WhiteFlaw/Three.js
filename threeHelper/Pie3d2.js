import * as THREE from 'three';

const dataExamples = [];

export class Pie3d {
    constructor(data) {
        data = data || dataExamples;
        this.mesh = new THREE.Group();

        data.forEach((item, index) => {

        })
    }
}