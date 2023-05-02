<script setup>
import { ref } from "vue";

import { useStore as useRequestsStore } from "../../store/requests.store";
import { storeToRefs } from "pinia";
import router from "../../router";

const requestsStore = useRequestsStore();

const { currentRequest } = storeToRefs(requestsStore);

const validateAccount = async () => {
  await requestsStore.validateAccount(currentRequest.value.id);
  router.push({
    name: "accounts-waiting",
  });
};

const rejectAccount = async () => {
  await requestsStore.rejectValidation(currentRequest.value.id);
  router.push({
    name: "accounts-waiting",
  });
};
</script>

<template>
  <q-card class="q-mb-md">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">Informations sur la demande</div>
    </q-card-section>

    <q-card-section>
      <q-list>
        <q-item>
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section
            >Etudiant :
            {{
              currentRequest?.firstName + " " + currentRequest?.lastName
            }}</q-item-section
          >
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-icon name="mail" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <a :href="'mailto:' + currentRequest?.email">
                {{ currentRequest?.email }}
              </a>
              <q-icon name="verified" color="green"></q-icon>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>

  <q-card class="q-mb-md">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">Photo de la demande</div>
    </q-card-section>

    <q-card-section>
      <!-- center the image -->
      <div class="row justify-center">
        <q-img :src="currentRequest?.proof" style="width: 50%; height: 100%" />
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn color="red" icon="close" @click="rejectAccount" />
      <q-btn color="green" icon="check" @click="validateAccount" />
    </q-card-actions>
  </q-card>
</template>
