<script setup></script>

<template>
  <q-layout>
    <q-page-container class="q-pa-md">
      <div class="row items-center q-mb-md">
        <h2 class="text-h4 q-mr-md">Bienvenue sur ArcAled</h2>
      </div>

      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Procédure de création d'un compte</div>
        </q-card-section>

        <q-card-section>
          <q-list>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="photo_camera" color="teal" />
              </q-item-section>
              <q-item-section
                >Fournir une photo claire de votre visage en tenant votre carte
                étudiante de manière visible (nom + prénom +
                photo)</q-item-section
              >
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="warning" color="warning" />
              </q-item-section>
              <q-item-section>
                Veuillez respecter ces règles, toutes demandes non conformes
                entraineront un bannissement définitif sur
                ArcAled</q-item-section
              >
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <div class="q-mt-lg"></div>
    </q-page-container>
  </q-layout>
</template>
