import axios from "axios";
import { defineStore } from "pinia";
import { API_LOCATION } from "../constants";

const storeName = "lessonStore";
const defautSate = {
  loading: false,
  error: null,
};

export const useStore = defineStore(storeName, {
  state: () => defautSate,
  getters: {},
  actions: {
    async getAllLesson() {
      this.loading = true;

      try {
        const response = await axios.get(`${API_LOCATION}/lessons/`);

        const { data } = response.data;

        return data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async getAllYears() {
      this.loading = true;

      try {
        const response = await axios.get(`${API_LOCATION}/lessons/`);

        const data = response.data;

        let years = data.map((lesson) => new Date(lesson.year).getFullYear());
        years = [...new Set(years)];

        return years;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});
