<template>
  <div class="scene" ref="sceneDiv">
    <div class="canvas-container"></div>
  </div>
</template>

<script setup>
import gsap from "gsap";
import * as THREE from "three";
import eventHub from "@/util/eventHub";
import { onMounted, ref, watch } from "vue";
import THREEHelper from "@/threeHelper/index.js";

// 导入添加物体函数
// import createMesh from "@/three/createMesh";

let gltf_n = null;
let redcar = null;
let action = null;
let threeHelper = null;

const props = defineProps(["eventList"]);

onMounted(() => {
  init();
  addLight();
  addCity();
});

function init() {
  threeHelper = new THREEHelper(".canvas-container");
  threeHelper.addAxis();
  threeHelper.setBackgroundHDR("./textures/023.hdr");
}

function addLight() {
  const directional = threeHelper.addDirectional();
  directional.rePos(10, 100, 10);
  threeHelper.add(directional.light);
}

function addCity() {
  threeHelper.gltfLoader("./draco/gltf/", "./model/city4.glb").then((gltf) => {
    gltf_n = gltf;
    threeHelper.add(gltf.scene);
    gltf.scene.traverse((node) => {
      if (node.name === "热气球") {
        action = gltf.getActionByIndex(1);
        action.play();
      }
      if (node.name === "汽车园区轨迹") {
        const line = node;
        line.visible = false;
        const curvePath = [];
        for (let i = line.geometry.attributes.position.count - 1; i >= 0; i--) {
          curvePath.push(
            new THREE.Vector3(
              line.geometry.attributes.position.getX(i),
              line.geometry.attributes.position.getY(i),
              line.geometry.attributes.position.getZ(i)
            )
          );
        }
        threeHelper.addCurve(curvePath);
      }
      if (node.name === "redcar") {
        redcar = node;
      }
    });

    gltf.cameras.forEach((camera) => {
      threeHelper.cameras.setCamera(camera.name, camera);
      threeHelper.rePosCamera(1000, 1000, 1000);
    });

    /* eventHub.on("actionClick", (i) => {
      console.log(i);
      action.reset();
      action = gltf.getActionByIndex[i];
      action.play();
    }); */
  });
}
</script>

<style scoped>
.scene {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
}

.canvas-container {
  width: 100%;
  height: 100%;
}
</style>
