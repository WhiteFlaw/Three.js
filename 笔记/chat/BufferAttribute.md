这个类专为BufferGeometry服务;

用于存储BufferGeometry有关的属性(例如顶点位置向量, 面片索引, 法向量, 颜色值, UV坐标以及任何自定义属性).

利用BufferAttribute，可以更高效的向GPU传递数据(把GPU计算后的数据存放在缓冲区后进行展示，后续修改时，可以减少GPU的计算，进而提升性能).

```javascript
BufferAttribute( array : TypedArray, itemSize : Integer, normalized : Boolean )
```

itemSize: 队列中与顶点相关的数据值的次元, 如果attribute存储的是空间坐标系, 则itemSize的值应该是3, 实际上是告知如何解析数组元素(几个为一组).

除参数外, 该API还有一堆属性可选, 见文档.