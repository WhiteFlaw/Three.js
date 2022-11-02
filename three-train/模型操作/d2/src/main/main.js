import * as THREE from 'three';  //可以直接使用npm对"three.js"进行安装， 但是引入的时候还是要引入"three";

//导入轨道控制器, 使得相机可以围绕目标进行运动
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

//创建场景
const scene = new THREE.Scene();

//创建相机
const carema = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//创建相机有camera, ArrayCamera, CubeCamera, OrthographicCamera, StereoCamera
//PerspectiveCamera(): 
//fov-相机视锥体垂直视野角度
//aspect-相机视锥体长宽比
//near-相机视锥体近端点
//far-相机视锥体远端点
//PerspectiveCamera自带的方法和属性这样可以直接carema.getFilmWidth()这样;

//设置相机位置, 这个是直接操作Object3D,顾名思义3D对象,这是threejs中绝大多数对象的基础类, 并且它为3D空间中可操作的3D对象提供一系列属性和方法, 也就是说绝大多数3D对象都可以调用它的方法访问它的属性, 
//这里提供position属性的也不是PerspectiveCamera自带的方法
carema.position.set(0, 0, 10);
//Object3D的属性:
//.position.set设置3D对象的局部位置为一个三维向量对象(Vector3)

scene.add(carema);
//场景.add(xxx): 将xx添加到场景中

//创建几何体
for (let i = 0; i < 50; i++) {
    const geometry = new THREE.BufferGeometry();
    const positionArray = new Float32Array(9);
    for (let j = 0; j < 9; j++) {
        positionArray[j] = Math.random() * 5;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));

    let color = new THREE.Color(Math.random(), Math.random(), Math.random());  //为什么给rgb设置第四个值也不透明?
    const material = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.5 });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}

//声明构造器(渲染器): WebGLRenderer, 渲染器会渲染出一个画布
const renderer = new THREE.WebGLRenderer();

//设置渲染尺寸
renderer.setSize(window.innerWidth, window.innerHeight);

//将渲染完的canvas内容添加到body
document.body.appendChild(renderer.domElement)

//最后渲染, 使用渲染器渲染场景和相机, 但是这里把render封装到方法里进行了, 方便每次镜头改变调用重渲染
//renderer.render(scene, carema)

//创建轨道控制器
const controls = new OrbitControls(carema, renderer.domElement);
//OrbitControls参数:
//carema将要被控制的相机
//一个DOM元素, 用于事件监听,可以用renderer.domElement也就是渲染器渲染出的那个canvas画布

//声明坐标系（非必须）
const axeHelper = new THREE.AxesHelper('5');  //传入坐标轴长度， Str,num均可
//将坐标系添加到场景
scene.add(axeHelper);

function render() {   //调用render()进行重渲染
    renderer.render(scene, carema);
    requestAnimationFrame(render);
}

render();