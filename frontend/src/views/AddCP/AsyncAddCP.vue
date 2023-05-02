<!--
ArcAled made by Lucas Perrin, Rui Marco Loureiro and Sebastien Chappuis
File's version : 1.0
this file is used for : add cps page

Wrote by : Lucas Perrin
updated by : Lucas Perrin
-->

<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useStore as useLessonStore } from "../../store/lesson.store";
import { useStore as useExamStore } from "../../store/exam.store";
import { Notify } from "quasar";
import { MAX_FILE_UPLOAD_SIZE } from "../../constants";

const lessonStore = useLessonStore();
const cpsStore = useExamStore();

const { error: errorLesson } = storeToRefs(lessonStore);
const { error: errorCps } = storeToRefs(cpsStore);

const lesson = ref(null);
const content = ref(null);

const lessons = await lessonStore.getAllLesson();

const formIsValid = computed(() => {
  return lesson.value && content.value;
});

const onSubmit = () => {
  if (lesson.value && content.value) {
    cpsStore.addCP({
      lesson: lesson.value,
      content: content.value,
    });
  }
};

const onReset = () => {
  lesson.value = null;
  content.value = null;
};

const onRejected = () => {
  Notify.create({
    message: "Fichier trop volumineux ou format non supporté, taille max 1MB",
    color: "negative",
    position: "top",
    timeout: 2000,
  });
};
</script>

<template>
  <q-page class="q-pa-md" style="max-width: 1000px; margin: 0 auto">
    <div v-if="errorLesson || errorCps">
      <q-card>
        <q-card-section>
          <div class="text-h6">Erreur</div>
          <div class="text-body2">
            Une erreur est survenue lors du chargement des données.
          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-card class="q-mb-md">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Informations importantes</div>
      </q-card-section>

      <q-card-section>
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon name="document_scanner" color="teal" />
            </q-item-section>
            <q-item-section
              >Fournir une photo ou un scan du CP<strong
                >Pensez à cacher le nom de la personne 😉</strong
              ></q-item-section
            >
          </q-item>
          <q-item>
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

    <q-card>
      <q-toolbar class="bg-primary text-white shadow-2">
        <q-toolbar-title>Ajout d'un CP</q-toolbar-title>
        <q-btn
          flat
          dense
          borderless
          icon="add"
          class="q-mr-xs"
          :to="{
            name: 'add-lesson',
          }"
          >Ajouter une leçon
        </q-btn>
      </q-toolbar>

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-select
            v-model="lesson"
            :options="lessons"
            option-value="id"
            option-label="label"
            label="Leçon"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click.stop.prevent="branch = null"
                class="cursor-pointer"
              />
            </template>
          </q-select>

          <!-- max file size 1MB = 1048576 bytes -->
          <q-file
            outlined
            v-model="content"
            label="CP"
            accept="image/*, .pdf, .png, .jpg, .jpeg"
            :max-file-size="MAX_FILE_UPLOAD_SIZE"
            @rejected="onRejected"
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
