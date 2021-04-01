<template>
  <div class="bg-blueGray-100 min-h-screen">
    <div class="container mx-auto bg-white min-h-screen pb-8">
      <div class="flex flex-row items-center bg-blueGray-600">
        <img src="/f3-logo-60x60.png" class="h-12 pr-3" alt="F3 Logo"/>
        <div class="text-2xl font-bold text-blueGray-50">
          Knoxville
        </div>
      </div>
      <div class="flex">
        <div class="text-4xl flex-1 text-center font-sans p-4 text-blueGray-800">
          Name Check
        </div>
      </div>
      <div class="flex flex-1 justify-center mb-4">
        <input class="border border-blueGray-200 rounded-tl-lg rounded-bl-lg p-2" v-model="name"
               @keydown.enter="search">
        <button class="px-4 py-2 border rounded-br-lg rounded-tr-lg border-l-0 border-blueGray-200" @click="search">
          Search
        </button>
      </div>
      <!--          <p v-for="r in results" v-if="results.length !== 0">-->
      <!--            {{ r.name }} posted {{ r.count }} times-->
      <!--          </p>-->

      <div v-for="r in results" :key="r.id" v-if="results.length"
           class="py-8 px-8 max-w-sm mx-auto bg-blueGray-600 rounded-xl shadow-md space-y-2 sm:py-4 sm:flex sm:space-y-0 sm:space-x-6 mb-4">
        <div class="space-y-2">
          <div class="space-y-0.5">
            <p class="text-lg text-white font-semibold">
              {{ r.name }}
            </p>
            <p class="text-blueGray-300 font-medium">
              posted {{ r.count }} times
            </p>
          </div>
        </div>
      </div>
      <div v-else class="text-center">
        No Results
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue'

export default defineComponent({
  name: 'App',
  components: {},
  setup() {
    const results = ref([]);
    const name = ref('');
    onMounted(async () => {
      results.value = await checkName('pool');
    });

    async function search() {
      results.value = await checkName(name.value);
    }

    return {results, search, name}
  }
})

async function checkName(name: string) {
  try {
    if (name === '') return [];
    const resp = await fetch(`/api/user-search?search=${name}`)
    return await resp.json();
  } catch (e) {
    console.log(e);
    return [];
  }
}
</script>
