import axios from "axios";
import { defineStore } from "pinia";
import { Notify } from "quasar";

const storeName = "requestsStore";
const defautSate = {
  loading: false,
  error: null,
  currentRequest: null,
};

export const useStore = defineStore(storeName, {
  state: () => defautSate,
  persist: true, // ⚠️ persists state in localStorage
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
    async accountsWaitingForValidation() {
      this.loading = true;
      try {
        const response = await axios.get("/access-requests/");

        const data = response.data;

        return data;
      } catch (error) {
        this.error = error;
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async validateAccount(access_request_id) {
      this.loading = true;
      try {
        const response = await axios.post(`/accept-access-request/`, {
          id: access_request_id,
        });

        const data = response.data;

        console.log(data);

        Notify.create({
          message: "Compte validé avec succès",
          color: "positive",
          position: "top",
          timeout: 2000,
        });

        return data;
      } catch (error) {
        this.error = error;
        Notify.create({
          message: "Erreur lors de la validation du compte",
          color: "negative",
          position: "top",
          timeout: 2000,
        });
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async rejectValidation(access_request_id) {
      this.loading = true;
      try {
        const response = await axios.post(`/reject-access-request/`, {
          id: access_request_id,
        });

        const data = response.data;

        Notify.create({
          message: "Compte rejeté avec succès",
          color: "positive",
          position: "top",
          timeout: 2000,
        });

        return data;
      } catch (error) {
        this.error = error;
        Notify.create({
          message: "Erreur lors du rejet du compte",
          color: "negative",
          position: "top",
          timeout: 2000,
        });
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    setCurrentRequest(request) {
      this.currentRequest = request;
    },
  },
});
