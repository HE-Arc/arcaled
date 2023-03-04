<!--
ArcAled made by Lucas Perrin, Rui Marco Loureiro and Sebastien Chappuis
File's version : 1.0
this file is used for : add cps page

Wrote by : Lucas Perrin
updated by : Lucas Perrin
-->

<script setup>
import AsyncAddCP from "./AsyncAddCP.vue";
</script>

<template>
  <Suspense>
    <template #default>
      <AsyncAddCP />
    </template>

    <template #fallback>
      <q-page padding>
        <q-spinner-dots size="5rem" />
      </q-page>
    </template>
  </Suspense>
</template>
