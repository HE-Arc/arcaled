<!--
ArcAled made by Lucas Perrin, Rui Marco Loureiro and Sebastien Chappuis
File's version : 1.0
this file is used for : account demand page

Wrote by : Rui Marco Loureiro
updated by : Rui Marco Loureiro
-->

<script setup>
import AccountDemandHeader from "./AccountDemandHeader.vue";
import AccountDemandForm from "./AccountDemandForm.vue";
</script>

<template>
  <q-page class="q-pa-md" style="max-width: 1000px; margin: 0 auto">
    <AccountDemandHeader />
    <AccountDemandForm />

    <!-- Already have an account? -->
    <div class="row justify-center q-mt-lg">
      <q-btn
        label="J'ai déjà un compte"
        color="secondary"
        :to="{
          name: 'login',
        }"
        class="text-weight-bold"
        size="lg"
        flat
        rounded
      />
    </div>
  </q-page>
</template>
