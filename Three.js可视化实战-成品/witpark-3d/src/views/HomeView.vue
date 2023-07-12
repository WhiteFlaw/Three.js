<template>
  <div class="home">
    <Scene :eventList="eventList"></Scene>
    <Panel></Panel>
  </div>
</template>

<script setup>
import gsap from "gsap";
import Scene from "@/components/Scene.vue";
import Panel from "@/components/Panel.vue";
import { onMounted, reactive, watch, computed, ref } from "vue";

const eventList = ref([]);
const dataInfo = reactive({});
const dataInfoNum = reactive({
  iot: 0,
  event: 0,
  power: 0,
  test: 0,
});

watch(eventList, () => {
  console.log("触发事件列表更新");
});
watch(dataInfo, (newValue, oldValue) => {
  // console.log(newValue,oldValue)
  // console.log("dataInfo数据发生改变")
  gsap.to(dataInfoNum, {
    iot: newValue.iot.number,
    event: newValue.event.number,
    test: newValue.test.number,
    power: newValue.power.number,
    duration: 1,
    repeat: 1,
  });
});
</script>