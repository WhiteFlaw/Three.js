import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

//全局声明摄像机
let camera, scene, renderer, labelRenderer;
let moon, earth;
let clock = new THREE.Clock();

//实例化纹理加载器
const textureLoader = new THREE.TextureLoader();


function init() {
    //地球半径
    const EARTH_RADIUS = 2.5;
    //月球半径
    const MOON_RADIUS = 0.27;

    //相机
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        200
    );
    camera.position.set(10, 5, 20);

    //场景
    scene = new THREE.Scene();


    //光源_聚光灯
    const dirLight = new THREE.SpotLight(0xffffff);
    dirLight.position.set(0, 0, 10);
    dirLight.intensity = 2;
    dirLight.castShadow = true;
    scene.add(dirLight);
    //光源_环境灯
    const aLight = new THREE.AmbientLight(0xcccccc);
    aLight.intensity = 0.3;
    scene.add(aLight);

    //月球
    const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 16, 16);
    const moonTexture = require("../assets/texture/planet/moon_1024.jpg")
    const moonMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load(moonTexture),
    });
    moon = new THREE.Mesh(moonGeometry, moonMaterial);
    scene.add(moon);

    const moonDiv = document.createElement('div');
    moonDiv.className = 'label';
    moonDiv.textContent = 'Moon';
    const moonLabel = new CSS2DObject(moonDiv)

    moonLabel.position.set(0, MOON_RADIUS + 0.5, 0);
    moon.add(moonLabel)

    //地球
    const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 16, 16);
    const earthTexture = require("../assets/texture/planet/earth_atmos_2048.jpg");
    const earthTexture_specularMap = require("../assets/texture/planet/earth_specular_2048.jpg")
    const earthTexture_normalMap = require("../assets/texture/planet/earth_normal_2048.jpg")

    const earthMaterial = new THREE.MeshPhongMaterial({
        shininess: 5,
        map: textureLoader.load(earthTexture),
        specularMap: textureLoader.load(earthTexture_specularMap),  //镜面反射贴图会影响镜面高光以及环境贴图对表面的影响程度
        normalMap: textureLoader.load(earthTexture_normalMap)
    });
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.receiveShadow = true;
    earth.castShadow = true;
    scene.add(earth);

    //渲染器
    renderer = new THREE.WebGLRenderer({
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    //渲染器_阴影: 是 
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // 标签渲染器
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight)
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(labelRenderer.domElement)

    //声明坐标系（非必须）
    const axeHelper = new THREE.AxesHelper('20');  //传入坐标轴长度， Str,num均可
    //将坐标系添加到场景
    scene.add(axeHelper);

    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    })

    //绑定镜头控制器
    const controls = new OrbitControls(camera, renderer.domElement);
}
function animate() {
    //时间_自时钟启动后的秒数
    const elapsed = clock.getElapsedTime();
    moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);

    //自转
    var axis = new THREE.Vector3(0, 1, 0);
    earth.rotateOnAxis(axis, elapsed * Math.PI / 1000);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
init();
animate();