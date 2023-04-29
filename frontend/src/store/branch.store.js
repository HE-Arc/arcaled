import axios from "axios";
import { defineStore } from "pinia";
import { Notify } from "quasar";

const storeName = "brancheStore";
const defautSate = {
  loading: false,
  error: null,
};

export const useStore = defineStore(storeName, {
  state: () => defautSate,
  getters: {},
  actions: {
    async getAllBranches() {
      this.loading = true;

      try {
        const response = await axios.get("/branches/");

        const data = response.data;

        return data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async addBranch(branch) {
      this.loading = true;

      try {
        const response = await axios.post("/branches/", branch);

        const data = response.data;
        Notify.create({
          message: "Branche ajoutée avec succès",
          color: "positive",
          position: "top",
          timeout: 2000,
        });

        return data;
      } catch (error) {
        this.error = error;
        Notify.create({
          message: "Erreur lors de l'ajout de la branche",
          color: "negative",
          position: "top",
          timeout: 2000,
        });
      } finally {
        this.loading = false;
      }
    },
  },
});
