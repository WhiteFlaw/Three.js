作为在r126版本淘汰的Geometry和Face3的替代者.

```javascript
const geometry = new THREE.BufferGeometry();

const vertices = new Float32Array([
	-1.0, -1.0,  1.0,
	 1.0, -1.0,  1.0,
	 1.0,  1.0,  1.0,

	 1.0,  1.0,  1.0,
	-1.0,  1.0,  1.0,
	-1.0, -1.0,  1.0
]);

geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ));
```
BufferAttribute类专为BufferGeometry服务, 见笔记BufferAttribute;

值得提到的是如果点的顺序从头到尾顺序是顺时针, 那么该面会面向摄像机, 如果逆时针那么会背对摄像机.
在没有启用双面渲染的情况下从背面观察会看不到该物体.
