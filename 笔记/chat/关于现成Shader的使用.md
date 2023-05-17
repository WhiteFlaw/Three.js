shader在
```html
<script id="fragment-shader-5" type="x-shader/x-fragment">
    glsl
</script>
```
中书写, script标签内的glsl着色器需要使用innerHTML获取以作为参数:
```javascript
const vertShader = document.getElementById(vertexShader).innerHTML;
const fragShader = document.getElementById(fragmentShader).innerHTML;
```

合成材质:
```javascript
const attributes = {};

const uniforms = {
    time: { type: 'f', value: 0.2 },
    scale: { type: 'f', value: 0.2 },
    alpha: { type: 'f', value: 0.6 },
    resolution: { type: "v2", value: new THREE.Vector2() }
};
uniforms.resolution.value.x = window.innerWidth;
uniforms.resolution.value.y = window.innerHeight;

const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    attributes: attributes,
    vertexShader: vertShader,
    fragmentShader: fragShader,
    transparent: true
});
```

uniforms: 通过该属性向着色器传递信息, 该信息将传递到每个顶点和片段, 以改变传入顶点的x, y, z坐标.

attributes: 该属性可以修改每一个顶点和片段, 通常用来传递位置数据和与法向量相关的数据, 使用这个属性需要为几何体中的每一个顶点提供信息, 上方例未使用attributes参数.

fragmentShader: 该着色器定义传入的每个像素的颜色, 字符串类型, glsl像素着色器的代码.

vertexShader: 该着色器允许修改每一个传入的顶点的位置, 字符串类型, glsl顶点着色器的字符串值.