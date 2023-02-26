<script setup>
import { ref, computed } from "vue";

const model = ref(null);
const email = ref("");
const accept = ref(false);

const formIsValid = computed(() => {
  return email.value && accept.value && model.value;
});

const onSubmit = () => {
  if (model.value && email.value && accept.value) {
    alert("Form submitted!");
  }
};

const onReset = () => {
  model.value = null;
  email.value = "";
  accept.value = false;
};
</script>

<template>
  <q-card class="q-mb-md">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">Formulaire d'inscription</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-file
          outlined
          v-model="model"
          label="Photo visage + carte étudiante"
          accept="image/*, .pdf, .png, .jpg, .jpeg"
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
          suffix="@he-arc.ch"
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
