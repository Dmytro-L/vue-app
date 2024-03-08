<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "../store/auth";
import { useOrdersStore } from "../store/orders";
import { useRoute, useRouter } from "vue-router";
import Card from "primevue/card";
import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import { Order } from "@/types/types";
import Dialog from "primevue/dialog";
import CreateFormPage from "./CreateFormPage.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const ordersStore = useOrdersStore();
const user = ref<string>();
const visible = ref<boolean>(false);
const selectedData = ref<Order | null>(null);

const authType = route.params.id;

const itemsList = computed<Order[]>(() => {
  console.log("authType", authType);
  
  return authType
    ? ordersStore.orders.filter((item: Order) => item.userId == authType)
    : ordersStore.orders;
});

const getUser = () => {
  user.value = authStore.user.name;
};

const handleCreateRequestClick = () => {
  const id = router.currentRoute.value.params.id;

  router.push({ name: "create", params: { id } });
};
onMounted(() => {
  getUser();
});

const formatDate = (unixTimestamp: number) => {
  const date = new Date(unixTimestamp * 1000);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const onRowSelect = (event: any) => {
  selectedData.value = event.target.value;
};
</script>

<template>
  <Card>
    <template #title>{{
      user ? user + " orders" : "List of all orders"
    }}</template>
    <template #content>
      <Button
        label="Create Order"
        severity="secondary"
        @click="handleCreateRequestClick"
      />
      <DataTable
        v-model:selection="selectedData"
        @rowSelect="
          () => {
            visible = true;
            onRowSelect;
          }
        "
        selectionMode="single"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        :value="itemsList"
      >
        <Column field="userId" header="User Id"></Column>
        <Column field="cityFrom" header="City from"></Column>
        <Column field="cityTo" header="City to"></Column>
        <Column field="parcelType" header="Parcel type"></Column>
        <Column field="dispatchDate" header="Dispatch date">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.dispatchDate) }}
          </template>
        </Column>
        <Column field="requestType" header="Request type"></Column>
        <Column field="dispatchDate" header="Dispatch date">
          <template #body="slotProps">
            <div class="button-block">
              <Button
                severity="danger"
                icon="pi pi-delete-left"
                @click="ordersStore.deleteOrder(slotProps.data.id)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
  <Dialog
    v-model:visible="visible"
    modal
    header="Edit Profile"
    :style="{ width: '25rem' }"
  >
    <CreateFormPage
      :edit-form="true"
      @closeModal="visible = false"
      :data-edit="selectedData as Record<string, any> | undefined"
    />
  </Dialog>
</template>

<style lang="scss" scoped>
.button-block {
  display: flex;
  gap: 10px;
}
</style>
