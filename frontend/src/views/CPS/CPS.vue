<!--
ArcAled made by Lucas Perrin, Rui Marco Loureiro and Sebastien Chappuis
File's version : 1.0
this file is used for : all cps page

Wrote by : Lucas Perrin
updated by : Lucas Perrin
-->

<script setup>
import { ref, computed } from "vue";

const branch = ref(null);
const teacher = ref(null);
const year = ref(null);
const groupBy = ref("Année");

const branchs = [
  "3250.2 Cryptographie",
  "3258.1 Sécurité informatique",
  "3292.2 Outils d'infographie",
];
const teachers = ["NMA", "MAS", "BLC"];
const years = ["2022", "2023", "2024"];
const groupBys = ["Branche", "Prof", "Année"];

const cps = [
  {
    teacher: "NMA",
    year: "2022",
    branch: "3250.2 Cryptographie",
  },
  {
    teacher: "NMA",
    year: "2023",
    branch: "3258.1 Sécurité informatique",
  },
  {
    teacher: "BLC",
    year: "2023",
    branch: "3292.2 Outils d'infographie",
  },
];

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
  if (groupBy.value === "Branche") {
    return filteredCps.value.reduce((acc, cp) => {
      if (!acc[cp.branch]) {
        acc[cp.branch] = [];
      }
      acc[cp.branch].push(cp);
      return acc;
    }, {});
  } else if (groupBy.value === "Prof") {
    return filteredCps.value.reduce((acc, cp) => {
      if (!acc[cp.teacher]) {
        acc[cp.teacher] = [];
      }
      acc[cp.teacher].push(cp);
      return acc;
    }, {});
  } else if (groupBy.value === "Année") {
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
</script>

<template>
  <q-page padding>
    <!-- Filters -->
    <div class="row items-center justify-evenly">
      <div class="col-1">
        <q-icon name="filter_list" size="3rem" />
      </div>
      <div class="col-3">
        <q-select v-model="branch" :options="branchs" label="Branche">
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
        <q-select v-model="teacher" :options="teachers" label="Prof">
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
        <q-select v-model="year" :options="years" label="Année">
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
            <template v-if="groupBy === 'Branche'">
              {{ group[0].branch }}
            </template>
            <template v-else-if="groupBy === 'Prof'">
              {{ group[0].teacher }}
            </template>
            <template v-else-if="groupBy === 'Année'">
              {{ group[0].year }}
            </template>
          </q-item-label>

          <!-- Ungrouped -->
          <q-item v-for="{ branch, teacher, year } in group">
            <q-item-section>
              <q-item-label
                >{{ branch }} - {{ teacher }} - {{ year }}</q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-btn
                class="gt-xs"
                size="12px"
                flat
                dense
                round
                icon="download"
              />
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </div>
  </q-page>
</template>
