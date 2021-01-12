'use strict';

import VueRouter from 'vue-router';

import loginService from './services/login';
import { perms } from './helpers/auth';

export const routes = [
  // Dashboard
  {
    name: 'home',
    path: '/',
    component: resolve => require(['@/views/Dashboard/Home.vue'], resolve),
    meta: {
      title: 'Dashboard',
      perms: perms(['r_visualizar']),
    },
  },
  //Login
  {
    name: 'login',
    path: '/login',
    component: resolve => require(['@/views/401.vue'], resolve),
    meta: {
      title: 'Login',
      perms: perms(),
    },
  },
  {
    name: '403',
    path: '/forbidden',
    component: resolve => require(['@/views/403.vue'], resolve),
    meta: {
      title: 'Permissão insuficiente',
      perms: perms(),
    },
  },
  {
    name: 'logout',
    path: '/logout',
    component: resolve => require(['@/views/Logout.vue'], resolve),
    meta: {
      title: 'Logout',
      perms: perms(),
    },
  }, 
  //Usuários
  {
    name: 'usuario',
    path: '/usuario',
    component: resolve => require(['@/views/Usuario/List.vue'], resolve),
    meta: {
      title: 'Usuários',
      perms: perms(['rw_usuario']),
    },
  },
  {
    name: 'usuarioEditar',
    path: '/usuario/editar/:id',
    component: resolve => require(['@/views/Usuario/Edit.vue'], resolve),
    meta: {
      title: 'Usuários',
      perms: perms(['rw_usuario']),
    },
  },
  {
    name: 'usuarioAdicionar',
    path: '/usuario/adicionar',
    component: resolve => require(['@/views/Usuario/Add.vue'], resolve),
    meta: {
      title: 'Usuários',
      perms: perms(['rw_usuario']),
    },
  },    
  // 404 (precisa ser a última rota deste arquivo)
  {
    name: '404',
    path: "*",
    component: resolve => require(['@/views/404.vue'], resolve),
    meta: {
      title: 'Página não encontrada',
      perms: perms(),
    },
  },
];

export const router = new VueRouter({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  if (!to.meta.perms) next(); // página pública
  else if (!loginService.isLoggedIn()) next({ name: 'login', params: { next: to }}); // não logado
  else if (!loginService.verifyPermissions(to.meta.perms)) next({ name: '403', params: { next: to }}); // sem permissão
  else next(); // acesso permitido
});
