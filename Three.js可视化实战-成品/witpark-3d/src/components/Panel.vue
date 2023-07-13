<template>
  <div id="panel">
    <div class="header">智慧城市管理平台</div>
    <div class="main">
      <div class="left">
        <div class="cityEvent">
          <h3>
            <span>热气球控制</span>
          </h3>
          <h1 @click="toggleBalloonAction(0)">
            <img class="icon" src="../assets/bg/bar.svg" alt="" />
            <span>设置热气球以横穿园区的动画显示</span>
          </h1>
          <h1 @click="toggleBalloonAction(1)">
            <img class="icon" src="../assets/bg/bar.svg" alt="" />
            <span>设置热气球以环绕园区进行运动</span>
          </h1>

          <div class="footerBorder"></div>
        </div>

        <div class="cityEvent">
          <h3>
            <span>相机控制</span>
          </h3>
          <h1 @click="toggleCamera('default')">
            <img class="icon" src="../assets/bg/bar.svg" alt="" />
            <span>默认的相机视角</span>
          </h1>
          <h1 @click="toggleCamera('rightcamera_Orientation')">
            <img class="icon" src="../assets/bg/bar.svg" alt="" />
            <span>设置相机追随汽车导览园区</span>
          </h1>
          <h1 @click="toggleCamera('carcamera_Orientation')">
            <img class="icon" src="../assets/bg/bar.svg" alt="" />
            <span>查看汽车司机视角</span>
          </h1>

          <div class="footerBorder"></div>
        </div>
      </div>
      <div class="right">
        <div class="cityEvent list">
          <h3>
            <span>切换园区观览模式</span>
          </h3>
          <ul>
            <li @click="toggleControls('default')">
              <h1>
                <div>
                  <img class="icon" src="../assets/bg/dianli.svg" alt="" />
                  <span> 轨道观览 </span>
                </div>
              </h1>
              <p>可以锁定目标建筑和园区进行轨道式360°查看</p>
            </li>
            <li @click="toggleControls('fly')">
              <h1>
                <div>
                  <img class="icon" src="../assets/bg/dianli.svg" alt="" />
                  <span> 飞行观览 </span>
                </div>
              </h1>
              <p>可以使用飞行模式进行园区进行观览</p>
            </li>
            <li @click="toggleControls('firstPerson')">
              <h1>
                <div>
                  <img class="icon" src="../assets/bg/dianli.svg" alt="" />
                  <span> 第一人称 </span>
                </div>
              </h1>
              <p>可以使用第一人称模式进行园区进行观览</p>
            </li>
          </ul>

          <div class="footerBorder"></div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue";
import eventHub from "@/util/eventHub";

const props = defineProps([
  "dataInfo",
  "dataInfoNum",
  "iotNum",
  "eventNum",
  "testNum",
  "powerNum",
  "eventList",
]);

const currentActive = ref(null);
const imgs = {
  电力: require("@/assets/bg/dianli.svg"),
  火警: require("@/assets/bg/fire.svg"),
  治安: require("@/assets/bg/jingcha.svg"),
};

const toggleEvent = (event) => {
  eventHub.emit("eventClick", event);
};

eventHub.on("spriteClick", (i) => {
  currentActive.value = i;
});

const toggleBalloonAction = (i) => {
  eventHub.emit("toggleBalloonAction", i);
};

const toggleCamera = (name) => {
  eventHub.emit("toggleCamera", name);
};

const toggleControls = (name) => {
  eventHub.emit("toggleControls", name);
};
</script>

<style>
#panel {
  position: fixed;
  display: flex;
  left: 0;
  top: 0;
  z-index: 100;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  flex-direction: column;
}

.header {
  height: 1rem;
  width: 19.2rem;
  font-size: 0.4rem;
  text-align: center;
  background-size: cover;
  color: rgb(226, 226, 255);
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(@/assets/bg/title.png);
}

.main {
  display: flex;
  flex: 1;
  width: 19.2rem;
  justify-content: space-between;
}

.left {
  display: flex;
  padding: 0.4rem 0;
  width: 4rem;
  align-items: center;
  flex-direction: column;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right center;
  background-image: url(@/assets/bg/line_img.png);
}

.right {
  display: flex;
  width: 4rem;
  padding: 0.4rem 0;
  align-items: center;
  flex-direction: column;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: left center;
  background-image: url(@/assets/bg/line_img.png);
}

.cityEvent {
  position: relative;
  width: 3.5rem;
  margin-bottom: 0.5rem;
  pointer-events: auto;
  background-repeat: repeat;
  background-image: url(@/assets/bg/bg_img03.png);
}

.cityEvent::before {
  position: absolute;
  display: block;
  width: 0.4rem;
  height: 0.4rem;
  left: 0;
  top: 0;
  content: "";
  border-top: 4px solid rgb(34, 133, 247);
  border-left: 4px solid rgb(34, 133, 247);
}

.cityEvent::after {
  position: absolute;
  width: 0.4rem;
  height: 0.4rem;
  right: 0;
  top: 0;
  content: "";
  display: block;
  border-top: 4px solid rgb(34, 133, 247);
  border-right: 4px solid rgb(34, 133, 247);
}
.footerBorder {
  position: absolute;
  width: 3.5rem;
  height: 0.4rem;
  bottom: 0;
}
.footerBorder::before {
  position: absolute;
  width: 0.4rem;
  height: 0.4rem;
  left: 0;
  top: 0;
  content: "";
  display: block;
  border-left: 4px solid rgb(34, 133, 247);
  border-bottom: 4px solid rgb(34, 133, 247);
}

.footerBorder::after {
  position: absolute;
  width: 0.4rem;
  height: 0.4rem;
  right: 0;
  top: 0;
  content: "";
  display: block;
  border-right: 4px solid rgb(34, 133, 247);
  border-bottom: 4px solid rgb(34, 133, 247);
}

.icon {
  width: 40px;
  height: 40px;
}

.cityEvent h1 span {
  flex: 1;
}

h1 {
  display: flex;
  align-items: center;
  padding: 0 0.3rem 0.3rem;
  color: #fff;
  font-size: 0.25rem;
  justify-content: space-between;
}
h3 {
  display: flex;
  color: #fff;
  align-items: center;
  padding: 0.3rem 0.3rem;
}

h1 > div {
  display: flex;
  align-items: center;
}

h1 span.time {
  font-size: 0.2rem;
  font-weight: normal;
}

.cityEvent li > p {
  color: #eee;
  padding: 0rem 0.3rem 0.3rem;
}

.list h1 {
  padding: 0.1rem 0.3rem;
}

.cityEvent.list ul {
  pointer-events: auto;
  cursor: pointer;
}

.cityEvent li.active h1 {
  color: red;
}

.cityEvent li.active p {
  color: red;
}
</style>
