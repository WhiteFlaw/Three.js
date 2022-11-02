import * as THREE from 'three';  //可以直接使用npm对"three.js"进行安装， 但是引入的时候还是要引入"three";
// console.log(THREE);

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
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);  //xyz111的正方体
//创建材质
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

cubeMaterial.color.set("lightgreen");

//Mesh()创建物体(不渲染), 这里传几何体和材质
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

//将创建完毕的物体加入场景
scene.add(cube);

//声明构造器(渲染器): WebGLRenderer, 渲染器会渲染出一个画布
const renderer = new THREE.WebGLRenderer();

//设置渲染尺寸
renderer.setSize(window.innerWidth, window.innerHeight);

//将渲染完的内容添加到body
document.body.appendChild(renderer.domElement)

//最后渲染, 使用渲染器渲染场景和相机
renderer.render(scene, carema)