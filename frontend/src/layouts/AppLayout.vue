<script setup>
import { RouterView } from "vue-router";
import { APP_NAME, FOOTER_TEXT } from "./../constants";
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
            <q-toolbar-title> Ratio 5 </q-toolbar-title>
          </div>
          <div class="col"></div>
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
