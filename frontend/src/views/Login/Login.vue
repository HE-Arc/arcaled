<!--
ArcAled made by Lucas Perrin, Rui Marco Loureiro and Sebastien Chappuis
File's version : 1.0
this file is used for : login page

Wrote by : Rui Marco Loureiro
updated by : Rui Marco Loureiro
-->

<script setup>
import { ref, computed } from "vue";
import { useStore as useAuthStore } from "../../store/auth.store";
import router from "../../router";

const authStore = useAuthStore();

const email = ref("");
const password = ref("");

const formIsValid = computed(() => {
  return email.value && password.value;
});

const onSubmit = async () => {
  if (email.value && password.value) {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    if (authStore.user) {
      router.push({ name: "app" });
    }
  }
};

const onReset = () => {
  email.value = "";
  password.value = "";
};
</script>

<template>
  <q-page class="q-pa-md" style="max-width: 1000px; margin: 0 auto">
    <q-card class="q-mb-md">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Login</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input
            outlined
            v-model="email"
            type="text"
            prefix="Email:"
            lazy-rules
            :rules="[
              (val) => !!val || 'Veuillez entrer votre email',
              // l'email doit se finir avec @he-arc.ch
              (val) =>
                val.endsWith('@he-arc.ch') || 'Veuillez entrer un email HE-Arc',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>

          <q-input
            outlined
            v-model="password"
            type="password"
            prefix="Mot de passe:"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>

          <q-card-actions align="right">
            <q-btn
              label="Se connecter"
              type="submit"
              color="primary"
              :disabled="!formIsValid"
            />
            <q-btn
              label="Réinitialiser"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>

    <!-- Don't have an account? -->
    <div class="row justify-center q-mt-lg">
      <q-btn
        label="Je n'ai pas de compte"
        color="secondary"
        :to="{
          name: 'account-demand',
        }"
        class="text-weight-bold"
        size="lg"
        flat
        rounded
      />
    </div>
  </q-page>
</template>
