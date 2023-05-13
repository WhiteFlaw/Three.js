场景雾气效果有两种, 分别为线性变化雾气和指数变化雾气.

随着距离线性加浓的雾气.
```javascript
scene.fog = new THREE.Fog(0xffffff, 0.15, 100); // 颜色 极近端 极远端
```

随着距离指数级加浓的雾气.
```javascript
scene.fog = new THREE.FogExp2(0xffffff, 0.02); // 颜色 浓度
```