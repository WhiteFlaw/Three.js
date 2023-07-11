import * as THREE from 'three';
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";

import { SSRPass } from "three/addons/postprocessing/SSRPass.js";
import { SMAAPass } from "three/addons/postprocessing/SMAAPass.js";
import { FilmPass } from "three/addons/postprocessing/FilmPass.js";
import { GlitchPass } from "three/addons/postprocessing/GlitchPass.js";
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { DotScreenPass } from "three/addons/postprocessing/DotScreenPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ReflectorForSSRPass } from "three/addons/objects/ReflectorForSSRPass.js";
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js';

export class Effect {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        this.effectComposer = new EffectComposer(this.renderer);
        this.effectComposer.setSize(window.innerWidth, window.innerHeight);

        const renderPass = new RenderPass(this.scene, this.camera);
        this.effectComposer.addPass(renderPass);
    }

    antialias() { // 抗锯齿
        const smaaPass = new SMAAPass(
            window.innerWidth * this.renderer.getPixelRatio(),
            window.innerHeight * this.renderer.getPixelRatio()
        );
        this.effectComposer.addPass(smaaPass);
    }

    dotScreen(center = new THREE.Vector2(0, 0), angel = 0.5, scale = 0.5) { // 粒子化
        const dotScreenPass = new DotScreenPass(center, angel, scale);
        this.effectComposer.addPass(dotScreenPass);
    }

    unrealBloom(threshold = 0.1, strength = 0.3, radius = 2) { // 物体泛光
        this.unrealBloomPass = new UnrealBloomPass();
        this.unrealBloomPass.enabled = true;
        this.unrealBloomPass.threshold = threshold; // 泛光临界强度, 越低越容易泛光
        this.unrealBloomPass.strength = strength; // 泛光强度
        this.unrealBloomPass.radius = radius; // 泛光半径
        // this.unrealBloomPass.resolution = new THREE.Vector2(0, 0); // 泛光覆盖场景大小
        this.effectComposer.addPass(this.unrealBloomPass);
    }

    pixel(intensity = 4) { // 像素风 intensity 像素化强度
        const pixelatedPass = new RenderPixelatedPass(intensity, this.scene, this.camera);
        this.effectComposer.addPass(pixelatedPass);
    }
    
    glitch(keep) { // 电磁干扰 keep布尔值 是否持续干扰
        const giltchPass = new GlitchPass(keep);
        this.effectComposer.addPass(giltchPass);
    }

    film(nIntensity = 0.8, sIntensity = 0.35, sCount = 250, grayscale = false) { // 扫描线&失真 nIntensity颗粒程度 sIntensity扫描线强度 sCount扫描线同时存在数量 grayscale是否灰度图
        const filmPass = new FilmPass(nIntensity, sIntensity, sCount, grayscale);
        this.effectComposer.addPass(filmPass);
    }

    ssr(size = new THREE.Vector2(10, 10), color = 0x888888) { // SSR屏幕空间反射
        let geometry = new THREE.PlaneGeometry(size.x, size.y);
        this.groundReflector = new ReflectorForSSRPass(geometry, {
            clipBias: 0.0003,
            textureWidth: window.innerWidth,
            textureHeight: window.innerHeight,
            color: color,
            useDepthTexture: true,
            distanceAttenuation: true
        });
        this.groundReflector.maxDistance = 1000000;
        this.groundReflector.material.depthWrite = false;
        this.groundReflector.rotation.x = -Math.PI / 2;
        this.groundReflector.visible = false;
        this.scene.add(this.groundReflector);

        const ssrPass = new SSRPass({
            renderer: this.renderer,
            scene: this.scene,
            camera: this.camera,
            width: window.innerWidth,
            height: window.innerHeight,
            morphTargets: true,
            groundReflector: this.groundReflector ? this.groundReflector : null,
            selects: this.groundReflector ? this.reflectorSelects : null
        });
        ssrPass.isFresnel = true;
        ssrPass.isBouncing = true;
        ssrPass.output = parseInt(SSRPass.OUTPUT.Default);
        ssrPass.opacity = 0.5;
        ssrPass.surfDist = 0.01;
        ssrPass.maxDistance = .2;
        ssrPass.isDistanceAttenuation = true;
        this.effectComposer.addPass(ssrPass);
        this.effectComposer.addPass(new ShaderPass(GammaCorrectionShader));
    }
}