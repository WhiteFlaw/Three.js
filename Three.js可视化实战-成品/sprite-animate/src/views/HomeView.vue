<template>
  <div class="home" ref="screenDom">
    <div class="canvas-container"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";

import gsap from "gsap";
import * as THREE from "three";
import THREEHelper from "../threeHelper/index.js";

let progress = ref(0);
let screenDom = ref(null);

let threeHelper = null;
let vetroMaterial = null;
let dinoMesh = null;
const whiteMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
const blackMaterial = new THREE.MeshPhongMaterial({ color: 0x505050 });

onMounted(() => {
  init();
  dino();
});

function init() {
  threeHelper = new THREEHelper(".canvas-container");
  threeHelper.addAxis();
  threeHelper.addMatrixAxis();
  threeHelper.defaultLight();
}

function dino() {
  threeHelper
    .gltfLoader("./draco/gltf/", "./model/dinosaur.glb")
    .then((gltf) => {
      gltf.getActions("runAction").play();
      threeHelper.addBox3(gltf, true);
      dinoMesh = gltf;
      threeHelper.add(gltf.scene);
      console.log(threeHelper.scene.children)
      curve();
    });
}

function curve() {
  const curve = threeHelper.addCurve();
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial(0xffffff);
  const box = new THREE.Mesh(geo, material);
  threeHelper.addBox3(box, true);
  threeHelper.fllowCurve(curve, box);
  threeHelper.add(curve.mesh, box);
  threeHelper.collideDetect(dinoMesh, box);
}
</script>

<style>
.home {
  width: 100vw;
  height: 100vh;
  transform-origin: 0 0;
}
.canvas-container {
  width: 100%;
  height: 100%;
}
.progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1080px;
  z-index: 101;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #0f1117;
}
.progress > img {
  padding: 0 15px;
}

.title {
  width: 380px;
  height: 40px;
  position: fixed;
  right: 100px;
  top: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  line-height: 40px;
  text-align: center;
  color: #ddda2e;
  border-radius: 5px;
  z-index: 110;
}
</style>