import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water2.js";

export class Ocean2 {
    constructor(length, width, density, color) {
        this.length = length;
        this.width = width;
        this.density = density;
        this.color = color;
        this.mesh = null;

        const oceanGeometry = new THREE.PlaneGeometry(width, length);
        this.mesh = new Water(oceanGeometry, {
            textureWidth: this.density, // 浑浊程度(密度)
            textureHeight: this.density, // 浑浊程度(密度)
            flowDirection: new THREE.Vector2(1, 1),
            color: this.color
        });
        this.mesh.rotation.x = Math.PI * -0.5;
        this.mesh.position.y = 0;
        this.mesh.renderOrder = -1;


        this.mesh.material.fragmentShader =
            this.mesh.material.fragmentShader.replace(
                "gl_FragColor = vec4( color, 1.0 ) * mix( refractColor, reflectColor, reflectance );",
                `gl_FragColor = vec4( color, 1.0 ) * mix( refractColor, reflectColor, reflectance );
                gl_FragColor = mix( gl_FragColor, vec4( 0.05, 0.3, 0.7, 1.0 ), vToEye.z*0.0005+0.5 );`
            );
    }

    setFlowTexture(flowTexturePath) {
        const loader = new THREE.TextureLoader();
        this.mesh.waterNormals = loader.load(flowTexturePath, (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        })
    }
    
    setColor(color) {
        this.mesh.color = color;
    }

    setSize(length, width) { // 性能不好
        const oceanGeometry = new THREE.PlaneGeometry(width, length);
        this.mesh = new Water(oceanGeometry, {
            textureWidth: this.density, // 浑浊程度(密度)
            textureHeight: this.density, // 浑浊程度(密度)
            waterNormals: this.flowTexture,
            waterColor: this.color
        });
        this.mesh.rotation.x = Math.PI * -0.5;
    }

    setDensity(density) {
        if (!this.waterTexture()) {
            console.warn('体现密度需要水纹贴图');
            return;
        }
        this.mesh.textureWidth = textureHeight = density;
    }

    waterTexture() {
        if (this.flowTexture) {
            return true;
        }
        return false;
    }

    setDensity(density) {
        this.mesh.textureWidth = textureHeight = density;
    }
}
