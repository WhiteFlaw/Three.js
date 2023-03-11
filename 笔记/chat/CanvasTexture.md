`THREE.CanvasTexture()`是Three.js中的一个纹理类型, 用于将`Canvas`元素中的图像作为纹理贴图应用到3D场景中. 

`THREE.CanvasTexture()`也可以基于`HTMLImageElement`元素创建纹理贴图, 在创建`CanvasTexture`对象时, 如果传入的参数是一个`HTMLImageElement`元素, 
则`CanvasTexture`对象会在内部创建一个新的`Canvas`元素, 并将`HTMLImageElement`元素的内容绘制到该元素上, 然后将该元素作为纹理贴图应用到场景中. 

`THREE.CanvasTexture`可以基于`ImageLoader`返回的`HTMLImageElement`元素创建贴图.

既然基于DOM创建, 为何也接受`ImageBitmapLoader`产出的`ImageBitmap`格式:
`THREE.CanvasTexture`可以基于`ImageBitmapLoader`返回的`ImageBitmap`对象创建贴图, 是因为`CanvasTexture`对象的构造函数中接受一个参数`canvas`. 
该参数可以是一个`HTMLCanvasElement`元素或者是一个`HTMLImageElement`元素. 当传入的是`ImageBitmap`对象时, `CanvasTexture`对象会在内部创建一个新的Canvas元素, 
并将`ImageBitmap`对象的内容绘制到该元素上, 然后将该元素作为纹理贴图应用到场景中.