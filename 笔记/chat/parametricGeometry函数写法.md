传入ParametricGeometry内的函数必定要包含u和v两个参数(参三可选), u和v将参与确立向量在THREE坐标系中的坐标.

u和v的值都必须介于0与1之间.

以基础平面为例: 

```javascript
const plane = function (width, height) {
    return function (u, v, target) {
        const result = target || new THREE.Vector3();
        const x = u * width;
        const y = 0;
        const z = v + height;
        return result.set(x, y, z);
    };
}

const radialWaveGeometry = new ParametricGeometry(plane, 10, 10);
```

