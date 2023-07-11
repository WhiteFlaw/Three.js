<template>
  <div class="home">
    <Scene></Scene>
  </div>
</template>

<script setup>
import gsap from "gsap";
import Scene from "@/components/Scene.vue";
import { onMounted, reactive, watch, computed, ref } from "vue";

onMounted(() => {
  init();
});

function init() {}
</script>