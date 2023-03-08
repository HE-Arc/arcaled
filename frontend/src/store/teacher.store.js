import axios from "axios";
import { defineStore } from "pinia";
import { API_LOCATION } from "../constants";
import { Notify } from "quasar";

const storeName = "teacherStore";
const defautSate = {
  loading: false,
  error: null,
};

export const useStore = defineStore(storeName, {
  state: () => defautSate,
  getters: {},
  actions: {
    async getAllTeachers() {
      this.loading = true;

      try {
        const response = await axios.get(`${API_LOCATION}/teachers/`);

        const data = response.data;
        
        return data;
      } catch (error) {
        
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async addTeacher(teacher) {
      this.loading = true;

      try {
        const response = await axios.post(`${API_LOCATION}/teachers/`, teacher);

        const data = response.data;
        Notify.create({
          message: "Prof ajouté avec succès",
          color: "positive",
          position: "top",
          timeout: 2000,
        });
        return data;
      } catch (error) {
        Notify.create({
          message: "Erreur lors de l'ajout du prof",
          color: "negative",
          position: "top",
          timeout: 2000,
        });
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});
