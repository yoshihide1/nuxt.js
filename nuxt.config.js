
export default {
  env: {
    VUE_APP_apiKey: process.env.VUE_APP_apiKey,
    VUE_APP_authDomain: process.env.VUE_APP_authDomain,
    VUE_APP_databaseURL: process.env.VUE_APP_databaseURL,
    VUE_APP_projectId: process.env.VUE_APP_projectId,
    VUE_APP_storageBucket: process.env.VUE_APP_storageBucket,
    VUE_APP_messagingSenderId: process.env.VUE_APP_messagingSenderId,
    VUE_APP_appId: process.env.VUE_APP_appId,
    VUE_APP_measurementId: process.env.VUE_APP_measurementId
  },
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'spa',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    'vuesax/dist/vuesax.css'
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    '@/plugins/vuesax'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
  ],
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
  }
}
