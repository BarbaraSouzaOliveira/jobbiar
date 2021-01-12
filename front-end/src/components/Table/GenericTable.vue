<template>
  <template-base>
    <slot name="header">
      <div class="padding d-flex">
        <h1 class="align-self-center">Lista de {{ title }}</h1>
        <div class="spacer"></div>
        <slot name="botoes" v-if="addRoute">
          <b-button
            @click="redirectToAddRoute()"
            variant="none"
            class="btn secondary-contained-button text-white align-self-center"
            :data-cy="`Adicionar ${name}`"
          >Adicionar {{name}}</b-button>
        </slot>
      </div>
    </slot>
    <DataTable
      :async="pagination"
      :loading="loading"
      :colunas="parsedCols"
      :linhas="linhas"
      :errMsg="errMsg"
      @state-change="setStateDataTable"
      :noedit="!editRoute"
      :nosearch="nosearch"
    >
      <template #results-page v-if="pagination">
        <select
          class="float-right invision-select ml-3"
          :value="rowsPerPage"
          @input="changeResults"
          data-cy="resultados-pagina"
        >
          <option value="10">10 por página</option>
          <option value="20">20 por página</option>
          <option value="50">50 por página</option>
          <option value="100">100 por página</option>
          <option v-if="canShowAllResults" value="-1">Mostrar todos</option>
        </select>
      </template>
      <template v-for="col in cols" v-slot:[col]="{value, item}">
        <slot :name="col" :value="value" :item="item">
          <router-link
            v-if="value && value.rota && value.nome && value.id"
            :to="{ name: value.rota, params: { id: value.id }}"
            title="Ir para a edição"
          >
            <edit-icon size="16" />
            {{value.nome}}
          </router-link>
        </slot>
      </template>
    </DataTable>
    <nav aria-label="Navegar entre as páginas" class="paginador" v-if="page">
      <div>
        Mostrando resultados {{first}} a {{last}} de um total de
        <strong>{{count}}</strong>.
      </div>
      <ul class="pagination justify-content-center mb-0">
        <li class="page-item" :class="{ 'disabled': page === 1 || loading }">
          <a @click.prevent="paginate(page - 1)" class="page-link" href="#">Anterior</a>
        </li>
        <li
          class="page-item"
          v-for="p in pages"
          :key="p"
          :class="{ 'active': page === p, 'disabled': loading && page !== p }"
        >
          <a @click.prevent="paginate(p)" class="page-link" href="#">{{p}}</a>
        </li>
        <li class="page-item" :class="{ 'disabled': page === pages || loading || pages === 0 }">
          <a @click.prevent="paginate(page + 1)" class="page-link" href="#">Próxima</a>
        </li>
      </ul>
    </nav>
    <nav aria-label="Navegar entre as páginas" class="paginador" v-else-if="pagination">
      <div>Buscando resultados...</div>
      <ul class="pagination justify-content-center mb-0">
        <li class="page-item disabled">
          <span class="page-link">Anterior</span>
        </li>
        <li class="page-item disabled">
          <span class="page-link">...</span>
        </li>
        <li class="page-item disabled">
          <span class="page-link">Próxima</span>
        </li>
      </ul>
    </nav>
  </template-base>
</template>

<style lang="scss" scoped>
$primary-color-50: #209F85;

.invision-select {
  width: auto;

  color: #5e627a;
  background-color: #f0f1fc;

  border: none;
  margin-left: 12px;
}

.paginador {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-item.disabled .page-link {
  font-weight: 400;
}

.page-item.active .page-link{
  background-color: white;
  color: $primary-color-50;

  font-weight: 500;

  border: 1px solid #dee2e6;

}

.feather {
  margin-bottom: 4px;
}
.spacer {
  margin-left: auto;
}
</style>

<script>
import loginService from "@/services/login";
import { show403 } from "@/helpers/auth";

import GenericApi from "@/services/genericRequest";

import DataTable from "@/components/Table/DataTable";
import TemplateBase from "@/templates/Base";

export default {
  name: "GenericTable",
  components: {
    DataTable,
    TemplateBase,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    addRoute: {
      type: String,
      required: false,
    },
    editRoute: {
      type: String,
      required: false,
    },
    apiFunction: {
      type: String,
      required: false,
      default() {
        return "get";
      },
    },
    api: {
      type: Object,
      required: false,
      default() {
        return GenericApi;
      },
    },
    route: {
      type: String,
      required: true,
    },
    cols: {
      type: Array,
      required: true,
    },
    colsMap: {
      type: Function,
      required: true,
    },
    colsName: {
      type: Array,
      required: true,
    },
    canShowAllResults: {
      type: Boolean,
      default: false,
    },
    customFilters: {
      type: Object,
      default() {
        return {};
      },
    },
    nosearch: {
      type: Boolean,
      default: false,
    },
    permissionsToWrite: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      lista: [],
      loading: false,
      errMsg: "",
      pagination: false,
      page: 0,
      pages: 1,
      rowsPerPage: 20,
      first: 0,
      last: 0,
      count: 0,

      filters: {},

      CAN_WRITE: loginService.verifyPermissions(this.permissionsToWrite),
    };
  },
  computed: {
    linhas() {
      return this.lista.map((row) => {
        let idKey;
        for (let key in row) {
          if (key.slice(0, 2) === "id") {
            idKey = key;
            break;
          }
        }

        return {
          href: { name: this.editRoute, params: { id: row[idKey] } },
          cols: this.colsMap(row),
          id: row[idKey],
        };
      });
    },
    parsedCols() {
      return this.cols.map((c, idx) =>
        this.colsName[idx] ? c : { value: c, sortable: false }
      );
    },
  },
  methods: {
    setStateDataTable(...args) {
      this.page = 0;
      this.update(1, this.rowsPerPage);
    },
    changeResults(event) {
      this.page = 0;
      this.update(1, event.target.value);
    },
    paginate(p) {
      if (p === this.page) return;
      this.page = p;
      this.update(this.page, this.rowsPerPage);
    },
    update(page = 1, rowsPerPage = 20) {
      this.loading = true;
      this.pagination = true;

      let filters = this.filters;
      let customFilters = this.customFilters;

      return this.api[this.apiFunction](
        { page, rowsPerPage, filters, customFilters },
        this.route
      )
        .then((res) => {
          if (res.rows) {
            // paginação ativada
            this.page = page;
            this.pages = res.pages;
            this.first = res.count === 0 ? 0 : (page - 1) * rowsPerPage + 1;
            this.last = res.rows.length + rowsPerPage * (page - 1);
            this.count = res.count;
            this.rowsPerPage = rowsPerPage;
          }
          this.lista = res.rows || res;
          this.errMsg = "";
          console.log(this.lista)
        })
        .catch((reason) => {
          this.lista = [];
          this.errMsg = reason.response.data
            ? reason.response.data.error
            : reason.toString();
        })
        .then(() => {
          this.loading = false;
        });
    },
    redirectToAddRoute() {
      if (!this.CAN_WRITE) return show403();

      this.$router.push({ name: this.addRoute });
    },
  },
};
</script>
