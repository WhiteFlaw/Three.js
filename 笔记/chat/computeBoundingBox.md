```javascript
.computeBoundingSphere () : undefined
```
BufferGoemetry方法.

计算当前几何体的的边界球形，该操作会更新已有 [param:.boundingSphere].
边界球形不会默认计算，需要调用该接口指定计算边界球形，否则保持默认值 null.

对于拥有骨骼蒙皮的对象, 体积测算会过大, 需要调用BufferGeometry方法.computeBoundingBox()计算边界矩形, 如:
```javascript
mesh.geometry.computeBoundingBox();
dinosaurBox3.union(mesh.geometry.boundingBox!);
```
边界矩形和Box3不是一个概念, 但都是测算体积的东西, 调用该方法后goemetry会增加boundingBox属性存储自己的边界矩形.

但这与Box3并无关系, 为了纠正错误的Box3, 需要`union()`取 错误Box3 与 正确边界矩形 的并集.

union是Box3方法, 在 参数上边界 和 调用者上边界 之间取较大者, 下边界取较小者, 以获得一个新的包围盒Box3.
两步至此正确的Box3会生成在具备骨骼蒙皮的物体上.
