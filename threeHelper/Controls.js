import { FlyControls } from "three/examples/jsm/controls/FlyControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";

export class Controls {
    constructor(camera, renderer) {
        this.controls = null;
        this.camera = camera;
        this.renderer = renderer;

        this.controlsMap = new Map();
        this.setOrbitControl('default');
        this.activeControl('default');
    }

    setOrbitControl(name) {
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        // 控制器阻尼
        controls.enableDamping = true;
        // 自动旋转
        // controls.autoRotate = true;

        controls.maxPolarAngle = Math.PI / 2;
        controls.minPolarAngle = 0;
        this.controlsMap.set(name, controls);
        return controls;
    }

    setFlyControl(name) {
        const controls = new FlyControls(this.camera, this.renderer.domElement);
        controls.movementSpeed = 100;
        controls.rollSpeed = Math.PI / 60;
        this.controlsMap.set(name, controls);
        return controls;
    }

    setFirstPersonControl(name) {
        const controls = new FirstPersonControls(this.camera, this.renderer.domElement);
        controls.movementSpeed = 100;
        controls.rollSpeed = Math.PI / 60;
        this.controlsMap.set(name, controls);
        return controls;
    }

    activeControl(name) {
        this.controls = this.controlsMap.get(name);
        return this.controls;
    }
}
