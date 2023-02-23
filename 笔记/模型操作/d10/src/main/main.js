import * as THREE from 'three';  //可以直接使用npm对"three.js"进行安装， 但是引入的时候还是要引入"three";
import { DoubleSide } from 'three';

//导入轨道控制器, 使得相机可以围绕目标进行运动
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

//创建场景
const scene = new THREE.Scene();

//创建相机
const carema = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//设置相机位置
carema.position.set(0, 0, 20);

//加入相机到场景
scene.add(carema);

//创建几何体
const geometry = new THREE.SphereBufferGeometry(5, 30, 30);  //xyz111的正方体
const planeGometry = new THREE.PlaneBufferGeometry(5, 5, 800, 800);

//导入贴图
const haokangde = require("../assets/haokangde.png");
const haokangde2 = require("../assets/haokangde2.png");

//声明贴图加载器
const textureLoader = new THREE.TextureLoader();

//声明贴图
const texture = textureLoader.load(haokangde);

const texture2 = textureLoader.load(haokangde2);

//material = new THREE.MeshBasicMaterial( { color: 0x049EF4 } );
const material = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide,  //不加THREE.DoubleSide只会渲染单面
    //normalMap: texture2  //这个贴图会被用于创建法线贴图, 它的RGB值会影响material的每个像素片段的法线, 从而更改光照的方式,只改变光照的方式.

});

const mesh = new THREE.Mesh(geometry, material);
const plane = new THREE.Mesh(planeGometry, material);
//scene.add(plane);
//scene.add(mesh);

plane.position.set(10, 0, 0);
mesh.position.set(10, 0, 0);

//////////////////////////////////////////////////////
const geometrya = new THREE.BufferGeometry();  //

const vertices = new Float32Array([
    //每三个值作为一个顶点, 矩形的话俩三角形拼合
    6.0, 10.0, 1.0,
    6.0, 0.0, 1.0,
    10.0, 10.0, 1.0,
]);

geometrya.setAttribute('position', new THREE.BufferAttribute(vertices, 3));  //创建缓冲区数据对象, 依照vertuce数组数据, 每三个作为一个顶点坐标

const materiala = new THREE.MeshStandardMaterial({ color: 0xffffff });

//根据几何体和材质创建物体
const mesha = new THREE.Mesh(geometrya, materiala)

scene.add(mesha);

///////////////////////////////////////////////////////

//直线光源
//平行光, 可以投射阴影, 但只平行光的话照不到的地方都是黑的
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 100);//xyz
scene.add(directionalLight);

//声明构造器(渲染器): WebGLRenderer, 渲染器会渲染出一个画布
const renderer = new THREE.WebGLRenderer();

//设置渲染尺寸
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
