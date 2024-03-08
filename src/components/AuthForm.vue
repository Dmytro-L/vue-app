<script setup lang="ts">
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import { UserData } from "@/types/types";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../store/auth";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import { debounce } from "lodash";

const AUTH_TYPE_LOGIN = "login";
const AUTH_TYPE_REGISTER = "register";

const route = useRoute();
const router = useRouter();
const authType = route.params.type;
const authStore = useAuthStore();
const toast = useToast();

const userData = ref<UserData>({
  email: "",
  password: "",
  name: "",
});

const handleAuth = () => {
  try {
    if (
      !userData.value.email ||
      !userData.value.password ||
      (authType === AUTH_TYPE_REGISTER && !userData.value.name)
    ) {
      toast.add({
        severity: "error",
        summary: "Error Message",
        detail: "All fields are required",
        life: 3000,
      });
      return;
    }

    if (authType === AUTH_TYPE_LOGIN) {
      authStore.login(userData.value);
      navigateAfterAuth();
      toast.add({
        severity: "contrast",
        summary: "Successful Login",
        detail: "Successful Login",
        life: 3000,
      });
    } else if (authType === AUTH_TYPE_REGISTER) {
      authStore.register(userData.value);
      toast.add({
        severity: "contrast",
        summary: "Successful Registration",
        detail: "Successful Registration",
        life: 3000,
      });

      if (authStore.user.id) {
        navigateAfterAuth();
      }
    }
  } catch (error: any) {
    console.log("error", error.message);

    toast.add({
      severity: "error",
      summary: "Error Message",
      detail: error.message,
      life: 3000,
    });
  }
};

const navigateAfterAuth = () => {
  setTimeout(() => {
    router.push({ name: "id", params: { id: authStore.user.id } });
  }, 1500);
};

const handleCancelAuth = () => {
  router.push("/");
};

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validateEmail = debounce((email: string) => {
  if (!emailRegex.test(email)) {
    toast.add({
      severity: "error",
      summary: "Error Message",
      detail: "Invalid email format",
      life: 3000,
    });
    userData.value.email = "";
  }
}, 4000);

watch(
  userData,
  (newVal) => {
    validateEmail(newVal.email);
  },
  { deep: true }
);
</script>

<template>
  <Toast />
  <Card>
    <template #title>
      <h2>{{ authType }}</h2>
    </template>

    <template #content>
      <FloatLabel v-if="authType === AUTH_TYPE_REGISTER">
        <InputText id="name" v-model="userData.name" required />
        <label for="name">Name</label>
      </FloatLabel>
      <FloatLabel>
        <InputText id="email" v-model="userData.email" type="email" required />
        <label for="email">E-mail</label>
      </FloatLabel>
      <FloatLabel>
        <InputText id="password" v-model="userData.password" required />
        <label for="password">Password</label>
      </FloatLabel>
      <Button
        label="Cancel"
        severity="secondary"
        raised
        @click="handleCancelAuth"
      />
      <Button :label="authType" raised @click="handleAuth" />
    </template>
  </Card>
</template>

<style lang="scss" scoped>
.p-card {
  width: auto;
  margin: auto;
  text-align: center;

  h2 {
    text-transform: capitalize;
  }
}

.p-card-body .p-card-content {
  display: flex;
  gap: 30px;

  button {
    text-transform: capitalize;
  }
}
</style>
