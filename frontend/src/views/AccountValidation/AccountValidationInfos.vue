<script setup>
let demand = {
  id: 1,
  number: "123456789",
  email: "test@he-arc.ch",
};
</script>

<template>
  <q-card class="q-mb-md">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">Informations sur la demande</div>
    </q-card-section>

    <q-card-section>
      <q-list>
        <q-item>
          <q-item-section avatar>
            <q-icon name="pin" />
          </q-item-section>
          <q-item-section
            >Numéro de la demande : {{ demand.number }}</q-item-section
          >
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-icon name="mail" />
          </q-item-section>
          <q-item-section> Adresse e-mail : {{ demand.email }} </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>

  <q-card class="q-mb-md">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">Photo de la demande</div>
    </q-card-section>

    <q-card-section>
      <!-- center the image -->
      <div class="row justify-center">
        <q-img
          src="https://cdn.quasar.dev/img/parallax2.jpg"
          style="width: 50%; height: 100%"
        />
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn color="red" icon="close" />
      <q-btn color="green" icon="check" />
    </q-card-actions>
  </q-card>
</template>
