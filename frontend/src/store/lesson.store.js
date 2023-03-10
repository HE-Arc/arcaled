import axios from "axios";
import { defineStore } from "pinia";
import { API_LOCATION } from "../constants";
import { Notify } from "quasar";


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

        const lessons = await Promise.all(
          response.data.map(async (lesson) => {
            const branch = await axios.get(lesson.branch);
            const teacher = await axios.get(lesson.teacher);

            return {
              ...lesson,
              branch: branch.data,
              teacher: teacher.data,
              label: `${branch.data.label} - ${teacher.data.name} - ${new Date(
                lesson.year
              ).getFullYear()}`,
            };
          })
        );

        return lessons;
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
    async addLesson({ branch, teacher, year}) {
      this.loading = true;

      try {
        const formdata = new FormData();

        //change year format to YYYY-MM-DD
        


        formdata.append("branch", `${API_LOCATION}/branches/${branch.id}/`);
        formdata.append("teacher", `${API_LOCATION}/teachers/${teacher.id}/`);
        formdata.append("year",  year.year);


        const response = await axios.post(`${API_LOCATION}/lessons/`, formdata);

        //const data = response.data;
        Notify.create({
          message: "Le??on ajout??e avec succ??s",
          color: "positive",
          position: "top",
          timeout: 2000,
        });

        //return data;
      } catch (error) {
        Notify.create({
          message: "Erreur lors de l'ajout de la le??on",
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
