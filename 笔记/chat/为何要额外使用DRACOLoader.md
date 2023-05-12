`THREE.GLTFLoader()`是Three.js中用于加载gltf格式三维模型的模型加载器. gltf是一种高效的三维模型格式, 具有广泛的支持, 包括动画、材质和场景等元素.

由于三维模型通常具有大量的数据, 因此加载大型gltf文件可能会很慢, 导致应用程序响应缓慢和用户体验差.

`THREE.DRACOLoader()`是一个可选的压缩加载器, 可将gltf文件中的数据进行压缩, 从而减少文件大小, 提高加载速度, 减少网络带宽消耗.
DRACO 压缩是一种专门针对三维模型数据的高效压缩算法, 它使用了一些先进的压缩技术.包括点云压缩、几何压缩和属性压缩等, 可以将三维模型文件的大小减少高达90%.

因此, 如果你需要加载大型gltf文件, 或者你的应用程序需要加载大量的三维模型, 使用`THREE.DRACOLoader()`可以显著提高加载速度和用户体验.
使用`THREE.DRACOLoader()`将压缩后的模型文件传递给`THREE.GLTFLoader()`, 让其加载压缩后的gltf文件, 这样就可以在减小文件大小的同时保持模型质量和性能.

```javascript
new GLTFLoader().setPath('../models/gltf/')
.setDRACOLoader(new DRACOLoader().setDecoderPath('../jsm/libs/draco/gltf/'))
.load('IridescentDishWithOlives.glb', function (gltf) {
    mixer = new THREE.AnimationMixer(gltf.scene);
    mixer.clipAction(gltf.animations[0]).play();
    scene.add(gltf.scene);
})
```