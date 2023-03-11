`THREE.ImageLoader()`是three.js中用于加载图像的类之一, 可以用于加载多种类型的图像文件, 例如PNG、JPEG、GIF、BMP等格式的图像文件。
使用THREE.ImageLoader可以方便地加载图像文件并将其用作纹理贴图或其他场景元素的材质。

加载是异步的, 所以无法保证在回调函数外的对贴图操作绝对是在贴图加载完毕后进行.

`ImageLoader`会返回`HTMLImageElement`, 可以被`THREE.CanvasTexture()`转化为贴图.