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

let threeHelper = null;
let progress = ref(0);
let screenDom = ref(null);
let vetroMaterial = null;

onMounted(() => {
  init();
  createOcean();
  createLight();
  createBuilding();
  createSky();
});

function init() {
  threeHelper = new THREEHelper(".canvas-container");

  threeHelper.addAxis(100);
  threeHelper.reposCamera(-117, 17, -140);

  window.addEventListener("resize", onWindowResize());
}

function createSky() {
  threeHelper.setBackgroundHDR("./assets/textures/023.hdr").then(() => {
    threeHelper.addSphereSky();
    threeHelper.dayLight(
      () => {
        vetroMaterial.emissive = new THREE.Color(0x000000);
        threeHelper.unrealBloomPass.enabled = false; // 关闭发光效果
      },
      () => {
        vetroMaterial.emissive = new THREE.Color(0xffffff);
        vetroMaterial.emissiveIntensity = 1;
        vetroMaterial.emissiveMap = threeHelper.videoLoader(
          "./textures/video/sucai01.mp4"
        );
        threeHelper.unrealBloomPass.enabled = true; // 开启发光效果
      }
    );
  });
}

function createLight() {
  threeHelper.initLight();
  threeHelper.defaultLight();
  threeHelper.createSun(true);
  threeHelper.rePosSun(500, 500, 4000);
  threeHelper.sunTrack();
}

function createOcean() {
  threeHelper.addOcean1("./textures/water/sky.jpg", 1000, 1000);
}

function createBuilding() {
  threeHelper
    .gltfLoader("./draco/gltf/", "./model/building.glb")
    .then((gltf) => {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material.shadowSide = THREE.BackSide;
        }
        if (child.isMesh && child.name == "Plane") {
          child.visible = false;
        }
        if (
          child.isMesh &&
          child.material.name == "Vetro" &&
          vetroMaterial == null
        ) {
          vetroMaterial = child.material;
        }
      });
      threeHelper.scene.add(gltf.scene);
    });
}

function onWindowResize() {
  threeHelper.camera.aspect = window.innerWidth / window.innerHeight;
  threeHelper.renderer.setSize(window.innerWidth, window.innerHeight);
}
</script>

<style>
.home {
  width: 1920px;
  height: 1080px;
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
  color: #fff;
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