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

const category = [];

const data = [
  {
    value: 4.0,
    name: '80%',
  },
  {
    value: 3.5,
    name: '70%',
  },
  {
    value: 3.0,
    name: '60%',
  },
  {
    value: 2.5,
    name: '50%',
  },
  {
    value: 2.0,
    name: '40%',
  },
];

onMounted(() => {
  init();
});

function init() {
  threeHelper = new THREEHelper(".canvas-container");
  threeHelper.addAxis3d(category, 1, new THREE.Vector3(8, 8, 5));
  threeHelper.initLight();
  threeHelper.defaultLight();

  // threeHelper.addBar3d(data, 'rect');
  threeHelper.addPie3d1(data);
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