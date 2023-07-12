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
let curve = null;
let curveProgress = null;
let threeHelper = null;

let eventMeshArr = [];
const props = defineProps(["eventList"]);

onMounted(() => {
  init();
  addLight();
  addCity();
  // carAnimation();
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
        curve = threeHelper.addCurve(curvePath);
        curveProgress = 0;
      }
      if (node.name === "redcar") {
        redcar = node;
        threeHelper.fllowCurve(curve, redcar, 15);
      }
    });

    gltf.cameras.forEach((camera) => {
      threeHelper.cameras.setCamera(camera.name, camera);
      threeHelper.rePosCamera(1000, 1000, 1000);
    });
  });

  eventHub.on("toggleBalloonAction", (i) => {
    action.reset();
    action = gltf_n.getActionByIndex(i);
    action.play();
  });

  eventHub.on("toggleCamera", (name) => {
    console.log(name);
    threeHelper.toggleCamera(name);
  });

  eventHub.on("toggleControls", (name) => {
    this[`set${name}Controls`]();
  });
}

/* function carAnimation() {
  console.log(curve);
  gsap.to(redcar, {
    curveProgress: 1,
    duration: 10,
    repeat: -1,
    onUpdate: () => {
      const point = curve.getPoint(curveProgress);
      redcar.position.set(point.x, point.y, point.z);
      if (curveProgress + 0.001 < 1) {
        const point = curve.getPoint(curveProgress + 0.001);
        redcar.lookAt(point);
      }
    },
  });
} */
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
