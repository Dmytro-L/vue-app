import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import CreateRequest from "./components/CreateRequest.vue";
import ListRequests from "./components/ListRequests.vue";
import AuthPage from "./components/AuthPage.vue";
import AuthForm from "./components/AuthForm.vue";
import CreateFormPage from "./components/CreateFormPage.vue";
import { authGuard } from './auth-guard';

const routes: Array<RouteRecordRaw> = [
  { path: "/:id/create", component: CreateRequest, name: 'create', meta: { requiresAuth: true }},
  { path: "/:id/create/order", component: CreateFormPage, name: 'createOrder', meta: { requiresAuth: true }},
  { path: "/:id/create/deliver", component: CreateFormPage, name: 'createDeliver', meta: { requiresAuth: true }},
  { path: "/:id/requests", component: ListRequests, name: 'userRequests', meta: { requiresAuth: true }},
  { 
    path: "/:id", 
    redirect: to => {
      return { name: 'userRequests', params: { id: to.params.id }};
    },
    name: 'id'
  },
  { path: "/requests", component: ListRequests, name: 'listRequests' },
  { path: "/:type/auth", component: AuthForm, name: 'authForm', meta: { requiresAuth: false }},
  { path: "/", component: AuthPage, name: 'authPage' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authGuard);

export default router;