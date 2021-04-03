<template>
  <div class="bg-blueGray-100 min-h-screen">
    <div class="container mx-auto bg-white min-h-screen pb-8">
      <div class="flex flex-row items-center bg-blueGray-600 h-16">
        <img src="/f3-logo-60x60.png" class="h-12 px-2" alt="F3 Logo"/>
        <div class="text-2xl font-bold text-blueGray-50">
          Knoxville
        </div>
      </div>
      <div class="block text-center">
        <div class="text-4xl text-center font-sans mt-4 text-blueGray-800">
          Name Check
        </div>
        <div class="text-sm text-center font-light my-1 text-blueGray-600">
          Unofficial check for F3 nickname availability.
        </div>
      </div>
      <div class="block max-w-sm mx-auto my-4">
        <label for="nickname" class="block text-sm font-medium text-gray-700">Nickname</label>
        <div class="inline-block w-full mt-1 relative rounded-lg shadow-lg">
          <input
              type="text"
              name="nickname"
              id="nickname"
              class="focus:ring-blueGray-500 focus:border-blueGray-500 block w-full pl-2 pr-16 sm:text-sm border-blueGray-300 rounded-lg"
              placeholder="spotter..."
              @keydown.enter="search"
              v-model="name"/>
          <button
              class="absolute inset-y-0 right-0 flex items-center p-2 focus:ring-blueGray-500 focus:ring-blueGray-500 rounded-lg"
              @click="search">
            Search
          </button>
        </div>
      </div>
      <a
          :href="r.link"
          target="_blank"
          v-for="r in results" :key="r.id" v-if="results.length"
          class="block py-8 px-8 max-w-sm mx-auto bg-blueGray-600 rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:space-y-0 sm:space-x-6 mb-4">
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
      </a>
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
