import { defineStore } from "pinia";
import { UserData } from "@/types/types";
import { v4 as uuidv4 } from "uuid";

export const useAuthStore = defineStore("auth", {
  state: () => {
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem("users") || "[]");
      if (!Array.isArray(users)) {
        users = [];
      }
    } catch (error) {
      console.error("Error parsing users from localStorage:", error);
    }
    return {
      user: JSON.parse(localStorage.getItem("currentUser") || "{}") as UserData,
      users: users as UserData[],
    };
  },
  actions: {
    login(loginData: UserData) {
      const user = this.users.find(
        (user) =>
          user.email === loginData.email && user.password === loginData.password
      );
      if (!user) {
        throw new Error("User not found");
      }
      this.user = user;
      localStorage.setItem("currentUser", JSON.stringify(this.user));
    },
    register(registerData: UserData) {
      const userExists = this.users.some(
        (user) =>
          user.email === registerData.email || user.name === registerData.name
      );
      if (userExists) {
        throw new Error("User with this email or name already exists");
      }
      const newUser: UserData = { id: uuidv4(), ...registerData }; // використовуємо uuid для генерації унікального ID
      this.users.push(newUser);
      this.user = newUser;

      localStorage.setItem("users", JSON.stringify(this.users));
      localStorage.setItem("currentUser", JSON.stringify(newUser));
    },
    logout() {
      this.user = {} as UserData;
      localStorage.removeItem("currentUser");
    },
  },
});
