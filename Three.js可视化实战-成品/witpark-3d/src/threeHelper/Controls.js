import { FlyControls } from "three/examples/jsm/controls/FlyControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";

export class Controls {
    constructor(camera, renderer) {
        this.controls = null;
        this.camera = camera;
        this.renderer = renderer;
        this.setOrbitControls();
    }
    setOrbitControls() {
        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );
        // 控制器阻尼
        this.controls.enableDamping = true;
        // 自动旋转
        // controls.autoRotate = true;

        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.minPolarAngle = 0;
    }
    setFlyControls() {
        this.controls = new FlyControls(
            this.camera,
            this.renderer.domElement
        );
        this.controls.movementSpeed = 100;
        this.controls.rollSpeed = Math.PI / 60;
    }
    setFirstPersonControls() {
        this.controls = new FirstPersonControls(
            this.camera,
            this.renderer.domElement
        );
        this.controls.movementSpeed = 100;
        this.controls.rollSpeed = Math.PI / 60;
    }
}
