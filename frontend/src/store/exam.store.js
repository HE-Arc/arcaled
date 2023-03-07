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
      } finally {
        this.loading = false;
      }
    },
    async addCP({ lesson, content }) {
      this.loading = true;
      try {
        const formdata = new FormData();

        formdata.append("lesson", `${API_LOCATION}/lessons/${lesson.id}/`);
        formdata.append("content", content);

        const response = await axios.post(`${API_LOCATION}/exams/`, formdata);
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});
