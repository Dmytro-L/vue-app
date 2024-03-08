import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from './store/auth';

export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = authStore.user.name;

  if (requiresAuth && !isAuthenticated) {
    next('/');
  } else {
    next();
  }
};