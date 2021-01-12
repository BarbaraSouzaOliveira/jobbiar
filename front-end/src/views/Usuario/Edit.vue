<template>
  <div>
    <b-container>
      <Form :editing="true"/>
    </b-container>
  </div>
</template>

<script>
import Form from './Form.vue';

export default {
  components: {
    Form
  },

};
</script>
