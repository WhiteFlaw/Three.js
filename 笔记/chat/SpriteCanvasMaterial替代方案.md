```javascript
function createImageTexture() { // Canvas贴图直接用图片做
    const img = document.createElement('img');
    img.src = '../assets/textures/construction.jpg';

    const texture = new THREE.CanvasTexture(img);
    return texture;
}
```

```javascript
function createSprites() { // SpriteCanvasMaterial已经废弃, 目前考虑使用CanvasTexture生成贴图贴到SpriteMaterial
    const texture = createImageTexture();
    const material = new THREE.SpriteMaterial({ map: texture, color: 0xffffff });

    const range = 500;
    for (let i = 0; i < 1500; i++) {
        const sprite = new THREE.Sprite(material);
        sprite.position.set(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2);
        sprite.scale.set(0.8, 0.8, 0.8);
        scene.add(sprite);
    }
}
```

```
https://blog.csdn.net/qq_52697994/article/details/130754676?csdn_share_tail=%7B%22type%22%3A%22blog%22%2C%22rType%22%3A%22article%22%2C%22rId%22%3A%22130754676%22%2C%22source%22%3A%22qq_52697994%22%7D
```