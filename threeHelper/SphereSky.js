import * as THREE from 'three';
import gsap from 'gsap';

export class SphereSky {
  constructor(radius, uTime, envMap, nightMap) {
    let geometry = new THREE.SphereGeometry(radius, 32, 32);
    let material = new THREE.MeshBasicMaterial({
      map: envMap,
      side: THREE.BackSide,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.y = Math.PI / 2;

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uTime;
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        `
        #include <common>
        uniform float uTime;
        `
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        `
          #include <dithering_fragment>
          float dayStrength = 0.0;
          if(abs(uTime - 12.0) < 4.0) {
            dayStrength = 1.0;
          }
          if(abs(uTime - 12.0) > 6.0) {
            dayStrength = 0.15;
          }
          if(abs(uTime - 12.0) >= 4.0 && abs(uTime - 12.0) <= 6.0) {
            dayStrength = 1.0 - (abs(uTime - 12.0) - 4.0) / 2.0;
            dayStrength = clamp(dayStrength, 0.15, 1.0);
          }
          gl_FragColor = mix(vec4(0.0, 0.0, 0.0, 1.0), gl_FragColor, dayStrength);
          `
        // gl_FragColor.rgb = mix(纯黑夜, 纯白天, 混合程度);
      )
    }
  }

  createSun(x, y, z, color) {
    // 创建太阳
    let sunGeometry = new THREE.SphereGeometry(100, 32, 32);
    let sunMaterial = new THREE.MeshStandardMaterial({
      color: color,
      emissive: 0xffffcc
    })
    this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
    this.sun.position.set(x, y, z);
    this.sun.visible = false;
    
    let sunLight = new THREE.DirectionalLight(color, 2);
    sunLight.shadow.camera.near = 0.1;
    sunLight.shadow.camera.far = 10000;
    sunLight.shadow.camera.left = -1000;
    sunLight.shadow.camera.right = 1000;
    sunLight.shadow.camera.top = 1000;
    sunLight.shadow.camera.bottom = 1000;
    sunLight.shadow.camera.width = 20480;
    sunLight.shadow.camera.height = 20480;
    sunLight.shadow.radius = 5;
    this.mesh.add(this.sun);
    this.sun.add(sunLight);
  }

  updateSun(time) {
    this.sun.position.z = Math.cos(((time - 6) * 2 * Math.PI) / 24) * 4000;
    this.sun.position.y = Math.sin(((time - 6) * 2 * Math.PI) / 24) * 4000;
  }
}