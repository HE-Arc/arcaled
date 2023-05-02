import axios from "axios";
import { defineStore } from "pinia";

const storeName = "userStore";
const defautSate = {
  loading: false,
  error: null,
  ratio: null,
};

export const useStore = defineStore(storeName, {
  state: () => defautSate,
  getters: {},
  actions: {
    async fetchRatio() {
      this.loading = true;

      try {
        const response = await axios.get("/ratio/");
        const { ratio } = response.data;
        this.ratio = ratio;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});
