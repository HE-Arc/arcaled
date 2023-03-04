<!--
ArcAled made by Lucas Perrin, Rui Marco Loureiro and Sebastien Chappuis
File's version : 1.0
this file is used for : all cps page

Wrote by : Lucas Perrin
updated by : Lucas Perrin
-->

<script setup>
import AsycCPS from "./AsyncCPS.vue";
</script>

<template>
  <Suspense>
    <template #default>
      <AsycCPS />
    </template>

    <template #fallback>
      <q-page padding>
        <q-spinner-dots size="5rem" />
      </q-page>
    </template>
  </Suspense>
</template>
