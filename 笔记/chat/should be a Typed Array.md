报错:
```
THREE.BuffeAttribute: Array should be a Typed Array.
```
THREE.BuffeAttribute的参一vertices必须是类型化数组.

如果vertice初始声明为非类型化数组并使用push方法填充数据:
```javascript
const vertices = [];
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
```

如果初始就声明为类型化数组:
```javascript
const vertices = new Float32Array([ // 顶点
    5.0, 5.0, 5.0,
    -5.0, 5.0, 5.0,
    -5.0, -5.0, 5.0
])
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
```