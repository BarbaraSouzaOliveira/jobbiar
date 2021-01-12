<template>
  <div>
    <nav-bar @menu-button-click="toggleSideBar" @change-max-width="updateSideBarWidth" />
    <side-bar :hidden="sideBarHidden || noPermission" :max-width="sideBarMaxWidth" @link="sideBarLinkClicked" :links="links" />
  </div>
</template>

<script>
import NavBar from './NavBar.vue'
import SideBar from './SideBar.vue'

export default {
  name: 'MenuFrame',
  components: {
    NavBar,
    SideBar,
  },
  data () {
    return {
      sideBarHidden: true,
      sideBarMaxWidth: 0,
      initialized: false,
    }
  },
  props: {
    links: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    noPermission () {
      return this.$route.name === 'login' || this.$route.name === 'logout';
    }
  },
  watch: {
    noPermission() {
      this.$emit('update:side-bar-hidden', this.sideBarHidden || this.noPermission);
    }
  },
  methods: {
    setHidden (hidden) {
      if (this.noPermission && this.initialized) return;
      this.sideBarHidden = hidden;
      this.$emit('update:side-bar-hidden', hidden || this.noPermission);
    },
    toggleSideBar () {
      this.setHidden(!this.sideBarHidden);
    },
    updateSideBarWidth (w) {
      this.sideBarMaxWidth = w;
      if (!this.initialized) {
        // detacta celular e encolhe a barra
        this.setHidden(w < 100)
        this.initialized = true;
      }
    },
    sideBarLinkClicked () {
      if (window.innerWidth <= 790) // testa mobile
        this.toggleSideBar();
    },
  },
}
</script>
