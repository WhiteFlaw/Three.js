
```javascript
.traverse ( callback : Function ) : undefined
```

Object3D方法.
以一个object3D对象作参数, 其在调用者以及调用者的后代中执行的回调函数.

这个回调参数可以有一个参数, 获取到当前要处理的模型.

可以用instanceof判定这是否是一个THREE.Mesh:
```javascript
scene.traverse(function(obj) {
    if(obj instanceof THREE.Mesh) {
        console.log(obj);
    }
})
```