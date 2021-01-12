<template>
  <div>
    <b-avatar
      :src="this.imageSrc || null"
      :size="this.size + 'rem'"
      class="avatar"
    ></b-avatar>
  </div>
</template>

<script>
export default {
  name: "GenericAvatar",
  props: {
    size: {
      type: Number,
      default: 4,
    },
    id: {
      require: true,
    },
  },

  computed: {
    imageSrc() {
      return this.$store.state.avatarImages[this.id];
    }
  },

  mounted() {
    this.$store.dispatch("getAvatarImage", { id: this.id });
  },
};
</script>

<style>
.avatar {
  margin: 1rem;
}
</style>
