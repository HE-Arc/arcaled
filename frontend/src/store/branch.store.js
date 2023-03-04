import axios from "axios";
import { defineStore } from "pinia";
import { API_LOCATION } from "../constants";

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
        const response = await axios.get(`${API_LOCATION}/branches/`);

        const data = response.data;

        return data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});
