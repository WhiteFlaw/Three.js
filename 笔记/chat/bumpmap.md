在three.js中, 可以使用`bumpMap`属性为材质添加凹凸贴图。凹凸贴图通常用于在表面上创建凹凸不平的细节, 例如皮肤、石头等。凹凸贴图是一张灰度图像, 其中黑色表示表面的凹陷部分, 白色表示凸起的部分, 灰色则表示过渡区域.

要为材质添加凹凸贴图, 首先需要将贴图加载为`THREE.Texture`对象, 然后将其赋值给材质的`bumpMap`属性。例如:

```javascript
const textureLoader = new THREE.TextureLoader();
const bumpMap = textureLoader.load('bumpmap.jpg');

const material = new THREE.MeshPhongMaterial({
  map: diffuseMap,
  bumpMap: bumpMap,  // 添加凹凸贴图
  bumpScale: 0.2     // 控制凹凸程度的参数
});
```

在上面的代码中, 我们首先使用`TextureLoader`加载了一张凹凸贴图bumpmap.jpg, 然后将其赋值给材质的`bumpMap`属性。注意, 我们还通过 `bumpScale`参数控制了凹凸程度的强度。

需要注意的是, 凹凸贴图只能影响表面的几何形状, 而不能改变光线的反射和折射, 因此在实现真实感渲染时, 需要使用其他技术来模拟光的交互, 例如法线贴图、高光贴图等.