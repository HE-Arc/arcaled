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

const pinia = createPinia();
// Persist the state of the stores in the localStorage (or sessionStorage)
pinia.use(piniaPluginPersistedstate);

const app = createApp(AppLayout); // AppLayout is the default layout
app.use(Quasar, {
  plugins: {
    Notify,
  }, // Import Quasar plugins and add here
  lang: quasarLang,
});
app.use(pinia);
app.use(router);

app.mount("#app");
