module.exports = {
  projects: [
    {
      displayName: 'functions',
      testMatch: ['**/functions/*.spec.(js|ts)'],
      testEnvironment: 'node',
    },
    {
      displayName: 'app',
      testMatch: ['**/src/**/*.spec.(js|ts)'],
      testEnvironment: 'jsdom',
      moduleFileExtensions: [
        'js',
        'ts',
        'json',
        // tell Jest to handle `*.vue` files
        'vue',
      ],
      transform: {
        // process `*.vue` files with `vue-jest`
        '.*\\.(vue)$': 'vue-jest',
        '^.+\\.tsx?$': 'ts-jest',
      },
    },
  ],
};
