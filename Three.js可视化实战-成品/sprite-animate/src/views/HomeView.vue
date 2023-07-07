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
  light();
  createRoom();
});

function init() {
  threeHelper = new THREEHelper(".canvas-container");
  threeHelper.addAxis();
  threeHelper.initLight();
  threeHelper.defaultLight()

  threeHelper.addSnow();

  threeHelper.addAntialias();
  threeHelper.addDotScreen();
  threeHelper.addUnrealBloom();
  threeHelper.addPixel();
  threeHelper.addGlitch();
  threeHelper.addFilm();
  // threeHelper.addSSR();
}

function light() {
  const ambientLight = new THREE.AmbientLight(0xd38ff7, 1);

  const directionalLight = new THREE.DirectionalLight(0xd38ff7, 0.1);
  directionalLight.position.set(100, 100, 100);
  directionalLight.castShadow = true;
  threeHelper.scene.add(directionalLight.target);

  const spotLight = new THREE.SpotLight(0xd38ff7, 1, 8, Math.PI / 16, 0.02, 2);
  spotLight.position.set(2, 2, 0);
  spotLight.castShadow = true;
  spotLight.target.position.set(0, 0, 0);
  threeHelper.scene.add(spotLight.target);
  threeHelper.scene.add(ambientLight, directionalLight, spotLight);
}

function createRoom() {
  const wallGeometry = new THREE.PlaneGeometry(8, 8);
  threeHelper.textureLoader("./textures/checker.png").then((texture) => {
    const wallTexture = pixelTexture(texture);
    wallTexture.repeat.set(3, 3);
    const wallMaterial = new THREE.MeshPhongMaterial({
      map: wallTexture,
      side: THREE.DoubleSide,
    });

    const walll = new THREE.Mesh(wallGeometry, wallMaterial);
    walll.receiveShadow = true;
    walll.position.set(4, 4, 0);

    const wallr = new THREE.Mesh(wallGeometry, wallMaterial);
    wallr.receiveShadow = true;
    wallr.rotateY((Math.PI / 180) * 90); // 为什么只接受弧度啊(恼)
    wallr.position.set(0, 4, 4);

    const floor = new THREE.Mesh(wallGeometry, wallMaterial);
    floor.receiveShadow = true;
    floor.rotateX((Math.PI / 180) * 90);
    floor.position.x = 4;
    floor.position.z = 4;

    const room = new THREE.Object3D();
    room.add(walll, wallr, floor);
    threeHelper.scene.add(room);
    room.scale.set(3, 3, 3);
  });

  const whitePlateauGeometry = new THREE.BoxGeometry(6, 2, 6);
  const whitePlateau = new THREE.Mesh(whitePlateauGeometry, whiteMaterial);
  whitePlateau.position.set(14.5, 1, 21.3);
  threeHelper.scene.add(whitePlateau);

  const whiteStepGeometry = new THREE.BoxGeometry(1, 1, 6);
  const whiteStep = new THREE.Mesh(whiteStepGeometry, whiteMaterial);
  whiteStep.position.set(18, 0.5, 21.4);
  threeHelper.scene.add(whiteStep);

  const blackPlateauGeometry = new THREE.BoxGeometry(11, 2, 11.5);
  const blackPlateau = new THREE.Mesh(blackPlateauGeometry, blackMaterial);
  blackPlateau.position.set(6, 1, 18.5);
  threeHelper.scene.add(blackPlateau);

  const z1 = createZhu();
  z1.position.set(15.5, 5.5, 12);
  threeHelper.scene.add(z1);

  const upFloorRGeometry = new THREE.BoxGeometry(7.7, 1, 10);
  const upFloorRMesh = new THREE.Mesh(upFloorRGeometry, blackMaterial);
  upFloorRMesh.position.set(20.5, 10.5, 5);
  const upFloorRPro = createProte(4);
  upFloorRPro.position.set(18.8, 11.5, 9.8);

  const upFloorR = new THREE.Object3D();
  upFloorR.add(upFloorRMesh, upFloorRPro);
  threeHelper.scene.add(upFloorR);

  const upFloorRCGeometry = new THREE.BoxGeometry(7, 1, 12);
  const upFloorRCMesh = new THREE.Mesh(upFloorRCGeometry, whiteMaterial);
  upFloorRCMesh.position.set(13, 10.5, 6.5);
  const upFloorRCPro = createProte(6, 0x505050);
  upFloorRCPro.position.set(13, 11.5, 12);

  const upFloorRC = new THREE.Object3D();
  upFloorRC.add(upFloorRCMesh, upFloorRCPro);
  threeHelper.scene.add(upFloorRC);

  const upFloorCGeometry = new THREE.BoxGeometry(10, 1, 12);
  const upFloorC = new THREE.Mesh(upFloorCGeometry, whiteMaterial);
  upFloorC.position.set(5, 11, 6.5);
  threeHelper.scene.add(upFloorC);

  const upFloorLGeometry = new THREE.BoxGeometry(10, 1, 6);
  const upFloorLMesh = new THREE.Mesh(upFloorLGeometry, blackMaterial);
  upFloorLMesh.position.set(5, 10, 15.5);
  const upFloorLPro1 = createProte(10);
  upFloorLPro1.position.set(5, 11, 18);
  const upFloorLPro2 = createProte(6);
  upFloorLPro2.rotateY((Math.PI / 180) * 90);
  upFloorLPro2.position.set(10, 11, 15);

  const upFloorL = new THREE.Object3D();
  upFloorL.add(upFloorLMesh, upFloorLPro1, upFloorLPro2);
  threeHelper.scene.add(upFloorL);

  const ladderr = createLadder();
  ladderr.position.set(22, -1, 12.5);
  ladderr.scale.y = 0.75;
  ladderr.rotateX((-Math.PI / 180) * 11);

  const ladderc = createLadder(0x505050);
  ladderc.position.set(16, 10, 3);
  ladderc.scale.y = 0.9;
  ladderc.rotateY((-Math.PI / 180) * 90);
  ladderc.rotateX((Math.PI / 180) * 25);

  const thirdFloorZGeometry = new THREE.BoxGeometry(10, 1, 24);
  const thirdFloorZ = new THREE.Mesh(thirdFloorZGeometry, whiteMaterial);
  thirdFloorZ.position.set(5, 23.5, 12);
  threeHelper.scene.add(thirdFloorZ);

  const thirdFloorCGeometry = new THREE.BoxGeometry(14, 1, 18.5);
  const thirdFloorC = new THREE.Mesh(thirdFloorCGeometry, blackMaterial);
  thirdFloorC.position.set(17, 23.5, 14.7);
  threeHelper.scene.add(thirdFloorC);

  const thirdFloorXGeometry = new THREE.BoxGeometry(10, 1, 5.5);
  const thirdFloorX = new THREE.Mesh(thirdFloorXGeometry, whiteMaterial);
  thirdFloorX.position.set(19, 23.5, 2.7);
  threeHelper.scene.add(thirdFloorX);

  const thirdFloorZhuC = triangleZhu();
  thirdFloorZhuC.position.set(9.5, 16, 12);

  const thirdFloorZhuZ = triangleZhu();
  thirdFloorZhuZ.rotateY((-Math.PI / 180) * 90);
  thirdFloorZhuZ.position.set(1, 16, 12);

  const thirdFloorZhuX = triangleZhu();
  thirdFloorZhuX.rotateY((Math.PI / 180) * 90);
  thirdFloorZhuX.position.set(9.5, 16, 1);

  const fence = createFence();
  fence.position.set(6, 3, 12);
}

function createZhu() {
  const zhuGeometry = new THREE.BoxGeometry(1, 11, 1);
  const zhu = new THREE.Mesh(zhuGeometry, whiteMaterial);
  return zhu;
}

function createProte(x, color = 0xffffff) {
  // 护栏
  const geometry = new THREE.BoxGeometry(x, 1.5, 0.5);
  const material = new THREE.MeshPhongMaterial({
    color: color,
  });
  const prote = new THREE.Mesh(geometry, material);
  prote.position.set(x / 2, 2.5 / 2, 0.5 / 2);
  threeHelper.scene.add(prote);
  return prote;
}

function createLadder(color = 0xffffff) {
  // 麻了
  const stepMaterial = new THREE.MeshPhongMaterial({ color: color });
  const dickGeometry = new THREE.BoxGeometry(0.5, 15, 0.5);
  const dick0 = new THREE.Mesh(dickGeometry, stepMaterial);
  dick0.position.set(-1, 9, 0);

  const dick1 = new THREE.Mesh(dickGeometry, stepMaterial);
  dick1.position.set(1, 9, 0);

  const ladder = new THREE.Object3D();
  ladder.add(dick0, dick1);
  const stepGeometry = new THREE.BoxGeometry(2, 0.5, 0.5);
  let y = 2;
  for (let i = 0; i < 8; i++) {
    const step = new THREE.Mesh(stepGeometry, stepMaterial);
    step.position.y = y;
    y += 2;
    ladder.add(step);
  }
  threeHelper.scene.add(ladder);
  return ladder;
}

function triangleZhu() {
  const zhuGeometry = new THREE.BoxGeometry(0.5, 9, 0.5);
  const triangleGeometry = new THREE.PlaneGeometry(3.5, 3); // 烦
  const zhu = new THREE.Mesh(zhuGeometry, blackMaterial);
  const triangler = new THREE.Mesh(triangleGeometry, blackMaterial);
  triangler.rotateY((Math.PI / 180) * 90);
  triangler.position.set(0, -4, -1.5);
  const trianglel = new THREE.Mesh(triangleGeometry, blackMaterial);
  trianglel.position.set(-1.5, -4, 0);

  const tz = new THREE.Object3D();
  tz.add(zhu, triangler, trianglel);
  threeHelper.scene.add(tz);
  return tz;
}

function createFence() {
  const fence = new THREE.Object3D();
  const baseGeometry = new THREE.BoxGeometry(13, 4, 1);
  const base = new THREE.Mesh(baseGeometry, whiteMaterial);
  fence.add(base);

  const xGeometry = new THREE.BoxGeometry(12, 0.5, 0.5);
  const yGeometry = new THREE.BoxGeometry(0.5, 6, 0.5);
  let per = 2;
  for (let i = 0; i < 3; i++) {
    const x = new THREE.Mesh(xGeometry, whiteMaterial);
    const y = new THREE.Mesh(yGeometry, whiteMaterial);
    x.position.y = per;
    y.position.x = per;
    y.position.y = 4.5;
    per += 2;
    fence.add(x, y);
  }
  threeHelper.scene.add(fence);
  return fence;
}

function pixelTexture(texture) {
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
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