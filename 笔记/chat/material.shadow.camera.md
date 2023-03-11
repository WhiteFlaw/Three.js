spotLight.shadow.camera
在 three.js 中, SpotLight 类代表一个聚光灯, 可以通过它来创建一个具有聚光效果的光源。聚光灯通常用于模拟手电筒或者舞台灯光等效果。

SpotLight 类有一个名为 shadow 的属性, 它是一个 SpotLightShadow 对象, 用于表示聚光灯产生的阴影。SpotLightShadow 对象有一个 camera 属性, 它是一个 PerspectiveCamera 对象, 用于设置聚光灯的投影相机。

spotLight.shadow.camera 属性是一个 PerspectiveCamera 对象, 它代表了聚光灯投影相机的属性。你可以通过设置这个对象的属性来控制聚光灯的投影效果, 例如投影的视野范围、投影的近截面和远截面等。

下面是一些常用的 spotLight.shadow.camera 属性：

fov：聚光灯的视野范围, 默认为 50。
near：聚光灯的近截面, 默认为 0.5。
far：聚光灯的远截面, 默认为 500。
aspect：聚光灯的宽高比, 默认为 1。
你可以通过设置这些属性来控制聚光灯的投影效果, 例如：

javascript
Copy code
const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 10, 0);
spotLight.shadow.camera.fov = 60;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 100;
spotLight.shadow.camera.aspect = window.innerWidth / window.innerHeight;
在上面的代码中, 我们创建了一个白色的聚光灯, 并将其位置设置为 (0, 10, 0)。然后, 我们设置了聚光灯的投影相机的视野范围为 60, 近截面为 1, 远截面为 100, 宽高比为屏幕宽高比。这样就可以根据需要来调整聚光灯的投影效果。