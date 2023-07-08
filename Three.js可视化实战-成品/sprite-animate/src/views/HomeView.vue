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
const whiteMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
const blackMaterial = new THREE.MeshPhongMaterial({ color: 0x505050 });

onMounted(() => {
  init();
});

function init() {
  threeHelper = new THREEHelper(".canvas-container");
  threeHelper.addAxis();
  threeHelper.addMatrixAxis();

  const curve = threeHelper.addCurve();
  threeHelper.scene.add(curve.mesh);

  const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
  const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  threeHelper.scene.add(box);

  threeHelper.fllowCurve(curve, box);

  /* const tube = threeHelper.addTube();
  threeHelper.scene.add(tube.mesh); */
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