<!--
ArcAled made by Lucas Perrin, Rui Marco Loureiro and Sebastien Chappuis
File's version : 1.0
this file is used for : account waiting page

Wrote by : Rui Marco Loureiro
updated by : Rui Marco Loureiro
-->

<script setup>
import { ref, computed } from "vue";

const columns = [
  {
    name: "id",
    required: true,
    label: "Numéro",
    align: "left",
    field: (row) => row.id,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "status",
    required: true,
    label: "Status",
    align: "left",
    field: (row) => row.status,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "date",
    required: true,
    label: "Date",
    align: "left",
    field: (row) => row.date,
    format: (val) => `${val}`,
    sortable: true,
  },
];

const rows = [
  { id: 1, status: "Validé", date: "2021-05-01" },
  { id: 2, status: "Validé", date: "2021-05-02" },
  { id: 3, status: "En attente", date: "2021-05-03" },
  { id: 4, status: "En attente", date: "2021-05-04" },
  { id: 5, status: "En attente", date: "2021-05-05" },
  { id: 6, status: "En attente", date: "2021-05-06" },
  { id: 7, status: "En attente", date: "2021-05-07" },
  { id: 8, status: "En attente", date: "2021-05-08" },
  { id: 9, status: "En attente", date: "2021-05-09" },
  { id: 10, status: "En attente", date: "2021-05-10" },
  { id: 11, status: "En attente", date: "2021-05-11" },
];

const onRowClick = (row) => {
  alert(`Row ${row.id} clicked!`);
};

const colorLabel = (status) => {
  if (status === "En attente") {
    return "orange";
  } else if (status === "Validé") {
    return "green";
  } else if (status === "Refusé") {
    return "red";
  }
};
</script>

<template>
  <q-layout>
    <q-page-container class="q-pa-md" style="max-width: 1000px; margin: 0 auto">
      <q-card class="q-mb-md">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Liste des comptes en attente de validation</div>
        </q-card-section>

        <!-- A list of accounts that are waiting for validation, 3 columns : Numéro, Status and Date -->
        <q-table
          title="Comptes en attente"
          :rows="rows"
          :columns="columns"
          row-key="id"
        />

        <template v-slot:body="props">
          <q-tr :props="props" @click="onRowClick(props.row)">
            <q-td key="id" :props="props">
              {{ props.row.id }}
            </q-td>
            <q-td key="status" :props="props">
              {{ props.row.status }}
            </q-td>
            <q-td key="date" :props="props">
              {{ props.row.date }}
            </q-td>
          </q-tr>
        </template>
      </q-card>
    </q-page-container>
  </q-layout>
</template>
