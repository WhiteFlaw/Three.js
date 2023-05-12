```javascript
.setFromObject ( object : Object3D ) : this
```
Box3方法, 用来计算3D对象的包围盒.

计算和世界轴对齐的一个3D对象(含其子对象)的包围盒, 计算对象和子对象的世界坐标变换. 
该方法可能会划定出一个大于实际体积的框.

可以用来做碰撞箱, 用以下语法辅助:
```javascript
new THREE.Box3Helper(需要可视化的那个Box3对象);
```

对于拥有骨骼蒙皮的对象, 体积测算会过大, 需要调用BufferGeometry方法.computeBoundingBox()计算边界矩形, 如:
```javascript
mesh.geometry.computeBoundingBox();
```
边界矩形和Box3不是一个概念, 但都是测算体积的东西, 调用该方法后goemetry会增加boundingBox属性存储自己的边界矩形.

但这与Box3并无关系, 为了纠正错误的Box3, 需要取 错误Box3 与 正确边界矩形 的并集: 
```
错误Box3.union(正确边界矩形!); 
```
union是Box3方法, 在 参数上边界 和 调用者上边界 之间取较大者, 下边界取较小者, 以获得一个新的包围盒Box3.
两步至此正确的Box3会生成在具备骨骼蒙皮的物体上.
