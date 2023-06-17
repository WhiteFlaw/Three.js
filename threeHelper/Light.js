import * as THREE from 'three';

export class Light {
    constructor() {
        this.max = -1;
        this.lights = new Map();
    }

    create(type, color, intensity, name) {
        this.max++;
        switch (type, name = `${type}${max}`) {
            case 'ambient':
                createAmbientLight(color, intensity, name);
                break;
            case 'directional':
                createDirectionalLight(color, intensity, name);
                break;
            case 'spot':
                createSpotLight(color, intensity, name);
                break;
            case 'points':
                createPointLight(color, intensity, name);
                break;
        }
        return this.light.get(name);
    }

    get(name) {
        return this.lights.get(name);
    }

    check() { // 检视
        return this.lights.keys();
    }

    createAmbientLight(color, intensity, name) { // 加name还是得在这， 万一他直接调这几个方法就没名字了
        const ambientLight = new Ambient(color, intensity);
        ambientLight.name = name;
        this.lights.set(name, ambientLight);
    }

    createDirectionalLight(color, intensity, name) {
        const directional = new Directional(color, intensity);
        directional.name = name;
        this.lights.set(name, directional);
    }

    createSpotLight(color, intensity, name) {
        const spot = new Spot(color, intensity);
        spot.name = name;
        this.lights.set(name, spot);
    }

    createPointLight(color, intensity, name) {
        const point = new Points(color, intensity);
        point.name = name;
        this.lights.set(name, point);
    }

}

// 以下不导出防止Light管理不到
class Ambient {
    constructor(color, intensity) {
        this.color = color;
        this.intensity = intensity;
        this.light = null;
        init();
    }

    init() {
        this.light = new THREE.AmbientLight(this.color, this.intensity);
    }

    setColor(color) {
        this.light.color = color;
    }

    setIntensity(intensity) {
        this.light.intensity = intensity;
    }

    isAmbient() {
        if (this.light.isAmbientLight) {
            return true;
        }
        return false;
    }
}

class Directional {
    constructor(color, intensity) {
        this.color = color;
        this.intensity = intensity;
        this.light = null;
        init();
    }

    init() {
        this.light = new THREE.AmbientLight(this.color, this.intensity);
        this.light.castShadow = true;
    }

    rePos(x, y, z) { // 重定位
        this.light.position.set(x, y, z);
    }

    setdecay(decay) { // 衰减速度
        this.light.decay = decay;
    }

    setColor(color) { // 颜色
        this.light.color = color;
    }

    setIntensity(intensity) {
        this.light.intensity = intensity;
    }

    lookAt(target) {
        this.light.target = target;
    }

    help() {
        console.warn('.add(directionHelper)');
        const directionHelper = new THREE.CameraHelper(this.light.shadow.camera);
        return directionHelper;
    }

    limitShdow(width, height) {
        width && (this.light.shadow.mapSize.width = width);
        height && (this.light.shadow.mapSize.width = height);
    }
    
    setRadius(radius) {
        this.light.shadow.radius = radius;
    }

    setCameraLength(near, far) {
        this.light.shadow.camera.far = far;
        this.light.shadow.camera.near = near;
    }

    setCameraArea(top, bottom, left, right) {
        this.light.shadow.camera.top = top;
        this.light.shadow.camera.bottom = bottom;
        this.light.shadow.camera.left = left;
        this.light.shadow.camera.right = right;
    }

    isDirectional() {
        if (this.light.isDirectionalLight) {
            return true;
        }
        return false;
    }
}

class Spot {
    constructor(color, intensity) {
        this.color = color;
        this.intensity = intensity;
        this.light = null;
        init();
    }

    init() {
        this.light = new THREE.AmbientLight(this.color, this.intensity);
        this.light.castShadow = true;
    }

    rePos(x, y, z) { // 重定位
        this.light.position.set(x, y, z);
    }

    setdecay(decay) { // 衰减速度
        this.light.decay = decay;
    }

    setColor(color) { // 颜色
        this.light.color = color;
    }

    setIntensity(intensity) { // 强度
        this.light.intensity = intensity;
    }

    setRadius(radius) {
        this.light.shadow.radius = radius;
    }

    lookAt(target) {
        this.light.target = target;
    }

    help() {
        console.warn('.add(spotHelper)');
        const spotHelper = new THREE.CameraHelper(this.light.shadow.camera);
        return spotHelper;
    }

    setCameraLength(near, far) { // 极近 极远
        this.light.shadow.camera.far = far;
        this.light.shadow.camera.near = near;
    }

    setCameraFov(fov) { // 可视区上下边角度&左右边角度
        this.light.shadow.camera.fov = fov;
    }

    limitShdow(width, height) {
        width && (this.light.shadow.mapSize.width = width);
        height && (this.light.shadow.mapSize.width = height);
    }

    setPenumbra(penumbra) { // 光暗边缘模糊度
        this.light.penumbra = penumbra;
    }

    setPower(power) { // 功率, 会影响Intensity
        this.light.power = power;
    }

    isSpot() {
        if (this.light.isSpotLight) {
            return true;
        }
        return false;
    }
}

class Points {
    constructor(color, intensity) {
        this.color = color;
        this.intensity = intensity;
        this.light = null;
        init();
    }

    init() {
        this.light = new THREE.AmbientLight(this.color, this.intensity);
        this.light.castShadow = true;
    }

    rePos(x, y, z) { // 重定位
        this.light.position.set(x, y, z);
    }

    setdecay(decay) { // 衰减速度
        this.light.decay = decay;
    }

    setColor(color) { // 颜色
        this.light.color = color;
    }

    setIntensity(intensity) { // 强度
        this.light.intensity = intensity;
    }

    setRadius(radius) {
        this.light.shadow.radius = radius;
    }

    limitShdow(width, height) {
        width && (this.light.shadow.mapSize.width = width);
        height && (this.light.shadow.mapSize.width = height);
    }

    setPower(power) { // 功率, 会影响Intensity
        this.light.power = power;
    }

    help() {
        console.warn('.add(PointHelper)');
        const PointHelper = new THREE.CameraHelper(this.light.shadow.camera);
        return PointHelper;
    }

    setDistance(distance) { // 到指定距离彻底衰减
        this.light.distance = distance;
    }

    setCameraLength(near, far) { // 极近 极远
        this.light.shadow.camera.far = far;
        this.light.shadow.camera.near = near;
    }

    setCameraFov(fov) { // 可视区上下边角度&左右边角度
        this.light.shadow.camera.fov = fov;
    }
}