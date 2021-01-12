<template>
  <div id="app" :class="{ appNormalDisplay: !disableMenu, appFaceRecognition: disableMenu}">
    <menu-frame
        v-if="!disableMenu"
        class="mb-4"
        @update:side-bar-hidden="(b) => (margin = !b)"
        :links="parsedLinks"
    />
      <div :class="{ 'super-container':!disableMenu, margin: !disableMenu }">
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </div>
    <br />
  </div>
</template>

<script>
import { cloneDeep } from "lodash";

import "./assets/fonts/style.css";
import "./assets/scss/invision.scss";

import MenuFrame from "@/components/Navegacao/MenuFrame";
import loginService from "@/services/login";
import { routes } from "@/router";
import { perms } from "@/helpers/auth";

export default {
  name: "App",
  components: {
    MenuFrame,
  },
  data() {
    return {
      loginChangeCallback: null,
      routes,
      links: [
        {
          to: {
            name: "home",
          },
          name: "Dashboard",
          icon: "dashboard",
          showPerms: perms(["r_visualizar"]),
        },
        {
          to: {
            name: "usuario",
          },
          name: "Usuários",
          icon: "user",
          showPerms: perms(["rw_usuario"]),
        },          
      ],
      parsedLinks: [],
    };
  },

  computed: {
    disableMenu() {
      return this.$store.state.disableMenu;
    },
  },

  methods: {
    updateLinks() {
      //*  Utilizando cloneDeep nós fazemos o JS criar um novo array links
      //*  em vez de apontar para o mesmo endereço de memória do "this.links".
      //*  isso permite que alteremos links sem alterar "this.links"
      let links = cloneDeep(this.links);

      this.parsedLinks = links.filter((ln, index) => {
        if (ln.showPerms) {
          return loginService.verifyPermissions(ln.showPerms);
        } else if (ln.children.length) {
          links[index].children = ln.children.filter((ln2) =>
            ln2.showPerms ? loginService.verifyPermissions(ln2.showPerms) : true
          );
          return links[index].children.length > 0;
        } else {
          return true;
        }
      });
    },
  },

  created() {
    this.updateLinks();
    this.loginChangeCallback = this.updateLinks.bind(this);
    this.$root.$on("loginChange", this.loginChangeCallback);
    loginService.validateToken();

    this.$validator.extend("greaterThanZero", {
      getMessage: (field) => field + " precisa ser maior do que zero",
      validate: (value) => {
        if (value > 0) return true;
        return false;
      },
    });
  },

  beforeDestroy() {
    this.$root.$off("loginChange", this.loginChangeCallback);
  },
};
</script>

<style>
html,
body {
  padding: 0;
  margin: 0;
  border: 0;
}

* {
  font-family: "Poppins", "sans-serif" !important;
}

#app {
  /* font-family: "Avenir", Helvetica, Arial, sans-serif; */
  background-color: rgb(246, 188, 63);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.appNormalDisplay {
  min-height: 100vh;
  padding-top: 64px;
}

.appFaceRecognition {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

</style>

<style scoped>
.super-container {
  transition: margin-left 0.3s ease-in-out;
}

.super-container.margin {
  margin-left: 70px;
}
</style>
