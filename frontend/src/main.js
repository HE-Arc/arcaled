import AppLayout from "./layouts/AppLayout.vue";
import router from "./router";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { Quasar, Notify } from "quasar";
import quasarLang from "quasar/lang/fr";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";
// Import Quasar css
import "quasar/src/css/index.sass";

const pinia = createPinia();
// persist the state of the stores in the localStorage (or sessionStorage)
pinia.use(piniaPluginPersistedstate);

const app = createApp(AppLayout); // AppLayout is the default layout
app.use(Quasar, {
  plugins: {
    Notify,
  }, // import Quasar plugins and add here
  lang: quasarLang,
});
app.use(pinia);
app.use(router);

app.mount("#app");
