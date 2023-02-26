<!--
ArcAled made by Lucas Perrin, Rui Marco Loureiro and Sebastien Chappuis
File's version : 1.0
this file is used for : email verification page

Wrote by : Rui Marco Loureiro
updated by : Rui Marco Loureiro
-->

<script setup>
import { ref, computed } from "vue";

const password = ref("");

const formIsValid = computed(() => {
  return password.value;
});

const onSubmit = () => {
  if (password.value) {
    alert("Form submitted!");
  }
};

const onReset = () => {
  password.value = "";
};
</script>

<template>
  <q-page class="q-pa-md" style="max-width: 1000px; margin: 0 auto">
    <q-card class="q-mb-md">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Vérification de l'adresse e-mail</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <!-- Enter the password that you received by mail -->
          <q-input
            outlined
            v-model="password"
            type="password"
            prefix="Mot de passe reçu par mail:"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>

          <q-card-actions align="right">
            <q-btn
              label="Demande de création de compte"
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
  </q-page>
</template>
