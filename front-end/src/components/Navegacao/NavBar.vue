<template>
  <nav
    class="navbar fixed-top pl-0 d-flex justify-content-between align-items-center"
  >
    <div class="navbar-left d-flex align-items-center h-100">
      <div
        class="init py-1 d-flex justify-content-center align-items-center"
        :class="showBackButton ? 'mr-0 ' : 'mr-3'"
        ref="navbar-header"
      >
        <div
          class="toggle-menu p-3 h-100 d-flex justify-content-center align-items-center text-white"
          @click="menuButtonClicked"
        >
          <menu-icon />
        </div>
        <div class="d-flex align-items-center spaced brand">
          <h1 class="mb-0 logo">Jobbiar</h1>
        </div>
      </div>
      <div
        class="go-back px-2 mr-2 d-flex justify-content-center align-items-center"
        @click="backButtonClicked"
        :class="{ 'force-hidden': !showBackButton }"
      >
        <arrow-left-icon />
      </div>

    </div>
    <div class="navbar-right d-flex align-items-center h-100 pr-2 py-1">
      <div class="d-flex align-items-center justify-content-center pl-1 mr-2">
        <div class="vertical-separator"></div>
      </div>
      <div class="user p-1 d-flex" v-if="usuario">
        <div class="avatar mr-2 text-white"><user-icon /></div>
        <div class="d-flex align-items-center">
          <div class="wrapper">
            <p class="name mb-0">
              <strong>{{ usuario || "Desconectado" }}</strong>
            </p>
            <p class="role mb-0">
              {{ cargo || "-" }}
              <span
                v-if="descricao"
                :title="descricao"
                v-b-tooltip.hover.bottom.viewport
              >
                <font-awesome-icon icon="question-circle" />
              </span>
            </p>
          </div>
          <b-btn
            variant="light"
            :to="{ name: 'logout' }"
            class="ml-2 mr-2 log-in-out-btn"
            title="Sair"
            v-b-tooltip.hover.viewport
            ><log-out-icon
          /></b-btn>
        </div>
      </div>
      <div v-else>
        <b-btn
          variant="light"
          :to="{ name: 'login' }"
          class="ml-2 mr-2 log-in-out-btn"
          title="Entrar"
          v-b-tooltip.hover.left.viewport
          ><log-in-icon
        /></b-btn>
      </div>
    </div>

    <div
      class="w-100 py-3 collapse"
      :class="{ show: !collapsed }"
      id="navbarToggle"
      style=""
    >
      <div class="container d-flex justify-content-between align-items-center">
        TODO - COLLAPSED
      </div>
    </div>
    <div
      class="more d-none justify-content-center align-items-center p-3"
      :class="{ collapsed: collapsed }"
      @click="toggleCollapsed"
      data-toggle="collapse"
      data-target="#navbarToggle"
      aria-controls="navbarToggle"
      :aria-expanded="!collapsed"
      aria-label="Mostrar mais"
    >
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="dimgray"
          d="M14 12c0-0.269-0.054-0.528-0.152-0.765-0.102-0.246-0.25-0.465-0.434-0.649s-0.404-0.332-0.649-0.434c-0.237-0.098-0.496-0.152-0.765-0.152s-0.528 0.054-0.765 0.152c-0.246 0.102-0.465 0.25-0.649 0.434s-0.332 0.404-0.434 0.649c-0.098 0.237-0.152 0.496-0.152 0.765s0.054 0.528 0.152 0.765c0.102 0.246 0.25 0.465 0.434 0.649s0.404 0.332 0.649 0.434c0.237 0.098 0.496 0.152 0.765 0.152s0.528-0.054 0.765-0.152c0.246-0.102 0.465-0.25 0.649-0.434s0.332-0.404 0.434-0.649c0.098-0.237 0.152-0.496 0.152-0.765zM21 12c0-0.269-0.054-0.528-0.152-0.765-0.102-0.246-0.25-0.465-0.434-0.649s-0.404-0.332-0.649-0.434c-0.237-0.098-0.496-0.152-0.765-0.152s-0.528 0.054-0.765 0.152c-0.246 0.102-0.465 0.25-0.649 0.434s-0.332 0.404-0.434 0.649c-0.098 0.237-0.152 0.496-0.152 0.765s0.054 0.528 0.152 0.765c0.102 0.246 0.25 0.465 0.434 0.649s0.404 0.332 0.649 0.434c0.237 0.098 0.496 0.152 0.765 0.152s0.528-0.054 0.765-0.152c0.246-0.102 0.465-0.25 0.649-0.434s0.332-0.404 0.434-0.649c0.098-0.237 0.152-0.496 0.152-0.765zM7 12c0-0.269-0.054-0.528-0.152-0.765-0.102-0.246-0.25-0.465-0.434-0.649s-0.404-0.332-0.649-0.434c-0.237-0.098-0.496-0.152-0.765-0.152s-0.528 0.054-0.765 0.152c-0.246 0.102-0.465 0.25-0.649 0.434s-0.332 0.404-0.434 0.649c-0.098 0.237-0.152 0.496-0.152 0.765s0.054 0.528 0.152 0.765c0.102 0.246 0.25 0.465 0.434 0.649s0.404 0.332 0.649 0.434c0.237 0.098 0.496 0.152 0.765 0.152s0.528-0.054 0.765-0.152c0.246-0.102 0.465-0.25 0.649-0.434s0.332-0.404 0.434-0.649c0.098-0.237 0.152-0.496 0.152-0.765z"
        ></path>
      </svg>
    </div>
  </nav>
</template>

<script>
/**
 * ======================================================================================
 * Este módulo escuta eventos do root. São eles:
 * --------------------------------------------------------------------------------------
 * - loginChange
 * --------------------------------------------------------------------------------------
 * - navbar/tituloExtra
 * 	   Define um título adicional ao que está no arquivo de rotas.
 *     Esse título adicional é limpo sempre que a rota muda. Caso esse evento seja chamado
 * mais de uma vez, a texto dado na segunda chamada sobreescreverá o dado na primeira,
 * e assim por diante.
 *     Para emitir o evento, de (quase) qualquer lugar do código, chame
 * 		    this.$root.$emit('navbar/tituloExtra', 'meu título extra');
 * ======================================================================================
 */

const PLACEHOLDER_TITLE = "InVision";
import { debounce } from "@/helpers/common";

import login from "@/services/login";

export default {
  props: {
    showBackButton: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      titulo: PLACEHOLDER_TITLE,
      maxWidthIntervalUpdates: 0,
      resFn: null,
      collapsed: true,
      usuario: "",
      cargo: "",
      descricao: "",
      tituloExtra: "",
    };
  },
  methods: {
    menuButtonClicked() {
      this.$emit("menu-button-click");
    },
    backButtonClicked() {
      this.$emit("back-button-click");
    },
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    updateTitle(newVal) {
      this.titulo = newVal || PLACEHOLDER_TITLE;
      this.tituloExtra = "";
    },
    setUser() {
      const user = login.getUser();
      this.usuario = user ? user.nome : "";
      this.cargo = user ? user.grupo : "";
      this.descricao = user ? user.descricao : "";
    },
  },

  watch: {
    "$route.meta.title": "updateTitle",
  },
  mounted() {
    this.updateTitle(this.$route.meta.title);
    this.resFn = debounce(() => {
      if (this.$refs["navbar-header"]) {
        let hWidth = getComputedStyle(
          this.$refs["navbar-header"],
          null
        ).getPropertyValue("width");
        this.$emit("change-max-width", parseFloat(hWidth.replace("px", "")));
      }
    }, 300).bind(this);

    // atualiza maxWidth ao redimensionar a janela do navegador
    window.addEventListener("resize", this.resFn);

    // atualiza maxWidth de tempos em tempo nos primeiros minutos por causa do carregamento de fontes
    const UPDATE_INTERVAL = 5000; // ms
    const MAX_INTERVAL_UPDATES = Math.ceil((1 * 60 * 1000) / UPDATE_INTERVAL); // 1 minuto

    (function updateMaxWidth() {
      this.resFn();
      if (++this.maxWidthIntervalUpdates < MAX_INTERVAL_UPDATES) {
        setTimeout(updateMaxWidth.bind(this), UPDATE_INTERVAL);
      }
    }.bind(this)());
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resFn);
  },
  created() {
    this.setUser();
    this.$root.$on("loginChange", () => this.setUser());
    this.$root.$on("navbar/tituloExtra", (titulo) => {
      this.tituloExtra = titulo;
    });
  },
  computed: {},
};
</script>


<style scoped>
:root {
  --primary-color-10: #209f85;
  --neutral-color-10: #35384d;
}

.force-hidden {
  display: none !important;
}

.spaced {
  padding-left: 30px;
  padding-right: 30px;
}

.linhas-btn {
  width: 48px;
  height: 43px;
  margin-top: -1px;
  margin-right: -4px;
}

.vertical-separator {
  width: 0;
  height: 30px;
  border-right: 1px solid #ddd;
}

.w-100 {
  width: 100% !important;
}

@media (min-width: 768px) and (max-width: 1158px) {
  .container-fluid > .navbar-collapse,
  .container-fluid > .navbar-header {
    margin-right: -15px !important;
    margin-left: -15px !important;
  }

  .navbar-toggle {
    display: block !important;
  }

  .navbar > .container-fluid .navbar-brand {
    margin-left: 0px !important;
  }

  .navbar-nav {
    margin: 7.5px -15px !important;
    float: none !important;
  }

  .navbar-nav > li,
  .navbar-header {
    float: none !important;
  }

  /* .navbar-right {
          float: none !important;
          margin-right: -15px !important;
      } */

  /* .navbar-collapse.collapse {
          display: none !important;
      } */

  /* .collapse.in {
          display: block !important;
      } */
}

/* --- NAVBAR --- */
.navbar {
  background-color: white;
  color: var(--neutral-color-10);
  /* padding: .5rem 1rem; */
  padding: 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  z-index: 999;
}

.navbar .init {
  background-color: white;
}

.navbar .toggle-menu {
  width: 70px;
  cursor: pointer;
  transition: 0.3s;
}

.navbar .toggle-menu svg {
  color: #35384d;
}

.navbar .logo,
.navbar .produto {
  color: var(--neutral-color-10);
}

.navbar .logo {
  /* height: 40px */
  font-family: "Poppins";
  font-weight: 300;
  font-size: 2em;
}

.navbar .produto {
  font-weight: 200;
  font-size: 2em;
}

.navbar .vertical-line {
  width: 3px;
  height: 25px;
  border-right: 2px solid #35384d;
}

.navbar .navbar-left {
  position: relative;
  height: 100%;
}

.navbar-icon {
  cursor: pointer;
  /* fill: dimgray */
}

.navbar .user {
  border-radius: 10px;
  transition: 0.3s;
}

/* .navbar .user:hover {
		background-color: rgba(0, 0, 0, 0.05);
	} */

.navbar .user .avatar {
  background-color: var(--primary-color-10);
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 9px;
  border-radius: 10px;
  /* border-color: #007bff;
		border-style: solid;
		border-width: 1px; */
}

.navbar .user .role {
  font-size: 0.8rem;
}

.navbar .more {
  transition: 0.3s;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  height: 64px;
}

.navbar .more[aria-expanded="true"] {
  transform: rotate(90deg);
}

@media (min-width: 791px) {
  .navbar .collapse {
    background-color: red !important;
    display: none !important;
  }
}

@media (max-width: 790px) {
  .navbar-right {
    display: none !important;
  }

  .navbar .more {
    display: flex !important;
  }

  .navbar .brand {
    display: none !important;
  }
}

.btn.log-in-out-btn {
  background-color: #fff;
  color: dimgrey;
}
</style>
