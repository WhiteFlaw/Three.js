20230312: physicallyCorrectLights在最近的一次更新中已被移除, 现在如果需要物理正确的光效, 使用
```javascript
renderer.useLegacyLights = false;
```
替代
```javascript
renderer.physicallyCorrectLights = true;
```