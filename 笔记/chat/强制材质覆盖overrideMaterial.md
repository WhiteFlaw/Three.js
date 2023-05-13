Scene方法, 强制所有子对象使用指定材质.

```javascript
scene.overrideMaterial = new THREE.MeshPhongMaterial({ // 强制材质覆盖
    color: 0xffffff,
    specular: 0xffffff,
    shininess: 50
})
```