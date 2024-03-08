<script setup lang="ts">
import Card from "primevue/card";
import Button from "primevue/button";
import { useRouter } from "vue-router";
import { requestTypes } from "../constants/consts";

const router = useRouter();

const navigateToCreateRequest = (type: string) => {
  if (type === requestTypes.ORDER_TYPE) {
    router.push({ name: "createOrder", params: { type } });
  } else if (type === requestTypes.DELIVERY_TYPE) {
    router.push({ name: "createDeliver", params: { type } });
  }
};
</script>

<template>
  <Card>
    <template #title>Create request</template>
    <template #content>
      <h2>Chose type of request...</h2>
      <Button
        label="Order"
        severity="secondary"
        raised
        @click="navigateToCreateRequest(requestTypes.ORDER_TYPE)"
      />
      <Button
        label="Deliver"
        severity="secondary"
        raised
        @click="navigateToCreateRequest(requestTypes.DELIVERY_TYPE)"
      />
    </template>
  </Card>
</template>

<style scoped></style>
