three.js RGBELoader
The RGBE file format is used for High Dynamic Range (HDR) images. In Three.js, the RGBELoader is a loader that can be used to load and parse .hdr files.
three.js里RGBELoader可用于加载和解析hdr格式的文件.

To use the RGBELoader, you'll need to include it in your project and then call its load method with the path to the .hdr file you want to load, as well as a callback function to handle the loaded data. Here's an example:
使用时调用loader的load方法传入指向目标hdr文件的路径, 也要传入不同阶段与情况下的回调函数, 下面是个例子:

```javascript
import { RGBELoader } from 'three';

const loader = new RGBELoader();

loader.load(
  'path/to/my/hdr/file.hdr',
  (texture) => {
    // Texture loaded successfully!
    // Use the texture in your scene, e.g.:
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.SphereGeometry(1, 32, 32);
    const mesh = new THREE.Mesh(sphere, material);
    scene.add(mesh);
  },
  undefined,
  (error) => {
    // Error occurred while loading the texture.
    console.error(error);
  }
);
```
In the example above, we create a new RGBELoader and use its load method to load an .hdr file. When the file is loaded successfully, the callback function is called with the loaded texture as a parameter. We then use the texture to create a MeshBasicMaterial and apply it to a sphere geometry, which we add to the scene.
上例中创建了一个EGBELoader并用它的load方法加载了一个hdr文件, 加载成功时回调函数取到贴图作为参数, 我们用这个贴图创建基础材质并应用于球体.

If an error occurs while loading the texture, the error callback is called with an error object as a parameter.
如果发生错误就回调并伴随错误信息作为参数