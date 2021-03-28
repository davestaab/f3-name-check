<template>
  <div>
    <h1>F3 Knoxville Name Check</h1>
<!--    <input>-->
    <p v-for="r in results" v-if="results.length !== 0">
      {{ r.name }} posted {{ r.count }} times
    </p>
    <p v-else>
      No Results
    </p>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue'

export default defineComponent({
  name: 'App',
  components: {},
  setup() {
    const results = ref([]);
    onMounted(async () => {
      try {
        const resp = await fetch('/api/user-search?search=pool')
        results.value = await resp.json();
      } catch (e) {
        console.log(e);
      }
    });
    return {results}
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
