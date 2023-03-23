const part1 = `
目前仅依据InstancedMesh的setMatrixAt();

InstancedMesh作为一个多模型的Object3D, 它的setMatrixAt()方法接受内部一个模型的index,
和一个代表该模型位置信息的Matrix4矩阵.

如果刨除例webgl_instancing_raycast中对矩阵的循环设置
改为手动对每个多面体设置变换矩阵, 那么:
`

const geometry = new THREE.IcosahedronGeometry(0.5, 3);
const material = new THREE.MeshPhongMaterial({ color: 0xffffff })
const mesh0 = new THREE.InstancedMesh(geometry, material, 1);
const mesh1 = new THREE.InstancedMesh(geometry, material, 1);
const mesh2 = new THREE.InstancedMesh(geometry, material, 1);
const mesh3 = new THREE.InstancedMesh(geometry, material, 1);
const mesh4 = new THREE.InstancedMesh(geometry, material, 1);
const mesh5 = new THREE.InstancedMesh(geometry, material, 1);
const mesh6 = new THREE.InstancedMesh(geometry, material, 1);

// 先做一堆InstancedMesh, 每组一个模型, 然后给一个变换矩阵
// 看看矩阵对模型的位置影响

const matrix0 = new THREE.Matrix4();
matrix0.setPosition(0, 0, 0);
console.log(`matrix0: `, matrix0);

const matrix1 = new THREE.Matrix4();
matrix1.setPosition(1, 0, 0);
console.log(`matrix1: `, matrix1);

const matrix2 = new THREE.Matrix4();
matrix2.setPosition(0, 1, 0);
console.log(`matrix2: `, matrix2);

const matrix3 = new THREE.Matrix4();
matrix3.setPosition(0, 0, 1);
console.log(`matrix3: `, matrix3);

const matrix4 = new THREE.Matrix4();
matrix4.setPosition(2, 0, 0);
console.log(`matrix4: `, matrix4);

const matrix5 = new THREE.Matrix4();
matrix5.setPosition(0, 2, 0);
console.log(`matrix5: `, matrix5);

const matrix6 = new THREE.Matrix4();
matrix6.setPosition(0, 0, 2);
console.log(`matrix6: `, matrix6);

mesh0.setMatrixAt(0, matrix0);
mesh1.setMatrixAt(0, matrix1);
mesh2.setMatrixAt(0, matrix2);
mesh3.setMatrixAt(0, matrix3);
mesh4.setMatrixAt(0, matrix4);
mesh5.setMatrixAt(0, matrix5);
mesh6.setMatrixAt(0, matrix6);

scene.add(
    mesh0,
    mesh1,
    mesh2,
    mesh3,
    mesh4,
    mesh5,
    mesh6
);

const part2 = `
输出可得如下矩阵:
matrix0: [ // (0, 0, 0)
    1, 0, 0, 0,
    0, 1, 1, 0,
    0, 0, 0, 0,
    0, 0, 0, 1
]

matrix1: [ // (1, 0, 0)
    1, 0, 0, 1,
    0, 1, 1, 0,
    0, 0, 0, 0,
    0, 0, 0, 1
]

matrix2: [ // (0, 1, 0)
    1, 0, 0, 0,
    0, 1, 1, 1,
    0, 0, 0, 0,
    0, 0, 0, 1
]

matrix3: [ // (0, 0, 1)
    1, 0, 0, 0,
    0, 1, 1, 0,
    0, 0, 0, 1,
    0, 0, 0, 1
]

matrix4: [ // (2, 0, 0)
    1, 0, 0, 2,
    0, 1, 1, 0,
    0, 0, 0, 0,
    0, 0, 0, 1
]

matrix5: [ // (0, 2, 0)
    1, 0, 0, 0,
    0, 1, 1, 2,
    0, 0, 0, 0,
    0, 0, 0, 1
]

matrix6: [ // (0, 0, 2)
    1, 0, 0, 0,
    0, 1, 1, 0,
    0, 0, 0, 2,
    0, 0, 0, 1
]

可见如官方文档对Matrix4.setPosition()的阐述, 传入的Vector3向量仅仅改变该矩阵的位置分量,即
[
  a, b, c, 受改变x,
  e, f, g, 受改变y,
  i, j, k, 受改变z,
  m, n, o, p
]

如果将其位置据上改变后反映在坐标系就是一个THREE Axes, 坐标系中心有一个直径1的球体, 每条轴各两个相邻的直径1球体
`