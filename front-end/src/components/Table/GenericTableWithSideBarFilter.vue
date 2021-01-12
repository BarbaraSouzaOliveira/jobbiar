<template>
  <div class="transition">
    <cardless-base>
      <slot name="header">
        <div class="d-flex">
          <TitleWithBreadcrumb :title="`Listagem de ${name}`" />
          <div class="spacer"></div>
          <slot name="buttons"> </slot>
          <button
            variant="none"
            class="btn toggle-button align-self-center"
            v-if="withFilter"
            v-b-toggle.sidebar-variant
          >
            <SlidersIcon class="mb-0" />
          </button>
        </div>
      </slot>
      <DataTable
        :async="pagination"
        :loading="loading"
        :colunas="parsedCols"
        :linhas="linhas"
        :errMsg="errMsg"
        :editable="editable"
        :avatar="avatar"
        :route="route"
        @state-change="setStateDataTable"
        :nosearch="nosearch"
        :editModalSize="editModalSize"
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
        <template v-for="col in cols" v-slot:[col]="{ value, item }">
          <slot :name="col" :value="value" :item="item"> </slot>
        </template>
        <template v-slot:editModal="item">
          <slot name="editModal" v-bind:item="item"> </slot>
        </template>
      </DataTable>
      <nav aria-label="Navegar entre as páginas" class="paginador" v-if="page">
        <div>
          Mostrando resultados {{ first }} a {{ last }} de um total de
          <strong>{{ count }}</strong
          >.
        </div>
        <ul class="pagination justify-content-center mb-0">
          <li class="page-item" :class="{ disabled: page === 1 || loading }">
            <a @click.prevent="paginate(1)" class="page-link" href="#"
              >Primeira</a
            >
          </li>
          <li
            class="page-item"
            v-for="p in pages"
            :key="p"
            :class="{ active: page === p, disabled: loading && page !== p }"
          >
            <a @click.prevent="paginate(p)" class="page-link" href="#">{{
              p
            }}</a>
          </li>
          <li
            class="page-item"
            :class="{
              disabled: page === numberOfPages || loading || pages === 0,
            }"
          >
            <a
              @click.prevent="paginate(numberOfPages)"
              class="page-link"
              href="#"
              >Última</a
            >
          </li>
        </ul>
      </nav>
      <nav
        aria-label="Navegar entre as páginas"
        class="paginador"
        v-else-if="pagination"
      >
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
    </cardless-base>
    <div>
      <b-sidebar
        id="sidebar-variant"
        width="400px"
        title=""
        bg-variant="white"
        right
      >
        <b-container class="container">
          <b-col class="p-0">
            <b-row>
              <!-- change -->
              <b-col class="margin-header">
                <h2 class="float-left">Filtro</h2>
                <b-button
                  @click="filter()"
                  variant="none"
                  class="float-right btn primary-light-contained-button"
                  >Filtrar
                </b-button>
              </b-col>
            </b-row>

            <!-- change -->
            <slot name="filterOptions" />
          </b-col>
        </b-container>
      </b-sidebar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$primary-color-50: #209f85;

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

.page-item.active .page-link {
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

#sidebar-variant {
  font-weight: 400;
}

/* change */
.margin-header,
.margin-body {
  padding: 0;
  margin: 5px 36px 24px 36px;
}
</style>

<script>
import loginService from "@/services/login";

import GenericApi from "@/services/genericRequest";

import DataTable from "@/components/Table/DataTable";
import CardlessBase from "@/templates/CardlessBase";
import TitleWithBreadcrumb from "@/templates/TitleWithBreadcrumb";

export default {
  name: "GenericTableWithSideBarFilter",
  components: {
    DataTable,
    CardlessBase,
    TitleWithBreadcrumb,
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
    editable: {
      type: Boolean,
      required: false,
      default: true,
    },
    withFilter: {
      type: Boolean,
      required: false,
      default: false,
    },
    filterValues: {
      type: Object,
      required: false,
    },
    editModalSize: {
      type: String,
      default: "",
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
    avatar: {
      type: String,
      default: "",
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
      pages: [],
      numberOfPages: 1,
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
    filter(page = 1, rowsPerPage = 20) {
      this.loading = true;
      this.pagination = true;
      this.clearNullValue(this.filterValues);
      let filters = this.filterValues;
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
            this.numberOfPages = res.pages;
            this.pages = this.createPagesArray(this.numberOfPages, this.page);
            this.first = res.count === 0 ? 0 : (page - 1) * rowsPerPage + 1;
            this.last = res.rows.length + rowsPerPage * (page - 1);
            this.count = res.count;
            this.rowsPerPage = rowsPerPage;
          }
          this.lista = res.rows || res;
          this.errMsg = "";
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
    // eslint-disable-next-line no-unused-vars
    setStateDataTable(...args) {
      this.page = 0;
      this.update(1, this.rowsPerPage);
    },
    changeResults(event) {
      this.page = 0;
      this.update(1, event.target.value);
    },
    createPagesArray(numberOfPages, atualPage) {
      var list = [];
      let lowEnd = atualPage - 3;
      if (lowEnd < 1) {
        lowEnd = 1;
      }
      let highEnd = atualPage + 3;
      if (highEnd > numberOfPages) {
        highEnd = numberOfPages;
      }
      for (var i = lowEnd; i <= highEnd; i++) {
        list.push(i);
      }
      return list;
    },
    clearNullValue(object) {
      let entries = Object.entries(object);

      for (let [, [key, value]] of entries.entries()) {
        if(!value){
          delete object[key]
        }
      }
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
            this.numberOfPages = res.pages;
            this.pages = this.createPagesArray(this.numberOfPages, this.page);
            this.first = res.count === 0 ? 0 : (page - 1) * rowsPerPage + 1;
            this.last = res.rows.length + rowsPerPage * (page - 1);
            this.count = res.count;
            this.rowsPerPage = rowsPerPage;
          }
          this.lista = res.rows || res;
          this.errMsg = "";
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
  },
};
</script>
