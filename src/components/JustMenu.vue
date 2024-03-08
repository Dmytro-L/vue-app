<script setup lang="ts">
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { UserData } from "@/types/types";

const authStore = useAuthStore();
const currentUser = computed<UserData | null>(() => authStore.user);
const router = useRouter();

const handleNavigateMenu = (path: string) => {
  if (path === "/logout") {
    localStorage.removeItem("currentUser");
    authStore.logout();
    router.push("/");
  } else {
    router.push({ name: path, params: { id: currentUser.value?.id } });
  }
};

const menuItems = computed(() => {
  const baseMenu = [{ id: "1", name: "List Requests", path: "listRequests" }];

  if (currentUser.value?.id) {
    return [
      ...baseMenu,
      { id: "2", name: "Create request", path: "create", params: { id: currentUser.value.id } },
      { id: "3", name: "My Requests", path: "userRequests", params: { id: currentUser.value.id } },
      { id: "5", name: "Logout", path: "/logout" },
    ];
  } else {
    return [...baseMenu, { id: "4", name: "Auth", path: "authPage" }];
  }
});
</script>

<template>
  <div class="top-menu">
    <ul class="menu-list">
      <li
        v-for="item in menuItems"
        :key="item.id"
        class="menu-item"
        @click="handleNavigateMenu(item.path)"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.top-menu {
  padding: 5px 0;
  background-color: #167f59;
}
.menu-list {
  display: flex;
  list-style: none;
  justify-content: center;
  gap: 30px;
  transition: all ease 0.3s;

  .menu-item {
    padding: 15px;
    border-radius: 25px;
    cursor: pointer;

    &:hover {
      transform: scale(1.1);
      color: dark-blue;
      transition: all ease 0.3s;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
