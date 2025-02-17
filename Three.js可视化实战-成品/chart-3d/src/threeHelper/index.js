import gsap from 'gsap';
import * as THREE from 'three';

import { Sun } from './Sun.js';
import { Light } from './Light.js';
import { Bar3d } from './Bar3d.js';
import { Pie3d1 } from './Pie3d1.js';
import { Pie3d2 } from './Pie3d2.js';
import { Ocean1 } from './Ocean1.js';
import { Ocean2 } from './Ocean2.js';
import { Axis3d } from './Axis3d.js';
import { Raycaster } from './Raycaster.js';
import { SphereSky } from './SphereSky.js';
import { Lensflares } from './Lensflare.js';
import { Polyline3d } from './Polyline3d.js';
import { SpriteCanvas } from "./SpriteCanvas";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { ReflectorForSSRPass } from "three/examples/jsm/objects/ReflectorForSSRPass.js";

export default class THREEHelper {
    constructor(selector) {
        this.mixers = [];
        this.actions = [];
        this.clock = new THREE.Clock();
        this.domElement = document.querySelector(selector);
        this.width = this.domElement.clientWidth;
        this.height = this.domElement.clientHeight;
        this.updateMeshArr = [];
        this.uTime = { value: 15 };
        this.isDay = false;

        this.init();
    }

    init() {
        this.initScene();
        this.initCamera();
        this.initRenderer();
        this.initControl();
        this.initEffect();
        this.render();
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xcccccc);
    }

    initCamera(x = 0, y = 0, z = 50) {
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.0000001, 10000);
        this.camera.position.set(x, y, z);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    // renderer
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            premultipliedAlpha: true,
            logarithmicDepthBuffer: true
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.useLegacyLights = false;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.changeExposure(1); // 曝光度
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.domElement.appendChild(this.renderer.domElement);
    }

    changeExposure(exposure) { // 场地曝光度
        this.renderer.toneMappingExposure = exposure;
    }

    // light
    initLight() {
        this.light = new Light();
    }

    defaultLight(color = 0xffffff) {
        const ambient0 = this.createLight('ambient', color);
        const directional1 = this.createLight('directional', color, 0.3);
        directional1.rePos(0, 10, 10);
        const directional2 = this.createLight('directional', color, 0.3);
        directional2.rePos(0, 10, -10);
        const directional3 = this.createLight('directional', color, 0.8);
        directional3.rePos(10, 10, 10);
        this.scene.add(ambient0.light, directional1.light, directional2.light, directional3.light);
    }

    createLight(type, color = 0xffffff, intensity = 1, name) {
        return this.light.create(type, color, intensity, name);
    }

    getLight(name, help = false) {
        help && console.warn(this.light.check());
        return this.light.get(name);
    }

    checkLight() {
        console.warn(this.light.check())
        return this.light.check();
    }

    getLights() {
        console.warn(this.light.lights);
        return this.light.lights;
    }

    reposCamera(x, y, z) {
        this.camera.position.set(x, y, z);
    }

    initControl() {
        this.control = new OrbitControls(this.camera, this.renderer.domElement);
        this.control.target.set(0, 0, 0); // 旋转中心
    }

    render() {
        let deltaTime = this.clock.getDelta();
        this.control && this.control.update();
        this.ocean && this.ocean.flow();

        for (let i = 0; i < this.mixers.length; i++) {
            this.mixers[i].update(deltaTime * 0.2);
        }
        for (let i = 0; i < this.updateMeshArr.length; i++) {
            this.updateMeshArr[i].update(deltaTime);
        }

        this.effectComposer.render();
        requestAnimationFrame(this.render.bind(this));
    }

    gltfLoader(dracoPath, gltfPath) {
        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(dracoPath); // 引导至draco_decoder.js所在目录, 这个文件可以从three模块内复制
        dracoLoader.setDecoderConfig({ type: "js" });
        dracoLoader.preload();
        gltfLoader.setDRACOLoader(dracoLoader);

        return new Promise((resolve, reject) => {
            gltfLoader.load(gltfPath, (gltf) => {
                resolve(gltf);
            });
        });
    }

    hdrLoader(path) {
        if (Array.isArray(path)) {
            const cubeTextureLoader = new THREE.CubeTextureLoader();
            return new Promise((resolve, reject) => {
                cubeTextureLoader.load(path).then((texture) => {
                    resolve(texture);
                });
            });
        }
        const rgbeLoader = new RGBELoader();
        return new Promise((resolve, reject) => {
            rgbeLoader.load(path, (texture) => {
                resolve(texture);
            });
        });
    }

    videoLoader(path) {
        let video = document.createElement('video');
        video.src = path;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.play();
        let videoTexture = new THREE.VideoTexture(video);
        return videoTexture;
    }

    setBackgroundImg(path) { // 设置图片背景
        const loader = new THREE.TextureLoader();
        return new Promise((resolve, reject) => {
            loader.load(path, (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                texture.anisotropy = 16;
                texture.format = THREE.RGBAFormat;

                this.scene.background = texture;
                this.scene.environment = texture;
                resolve(texture);
            });
        });
    }

    setBackgroundHDR(url) { // 设置HDR背景
        return new Promise((resolve, reject) => {
            this.hdrLoader(url).then((texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                texture.anisotropy = 16;
                texture.format = THREE.RGBAFormat;

                this.scene.background = texture;
                this.scene.environment = texture;
                resolve(texture);
            });
        });
    }

    initEffect() {
        // 合成效果
        this.effectComposer = new EffectComposer(this.renderer);
        this.effectComposer.setSize(window.innerWidth, window.innerHeight);

        // 添加渲染通道
        const renderPass = new RenderPass(this.scene, this.camera);
        this.effectComposer.addPass(renderPass);

        // 点效果
        // const dotScreenPass = new DotScreenPass();
        // dotScreenPass.enabled = false;
        // effectComposer.addPass(dotScreenPass);

        // 抗锯齿
        const smaaPass = new SMAAPass(
            window.innerWidth * this.renderer.getPixelRatio(),
            window.innerHeight * this.renderer.getPixelRatio()
        );
        this.effectComposer.addPass(smaaPass);

        // 发光效果
        /* this.unrealBloomPass = new UnrealBloomPass();
        this.unrealBloomPass.enabled = false;
        this.unrealBloomPass.threshold = 0.1;
        this.unrealBloomPass.strength = 0.5;
        this.unrealBloomPass.radius = 2;
        this.effectComposer.addPass(this.unrealBloomPass); */

        // SSR屏幕反射
        // this.addReflectorPlane();
        // const ssrPass = new SSRPass({
        //   renderer: this.renderer,
        //   scene: this.scene,
        //   camera: this.camera,
        //   width: this.width,
        //   height: this.height,
        //   groundReflector: this.groundReflector ? this.groundReflector : null,
        //   selects: this.groundReflector ? this.reflectorSelects : null,
        //   distanceAttenuation: true,
        // });
        // ssrPass.maxDistance = 1000000;
        // console.log(ssrPass);
        // this.effectComposer.addPass(ssrPass);
        // this.effectComposer.addPass(new ShaderPass(GammaCorrectionShader));
    }

    addReflectorPlane(size = new THREE.Vector2(100, 100)) { // 屏幕反射
        let geometry = new THREE.PlaneGeometry(size.x, size.y);
        this.groundReflector = new ReflectorForSSRPass(geometry, {
            clipBias: 0.0003,
            textureWidth: this.width,
            textureHeight: this.height,
            color: 0x888888,
            useDepthTexture: true,
            distanceAttenuation: true,
        });
        this.groundReflector.maxDistance = 1000000;
        this.groundReflector.material.depthWrite = false;
        this.groundReflector.rotation.x = -Math.PI / 2;
        this.groundReflector.visible = false;
        this.scene.add(this.groundReflector);
    }

    addOcean1(flowTexturePath = '', length = 100, width = 100, density = 1150, color = 0x21ccfc) { // ocean必需波纹贴图
        this.ocean = new Ocean1(flowTexturePath, length, width, density, color);
        this.scene.add(this.ocean.mesh);
    }

    addOcean2(length = 100, width = 100, density = 1150, color = 0x21ccfc) {
        this.ocean = new Ocean2(length, width, density, color);
        this.scene.add(this.ocean.mesh);
    }

    addAxis(size = 10) {
        let axis = new THREE.AxesHelper(size);
        this.scene.add(axis);
    }

    addCameraControl() {
        this.iskeyDown = false;
        this.domElement.addEventListener("mousedown", (e) => {
            this.iskeyDown = true;
        });
        this.domElement.addEventListener("mouseup", (e) => {
            this.iskeyDown = false;
        });
        this.domElement.addEventListener("mouseout", (e) => {
            this.iskeyDown = false;
        });
        this.domElement.addEventListener("mousemove", (e) => {
            if (this.iskeyDown) {
                this.camera.rotation.y -= e.movementX * 0.002;
                this.camera.rotation.x -= e.movementY * 0.002;
                this.camera.rotation.z = 0;
                this.camera.rotation.order = "YXZ";
                // this.camera.updateMatrix();
                // this.camera.matrixWorld = this.camera.matrix;
                // this.camera.updateWorldMatrix();
                // this.camera.matrix = new THREE.Matrix4();
                // this.camera.up.set(0, 1, 0);
                // this.camera.updateProjectionMatrix();
                // console.log(this.camera.matrix, this.camera.matrixWorld);
            }
        });
    }

    initRaycaster() {
        this.raycaster = new Raycaster(this.domElement);
    }

    setRaycasterMeshes(RaycasterMeshes) {
        this.raycaster.setMeshArr(RaycasterMeshes);
    }

    createClickRaycaster(callback) {
        this.raycaster.createClickRaycaster(callback);
    }

    createHoverRaycaster(callback) {
        this.raycaster.createHoverRaycaster(callback);
    }

    rayHelper(meshArr, callback) {
        const geometry = new THREE.SphereGeometry(0.2, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff3333,
            side: THREE.DoubleSide,
            transparent: true
        });
        const star = new THREE.Mesh(geometry, material);
        star.visible = false;
        this.scene.add(star);
        this.setRaycasterMeshes(meshArr);
        this.createHoverRaycaster((intersects) => {
            callback(intersects);
            star.visible = true;
            star.position.copy(intersects[0].point);
        });
    }

    addSpriteText(text, position) {
        let spriteText = new SpriteCanvas(this.camera, text, position);
        this.scene.add(spriteText.mesh);
        return spriteText;
    }

    initLensflare() {
        this.lensflares = new Lensflares();
    }

    createLensflare(configArr = [], name) { // [{ path, size, distance, color}, ...]
        const lensflare = this.lensflares.create(configArr, name);
        return lensflare;
    }

    getLensflare(name) {
        return this.lensflares.get(name);
    }

    getLensflares() {
        return this.lensflares;
    }

    checkLensflare() {
        console.log(this.lensflares.check())
        return this.lensflares.check();
    }

    createSun(useLensFlare = false) {
        const sun = new Sun();
        if (useLensFlare) {
            if (!this.lensflares) {
                this.initLensflare();
            }
            const configArr = [
                ["./textures/lensflare/lensflare0.png", 700, 0],
                ["./textures/lensflare/lensflare0.png", 300, 0.6],
                ["./textures/lensflare/lensflare0.png", 200, 0.75],
                ["./textures/lensflare/lensflare0.png", 150, 0.9],
                ["./textures/lensflare/lensflare0.png", 100, 1],
            ];
            const lensflare = this.createLensflare(configArr);
            sun.light.light.add(lensflare.lensflare);
        }
        this.sun = sun;
        this.scene.add(sun.sun);
        return sun;
    }

    sunTrack() { // Sun运动
        gsap.to(this.uTime, {
            value: 24,
            duration: 24,
            repeat: -1,
            ease: "linear",
            onUpdate: () => {
                this.sun.sun.position.z = Math.cos(((this.uTime.value - 6) * 2 * Math.PI) / 24) * 4000;
                this.sun.sun.position.y = Math.sin(((this.uTime.value - 6) * 2 * Math.PI) / 24) * 4000;

                if (this.uTime.value > 6) { // 早6
                    this.sun.sun.visible = true;
                }
                if (this.uTime.value > 18) { // 晚6
                    this.sun.sun.visible = false;
                }
            },
        });
    }

    dayLight(dayCallback, nightCallback) { // 日光环境变化
        gsap.to(this.uTime, {
            value: 24,
            duration: 24,
            repeat: -1,
            ease: "linear",
            onUpdate: () => {
                if (
                    this.uTime.value > 6 &&
                    this.uTime.value <= 18 &&
                    this.isDay === false
                ) { // 早8
                    this.isDay = true;
                    this.changeExposure(1);
                    dayCallback && dayCallback();
                }
                if (
                    (this.uTime.value > 18 ||
                        this.uTime.value <= 6) &&
                    this.isDay === true
                ) { // 晚8
                    this.isDay = false;
                    this.changeExposure(0.4);
                    nightCallback && nightCallback();
                }
                if (Math.abs(this.uTime.value - 12) >= 4 && Math.abs(this.uTime.value - 12) <= 6) {
                    // 昼夜交替6-8
                    let strength = 1 - (Math.abs(this.uTime.value - 12) - 4) / 2; // 光照强度
                    strength < 0.3 ? (strength = 0.3) : (strength = strength);
                    this.changeExposure(strength);
                }
            }
        });
    }

    addSphereSky() { // 天空球
        let sphereSky = new SphereSky(10000, this.uTime, this.scene.environment);
        this.scene.add(sphereSky.mesh);

        return sphereSky;
    }

    addAxis3d(category, bottom, left, size) { // 3D网格坐标系
        let axis3d = new Axis3d(category, bottom, left, size);
        this.scene.add(axis3d.mesh);
        return axis3d;
    }

    addBar3d(data, space, type) { // 柱形图
        let bar3d = new Bar3d(data, space, type);
        this.scene.add(bar3d.mesh);
        return bar3d;
    }

    addPie3d1(data, depth) { // 饼图1
        let pie3d1 = new Pie3d1(data, this.camera, depth);
        this.scene.add(pie3d1.mesh);
        return pie3d1;
    }

    addPie3d2(data) { // 饼图2
        let pie3d2 = new Pie3d2(data);
        this.scene.add(pie3d2.mesh);
        return pie3d2;
    }

    addPolyline3d(data, space) {
        let polyline3d = new Polyline3d(data, space);
        this.scene.add(polyline3d.mesh);
        return polyline3d;
    }
}