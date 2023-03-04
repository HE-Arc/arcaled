import axios from "axios";
import { defineStore } from "pinia";
import { API_LOCATION } from "../constants";

const storeName = "examStore";
const defautSate = {
  loading: false,
  error: null,
};

export const useStore = defineStore(storeName, {
  state: () => defautSate,
  getters: {},
  actions: {
    async getAllCps() {
      this.loading = true;

      try {
        const response = await axios.get(`${API_LOCATION}/exams/`);

        const data = response.data;

        return data.map(({ lesson: { branch, teacher, year }, content }) => ({
          branch,
          teacher,
          year: new Date(year).getFullYear(),
          content,
        }));
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async addCP({ branch, teacher, year, content }) {
      this.loading = true;

      try {
        const response = await axios.post(`${API_LOCATION}/exams/`, {
          branch,
          teacher,
          year,
          content,
        });

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
