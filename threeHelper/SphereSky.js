import * as THREE from 'three';

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

}