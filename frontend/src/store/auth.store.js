import axios from "axios";
import { defineStore } from "pinia";
import { Notify } from "quasar";

const storeName = "authStore";
const defautSate = {
  loading: false,
  error: null,
  user: null,
};

export const useStore = defineStore(storeName, {
  state: () => defautSate,
  persist: true, // ⚠️ persists state in localStorage
  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.is_admin,
  },
  actions: {
    async login({ email, password }) {
      this.loading = true;

      try {
        const response = await axios.post("/login/", {
          email,
          password,
        });

        const data = response.data;

        this.user = {
          // Select only the needed fields
          id: data.user.id,
          email: data.user.email,
          is_admin: data.user.is_admin,
        };

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
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      if (!this.user) {
        Notify.create({
          message: "Vous n'êtes pas connecté",
          color: "info",
          position: "top",
          timeout: 2000,
        });
        return;
      }

      this.loading = true;

      try {
        const response = await axios.post("/logout/");

        const data = response.data;

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
        this.user = null;

        this.loading = false;
      }
    },
  },
});
