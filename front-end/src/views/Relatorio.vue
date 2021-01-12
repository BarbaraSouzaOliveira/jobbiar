<template>
  <b-container >
    <b-card class="invision-card borderless elevate-2 invision-top">
      <b-card-header class="borderless invision-sub-heading">
        Lista de relatórios
      </b-card-header>
      <b-list-group>
        <b-list-group-item :to="{ name: 'MaskReport' }">Relatório Ausência de Máscaras</b-list-group-item>
      </b-list-group>
    </b-card>
  </b-container>
</template>

<script>

export default {
  name: "Home",
  data() {
    return {
      nome: "Relatórios"
    };
  },
};
</script>

<style scoped>
.card-header + .list-group .list-group-item:first-child {
  border-top: 1px solid rgba(0, 0, 0, 0.125) !important;
}
</style>
