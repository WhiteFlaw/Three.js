/* 
 * @description 将纯色贴图传入该函数处理, 返回方格花纹贴图
 * @param {Array} texture
 * @returns {Array} 方格花纹贴图
 */
function pixelTexture(texture) {
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/* 
 * @description 将Shader转换为贴图
 * @param vertexShader, fragmentShader
 * @returns Material
 */
function createMaterial(vertexShader, fragmentShader) {
  const vertShader = document.getElementById(vertexShader).innerHTML;
  const fragShader = document.getElementById(fragmentShader).innerHTML;

  const attributes = {};
  const uniforms = {
      time: { type: 'f', value: 0.2 },
      scale: { type: 'f', value: 0.2 },
      alpha: { type: 'f', value: 0.6 },
      resolution: { type: "v2", value: new THREE.Vector2() }
  };

  uniforms.resolution.value.x = window.innerWidth;
  uniforms.resolution.value.y = window.innerHeight;

  const meshMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      attributes: attributes,
      vertexShader: vertShader,
      fragmentShader: fragShader,
      transparent: true
  });

  return meshMaterial;
}

/* 
 * @description 返回一个随机矩阵
 * @param 随便一个Matrix4
 * @returns Matrix4
 */
function randomizeMatrix(matrix) {

  const position = new THREE.Vector3();
  const rotation = new THREE.Euler();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();


  position.x = Math.random() * 40 - 20;
  position.y = Math.random() * 40 - 20;
  position.z = Math.random() * 40 - 20;

  rotation.x = Math.random() * 2 * Math.PI;
  rotation.y = Math.random() * 2 * Math.PI;
  rotation.z = Math.random() * 2 * Math.PI;

  quaternion.setFromEuler(rotation);

  scale.x = scale.y = scale.z = Math.random() * 1;

  matrix.compose(position, quaternion, scale);

  return matrix;

};