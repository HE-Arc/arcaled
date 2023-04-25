import axios from "axios";
import { defineStore } from "pinia";
import { Notify } from "quasar";

const storeName = "authStore";
const defautSate = {
  loading: false,
  error: null,
  user: null,
  isAuthenticated: false,
};

export const useStore = defineStore(storeName, {
  state: () => defautSate,
  persist: true, // ⚠️ persists state in localStorage
  getters: {},
  actions: {
    async login({ username, password }) {
      this.loading = true;

      try {
        const response = await axios.post("/login/", {
          username,
          password,
        });

        const data = response.data;

        this.isAuthenticated = true;

        Notify.create({
          message: "Connexion réussie",
          color: "positive",
          position: "top",
          timeout: 2000,
        });
      } catch (error) {
        this.error = error;
        Notify.create({
          message: "Erreur lors de la connexion",
          color: "negative",
          position: "top",
          timeout: 2000,
        });
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      this.loading = true;

      try {
        const response = await axios.post("/logout/");

        const data = response.data;

        this.isAuthenticated = false;

        Notify.create({
          message: "Déconnexion réussie",
          color: "positive",
          position: "top",
          timeout: 2000,
        });
      } catch (error) {
        this.error = error;
        Notify.create({
          message: "Erreur lors de la déconnexion",
          color: "negative",
          position: "top",
          timeout: 2000,
        });
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
