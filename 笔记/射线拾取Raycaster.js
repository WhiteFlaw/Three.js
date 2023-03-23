const doc = `
该类用于进行光线投射, 进而判定三维目标的选取操作, 如果投射出的光线穿过三维物体
那么该物体在二维视角上应是与鼠标重叠, 可被选取.
`

let camera, scene, renderer;
let geometry, material;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

init();
animate();

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(10, 10, 10);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    geometry = new THREE.IcosahedronGeometry(0.5, 3);
    material = new THREE.MeshPhongMaterial({ color: 0xffffff });

    mesh = new THREE.InstancedMesh(geometry, material, 2);

    const matrix0 = new THREE.Matrix4();
    matrix0.setPosition(0, 0, 0);
    console.log(matrix0);

    const matrix1 = new THREE.Matrix4();
    matrix1.setPosition(1, 0, 0);
    console.log(matrix1);

    mesh.setMatrixAt(0, matrix0);
    mesh.setMatrixAt(1, matrix1);

    scene.add(mesh);

    const axe = new THREE.AxesHelper();
    scene.add(axe);
}

function onMouseMove() {
    mouse.x = window.clientX;
    mouse.y = window.clientY;
}

function animate() {
    requestAnimationFrame(animate);
    raycaster.setFromCamera(mouse, camera); // (鼠标二维坐标, 摄像机)
    render();
}

function render() {
    renderer.render(scene, camera);
}