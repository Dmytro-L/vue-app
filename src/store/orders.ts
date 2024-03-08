import { v4 as uuidv4 } from "uuid";
import { defineStore } from "pinia";
import { Order } from "@/types/types";

export const useOrdersStore = defineStore("orders", {
  state: () => ({
    orders: JSON.parse(localStorage.getItem("orders") || "[]"),
  }),
  actions: {
    addOrder(order: Order) {
      const orderWithId = { ...order, id: uuidv4() };
      this.orders.push(orderWithId);
      localStorage.setItem("orders", JSON.stringify(this.orders));
    },
    deleteOrder(orderId: string) {
      this.orders = this.orders.filter((order: Order) => order.id !== orderId);
      localStorage.setItem("orders", JSON.stringify(this.orders));
    },
    editOrder(orderId: string, updatedOrder: Order) {
      const orderIndex = this.orders.findIndex(
        (order: Order) => order.id === orderId
      );
      if (orderIndex !== -1) {
        this.orders[orderIndex] = { ...updatedOrder, id: orderId };
        localStorage.setItem("orders", JSON.stringify(this.orders));
      }
    },
    loadOrders() {
      this.orders = JSON.parse(localStorage.getItem("orders") || "[]");
    },
  },
});
