<script setup lang="ts">
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";
import FloatLabel from "primevue/floatlabel";
import Card from "primevue/card";
import Textarea from "primevue/textarea";
import { computed, onMounted, ref, toRefs } from "vue";
import Button from "primevue/button";
import { Order, UserData } from "@/types/types";
import { requestTypes } from "../constants/consts";
import { useRouter } from "vue-router";
import { useOrdersStore } from "../store/orders";
import { useAuthStore } from "../store/auth";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import { defineProps, defineEmits } from "vue";

const emit = defineEmits(["closeModal"]);

const onclosePopupForm = () => {
  emit("closeModal");
};

const props = defineProps({
  editForm: {
    type: Boolean,
    default: false,
  },
  dataEdit: {
    type: Object,
    default: {},
  },
});

const { editForm, dataEdit } = toRefs(props);

const toast = useToast();
const data = ref<Order>({
  cityFrom: "",
  cityTo: "",
  parcelType: "-",
  description: "",
});
onMounted(() => {
  if (editForm.value) {
    data.value = dataEdit.value as Order;
  }
});

const dispatchDate = ref<Date>(new Date());
const authStore = useAuthStore();
const currentUser = computed<UserData>(() => authStore.user);

const checkFormNeed = computed<boolean>(() => {
  return (
    (editForm.value && data.value.requestType === requestTypes.ORDER_TYPE) ||
    requestCurrentType === requestTypes.ORDER_TYPE
  );
});

const router = useRouter();

const useUnixTimestampData = () => {
  const date = new Date(dispatchDate.value);
  const unixTimestampData = Math.floor(date.getTime() / 1000);
  return unixTimestampData;
};

const handleSubmitForm = (): void => {
  if (
    !data.value.cityFrom ||
    !data.value.cityTo ||
    (requestCurrentType === requestTypes.ORDER_TYPE &&
      (!data.value.parcelType || !dispatchDate.value))
  ) {
    toast.add({
      severity: "error",
      summary: "All fields are required",
      detail: "Error",
      life: 3000,
    });
    return;
  }

  if (editForm.value) {
    useOrdersStore().editOrder(dataEdit.value.id, {
      ...data.value,
      dispatchDate: useUnixTimestampData(),
      userId: currentUser.value.id,
      requestType: requestCurrentType,
    });
    onclosePopupForm();
    return;
  }

  useUnixTimestampData();
  useOrdersStore().addOrder({
    ...data.value,
    dispatchDate: useUnixTimestampData(),
    userId: currentUser.value.id,
    requestType: requestCurrentType,
  });
  router.push({ name: "userRequests", params: { id: currentUser.value.id } });
};

const requestCurrentType = router.currentRoute.value.path.split("/").pop();

const parcelTypes = ["Gadgets", "Drinks", "Clothes", "Medicines", "Other"];
</script>

<template>
  <Toast />
  <Card>
    <template #title>{{
      editForm ? "" : "Form " + requestCurrentType
    }}</template>
    <template #content>
      <div class="form-wrapper">
        <div class="form-group">
          <FloatLabel>
            <InputText id="cityFrom" v-model="data.cityFrom" />
            <label for="cityFrom">City from</label>
          </FloatLabel>
          <FloatLabel>
            <InputText id="cityTo" v-model="data.cityTo" />
            <label for="cityTo">City to</label>
          </FloatLabel>
        </div>
        <div class="form-group">
          <FloatLabel v-if="checkFormNeed">
            <Dropdown
              v-model="data.parcelType"
              inputId="parcelType"
              :options="parcelTypes"
            />
            <label for="parcelType">Select type</label>
          </FloatLabel>
          <FloatLabel>
            <Calendar v-model="dispatchDate" inputId="dispatch_date" />
            <label for="dispatch_date">Dispatch date</label>
          </FloatLabel>
        </div>
        <div class="form-group" v-if="checkFormNeed">
          <FloatLabel>
            <Textarea
              v-model="data.description"
              rows="3"
              cols="30"
              autoResize
            />
            <label>Parcel description</label>
          </FloatLabel>
        </div>
        <Button label="Submit" @click="handleSubmitForm" />
      </div>
    </template>
  </Card>
</template>

<style lang="scss">
.p-card {
  width: 100%;
}

.form-wrapper {
  display: flex;
  gap: 30px;
  margin-top: 25px;
  flex-wrap: wrap;
  flex-direction: column;

  .form-group {
    display: flex;
    gap: 20px;

    .p-float-label,
    .p-component {
      width: 100%;
    }
  }
}
</style>
