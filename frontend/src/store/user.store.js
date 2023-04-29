import axios from "axios";
import { defineStore } from "pinia";
import { Notify } from "quasar";

const storeName = "teacherStore";
const defautSate = {
  loading: false,
  error: null,
};

export const useStore = defineStore(storeName, {
  state: () => defautSate,
  getters: {},
  actions: {},
});
