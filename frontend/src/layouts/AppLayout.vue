<script setup>
import AsyncAppLayout from "./AsyncAppLayout.vue";
</script>

<template>
  <Suspense>
    <template #default>
      <AsyncAppLayout />
    </template>

    <template #fallback>
      <q-layout>
        <q-page-container>
          <q-page padding>
            <q-spinner-dots size="5rem" />
          </q-page>
        </q-page-container>
      </q-layout>
    </template>
  </Suspense>
</template>
