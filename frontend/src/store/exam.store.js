import axios from "axios";
import { defineStore } from "pinia";
import { Notify } from "quasar";

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
        const response = await axios.get("/exams/");
        // All exams (with lesson URL)
        let exams = response.data;
        let promises = exams.map(
          async ({ id, lesson: lessonUrl, content }) => ({
            id,
            lesson: (await axios.get(lessonUrl)).data,
            content,
          })
        );
        // All exams (with lesson data)
        exams = await Promise.all(promises);
        promises = exams.map(
          async ({
            id,
            lesson: { branch: branchUrl, teacher: teacherUrl, year },
            content,
          }) => ({
            id,
            lesson: {
              branch: (await axios.get(branchUrl)).data,
              teacher: (await axios.get(teacherUrl)).data,
              year: new Date(year).getFullYear(),
            },
            content,
          })
        );
        // All exams (with lesson data + branch data + teacher data)
        exams = await Promise.all(promises);
        // All exams (lesson flattened to: branch, teacher, year)
        exams = exams.map(
          ({ id, lesson: { branch, teacher, year }, content }) => ({
            id,
            branch,
            teacher,
            year,
            content,
          })
        );
        return exams;
      } catch (error) {
        this.error = error;

        Notify.create({
          message: "Erreur lors de la récupération des CPs",
          color: "negative",
          position: "top",
          timeout: 2000,
        });
      } finally {
        this.loading = false;
      }
    },
    async addCP({ lesson, content }) {
      this.loading = true;
      try {
        const formdata = new FormData();

        formdata.append("lesson", `/lessons/${lesson.id}/`);
        formdata.append("content", content);

        const response = await axios.post("/exams/", formdata);

        Notify.create({
          message: "CP ajouté avec succès",
          color: "positive",
          position: "top",
          timeout: 2000,
        });
      } catch (error) {
        this.error = error;
        Notify.create({
          message: "Erreur lors de l'ajout du CP",
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
