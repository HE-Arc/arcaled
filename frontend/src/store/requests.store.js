import axios from "axios";
import { defineStore } from "pinia";
import { Notify } from "quasar";

const storeName = "requestsStore";
const defautSate = {
  loading: false,
  error: null,
};

export const useStore = defineStore(storeName, {
  state: () => defautSate,
  getters: {},
  actions: {
    async accessRequest({ email, proof }) {
      this.loading = true;
      try {
        const formdata = new FormData();

        formdata.append("email", email);
        formdata.append("proof", proof);

        const response = await axios.post("/access-requests/", formdata);

        Notify.create({
          message:
            "Demande d'accès envoyée avec succès, nous vous contacterons par email une fois votre demande traitée",
          color: "positive",
          position: "top",
          timeout: 5000,
        });
      } catch (error) {
        this.error = error;
        Notify.create({
          message: "Erreur lors de la demande d'accès",
          color: "negative",
          position: "top",
          timeout: 2000,
        });
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
