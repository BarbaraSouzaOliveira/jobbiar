<template>
  <div>
    <form @submit.prevent.stop="search">
      <div v-if="!nosearch" class="float-left container-pesquisa mb-1">
        <div class="input-group">
          <input
            type="search"
            class="form-control"
            aria-label="Filtrar por texto"
            v-model="query"
            placeholder="Digite para filtrar por todos os campos"
            data-cy="Pesquisa"
          />
          <div class="input-group-append">
            <button
              class="btn light-contained-button px-4"
              type="submit"
              data-cy="Pesquisar"
              :disabled="loading"
            >
              <SearchIcon />
            </button>
          </div>
        </div>
        <slot name="results-page" />
      </div>
    </form>
    <div :class="scroll ? 'table-responsive' : 'table-responsive-md'">
      <table
        class="table table-hover mb-2"
        data-cy="Tabela"
        :data-asc="sortAsc"
      >
      <thead>
          <tr>
            <th scope="col" v-for="(col, idx) in colunas" :key="idx">         
            {{ typeof col === "string" ? col : col.value || "-" }}
            </th>
            <th v-if="editable" data-editar>Editar</th>
          </tr>
        </thead>
        <tbody v-if="loading">
          <tr v-for="i in 3" :key="i">
            <td class="p-1" v-for="j in colunas.length + 1" :key="j">
              <tb-skeleton
                shape="rect"
                style="background-color: #dcdcdc; height: 2rem; width: 100%"
                theme="opacity"
              ></tb-skeleton>
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="sortedItems.length === 0">
          <tr>
            <td scope="row" class="text-center" :colspan="colunas.length + 1">
              {{ errMsg || "(Vazio)" }}
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="(item, index) in sortedItems" :key="index">    
            <th scope="row" class="row-avatar" v-if="avatar !== ''">  
              <Avatar
                :id="item.id"
                :route="avatar"
              /> 
              <slot 
                :name="
                  typeof colunas[0] === 'string'
                    ? colunas[0]
                    : colunas[0].value || ''
                "
                :value="item.cols[0]"
                :item="item"
              > 
                {{ item.cols[0] }}
              </slot>
            </th>
            <th scope="row" v-else>
              <slot 
                :name="
                  typeof colunas[0] === 'string'
                    ? colunas[0]
                    : colunas[0].value || ''
                "
                :value="item.cols[0]"
                :item="item"
              > 
                {{ item.cols[0] }}
              </slot>
            </th>
            <td v-for="(coli, index) in item.cols.length - 1" :key="index">
              <slot
                :name="
                  typeof colunas[coli] === 'string'
                    ? colunas[coli]
                    : colunas[coli].value || ''
                "
                :value="item.cols[coli]"
                :item="item"                
              >
                {{
                  item.cols[coli] || item.cols[coli] === 0
                    ? item.cols[coli]
                    : "-"
                }}
              </slot>
            </td>
            <td data-editar class="align-middle" v-if="editable">
              <b-button 
                variant="none"
                v-b-modal="'edit-modal' + item.id"
                >
                <edit-icon class="w20px" />
              </b-button>

              <b-modal 
                header-class="border-bottom-0 p-4" 
                body-class="px-4 pt-0 pb-4"
                :id="'edit-modal' + item.id"
                :size="editModalSize"
                hide-footer
              >
                <template #modal-header="{ close }">
                  <h5>Edição de cadastro</h5>
                  <b-button class="close-button" variant="light" @click="close()">
                    <span class="icon-close align-self-center">
                      <font-awesome-icon icon="times" />
                    </span>
                  </b-button>
                </template>
                <slot name="editModal" v-bind:item="item"> </slot>
              </b-modal>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Avatar from "@/components/GenericAvatar";
const removeAccents = require("remove-accents");
const argToString = (str) =>
  str == null ? "-" : removeAccents(str.toString().toLowerCase());
const isQueryInString = (query) => (str) => argToString(str).includes(query);
const parseQuery = (query) => removeAccents(query.trim().toLowerCase());

export default {
  name: "DataTable",
  props: {
    colunas: {
      type: Array,
      required: true,
    },
    linhas: {
      type: Array,
      required: true,
    },
    errMsg: {
      // type: Object||String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    state: {
      type: Object,
      dafault: () => ({
        sortBy: 0,
        sortAsc: true,
        query: "",
      }),
    },
    async: {
      type: Boolean,
      default: false,
    },
    nosearch: {
      type: Boolean,
      default: false,
    },
    scroll: {
      type: Boolean,
      default: false,
    },
    editModalSize: {
      type: String,
      required: false,
    },
    route: {
      type: String,
      required: false,
    },
  },
  components: {
    Avatar
  },
  data() {
    const iState = this.state
      ? { ...this.state }
      : {
          sortBy: 0,
          sortAsc: true,
          query: "",
        };
    return {
      iState,
      q: parseQuery(iState.query),
    };
  },
  computed: {
    sortBy: {
      get() {
        return this.iState.sortBy;
      },
      set(v) {
        this.iState.sortBy = v;
      },
    },
    sortAsc: {
      // 1 para ascendente ou -1 para descendente
      get() {
        return this.iState.sortAsc ? 1 : -1;
      },
      set(v) {
        this.iState.sortAsc = v === 1;
      },
    },
    query: {
      get() {
        return this.iState.query;
      },
      set(v) {
        this.iState.query = v;
      },
    },
    sortedItems() {
      if (this.async) return this.linhas || [];

      let result = [];
      if (this.q === "") result = this.linhas || [];
      // escolhe linhas que alguma coluna tem a query
      else
        result =
          this.linhas &&
          this.linhas.filter((l) => l.cols.some(isQueryInString(this.q)));

      return result.sort((a, b) =>
        a.cols[this.sortBy] < b.cols[this.sortBy]
          ? this.sortAsc * -1
          : a.cols[this.sortBy] > b.cols[this.sortBy]
          ? this.sortAsc * 1
          : 0
      );
    },
  },

  methods: {
    search() {
      this.q = parseQuery(this.query);
      this.emitState();
    },
    emitState() {
      this.$emit("state-change", { ...this.iState });
    },
    updateState() {
      this.iState = { ...this.state };
    },

  },

  watch: {
    "state.query": "updateState",
    "state.sortBy": "updateState",
    "state.sortAsc": "updateState",
  },
  
};
</script>

<style lang="scss" scoped>
$neutral-color-60: #7E829F;
$neutral-color-70: #5E627A;
$neutral-color-80:  #35384D;
$primary-color-40: #21CCA9;
$primary-color-10: #E5FEF8;

.table-responsive {
  margin-bottom: 24px;
}

table thead th {
  font-weight: 500;
  color: #35384d;

  user-select: none;
  border: none;
}
table thead th[data-ordenar] {
  cursor: pointer;
  user-select: none;
}

table thead th[data-active] {
  color: #007bff;
}

table thead th[data-ordenar]::after {
  content: " ↕";
  color: #66666680;
}

table[data-asc="1"] thead th[data-active]::after {
  content: " ↑";
  color: inherit;
}

table[data-asc="-1"] thead th[data-active]::after {
  content: " ↓";
  color: inherit;
}

thead th {
  white-space: nowrap;
  text-overflow: ellipsis;
}

tbody {
  color: #5e627a;
}

table tbody tr {
  border-radius: 10px;
  padding: 24px 12px;
}

tbody tr th {
  padding: 24px;//24px;
}

tbody tr td {
  padding: 24px 12px;
}

tbody tr {
  padding: 24px;

  margin-top: 12px;
  background-color: white;
  border-radius: 5px;
}

table {
  border-collapse: separate;
  border-spacing: 0 12px;
  margin-top: -12px;
}

.table th,
.table td {
  vertical-align: middle;
}

[data-editar] {
  width: 8rem;
  text-align: center;
}

.row-avatar {
  display: flex;
  flex-direction: row;
  text-align: left;
  align-items: center;
  padding: 1px;
  position: relative;
}

.container-pesquisa {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 24px;
}

.text--black {
  color: #35384d;
}

.form-control {
  height: calc(1.5em + 0.75rem + 4px);
  border: none;
}

.input-group-prepend {
  height: 40px;
}

.input-group-prepend .input-group-text {
  color: $neutral-color-70;
  background-color: white;
  border: 0px;
  border-radius: 0 5px 5px 0; /* n está aplicando a borda*/
}

#tool-bar {
  padding-bottom: 24px;
}

#tool-bar .btn {
  margin-left: 12px;
}

h5 { // titulo cabeçalho modal
    font-size: 18px;
    color: $neutral-color-80;
}

.align-self-center {
  border: 0;
}

.modal .close-button { /* #add-modal n existe e n pode ser aplicado onde deveria */
  border-radius: 50%;
  width: 30px;
  height: 30px;
  padding: 0;
  background-color: $primary-color-10;

  position: absolute;
  right: 15px;
  top: 0%;
  transform: translate(0%, -50%);
}

.icon-close {
  color: $primary-color-40;
}

</style>
