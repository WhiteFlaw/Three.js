`基类Material
所有材质类全部继承自此类, 即所有材质类通用Material类的配置;

这也属于一种材质Material, 在文档中查找Material时该材质会与其他一众材质并列;

文档中Material的'属性'均可通过实例化Material时的参数对象来设置:
`
const material = new THREE.Material({
    xxx: xxx
})

// ----------------------------------------------
`MeshBasicMaterial`
`不受光照影响, 有没有光照效果都是相同, 自身发光但是该光不辐射.`

`alphaMap: Texture`
`透明度贴图, 这种贴图视觉效果是灰度纹理(黑白色), 将这种贴图设置给alphaMap后, 
模型表面越白的部分越不透明, 越黑越透明.`

`aoMap: Texture`
`环境遮挡贴图, 贴图的红色通道被用作环境遮挡贴图, 红色通道颜色越深的部位
对环境光反应越不明显, 看起来光被遮挡的越严重.
这个效果需要设置uv2:
${geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2))}
当需要使用多个纹理时, 可以使用 uv2 属性来定义另一个纹理坐标集. 例如, 如果你想要在一个几何体上同时使用反射和折射纹理, 
你可以将一个纹理坐标集用于反射纹理, 将另一个纹理坐标集用于折射纹理
使用 setAttribute() 方法将 uv2 属性设置为与原始 uv 属性相同的值(uv做反射, uv2做折射). 这将为几何体添加一个新的 BufferAttribute，
其中包含与 uv 属性相同数量的 2D 纹理坐标. 这些坐标可以被 MeshStandardMaterial 材质的 envMap 和 envMapIntensity 属性引用, 
以便在渲染场景时对几何体进行反射和折射.`

`aoMapIntensity: Float`
`虽然遮挡强度根据红色通道变化, 但可以总体调整遮挡程度, 弱的调节到无, 强的调节到弱还是可以的.
默认值1, 0为完全不遮挡.`

`color: Color`
`这玩意居然不是在Material基类里.`
`通常会使用THREE.Color规定其颜色, 在three中, 为了保持颜色值的一致性和可读性, 通常会使用THREE.Color类创建颜色对象`

`envMap: Texture`
`环境贴图, 这是把该模型所处环境的贴图传入, 然后会自动计算该在模型上呈现何种结果以反映环境对模型的影响`

`reflectivity: Float浮点数`
`环境贴图对模型表面的影响程度, 0 无反射, 1 完全反射`

`refractionRatio: Float`
`空气折射率IOR(约为1) / 材质折射率reflectivity的结果`

`fog: Boolean`
`这并非设置雾气效果, 而是材质是否会受到场景雾气效果影响`

`map: Texture`
`颜色贴图, 可以选择一个alpha通道, 贴图需要和材质一起加载到模型上`

`wireframe: Boolean`
`是否将几何体渲染为线框, 默认值false`

`wireframeLinecap : String`
`如果几何体仅渲染为线框, 那么线框节点的样式, 可选butt, round和square, 默认round`
