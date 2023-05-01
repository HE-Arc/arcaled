<!--
ArcAled made by Lucas Perrin, Rui Marco Loureiro and Sebastien Chappuis
File's version : 1.0
this file is used for : account waiting page

Wrote by : Rui Marco Loureiro
updated by : Rui Marco Loureiro
-->

<script setup>
import { ref, computed } from "vue";
import { useStore as useRequestsStore } from "./../../store/requests.store";
import router from "./../../router/index";

const requestsStore = useRequestsStore();

const waitingRequests = await requestsStore.accountsWaitingForValidation();

const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const removeNumber = (string) => string.replace(/[0-9]/g, "");

const rows = waitingRequests?.map((request) => {
  return {
    id: request.id,
    email: request.email,
    firstName: capitalizeFirstLetter(request.email.split("@")[0].split(".")[0]),
    lastName: removeNumber(
      capitalizeFirstLetter(request.email.split("@")[0].split(".")[1])
    ),
    proof: request.proof,
    date: new Date(request.created_at).toLocaleDateString(),
  };
});

const request = async (waitingRequest) => {
  await requestsStore.setCurrentRequest(waitingRequest);
  router.push({
    name: "account-validation",
  });
};
</script>

<template>
  <div v-if="waitingRequests.length === 0">
    <q-page class="q-pa-md" style="max-width: 1000px; margin: 0 auto">
      <div class="text-h6">Aucun compte en attente de validation</div>
    </q-page>
  </div>
  <div v-else>
    <q-page class="q-pa-md" style="max-width: 1000px; margin: 0 auto">
      <q-card class="q-mb-md">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Informations importantes</div>
        </q-card-section>

        <q-card-section>
          <div class="text-body2">
            Vous trouverez ici la liste des comptes en attente de validation.
          </div>
        </q-card-section>

        <q-list bordered>
          <q-item
            v-for="waitingRequest in rows"
            :key="waitingRequest.id"
            class="q-my-sm"
            clickable
            v-ripple
            @click="request(waitingRequest)"
          >
            <q-item-section avatar>
              <q-avatar> <img :src="waitingRequest.proof" /> </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{
                waitingRequest.firstName + " " + waitingRequest.lastName
              }}</q-item-label>
              <q-item-label caption lines="1"
                >{{ waitingRequest.email }}
                <q-icon name="verified" color="green"
              /></q-item-label>
            </q-item-section>

            <q-item-section side> </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-page>
  </div>
</template>
