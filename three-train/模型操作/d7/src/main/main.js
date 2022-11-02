import * as THREE from 'three';  //可以直接使用npm对"three.js"进行安装， 但是引入的时候还是要引入"three";
import { LineBasicMaterial } from 'three.js';

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
const geometry = new THREE.SphereGeometry(5, 30, 30);  //xyz111的正方体

//导入贴图
const haokangde = require("../assets/haokangde.png");

//声明贴图加载器
const textureLoader = new THREE.TextureLoader();

//声明贴图
const texture = textureLoader.load(haokangde);

//不看
texture.repeat.set(6, 4);
texture.wrapS = THREE.RepeatWrapping;  //规定贴图在水平方向如何包裹
texture.wrapT = THREE.RepeatWrapping;  //规定贴图在垂直方向如何包裹

//material = new THREE.MeshBasicMaterial( { color: 0x049EF4 } );
const material = new THREE.MeshStandardMaterial({
    color: "0x049EF4",  //color值不能加引号, 不然会渲染默认白
    map: texture,
    side: THREE.DoubleSide,  //不加THREE.DoubleSide只会渲染单面
});

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);
//意思是这个纹理是异步添加的, 在画布渲染完毕后才会添加, 所以渲染不出

//环境灯光, 四面八方打光, 没有确切方向
/* const light = new THREE.AmbientLight(0x404040);  //AmbientLight不能用来投射阴影, 因为没有方向
scene.add(light); */

//直线光源
//平行光, 可以投射阴影, 但只平行光的话照不到的地方都是黑的
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 10, 10);//xyz
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
const axeHelper = new THREE.AxesHelper('10');  //传入坐标轴长度， Str,num均可

//将坐标系添加到场景
scene.add(axeHelper);

function render() {   //调用render()进行重渲染
    //console.log("render")
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