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
