`THREE.AnimationMixer()`是Three.js中用于控制动画播放的类.它接受一个包含动画数据的`THREE.Object3D`对象, 并可以在运行时控制该对象的动画.

通过`THREE.AnimationMixer()`, 我们可以使用`clipAction()`方法来创建一个动画操作, 这个操作包含一个指向`THREE.AnimationClip`对象的引用, 同时还包含了该动画的播放状态和速度.我们可以通过调用`play()`方法来启动动画, 也可以使用`stop()`方法停止它, 还可以通过`paused`属性暂停或恢复它.

`THREE.AnimationMixer()`还提供了一些其他有用的方法, 例如`update()`方法, 该方法用于在每个渲染循环中更新动画, 并且可以通过`setTime()`方法来设置动画的时间.

总之, `THREE.AnimationMixer()`可以让我们轻松地控制Three.js中的动画, 包括播放、暂停、停止、修改播放速度、循环等.

```javascript
mixer = new THREE.AnimationMixer(gltf.scene);
mixer.clipAction(gltf.animations[0]).play();
```