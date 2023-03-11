three.js physicallyCorrectLights
physicallyCorrectLights 是 three.js 中的一个属性, 用于启用物理正确的灯光计算。启用该属性后, three.js 将使用物理单位来计算灯光的强度和距离衰减, 以达到更加真实的渲染效果。

使用 physicallyCorrectLights 需要先将场景的 renderer.physicallyCorrectLights 属性设置为 true, 然后对于每个光源（例如点光源、聚光灯、方向光等）, 设置它的 intensity 和 distance 属性, 就可以启用物理正确的灯光计算了。

例如, 以下代码片段创建一个物理正确的点光源, 并将它添加到场景中：

javascript
Copy code
// 启用物理正确的灯光计算
renderer.physicallyCorrectLights = true;

// 创建点光源
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 2, 2);

// 设置灯光的距离衰减
light.distance = 50;

// 将灯光添加到场景中
scene.add(light);
在这个例子中, 我们将灯光的 intensity 设置为 1, 表示灯光的强度为标准强度, 灯光的距离衰减设置为 50, 表示灯光在距离超过 50 个单位时会完全消失。

启用物理正确的灯光计算可以让渲染的效果更加真实, 但是也会增加渲染的计算量和时间。因此, 如果你的场景中只有少量的灯光, 并且渲染性能已经足够好, 可以考虑启用该功能。