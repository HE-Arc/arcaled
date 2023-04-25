<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useStore as useTeacherStore } from "../../store/teacher.store";
import { useStore as useBranchStore } from "../../store/branch.store";
import { useStore as useLessonStore } from "../../store/lesson.store";
import { useStore as useExamStore } from "../../store/exam.store";

const teacherStore = useTeacherStore();
const branchStore = useBranchStore();
const lessonStore = useLessonStore();
const cpsStore = useExamStore();

const { error: errorTeacher } = storeToRefs(teacherStore);
const { error: errorBranch } = storeToRefs(branchStore);
const { error: errorLesson } = storeToRefs(lessonStore);
const { error: errorCps } = storeToRefs(cpsStore);

let tab = ref("Branches");
const newBranch = ref(null);
const newTeacher = ref(null);

const formIsValid = computed(() => {
  return newBranch.value;
});

const formTeacherIsValid = computed(() => {
  return newTeacher.value;
});

const onSubmit = () => {
  if (newBranch.value) {
    branchStore.addBranch({
      label: newBranch.value,
    });
    branchs.value.push(newBranch.value);

    //reset
    newBranch.value = null;
  }
};

const onSubmitTeacher = () => {
  if (newTeacher.value) {
    teacherStore.addTeacher({
      name: newTeacher.value,
    });
    teachers.value.push(newTeacher.value);

    //reset
    newTeacher.value = null;
  }
};

const BRANCH_LABEL = "Branche";
const TEACHER_LABEL = "Prof";
const YEAR_LABEL = "Année";

const branch = ref(null);
const teacher = ref(null);
const year = ref(null);
const groupBy = ref(YEAR_LABEL);

const groupBys = [BRANCH_LABEL, TEACHER_LABEL, YEAR_LABEL];

// const branchs = [
//   "3250.2 Cryptographie",
//   "3258.1 Sécurité informatique",
//   "3292.2 Outils d'infographie",
// ];
/*const branchs = (await branchStore.getAllBranches()).map(
  (branch) => branch.label
);*/

let branchs = ref([]);
branchs.value = (await branchStore.getAllBranches())?.map(
  (branch) => branch.label
);

// const teachers = ["NMA", "MAS", "BLC"];
let teachers = ref([]);
teachers.value = (await teacherStore.getAllTeachers())?.map(
  (teacher) => teacher.name
);

// const years = ["2022", "2023", "2024"];
const years = await lessonStore.getAllYears();

// const cps = [
//   {
//     teacher: "NMA",
//     year: "2022",
//     branch: "3250.2 Cryptographie",
//   },
//   {
//     teacher: "NMA",
//     year: "2023",
//     branch: "3258.1 Sécurité informatique",
//   },
//   {
//     teacher: "BLC",
//     year: "2023",
//     branch: "3292.2 Outils d'infographie",
//   },
// ];
const cps = (await cpsStore.getAllCps()).map((cp) => ({
  teacher: cp.teacher.name,
  year: cp.year,
  branch: cp.branch.label,
  content: cp.content,
}));

const filteredCps = computed(() => {
  return cps.filter((cp) => {
    return (
      (branch.value === null || cp.branch === branch.value) &&
      (teacher.value === null || cp.teacher === teacher.value) &&
      (year.value === null || cp.year === year.value)
    );
  });
});

const groupedCps = computed(() => {
  if (groupBy.value === BRANCH_LABEL) {
    return filteredCps.value.reduce((acc, cp) => {
      if (!acc[cp.branch]) {
        acc[cp.branch] = [];
      }
      acc[cp.branch].push(cp);
      return acc;
    }, {});
  } else if (groupBy.value === TEACHER_LABEL) {
    return filteredCps.value.reduce((acc, cp) => {
      if (!acc[cp.teacher]) {
        acc[cp.teacher] = [];
      }
      acc[cp.teacher].push(cp);
      return acc;
    }, {});
  } else if (groupBy.value === YEAR_LABEL) {
    return filteredCps.value.reduce((acc, cp) => {
      if (!acc[cp.year]) {
        acc[cp.year] = [];
      }
      acc[cp.year].push(cp);
      return acc;
    }, {});
  } else {
    return filteredCps.value;
  }
});

const filename = (url) => {
  return url.split("/").pop();
};

const download = (url) => {
  console.log(url);

  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", filename(url));
  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};
</script>

<template>
  <q-page padding>
    <div v-if="errorTeacher || errorBranch || errorLesson || errorCps">
      <q-card>
        <q-card-section>
          <div class="text-h6">Erreur</div>
          <div class="text-body2">
            Une erreur est survenue lors du chargement des données.
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Filters -->
    <div class="row items-center justify-evenly">
      <div class="col-1">
        <q-icon name="filter_list" size="3rem" />
      </div>
      <div class="col-3">
        <q-select v-model="branch" :options="branchs" :label="BRANCH_LABEL">
          <template v-slot:append>
            <q-icon
              name="close"
              @click.stop.prevent="branch = null"
              class="cursor-pointer"
            />
          </template>
        </q-select>
      </div>
      <div class="col-3">
        <q-select v-model="teacher" :options="teachers" :label="TEACHER_LABEL">
          <template v-slot:append>
            <q-icon
              name="close"
              @click.stop.prevent="teacher = null"
              class="cursor-pointer"
            />
          </template>
        </q-select>
      </div>
      <div class="col-3">
        <q-select v-model="year" :options="years" :label="YEAR_LABEL">
          <template v-slot:append>
            <q-icon
              name="close"
              @click.stop.prevent="year = null"
              class="cursor-pointer"
            />
          </template>
        </q-select>
      </div>
    </div>

    <!-- Group By -->
    <div class="row items-center justify-evenly">
      <div class="col-1">
        <q-icon name="view_list" size="3rem" />
      </div>
      <div class="col-3">
        <q-select v-model="groupBy" :options="groupBys" label="Grouper par">
        </q-select>
      </div>
      <div class="col-3"></div>
      <div class="col-3"></div>
    </div>

    <div class="q-pa-md">
      <q-card class="q-mb-md">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Pas disponible dans la liste ?</div>
        </q-card-section>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="Branches" label="Branches" />
          <q-tab name="Prof" label="Prof" />
        </q-tabs>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="Branches">
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input
                v-model="newBranch"
                label="Nom de la branche, exemple : 3251.3 - Développement web I"
                filled
                lazy-rules
              />

              <q-card-actions align="right">
                <q-btn
                  label="Ajouter la branche"
                  type="submit"
                  color="primary"
                  :disable="!formIsValid"
                />
              </q-card-actions>
            </q-form>
          </q-tab-panel>

          <q-tab-panel name="Prof">
            <q-form @submit="onSubmitTeacher" class="q-gutter-md">
              <q-input
                v-model="newTeacher"
                label="Nom du prof, exemple : NMA"
                filled
                lazy-rules
              />

              <q-card-actions align="right">
                <q-btn
                  label="Ajouter le prof"
                  type="submit"
                  color="primary"
                  :disable="!formTeacherIsValid"
                />
              </q-card-actions>
            </q-form>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>

    <div class="q-pa-md">
      <q-toolbar class="bg-primary text-white shadow-2">
        <q-toolbar-title>CPs 🗐</q-toolbar-title>
        <q-btn
          flat
          dense
          icon="add"
          class="q-mr-xs"
          :to="{
            name: 'add-cp',
          }"
          >Ajouter un CP</q-btn
        >
      </q-toolbar>

      <q-list bordered padding>
        <q-item v-if="filteredCps.length === 0">
          <q-item-section>
            <q-item-label
              >Aucun CP ne correspond à votre recherche</q-item-label
            >
          </q-item-section>
        </q-item>

        <!-- Grouped -->
        <template v-for="group in groupedCps">
          <q-item-label header>
            <template v-if="groupBy === BRANCH_LABEL">
              {{ group[0].branch }}
            </template>
            <template v-else-if="groupBy === TEACHER_LABEL">
              {{ group[0].teacher }}
            </template>
            <template v-else-if="groupBy === YEAR_LABEL">
              {{ group[0].year }}
            </template>
          </q-item-label>

          <!-- Ungrouped -->
          <q-item v-for="{ branch, teacher, year, content } in group">
            <q-item-section>
              <q-item-label
                >{{ branch }} - {{ teacher }} - {{ year }}</q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-btn
                size="12px"
                flat
                dense
                round
                icon="download"
                @click="download(content)"
              />
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </div>
  </q-page>
</template>
