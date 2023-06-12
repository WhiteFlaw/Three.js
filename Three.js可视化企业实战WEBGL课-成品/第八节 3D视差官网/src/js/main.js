import * as THREE from '../../node_modules/three/build/three.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import gsap from 'gsap';
//import * as dat from 'dat.gui';
// const gui = new dat.GUI();

let scene, camera, renderer, clock, raycaster, currentPage, cubeArr, ballGroup;
let highLightMaterial, mouse;
let cubeGroup, triangles, bulb;
const allScene = [];

function initScene() {
    window.scrollTo(0, 0);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300);

    // const textureLoader = new THREE.TextureLoader();
    // const particleTexture = textureLoader.load('./textures/particles/1.png');

    camera.position.set(0, 0, 15);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.useLegacyLights = false;
    document.body.appendChild(renderer.domElement);

    clock = new THREE.Clock();

    highLightMaterial = new THREE.MeshBasicMaterial({ color: '#ff0000' });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
    })

    const outputRes = debounce(dealScroll, 500);
    window.addEventListener('scroll', () => {
        outputRes();
    })

    mouse = new THREE.Vector2();

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX / window.innerWidth - 0.5;
        mouse.y = event.clientY / window.innerHeight - 0.5;
    })
}

currentPage = 0;
function dealScroll() {
    if (window.innerHeight * currentPage < window.scrollY && currentPage !== 2) { // down
        currentPage++;
        // else if, 你要么上要么下, 别他妈在那给我弹来弹去的做了防抖都不行
    } else if (window.innerHeight * currentPage > window.scrollY && currentPage !== 0) { // up
        currentPage--;
    }

    window.scrollTo({
        top: window.innerHeight * currentPage,
        behavior: 'smooth'
    });

    if (currentPage !== 2) {
        gsap.to(allScene[currentPage].rotation, {
            z: '+=' + Math.PI,
            x: '+=' + Math.PI,
            duration: 1,
            onComplete: () => {
                console.log('animation done: ', currentPage)
            }
        });
    }
}

function debounce(func, wait = 1000, immediate = true) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);

    }
}

function createMatrix() {
    // 矩形阵列
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({ wireframe: true });

    cubeArr = [];
    cubeGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            for (let z = 0; z < 5; z++) {
                const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                cube.position.set(i * 2 - 4, j * 2 - 4, z * 2 - 4);
                cubeGroup.add(cube);
                cubeArr.push(cube);
            }
        }
    }
    cubeGroup.position.set(0, -3, -5);
    scene.add(cubeGroup);
    allScene.push(cubeGroup);

    gsap.to(cubeGroup.rotation, {
        x: '+=' + Math.PI,
        y: '+=' + Math.PI,
        ease: "power2.inOut",
        duration: 5,
        repeat: -1
    })
}

function initRay() {
    // raycaster
    raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    window.addEventListener('click', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
        raycaster.setFromCamera(mouse, camera);

        let result = raycaster.intersectObjects(cubeArr);

        result.forEach((item) => {
            item.object.material = highLightMaterial;
        })
    })
}

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true; // 惯性

/* const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper); */

function createTriangle() {
    // 三角
    triangles = new THREE.Group();

    for (let i = 0; i < 50; i++) {
        const triangleGeometry = new THREE.BufferGeometry();
        const positionArray = new Float32Array(9); // 数组里有9组三维坐标

        for (let j = 0; j < 9; j++) {
            // xyz方向各向负轴移动5
            positionArray[j] = Math.random() * 10 - 5;
        }

        triangleGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));

        let color = new THREE.Color(Math.random(), Math.random(), Math.random());

        const triangleMaterial = new THREE.MeshBasicMaterial({
            color: color,
            opacity: 0.5,
            transparent: true,
            side: THREE.DoubleSide
        });

        const triangle = new THREE.Mesh(triangleGeometry, triangleMaterial);
        triangles.add(triangle);
    }
    triangles.position.set(0, -30, 0);
    scene.add(triangles);
    allScene.push(triangles);

    gsap.to(triangles.rotation, {
        x: '+=' + Math.PI * 2,
        y: '+=' + Math.PI * 2,
        ease: "power2.inOut",
        duration: 5,
        repeat: -1
    })
}

function createProjection() { // 球体投影
    ballGroup = new THREE.Group();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const bulbGeometry = new THREE.SphereGeometry(0.3, 60, 60);
    const bulbMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
    bulb.position.set(2, 3, 2);

    const pointLight = new THREE.PointLight(0xffffff, 2);
    pointLight.castShadow = true;
    pointLight.shadow.radius = 20;
    pointLight.shadow.mapSize.set(512, 512);
    bulb.add(pointLight);
    ballGroup.add(bulb);

    const ballGeometry = new THREE.SphereGeometry(1, 20, 20);
    const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xa3eaea });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.castShadow = true;
    ballGroup.add(ball);

    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshStandardMaterial();
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, -1, 0);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    ballGroup.add(plane);

    ballGroup.position.set(0, -60, 0);
    scene.add(ballGroup);
    allScene.push(ballGroup);
    gsap.to(bulb.position, { // 公转
        x: -3,
        ease: "power2.inOut",
        duration: 6,
        yoyo: true,
        repeat: -1
    })
    gsap.to(bulb.position, { // 颠簸
        y: 2,
        ease: "power2.inOut",
        duration: 1,
        yoyo: true,
        repeat: -1
    })
    gsap.to(ballGroup.rotation, { // 颠簸
        z: Math.PI / 15,
        x: Math.PI / 15,
        ease: "power2.inOut",
        duration: 5,
        yoyo: true,
        repeat: -1
    })
}


function render() {
    let deltaTime = clock.getDelta();

    camera.position.y = - (window.scrollY / window.innerHeight) * 27;

    camera.position.x += (mouse.x * 10 - camera.position.x) * deltaTime; // 最多偏移10像素

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

initScene();

createMatrix();
initRay();

createTriangle();

createProjection();

render();