import * as THREE from 'three';

import gsap from 'gsap';
import { SphereSky } from './SphereSky.js';
import { Ocean1 } from './Ocean1.js';
import { Ocean2 } from './Ocean2.js';
import { SpriteCanvas } from "./SpriteCanvas";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
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

    initCamera(x = 0, y = 50, z = 320) {
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.0000001, 10000);
        this.camera.position.set(x, y, z);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            premultipliedAlpha: true,
            logarithmicDepthBuffer: true
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.useLegacyLights = false;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1; // 曝光度
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.domElement.appendChild(this.renderer.domElement);
    }

    changeExposure(exposure) { // 调节曝光度
        this.renderer.toneMappingExposure = exposure;
    }

    reposCamera(x, y, z) {
        this.camera.position.set(x, y, z);
    }

    initControl() {
        this.control = new OrbitControls(this.camera, this.renderer.domElement);
        this.control.target.set(0, 15, 0);
    }

    render() {
        let deltaTime = this.clock.getDelta();
        this.control && this.control.update();
        this.ocean1 && this.ocean1.flow();

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
        dracoLoader.setDecoderPath(dracoPath); // 引导至具体模型文件所在目录
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

    setBackgroundImg(path) {
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

    setBackgroundHDR(url) {
        // 设置场地背景为HDR
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

    createLight(color = 0xffffff) {
        this.ambientLight = new THREE.AmbientLight(color, 1);
        this.scene.add(this.ambientLight);

        const light1 = new THREE.DirectionalLight(color, 0.3);
        light1.position.set(0, 10, 10);
        const light2 = new THREE.DirectionalLight(color, 0.3);
        light2.position.set(0, 10, -10);
        const light3 = new THREE.DirectionalLight(color, 0.8);
        light3.position.set(10, 10, 10);
        light1.castShadow = true;
        light2.castShadow = true;
        light3.castShadow = true;
        light1.shadow.mapSize.width = 10240;
        light1.shadow.mapSize.height = 10240;
        light2.shadow.mapSize.width = 10240;
        light2.shadow.mapSize.height = 10240;
        light3.shadow.mapSize.width = 10240;
        light3.shadow.mapSize.height = 10240;
        this.scene.add(light1, light2, light3);
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
        this.unrealBloomPass = new UnrealBloomPass();
        this.unrealBloomPass.enabled = false;
        this.unrealBloomPass.threshold = 0.1;
        this.unrealBloomPass.strength = 1;
        this.unrealBloomPass.radius = 2;
        this.effectComposer.addPass(this.unrealBloomPass);

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

    addReflectorPlane(size = new THREE.Vector2(100, 100)) {
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

    addOcean1(flowTexturePath = '', length = 100, width = 100, density = 1150, color = 0x21ccfc) {
        this.ocean1 = new Ocean1(flowTexturePath, length, width, density, color);
        this.scene.add(this.ocean1.mesh);
    }

    addOcean2(flowTexturePath = '', length = 100, width = 100, density = 1150, color = 0x21ccfc) {
        this.ocean2 = new Ocean2(flowTexturePath, length, width, density, color);
        this.scene.add(this.ocean2.mesh);
    }

    addAxes(size = 10) {
        let axis = new THREE.AxesHelper(size);
        this.scene.add(axis);
    }

    addControlToCamera() {
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
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.domElement.addEventListener("click", (e) => {
            this.updateMouse(e);
        });
    }

    updateMouse(e) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / (1080 * (window.innerWidth / 1920))) * 2 + 1;
        // console.log(this.mouse.x, this.mouse.y, e.clientY);
        return this.mouse;
    }

    onRay(meshArr, fn) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        let intersects = this.raycaster.intersectObjects(meshArr);
        if (intersects.length > 0) {
            fn(intersects);
        }
    }

    visibleRay(meshArr, callback) { // 在首个命中物体上标识射线位置
        this.initRaycaster();

        const geometry = new THREE.SphereGeometry(0.2, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff3333,
            side: THREE.DoubleSide,
            transparent: true
        });
        const plane = new THREE.Mesh(geometry, material);
        this.scene.add(plane);
        this.domElement.addEventListener("mousemove", (e) => {
            this.updateMouse(e);
            plane.visible = false;
            this.onRay(meshArr, (intersects) => {
                plane.visible = true;
                callback(intersects);
                plane.position.copy(intersects[0].point);
            });
        });
    }

    clickRay(meshArr, callback) {
        this.initRaycaster();

        this.domElement.addEventListener("click", (e) => {
            this.updateMouse(e);
            this.onRaycaster(meshArr, (intersects) => {
                callback(intersects);
            });
        });
    }

    addSpriteText(text, position) { // 始终朝向屏幕的文字
        let spriteText = new SpriteCanvas(this.camera, text, position);
        this.scene.add(spriteText.mesh);
        return spriteText;
    }

    addSphereSky(minExposure = 0.4, maxExposure = 1) { // 人造天空
        let uTime = { value: 0 };
        let sphereSky = new SphereSky(10000, uTime, this.scene.environment);
        sphereSky.createSun(500, 500, 4000, 0xffffcc);
        this.scene.add(sphereSky.mesh);
        gsap.to(uTime, {
            value: 24,
            duration: 24,
            repeat: -1,
            ease: "linear",
            onUpdate: () => {
                sphereSky.updateSun(uTime.value);
                if(uTime.value > 6) {
                    sphereSky.sun.visible = true;
                }
                if(uTime.value > 18) {
                    sphereSky.sun.visible = false;
                }
                if (Math.abs(uTime.value - 12) < 4) {
                    // 昼
                    this.renderer.toneMappingExposure = maxExposure;
                }
                if (Math.abs(uTime.value - 12) > 6) {
                    // 夜
                    this.renderer.toneMappingExposure = minExposure;
                }
                if (Math.abs(uTime.value - 12) >= 4 && Math.abs(uTime.value - 12) <= 6) {
                    // 昼夜交替阶段4-6, 2h
                    let strength = 1 - (Math.abs(uTime.value - 12) - 4) / 2; // 光照强度
                    strength < 0.3 ? (strength = 0.3) : (strength = strength);
                    this.renderer.toneMappingExposure = strength;
                }
            },
        });
        return sphereSky;
    }
}