<script setup>
import AsyncAddLesson from "./AsyncAddLesson.vue";
</script>

<template>
  <Suspense>
    <template #default>
      <AsyncAddLesson />
    </template>

    <template #fallback>
      <q-page padding>
        <q-spinner-dots />
      </q-page>
    </template>
  </Suspense>
</template>
