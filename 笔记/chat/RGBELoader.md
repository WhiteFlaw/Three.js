`three.js RGBELoader`
three.js里RGBELoader可用于加载和解析hdr格式的文件.

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

上例中创建了一个RGBELoader并用load方法加载了一个hdr文件, 加载成功时回调函数取到贴图作为参数, 我们用这个贴图创建基础材质并应用于球体.

如果发生错误就回调并伴随错误信息作为参数