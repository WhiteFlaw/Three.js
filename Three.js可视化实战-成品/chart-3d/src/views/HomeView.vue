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

const category = [
  ["0%", "20%", "40%", "60%", "80%", "100%"],
  ["line0", "line1", "line2", "line3", "line4"]
];

const data = [
  {
    value: 4.0,
    name: "50%",
  },
  {
    value: 3.5,
    name: "42%",
  },
  {
    value: 5.0,
    name: "61%",
  },
  {
    value: 2.5,
    name: "31%",
  },
  {
    value: 2.0,
    name: "22%",
  },
];

onMounted(() => {
  init();
});

function init() {
  threeHelper = new THREEHelper(".canvas-container");
  threeHelper.addAxis();
  threeHelper.addAxis3d(category, 0, 1.5, new THREE.Vector3(15, 8, 5));
  threeHelper.initLight();
  threeHelper.defaultLight();

  // threeHelper.addBar3d(data, 1.5, 'rect');
  // threeHelper.addPie3d1(data, 10);
  // threeHelper.addPie3d2(data);
  const polyline3d = threeHelper.addPolyline3d(data, 3.4);
  polyline3d.mesh.position.set(-6, 0, 0);
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