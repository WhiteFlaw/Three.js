import gsap from 'gsap';
import * as dat from "dat.gui";
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
import { Cameras } from './Camera.js';
import { Controls } from './Controls.js';
import { MatrixAxis } from './Matrix.js';
import { Raycaster } from './Raycaster.js';
import { SphereSky } from './SphereSky.js';
import { Lensflares } from './Lensflare.js';
import { Polyline3d } from './Polyline3d.js';
import { SpriteCanvas } from "./SpriteCanvas.js";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export default class THREEHelper {
    constructor(selector) {
        this.isDay = false;
        this.curveMap = new Map();
        this.mixerMap = new Map();
        this.uTime = { value: 15 };
        this.clock = new THREE.Clock();

        this.domElement = document.querySelector(selector);
        this.width = this.domElement.clientWidth;
        this.height = this.domElement.clientHeight;

        this.init();
    }

    /* 
        * @description 初始化，实例化helper之后不要再手动调用init().
    */
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

    /* 
        * @description 窗口自适应
    */
    onWindowResize() {
        // 重新设置相机宽高比例
        this.camera.aspect = window.innerWidth / window.innerHeight;
        // 更新相机投影矩阵
        this.camera.updateProjectionMatrix();
        // 重新设置渲染器渲染范围
        this.renderer.setPixelRatio(window.devicePixelRatio);
        // 设置渲染器的像素比例
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /* 
        * @description 添加Object3D到场景
        * @param {Array} Object3D
    */
    add(...object3D) {
        this.scene.add(...object3D);
    }

    /* 
        * @description 初始化场景
    */
    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
    }

    /* 
        * @description 初始化相机模块并添加默认透视相机
        * @param {Number} fov 视锥体上下边角度
        * @param {Number} min 极近点
        * @param {Number} max 极远点
    */
    initCamera(fov, min, max) {
        this.cameras = new Cameras(fov, min, max);
        this.camera = this.cameras.camera;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        return this.camera;
    }

    /* 
        * @description 设置新的相机, 但不启用
        * @param {Number} fov 视锥体上下边角度
        * @param {Number} min 极近点
        * @param {Number} max 极远点
    */
    setCamera(name, camera) {
        this.cameras.setCamera(name, camera);
    }

    /* 
        * @description 启用相机
        * @param {String} name 相机名称
    */
    toggleCamera(name) {
        this.camera = this.cameras.activeCamera(name);
        return this.camera;
    }

    /* 
        * @description 初始化渲染器
    */
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            premultipliedAlpha: true,
            logarithmicDepthBuffer: true,
            useLegacyLights: false
        });
        this.renderer.toneMappingExposure = 1.5;
        this.renderer.shadowMap.enabled = true;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.domElement.appendChild(this.renderer.domElement);
        return this.renderer;
    }

    /* 
        * @description 调节场地曝光度
        * @param {Number} exposure 场地曝光度
    */
    changeExposure(exposure) {
        this.renderer.toneMappingExposure = exposure;
    }

    /* 
        * @description 添加GUI
    */
    addGUI() {
        this.gui = new dat.GUI();
    }

    /* 
        * @description 初始化光模块
    */
    initLight() {
        this.light = new Light();
    }

    /* 
        * @description 调启用默认光线方案
        * @param {Color} color 十六进制颜色
    */
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

    /* 
        * @description 创建直线光, 不添加
        * @param {Color} color 十六进制颜色
        * @param {Number} intensity 强度
        * @param {String} name 名称
        * @return {DirectionalLight} 直线光
    */
    addDirectional(color, intensity, name) {
        return this.light.createDirectionalLight(color, intensity, name);;
    }

    /* 
        * @description 添加环境光
        * @param {Color} color 十六进制颜色
        * @param {Number} intensity 强度
        * @param {String} name 名称
        * @return {AmbientLight} 环境光
    */
    addAmbient(color, intensity, name) {
        const ambient = this.light.createAmbientLight(color, intensity, name);
        this.scene.add(ambient.light);
        return ambient;
    }

    /* 
        * @description 创建聚光灯, 不添加
        * @param {Color} color 十六进制颜色
        * @param {Number} intensity 强度
        * @param {String} name 名称
        * @return {SpotLight} 聚光灯
    */
    addSpot(color, intensity, name) {
        return this.light.createSpotLight(color, intensity, name);
    }

    /* 
        * @description 创建点光源, 不添加
        * @param {Color} color 十六进制颜色
        * @param {Number} intensity 强度
        * @param {String} name 名称
        * @return {PointLight} 点光源
    */
    addPoint(color, intensity, name) {
        return this.light.createPointLight(color, intensity, name);
    }

    /* 
        * @description 依据名称获取光
        * @param {String} name 名称
        * @param {Boolean} help 是否检视所有名称
        * @return {Light} 光
    */
    getLight(name, help = false) {
        help && console.warn(this.light.check());
        return this.light.get(name);
    }

    /* 
        * @description 重定位相机
        * @param {Number} x x轴向距离
        * @param {Number} y y轴向距离
        * @param {Number} z z轴向距离
    */
    rePosCamera(x, y, z) {
        this.cameras.rePos(x, y, z);
    }

    /* 
        * @description 初始化控制器模块, 并添加默认轨道控制器
    */
    initControl() {
        this.controls = new Controls(this.camera, this.renderer);
        this.control = this.controls.controls;
        this.control.target.set(0, 0, 0); // 旋转中心
    }

    /* 
        * @description 创建轨道控制器, 不启用
        * @param {String} name 控制器名称
        * @return {Controls} name 控制器
    */
    setOrbitControl(name) {
        return this.controls.setOrbitControl(name);
    }

    /* 
        * @description 创建飞行控制器, 不启用
        * @param {String} name 控制器名称
        * @return {Controls} name 控制器
    */
    setFlyControl(name) {
        return this.controls.setFlyControl(name);
    }

    /* 
        * @description 创建第一人称控制器, 不启用
        * @param {String} name 控制器名称
        * @return {Controls} name 控制器
    */
    setFirstPersonControl(name) {
        return this.controls.setFirstPersonControl(name);
    }

    /* 
        * @description 启用一个控制器
        * @param {String} name 控制器名称
        * @return {Controls} name 控制器
    */
    toggleControl(name) {
        this.control = this.controls.activeControl(name);
        return this.control;
    }

    /* 
        * @description 更新控制器 更新曲线追踪 更新Box3 更新AnimationMixer 更新雪模块 更新后期效果 更新渲染器
    */
    render() {
        const delta = this.clock.getDelta();
        const elapsed = this.clock.getElapsedTime();

        this.control && this.control.update(delta);

        if (Array.from(this.curveMap.keys()).length > 0) {
            for (let i = 0; i < Array.from(this.curveMap.keys()).length; i++) {
                if (this.curveMap.get(Array.from(this.curveMap.keys())[i]) !== null) {
                    const point = Array.from(this.curveMap.keys())[i].getPoint(elapsed / this.curveMap.get(Array.from(this.curveMap.keys())[i]).deceleration % 1);
                    this.curveMap.get(Array.from(this.curveMap.keys())[i]).position.copy(point);
                }
            }
        }

        this.scene.traverse((node) => {
            if (node.box3) {
                node.box3.setFromObject(node);
            }
        })

        if (Array.from(this.mixerMap.values()).length > 0) {
            for (let i = 0; i < Array.from(this.mixerMap.values()).length; i++) {
                Array.from(this.mixerMap.values())[i].update(delta);
            }
        }

        if (this.points) {
            this.updateVertex();
        }

        this.effect.effectComposer.render(delta);
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }

    /* 
        * @description 更新雪模块
    */
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

    /* 
        * @description 加载gltf, 提前解析动画, 注册根据下标/名称获取动画的方法
        * @param {String} dracoPath 引导至draco_decoder.js所在目录, 这个文件可以从three模块内复制
        * @param {String} gltfPath gltf模型路径
        * @promise {GLTF} gltf模型
    */
    gltfLoader(dracoPath, gltfPath) {
        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(dracoPath);
        dracoLoader.setDecoderConfig({ type: "js" });
        dracoLoader.preload();
        gltfLoader.setDRACOLoader(dracoLoader);

        return new Promise((resolve, reject) => {
            gltfLoader.load(gltfPath, (gltf) => {
                const mixer = new THREE.AnimationMixer(gltf.scene);
                this.mixerMap.set(gltf, mixer);

                const actions = {};
                for (let i = 0; i < gltf.animations.length; i++) {
                    actions[`${gltf.animations[i].name}Action`] = mixer.clipAction(gltf.animations[i]);
                }
                gltf.actions = actions;

                gltf.getActionByName = function (actionName) {
                    return gltf.actions[actionName];
                }
                gltf.getActionByIndex = function (index) {
                    return gltf.actions[Object.keys(gltf.actions)[index]]
                }
                resolve(gltf);
            });
        });
    }

    /* 
        * @description 加载图像纹理
        * @param {String} path 引导至图片所在
        * @Promise {Texture} texture 图像纹理
    */
    textureLoader(path) {
        const loader = new THREE.TextureLoader();
        return new Promise((resolve, reject) => {
            loader.load(path, (texture) => {
                resolve(texture);
            });
        });
    }

    /* 
        * @description 根据gltf获取其AnimationMixer
        * @param {GLTF} gltf gltf模型
        * @return {AnimationMixer} 动作混合器
    */
    getMixer(gltf) {
        return this.mixerMap.get(gltf);
    }

    /* 
        * @description 加载HDR纹理
        * @param {String} path 引导至HDR文件所在
        * @Promise {Texture} texture 图像纹理
    */
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

    /* 
        * @description 加载视频纹理
        * @param {String} path 引导至视频所在
        * @return {Texture} texture 视频纹理
    */
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

    /* 
        * @description 设置环境纹理(图像纹理)
        * @param {String} path 引导至图片所在
        * @Promise {Texture} texture 图像纹理
    */
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

    /* 
        * @description 设置环境纹理(HDR)
        * @param {String} path 引导至HDR文件所在
        * @Promise {Texture} texture HDR纹理
    */
    setBackgroundHDR(url) {
        return new Promise((resolve, reject) => {
            this.hdrLoader(url).then((texture) => {
                texture.anisotropy = 16;
                this.scene.background = texture;
                this.scene.environment = texture;
                texture.format = THREE.RGBAFormat;
                texture.mapping = THREE.EquirectangularReflectionMapping;

                resolve(texture);
            });
        });
    }

    /* 
        * @description 初始化后期效果模块
    */
    initEffect() {
        const effect = new Effect(this.scene, this.camera, this.renderer);
        this.effect = effect;
    }

    /* 
        * @description 启用抗锯齿后期
    */
    addAntialias() {
        this.effect.antialias();
    }

    /* 
        * @description 启用柯里化后期
    */
    addDotScreen(center, angel, scale) {
        this.effect.dotScreen(center, angel, scale);
    }

    /* 
        * @description 启用泛光后期
    */
    addUnrealBloom(threshold, strength, radius) {
        this.effect.unrealBloom(threshold, strength, radius);
    }

    /* 
        * @description 启用像素化后期
    */
    addPixel(intensity) {
        this.effect.pixel(intensity);
    }

    /* 
        * @description 启用干扰后期
    */
    addGlitch(keep) {
        this.effect.glitch(keep);
    }

    /* 
        * @description 启用电影后期
    */
    addFilm(nIntensity, sIntensity, sCount, grayscale) {
        this.effect.film(nIntensity, sIntensity, sCount, grayscale);
    }

    /* 
        * @description 启用屏幕空间反射后期
    */
    addSSR(size, color) {
        this.effect.ssr(size, color);
    }

    /* 
        * @description 添加纹理海洋
        * @params {Texture} flowTexturePath 水波纹理
        * @params {Number} length 长
        * @params {Number} width 宽
        * @params {Number} density 水波密度
        * @params {Color} color 十六进制颜色
    */
    addOcean1(flowTexturePath = '', length = 100, width = 100, density = 1150, color = 0x21ccfc) { // ocean必需波纹贴图
        this.ocean = new Ocean1(flowTexturePath, length, width, density, color);
        this.scene.add(this.ocean.mesh);
    }

    /* 
        * @description 添加Shader海洋
        * @params {Number} length 长
        * @params {Number} width 宽
        * @params {Number} density 水波密度
        * @params {Color} color 十六进制颜色
    */
    addOcean2(length = 100, width = 100, density = 1150, color = 0x21ccfc) {
        this.ocean = new Ocean2(length, width, density, color);
        this.scene.add(this.ocean.mesh);
    }

    /* 
        * @description 添加坐标轴
        * @params {Number} size 三轴线长度
    */
    addAxis(size = 10) {
        let axis = new THREE.AxesHelper(size);
        this.scene.add(axis);
    }

    /* 
        * @description ??
    */
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

    /* 
        * @description 初始化射线拾取
    */
    initRaycaster() {
        this.raycaster = new Raycaster(this.domElement);
    }

    /* 
        * @description 设置射线拾取适用物体
        * @params {Array} RaycasterMeshes 能够被射线拾取的物体
    */
    setRaycasterMeshes(RaycasterMeshes) {
        this.raycaster.setMeshArr(RaycasterMeshes);
    }

    /* 
        * @description 在鼠标点击物体时进行射线拾取
        * @params {Function} callback 拾取之后回调
    */
    createClickRaycaster(callback) {
        this.raycaster.createClickRaycaster(callback);
    }

    /* 
        * @description 在鼠标悬浮时进行射线拾取
        * @params {Function} callback 拾取之后回调
    */
    createHoverRaycaster(callback) {
        this.raycaster.createHoverRaycaster(callback);
    }

    /* 
        * @description 射线悬浮拾取demo
        * @params {Array} RaycasterMeshes 能够被射线拾取的物体
    */
    rayHelper() {
        const geometry = new THREE.SphereGeometry(0.2, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff3333,
            side: THREE.DoubleSide,
            transparent: true
        });
        const star = new THREE.Mesh(geometry, material);
        star.visible = false;
        this.scene.add(star);
        this.createHoverRaycaster((intersects) => {
            star.visible = true;
            star.position.copy(intersects[0].point);
        });
    }

    /* 
        * @description 添加精灵文字
        * @params {String} text 文字
        * @params {Vector3} position 位置
    */
    addSpriteText(text, position) {
        let spriteText = new SpriteCanvas(this.camera, text, position);
        this.scene.add(spriteText.mesh);
        return spriteText;
    }

    /* 
        * @description 初始化光晕模块
    */
    initLensflare() {
        this.lensflares = new Lensflares();
    }

    /* 
        * @description 创建光晕
        * @params {Array} configArr配置每个光晕, 格式: [{ path, size, distance, color}, ...]
        * @params {String} name 名称
        * @return {Lensflares} 光晕
    */
    createLensflare(configArr = [], name) { // 
        const lensflare = this.lensflares.create(configArr, name);
        return lensflare;
    }

    /* 
        * @description 获取光晕
        * @params {String} name 名称
        * @return {Lensflares} 光晕
    */
    getLensflare(name) {
        return this.lensflares.get(name);
    }

    /* 
        * @description 创建模拟太阳
        * @params {String} name 是否使用光晕
        * @return {Sun}
    */
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

    /* 
        * @description 太阳公转启用
    */
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

    /* 
        * @description 日光跟随太阳变化
        * @params {Function} dayCallback 昼调用
        * @params {Function} nightCallback 夜调用
    */
    dayLight(dayCallback, nightCallback) {
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

    /* 
        * @description 模拟天空, 你处在天空球内
        * @params 天空球尺寸
        * @return {SphereSky} 天空球
    */    
    addSphereSky(size = 10000) {
        let sphereSky = new SphereSky(size, this.uTime, this.scene.environment);
        this.scene.add(sphereSky.mesh);

        return sphereSky;
    }

    /* 
        * @description 添加3D网格坐标系
        * @params {Array} category 二维数组, length = 2, 控制y轴、x轴标签
        * @params {Number} bottom 纵轴起始位置
        * @params {Number} left 横轴起始位置
    */
    addAxis3d(category, bottom, left, size) {
        let axis3d = new Axis3d(category, bottom, left, size);
        this.scene.add(axis3d.mesh);
        return axis3d;
    }

    /* 
        * @description 添加3D柱形图
        * @params {Array} data 数组内对象必需name, value属性分别为项名&值
        * @params {Number} space 柱体间隔
        * @params {String} type 圆柱cylinder, 四棱柱rect
        * @return {Group} bar3d 柱形图
    */
    addBar3d(data, space, type) { // 柱形图
        let bar3d = new Bar3d(data, space, type);
        this.scene.add(bar3d.mesh);
        return bar3d;
    }

    /* 
        * @description 添加3D饼图1, 各部分有高度差
        * @params {Array} data 数组内对象必需name, value属性分别为项名&值
        * @params {Number} depth 各部分高度差
        * @return {Group} pie3d1 饼图1
    */
    addPie3d1(data, depth) { // 饼图1
        let pie3d1 = new Pie3d1(data, this.camera, depth);
        this.scene.add(pie3d1.mesh);
        return pie3d1;
    }

    /* 
        * @description 添加3D饼图2, 无高度差
        * @params {Array} data 数组内对象必需name, value属性分别为项名&值
        * @return {Group} pie3d1 饼图1
    */
    addPie3d2(data) { // 饼图2
        let pie3d2 = new Pie3d2(data);
        this.scene.add(pie3d2.mesh);
        return pie3d2;
    }

    /* 
        * @description 添加3D折线图
        * @params {Array} data 数组内对象必需name, value属性分别为项名&值
        * @params {Number} space 项之间间隔
        * @return {Group} pie3d1 折线图
    */
    addPolyline3d(data, space) {
        let polyline3d = new Polyline3d(data, space);
        this.scene.add(polyline3d.mesh);
        return polyline3d;
    }

     /* 
        * @description 增加降雪或其他
        * @params {BufferGeometry} geometry 每个颗粒的模型(非必需)
        * @params {Color} color 材质颜色, 十六进制颜色
        * @params {Texture} texture 图像纹理
        * @return {Mesh} 雪区
    */
    addSnow(geometry, color, texture) {
        this.points = new Snow(geometry, color, texture);
        this.scene.add(this.points.mesh);
        return this.points;
    }

    /* 
        * @description 立体矩阵坐标系
        * @params {Number} space 间隔
        * @params {Number} density 密度
        * @params {Texture} texture 图像纹理(非必需)
    */
    addMatrixAxis(space, density, geometry, texture) {
        const matrixAxis = new MatrixAxis(space, density, geometry, texture);
        this.scene.add(matrixAxis.mesh);
    }

    /* 
        * @description 添加曲线
        * @params {Array} path Vector3数组
        * @params {Color} color 颜色
        * @return {Curve} curve 曲线
    */
    addCurve(path, color) {
        const curve = new Curve(path, color);
        this.curveMap.set(curve, null);
        return curve;
    }

    /* 
        * @description 使物体沿曲线移动
        * @params {Curve} curve 曲线
        * @params {Mesh} mesh 物体
        * @params {Number} 降速
    */
    fllowCurve(curve, mesh, deceleration = 3) {
        if (!mesh) console.warn('fllowCurve: mesh cannot be undefined.');
        mesh.deceleration = deceleration;
        this.curveMap.set(curve, mesh);
    }

    /* 
        * @description 目标物体沿曲线移动
        * @params {Array} path Vector3路径数组
        * @params {Number} tubularSegments 分段数
        * @params {Number} radius 半径
        * @params {Number} radialSegments 横截面分段数(棱数)
        * @params {Color} color 材质颜色, 十六进制颜色
    */
    addTube(path, tubularSegments, radius, radialSegments, color) {
        const tube = new Tube(path, tubularSegments, radius, radialSegments, color);
        return tube;
    }

    /* 
        * @description 为一个物体增加Box3
        * @params {Mesh/gltf} 物体或gltf 
        * @params {Boolean} helper Box3视觉辅助
    */
    addBox3(model, helper = false) { // 为一个模型添加box3
        model.box3 = new THREE.Box3();
        if (model.scene) {
            model.scene.traverse((node) => {
                if (node.isSkinnedMesh) {
                    const mesh = node;
                    node.frustumCulled = false;
                    mesh.geometry.computeBoundingBox();
                    model.box3.union(mesh.geometry.boundingBox);
                }
            })
        } else {
            model.box3.setFromObject(model);
        }
        if (helper) {
            const box3Helper = new THREE.Box3Helper(model.box3, 0xffff00);
            this.scene.add(box3Helper);
        }
        return model;
    }

    /* 
        * @description 传入两个物体, 检测其Box3是否有交集
        * @params {Mesh/gltf} 物体或gltf
        * @return {Boolean} 交集与否
    */
    collideDetect(mesh0, mesh1) {
        if (!mesh0.box3 || !mesh1.box3) {
            console.warn('collideDetect: Box3 needed.')
            return;
        }
        return mesh0.box3.intersectsBox(mesh1.box3);
    }
}