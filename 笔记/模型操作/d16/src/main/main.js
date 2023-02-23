import * as dat from "dat.gui";
import * as THREE from 'three';
import { DirectionalLight, PlaneBufferGeometry, SpotLight, PointLight } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

//创建场景
const scene = new THREE.Scene();

//创建相机
const carema = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//设置相机位置
carema.position.set(0, 0, 10);

//加入相机到场景
scene.add(carema);

//创建几何体
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const planeGeometry = new PlaneBufferGeometry(50, 50);

const material = new THREE.MeshStandardMaterial({
    color: "#fab9e6",
    metalness: 0.7,
    roughness: 0.1,
});

const planeMesh = new THREE.Mesh(planeGeometry, material);
const sphereMesh = new THREE.Mesh(sphereGeometry, material);

sphereMesh.castShadow = true;
planeMesh.receiveShadow = true;
planeMesh.rotation.x = 80;
planeMesh.position.set(0, -3, 0);

scene.add(sphereMesh);
scene.add(planeMesh)

//环境光源
const light = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(light);


//平行光, 可以投射阴影, 但只平行光的话照不到的地方都是黑的
const pointLight = new PointLight(0xffffff, 1);

pointLight.position.set(2, 2, 2);
pointLight.castShadow = true;
pointLight.shadow.radius = 20;
pointLight.shadow.mapSize.set(512, 512);

scene.add(pointLight);

const GUI = new dat.GUI();

GUI
    .add(pointLight.position, "x")
    .min(-5)
    .max(5)
    .step(0.1)
    .onChange(() => {
        pointLight.shadow.camera.updateProjectionMatrix();  //相机属性一旦被改动就必须调用这个
    })
GUI
    .add(pointLight.position, "z")
    .min(-5)
    .max(5)
    .step(0.1)
    .onChange(() => {
        pointLight.shadow.camera.updateProjectionMatrix();  //相机属性一旦被改动就必须调用这个
    })
GUI
    .add(pointLight, "distance")
    .min(0)
    .max(10)
    .step(0.01)
    .onChange(() => {
        pointLight.shadow.camera.updateProjectionMatrix();  //相机属性一旦被改动就必须调用这个
    })

//声明构造器(渲染器): WebGLRenderer, 渲染器会渲染出一个画布
const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);

//将渲染完的canvas内容添加到body
document.body.appendChild(renderer.domElement)

//创建轨道控制器
const controls = new OrbitControls(carema, renderer.domElement);

//声明坐标系（非必须）
const axeHelper = new THREE.AxesHelper('20');  //传入坐标轴长度， Str,num均可

//将坐标系添加到场景
scene.add(axeHelper);

function render() {   //调用render()进行重渲染
    requestAnimationFrame(render);
    renderer.render(scene, carema);
}

render();

window.addEventListener('resize', () => {
    //更新相机锥体视区长宽比
    carema.aspect = window.innerWidth / window.innerHeight;

    //手动更新相机的投影矩阵(重新计算投影矩阵), 相机对象的投影矩阵相关属性变化后，再重新计算相机投影矩阵值, 否则会造成资源浪费
    carema.updateProjectionMatrix();

    //更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);

    //设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio);
})