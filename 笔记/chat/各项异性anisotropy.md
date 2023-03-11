在three.js中, 当材质使用纹理时, 可以通过设置材质的`anisotropy`属性来提高纹理的质量. 
`anisotropy`属性控制纹理采样时的各向异性过滤程度, 从而在不同角度和距离上提高纹理的清晰度和细节. 

默认情况下, `three.js`的`Texture`类的`anisotropy`属性值为 1, 表示禁用各向异性过滤. 要启用各向异性过滤, 可以将 anisotropy 属性值设置为大于 1 的值, 例如：

```javascript
const texture = new THREE.TextureLoader().load('texture.jpg');
texture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // 返回一个大于1的值作为anisotropy属性值
```

其中, `getMaxAnisotropy()`方法可以获取当前WebGL渲染器支持的最大各向异性过滤程度, 可以将其作为纹理的`anisotropy`属性值, 从而获得最佳的纹理质量和效果. 

需要注意的是, 启用各向异性过滤会增加 GPU 的负载, 因此在使用时需要权衡性能和质量. 可以根据实际需要调整各向异性过滤程度, 以获得最佳的性能和效果. 