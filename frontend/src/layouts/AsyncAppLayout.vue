<script setup>
import { RouterView } from "vue-router";
import { storeToRefs } from "pinia";

import { APP_NAME, FOOTER_TEXT } from "./../constants";
import { useStore as useAuthStore } from "../store/auth.store";
import { useStore as useUserStore } from "../store/user.store";
import { useStore as useRequestsStore } from "../store/requests.store";

const authStore = useAuthStore();
const userStore = useUserStore();
const requestsStore = useRequestsStore();

const { ratio } = storeToRefs(userStore);

const numberOfRequests =
  (await requestsStore.accountsWaitingForValidation())?.length || 0;

await userStore.fetchRatio();
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <div class="row fit items-center">
          <div class="col">
            <q-toolbar-title>
              <q-btn
                flat
                :to="{
                  name: 'cps',
                }"
              >
                {{ APP_NAME }}</q-btn
              >
            </q-toolbar-title>
          </div>

          <div class="col-md-auto">
            <q-toolbar-title>
              <div v-if="authStore.isAuthenticated">
                <!-- Color green if ration > 0 else red -->
                <div :class="ratio > 0 ? 'text-green' : 'text-red'">
                  <strong>Ratio {{ ratio }}</strong>
                </div>
              </div>
            </q-toolbar-title>
          </div>
          <div class="col row">
            <q-space />
            <div v-if="authStore.isAuthenticated">
              <template v-if="authStore.isAdmin">
                <q-btn
                  dense
                  round
                  flat
                  icon="hourglass_top"
                  class="q-ml-md"
                  :to="{
                    name: 'accounts-waiting',
                  }"
                >
                  <q-badge color="red" floating></q-badge>
                </q-btn>
              </template>
              <q-btn
                flat
                @click="authStore.logout"
                :to="{
                  name: 'login',
                }"
                icon="logout"
              >
              </q-btn>
            </div>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <RouterView />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div>{{ FOOTER_TEXT }}</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
