<script setup lang="ts">
import Card from "primevue/card";
import Button from "primevue/button";
import { useRouter } from "vue-router";

const router = useRouter();

const navigateToLogin = () => {
  router.push("/login/auth");
};

const navigateToRegister = () => {
  router.push("/register/auth");
};
</script>

<template>
  <Card>
    <template #title>Chose your way...</template>
    <template #content>
      <Button label="Login" raised @click="navigateToLogin" />
      <Button
        label="Register"
        severity="secondary"
        raised
        @click="navigateToRegister"
      />
    </template>
  </Card>
</template>

<style lang="scss">
.p-card {
  width: auto;
  margin: auto;
  text-align: center;
}
.p-card-body .p-card-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
</style>
