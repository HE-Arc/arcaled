<script setup>
import { ref, computed } from "vue";
import { useStore as useRequestsStore } from "../../store/requests.store";
import { Notify } from "quasar";
import { MAX_FILE_UPLOAD_SIZE } from "./../../constants";

const requestsStore = useRequestsStore();

const proof = ref(null);
const email = ref("");
const accept = ref(false);

const formIsValid = computed(() => {
  return email.value && accept.value && proof.value;
});

const onSubmit = () => {
  if (proof.value && email.value && accept.value) {
    requestsStore.accessRequest({
      proof: proof.value,
      email: email.value,
    });
  }
};

const onReset = () => {
  proof.value = null;
  email.value = "";
  accept.value = false;
};

const onRejected = () => {
  Notify.create({
    message: "Fichier trop volumineux ou format non supporté",
    color: "negative",
    position: "top",
    timeout: 2000,
  });
};
</script>

<template>
  <q-card class="q-mb-md">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">Formulaire d'inscription</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <!-- max file size 1MB = 1048576 bytes -->
        <q-file
          outlined
          v-model="proof"
          label="Photo visage + carte étudiante"
          accept=".png, .jpg, .jpeg"
          :max-file-size="MAX_FILE_UPLOAD_SIZE"
          @rejected="onRejected"
        >
          <template v-slot:append>
            <!-- photo -->
            <q-icon name="photo_camera" color="teal" />
          </template>
        </q-file>

        <q-input
          outlined
          v-model="email"
          type="text"
          prefix="Email:"
          lazy-rules
          :rules="[
            (val) => !!val || 'Veuillez entrer votre email',
            // l'email doit se finir avec @he-arc.ch
            (val) =>
              val.endsWith('@he-arc.ch') || 'Veuillez entrer un email HE-Arc',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="mail" />
          </template>
        </q-input>

        <q-toggle
          v-model="accept"
          label="J'ai respecté la procédure de création d'un compte"
        />

        <q-card-actions align="right">
          <q-btn
            label="Vérification du mail"
            type="submit"
            color="primary"
            :disabled="!formIsValid"
          />
          <q-btn
            label="Réinitialiser"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>
