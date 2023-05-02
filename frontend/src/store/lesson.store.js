import axios from "axios";
import { defineStore } from "pinia";
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
        const response = await axios.get("/lessons/");

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
    async addLesson({ branch, teacher, year }) {
      this.loading = true;

      try {
        const formdata = new FormData();

        //change year format to YYYY-MM-DD

        formdata.append("branch", `/branches/${branch.id}/`);
        formdata.append("teacher", `/teachers/${teacher.id}/`);
        formdata.append("year", year.year);

        const response = await axios.post("/lessons/", formdata);

        //const data = response.data;
        Notify.create({
          message: "Leçon ajoutée avec succès",
          color: "positive",
          position: "top",
          timeout: 2000,
        });

        //return data;
      } catch (error) {
        Notify.create({
          message: "Erreur lors de l'ajout de la leçon",
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
