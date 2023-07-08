import gsap from 'gsap';
import * as THREE from 'three';

import { Sun } from './Sun.js';
import { Snow } from './Snow.js';
import { Tube } from './Tube.js';
import { Light } from './Light.js';
import { Curve } from './Curve.js';
import { Bar3d } from './Bar3d.js';
import { Pie3d1 } from './Pie3d1.js';
import { Pie3d2 } from './Pie3d2.js';
import { Ocean1 } from './Ocean1.js';
import { Ocean2 } from './Ocean2.js';
import { Axis3d } from './Axis3d.js';
import { Effect } from './Effect.js';
import { MatrixAxis } from './Matrix.js';
import { Raycaster } from './Raycaster.js';
import { SphereSky } from './SphereSky.js';
import { Lensflares } from './Lensflare.js';
import { Polyline3d } from './Polyline3d.js';
import { SpriteCanvas } from "./SpriteCanvas.js";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class THREEHelper {
    constructor(selector) {
        this.clock = new THREE.Clock();
        this.domElement = document.querySelector(selector);
        this.width = this.domElement.clientWidth;
        this.height = this.domElement.clientHeight;
        this.uTime = { value: 15 };
        this.curveMap = new Map();
        this.isDay = false;

        this.init();
    }

    init() {
        this.initScene();
        this.initCamera();
        this.initRenderer();
        this.initControl();
        this.initEffect();
        this.initLight();
        this.render();

        window.addEventListener('resize', () => { this.onWindowResize() });
    }

    onWindowResize() {
        // 重新设置相机宽高比例
        this.camera.aspect = window.innerWidth / window.innerHeight;
        // 更新相机投影矩阵
        this.camera.updateProjectionMatrix();
        // 重新设置渲染器渲染范围
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
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
        this.createAmbient(color);

        const directional0 = this.createDirectional(color, 0.3);
        directional0.rePos(0, 10, 10);
        const directional1 = this.createDirectional(color, 0.3);
        directional1.rePos(0, 10, -10);
        const directional2 = this.createDirectional(color, 0.8);
        directional2.rePos(10, 10, 10);

        this.scene.add(directional0.light, directional1.light, directional2.light);
    }

    createDirectional(color, intensity, name) {
        return this.light.createDirectionalLight(color, intensity, name);;
    }

    createAmbient(color, intensity, name) {
        const ambient = this.light.createAmbientLight(color, intensity, name);
        this.scene.add(ambient.light);
        return ambient;
    }

    createSpot(color, intensity, name) {
        return this.light.createSpotLight(color, intensity, name);
    }

    createPoint(color, intensity, name) {
        return this.light.createPointLight(color, intensity, name);
    }

    getLight(name, help = false) {
        help && console.warn(this.light.check());
        return this.light.get(name);
    }

    checkLight() {
        console.warn(this.light.check())
        return this.light.check();
    }

    reposCamera(x, y, z) {
        this.camera.position.set(x, y, z);
    }

    initControl() {
        this.control = new OrbitControls(this.camera, this.renderer.domElement);
        this.control.target.set(0, 0, 0); // 旋转中心
    }

    render() {
        const elapsed = this.clock.getElapsedTime();

        this.control && this.control.update();

        if (Array.from(this.curveMap.keys()).length > 0) { // 有没有办法能降速?
            for (let i = 0; i < Array.from(this.curveMap.keys()).length; i++) {
                if (this.curveMap.get(Array.from(this.curveMap.keys())[i]) !== null) {
                    const point = Array.from(this.curveMap.keys())[i].getPoint(elapsed % 1);
                    this.curveMap.get(Array.from(this.curveMap.keys())[i]).position.copy(point);
                }
            }
        }

        if (this.points) {
            this.updateVertex();
        }

        this.effect.effectComposer.render();
        requestAnimationFrame(this.render.bind(this));
    }

    updateVertex() {
        let vertices = this.points.mesh.geometry.attributes.position.array;

        // 1, 4, 7, 10, 13, 16
        for (let i = 1; i < vertices.length; i += 3) { // y
            vertices[i] = vertices[i] - (0.1 + Math.random() / 5);
            if (vertices[i] <= -60) vertices[i] = 45;
        }

        // 0, 3, 6, 9, 12, 15
        for (let i = 0; i < vertices.length; i += 3) { // 抖动
            vertices[i] = vertices[i] - ((Math.random() - 0.5) / 3);
            if (vertices[i].x <= -20 || vertices[i].x >= 20) vertices[i] = vertices[i] * -1;
        }

        // 顶点变动之后需要更新
        this.points.mesh.geometry.attributes.position.needsUpdate = true;;
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

    textureLoader(path) {
        const loader = new THREE.TextureLoader();
        return new Promise((resolve, reject) => {
            loader.load(path, (texture) => {
                resolve(texture);
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
        const effect = new Effect(this.scene, this.camera, this.renderer);
        this.effect = effect;
    }

    addAntialias() {
        this.effect.antialias();
    }

    addDotScreen(center, angel, scale) {
        this.effect.dotScreen(center, angel, scale);
    }

    addUnrealBloom(threshold, strength, radius) {
        this.effect.unrealBloom(threshold, strength, radius);
    }

    addPixel(intensity) {
        this.effect.pixel(intensity);
    }

    addGlitch(keep) {
        this.effect.glitch(keep);
    }

    addFilm(nIntensity, sIntensity, sCount, grayscale) {
        this.effect.film(nIntensity, sIntensity, sCount, grayscale);
    }

    addSSR(size, color) {
        this.effect.ssr(size, color);
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

    addSnow(geometry, color, texture) {
        this.points = new Snow(geometry, color, texture);
        this.scene.add(this.points.mesh);
        return this.points;
    }

    addMatrixAxis(space, num, geometry, texture) {
        const matrixAxis = new MatrixAxis(space, num, geometry, texture);
        this.scene.add(matrixAxis.mesh);
    }

    addCurve(path, color) {
        const curve = new Curve(path, color);
        this.curveMap.set(curve, null);
        return curve;
    }

    fllowCurve(curve, mesh) {
        if (!mesh) console.warn('fllowCurve: param mesh cannot be undefined.');
        this.curveMap.set(curve, mesh);
    }

    addTube(scale, tubularSegments, radius, radialSegments, color) {
        const tube = new Tube(scale, tubularSegments, radius, radialSegments, color);
        return tube;
    }
}