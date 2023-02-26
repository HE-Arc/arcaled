<!--
ArcAled made by Lucas Perrin, Rui Marco Loureiro and Sebastien Chappuis
File's version : 1.0
this file is used for : add cps page

Wrote by : Lucas Perrin
updated by : Lucas Perrin
-->

<script setup>
import { ref, computed } from "vue";

const actualYear = new Date().getFullYear();

const file = ref(null);
const branch = ref(null);
const teacher = ref(null);
const year = ref(actualYear);

const branchs = [
  "3250.2 Cryptographie",
  "3258.1 Sécurité informatique",
  "3292.2 Outils d'infographie",
];
const teachers = ["NMA", "MAS", "BLC"];
const years = ["2022", "2023", "2024"];

const formIsValid = computed(() => {
  return branch.value && teacher.value && year.value && file.value;
});

const onSubmit = () => {
  if (branch.value && teacher.value && year.value && file.value) {
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
  <q-page padding>
    <q-card class="q-mb-md">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Informations importantes</div>
      </q-card-section>

      <q-card-section>
        <q-list>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="document_scanner" color="teal" />
            </q-item-section>
            <q-item-section
              >Fournir une photo ou un scan du CP<strong
                >Pensez à cacher le nom de la personne 😉</strong
              ></q-item-section
            >
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="warning" color="warning" />
            </q-item-section>
            <q-item-section>
              Assurez-vous que le CP n'as pas déjà été posté par un autre
              utilisateur</q-item-section
            >
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <q-card class="q-mb-md">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Ajout d'un CP</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-select v-model="branch" :options="branchs" label="Branche">
            <template v-slot:append>
              <q-icon
                name="close"
                @click.stop.prevent="branch = null"
                class="cursor-pointer"
              />
            </template>
          </q-select>

          <q-select v-model="teacher" :options="teachers" label="Prof">
            <template v-slot:append>
              <q-icon
                name="close"
                @click.stop.prevent="teacher = null"
                class="cursor-pointer"
              />
            </template>
          </q-select>

          <q-select v-model="year" :options="years" label="Année">
            <template v-slot:append>
              <q-icon
                name="close"
                @click.stop.prevent="year = null"
                class="cursor-pointer"
              />
            </template>
          </q-select>

          <q-file
            outlined
            v-model="file"
            label="CP"
            accept="image/*, .pdf, .png, .jpg, .jpeg"
          >
            <template v-slot:append>
              <!-- photo -->
              <q-icon name="file_copy" color="teal" />
            </template>
          </q-file>

          <q-card-actions align="right">
            <q-btn
              label="Ajouter le CP"
              type="submit"
              color="primary"
              :disabled="!formIsValid"
            />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>
