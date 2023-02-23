import * as THREE from 'three';  //可以直接使用npm对"three.js"进行安装， 但是引入的时候还是要引入"three";

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

var ylj = require('../assets/416.png');   //这种引入方式可以, 直接在load()里写路径不行
const texture = new THREE.TextureLoader().load(ylj, function () {
    renderer.render(scene, camera);
});


//创建几何体
const geometry = new THREE.BoxGeometry(5, 5, 5);  //xyz111的正方体

// in this example we create the material when the texture is loaded
//material = new THREE.MeshBasicMaterial( { color: 0x049EF4 } );
const material = new THREE.MeshBasicMaterial({
    color: "0x049EF4",  //color值不能加引号, 不然会渲染默认白
    map: texture
});

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);
//意思是这个纹理是异步添加的, 在画布渲染完毕后才会添加, 所以渲染不出

//mesh放basicMaterial后面黑的没贴图
//Mesh()创建物体(不渲染), 这里传几何体和材质


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