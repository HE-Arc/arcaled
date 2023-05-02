<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useStore as useTeacherStore } from "../../store/teacher.store";
import { useStore as useBranchStore } from "../../store/branch.store";
import { useStore as useLessonStore } from "../../store/lesson.store";
import router from "../../router";

const teacherStore = useTeacherStore();
const branchStore = useBranchStore();
const lessonStore = useLessonStore();

const { error: errorTeacher } = storeToRefs(teacherStore);
const { error: errorBranch } = storeToRefs(branchStore);
const { error: errorLesson } = storeToRefs(lessonStore);

const branch = ref(null);
const teacher = ref(null);
const year = ref(null);

const branches = await branchStore.getAllBranches();
const teachers = await teacherStore.getAllTeachers();
const years_2010_now = [];
for (let i = 2010; i <= new Date().getFullYear(); i++) {
  years_2010_now.push(i.toString());
}
const years = years_2010_now;

const formIsValid = computed(() => {
  return branch.value && teacher.value && year.value;
});

const onSubmit = async () => {
  if (branch.value && teacher.value && year.value) {
    await lessonStore.addLesson({
      branch: branch.value,
      teacher: teacher.value,
      year: year.value,
    });
    router.push({
      name: "add-cp",
    });
  }
};

const onReset = () => {
  branch.value = null;
  teacher.value = null;
  year.value = null;
};
</script>

<template>
  <q-page class="q-pa-md" style="max-width: 1000px; margin: 0 auto">
    <q-card class="q-mb-md">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Ajout d'une leçon</div>
      </q-card-section>
      <q-card-section>
        <q-icon name="info" />
        Une leçon est composée d'une branche, d'un prof ainsi que d'une
        année.</q-card-section
      >

      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-select
          v-model="branch"
          outlined
          label="Branche"
          :options="branches"
          option-value="id"
          option-label="label"
          class="q-px-sm"
        />

        <q-select
          v-model="teacher"
          outlined
          label="Professeur"
          :options="teachers"
          option-value="id"
          option-label="name"
          class="q-px-sm"
        />
        <q-select
          v-model="year"
          outlined
          label="Année"
          :options="years"
          option-value="id"
          option-label="year"
          class="q-px-sm"
        />

        <q-card-actions align="right">
          <q-btn label="Annuler" type="reset" color="red" flat />
          <q-btn
            label="Ajouter"
            type="submit"
            color="primary"
            :disable="!formIsValid"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>
