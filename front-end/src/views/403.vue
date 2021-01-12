<template>
    <b-container>
      <b-card class="invision-card elevate-2 invision-top borderless text-center">
        <h3 class="invision-heading">
          Você não possui permissão suficiente para acessar esta página
        </h3>
        <div class="mt-4">
          <b-btn variant="secondary" class="invision-btn mr-2" @click="$router.back()">Voltar</b-btn>
          <b-btn variant="success" :to="{ name: 'logout', params: { next: $route.params.next } }" class="invision-btn lg">Trocar usuário</b-btn>
        </div>
      </b-card>
    </b-container>
</template>
