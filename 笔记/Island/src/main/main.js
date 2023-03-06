import * as THREE from 'three';
import { DirectionalLight } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/orbitcontrols';
import { Water } from 'three/examples/jsm/objects/Water';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from 'three/examples/jsm/loaders/dracoloader';
import * as dat from "dat.gui";
const gui = new dat.GUI();
const scene = new THREE.Scene();

/////////////////////////////////////////////////////////camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);

camera.position.set(-380, 250, 750);
camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix();

scene.add(camera);
/////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
})

renderer.outputEncoding = THREE.sRGBEncoding;  ///???????

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
////////////////////////////////////////////////////////////////////

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})

const controls = new OrbitControls(camera, renderer.domElement);


/////////////////////////////////////////////////////////////render
function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();
//////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////sky
const skyGeometry = new THREE.SphereGeometry(1000, 60, 60);
const skyTexture = require("../assets/img/bg.jpg")
const skyMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(skyTexture)

})
skyGeometry.scale(1, 1, -1);  //让大圆球外层内翻, 双面渲染费性能
const sky = new THREE.Mesh(skyGeometry, skyMaterial);

scene.add(sky);


////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////sea
const waterGeometry = new THREE.CircleBufferGeometry(800, 64);
const water = new Water(waterGeometry, {
    textureWidth: 1024,
    textureHeight: 1024,
    //color: 0xeeeeff,
    flowDirection: new THREE.Vector2(1, 1),
    scale: 4,
    //side: THREE.DoubleSide

})
water.receiveShadow = true;
water.rotation.x = -Math.PI / 2;
scene.add(water);
/////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////island
const loader = new GLTFLoader();

const dracoLoader = new DRACOLoader();

dracoLoader.setDecoderPath("./draco/");

loader.setDRACOLoader(dracoLoader);

loader.load("./model/untitled.glb", (gltf) => {
    scene.add(gltf.scene);
    gltf.scene.scale.set(30, 30, 30);
    gltf.scene.rotation.set(0, 7.5, -0.1);
    gltf.scene.castShadow = true;
    
    gui.  //// gui-island_deg
    add(gltf.scene.rotation, "y")
    .min(6.5)
    .max(8.2)
    .step(0.1)
    .name("RotateY")
})


/////////////////////////////////////////////////////////////////////////light

const light = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(light);

const directionalLight1 = new DirectionalLight(0xffffff, 2);

directionalLight1.position.set(0, 0, -300);
directionalLight1.castShadow = true;

scene.add(directionalLight1);

const directionalLight2 = new DirectionalLight(0xffffff, 0.5);

directionalLight2.position.set(-300, 0, -100);

scene.add(directionalLight2);

/////////////////////////////////////////////////////////////////////

//add需要改变的属性到gui里
gui.
    add(camera.position, "x")
    .min(-400)
    .max(100)
    .step(1)
    .name("PositionX")

    gui.
    add(camera.position, "y")
    .min(150)
    .max(500)
    .step(1)
    .name("PositionZ")