import AppLayout from "./layouts/AppLayout.vue";
import router from "./router";

import { createApp } from "vue";
import { createPinia } from "pinia";
import axios from "axios";
import { Quasar, Notify } from "quasar";
import quasarLang from "quasar/lang/fr";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";
// Import Quasar css
import "quasar/src/css/index.sass";

// Axios global configuration
axios.defaults.baseURL = import.meta.env.VITE_API_LOCATION;
// Retrieve the csrf token from the cookie
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

createApp(AppLayout)
  .use(Quasar, {
    plugins: {
      Notify,
    }, // Import Quasar plugins and add here
    lang: quasarLang,
  })
  .use(
    createPinia().use(
      piniaPluginPersistedstate // persist state in localStorage when the store has the property `persistedState`
    )
  )
  .use(router)
  .mount("#app");
