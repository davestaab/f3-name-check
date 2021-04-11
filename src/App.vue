<template>
  <div class="bg-blueGray-100 min-h-screen">
    <div class="container mx-auto bg-white min-h-screen pb-8">
      <div class="flex flex-row items-center bg-blueGray-600 h-16">
        <img src="/f3-logo-60x60.png" class="h-12 px-2" alt="F3 Logo" />
        <div class="text-2xl font-bold text-blueGray-50">Knoxville</div>
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
        <label for="nickname" class="block text-sm font-medium text-gray-700"
          >Nickname</label
        >
        <div class="inline-block w-full mt-1 relative rounded-lg shadow-lg">
          <input
            id="nickname"
            v-model="name"
            type="text"
            name="nickname"
            class="focus:ring-blueGray-500 focus:border-blueGray-500 block w-full pl-2 pr-16 sm:text-sm border-blueGray-300 rounded-lg"
            placeholder="spotter..."
            @keydown.enter="search"
          />
          <button
            class="absolute inset-y-0 right-0 flex items-center p-2 focus:ring-blueGray-500 focus:ring-blueGray-500 rounded-lg"
            @click="search"
          >
            Search
          </button>
        </div>
      </div>
      <div class="max-w-sm mx-auto h-8 mb-4">
        <div class="flex items-center h-full">
          <!-- By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL -->
          <svg
            v-if="stateValidating || statePending"
            width="24"
            height="24"
            viewBox="0 0 38 38"
            xmlns="http://www.w3.org/2000/svg"
            class="animate-spin mr-4"
          >
            <defs>
              <linearGradient
                id="a"
                x1="8.042%"
                y1="0%"
                x2="65.682%"
                y2="23.865%"
              >
                <stop stop-color="rgb(51,65,85)" stop-opacity="0" offset="0%" />
                <stop
                  stop-color="rgb(51,65,85)"
                  stop-opacity=".631"
                  offset="63.146%"
                />
                <stop stop-color="rgb(51,65,85)" offset="100%" />
              </linearGradient>
            </defs>
            <g fill="none" fill-rule="evenodd">
              <g transform="translate(1 1)">
                <!--                <rect height="36" width="36" fill="black"></rect>-->
                <path
                  id="Oval-2"
                  d="M36 18c0-9.94-8.06-18-18-18"
                  stroke="url(#a)"
                  stroke-width="2"
                />
                <circle fill="#fff" cx="36" cy="18" r="1" />
              </g>
            </g>
          </svg>
          <span class="flex-1">
            <span v-if="stateValidating || statePending"> Loading... </span>
          </span>
          <!--https://linearicons.com/free/icon/cross-->
          <svg
            v-if="showClearResults"
            width="24"
            height="24"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            data-testid="clear-search"
            @click="clearResults"
          >
            <path
              class="path1"
              d="M548.203 537.6l289.099-289.098c9.998-9.998 9.998-26.206 0-36.205-9.997-9.997-26.206-9.997-36.203 0l-289.099 289.099-289.098-289.099c-9.998-9.997-26.206-9.997-36.205 0-9.997 9.998-9.997 26.206 0 36.205l289.099 289.098-289.099 289.099c-9.997 9.997-9.997 26.206 0 36.203 5 4.998 11.55 7.498 18.102 7.498s13.102-2.499 18.102-7.499l289.098-289.098 289.099 289.099c4.998 4.998 11.549 7.498 18.101 7.498s13.102-2.499 18.101-7.499c9.998-9.997 9.998-26.206 0-36.203l-289.098-289.098z"
            ></path>
          </svg>
        </div>
      </div>
      <div v-if="hasResults">
        <a
          v-for="r in results"
          :key="r.id"
          :href="r.link"
          target="_blank"
          data-testid="user-card"
          class="block py-8 px-8 max-w-sm mx-auto bg-blueGray-600 rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:space-y-0 sm:space-x-6 mb-4"
        >
          <div class="space-y-2">
            <p class="text-lg text-white font-semibold">
              {{ r.name }}
            </p>
            <p class="text-blueGray-300 font-medium">
              posted {{ r.count }} times
            </p>
          </div>
        </a>
      </div>
      <div v-else class="text-center">No Results</div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import useSWRV from 'swrv';
  import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage';
  import { UserTag } from './types';

  export default defineComponent({
    name: 'App',
    components: {},
    setup() {
      const name = ref('');
      const searchName = ref('');

      const { data: results, isValidating, error } = useSWRV<UserTag[]>(
        () => `/api/user-search?search=${searchName.value}`,
        (key) => fetch(key).then((res) => res.json()),
        { revalidateOnFocus: false, cache: new LocalStorageCache() }
      );

      const hasResults = computed<boolean>(
        () => (results.value?.length ?? 0) > 0
      );
      const stateValidating = computed<boolean>(
        () => (results.value ?? false) && isValidating.value
      );
      const statePending = computed<boolean>(
        () => results.value === undefined && !error.value
      );
      const stateSuccess = computed<boolean>(
        () => (results.value ?? false) && !error.value
      );
      const showClearResults = computed<boolean>(
        () => (searchName?.value ?? '').length > 0
      );

      function search() {
        searchName.value = name.value;
      }

      function clearResults() {
        searchName.value = '';
        name.value = '';
      }

      return {
        results,
        search,
        name,
        hasResults,
        stateValidating,
        statePending,
        stateSuccess,
        showClearResults,
        clearResults,
      };
    },
  });
</script>
