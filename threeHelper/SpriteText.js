import * as THREE from "three";

export class SpriteText {
    constructor(
        text = "helloworld",
        position = new THREE.Vector3(0, 0, 0)
    ) {
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;
        const context = canvas.getContext("2d");
        this.context = context;
        context.fillStyle = "rgba(90, 90, 90, 0.7)";
        context.fillRect(0, 256, 1024, 512);
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "bold 200px Arial";
        context.fillStyle = "rgba(255, 255, 255, 1)";
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        let texture = new THREE.CanvasTexture(canvas);

        const material = new THREE.SpriteMaterial({
            map: texture,
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true
        });
        this.mesh = new THREE.Sprite(material);
        this.mesh.scale.set(1, 1, 1);
        this.mesh.position.copy(position);
    }
}
