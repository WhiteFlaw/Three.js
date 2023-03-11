`THREE.ImageBitmapLoader()`是一个用于加载图像位图数据的Three.js加载器. 它可以加载各种类型的图像, 包括PNG、JPEG、GIF、BMP等等, 
并将图像数据转换为`ImageBitmap`对象, 这是一种可以高效绘制到HTML5 Canvas上的二进制图像格式.

虽然不像`ImageLoader()`直接返回DOM , 但是返回便于绘制到DOM的数据结构, 所以`THREE.CanvasTexture()`也可以将其返回物转换为贴图.

`ImageBitmap`对象是一种相对新的Web API, 不是所有的浏览器都支持. 在使用`THREE.ImageBitmapLoader()`时, 需要检查当前浏览器是否支持该API, 并根据需要提供回退方案. 可以使用以下代码检查浏览器是否支持`ImageBitmap`:

```javascript
if (window.createImageBitmap) {
    // 浏览器支持ImageBitmap
} else {
    // 浏览器不支持ImageBitmap
}
```