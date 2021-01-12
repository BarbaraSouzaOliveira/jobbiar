<template>
  <div>
    <h5 class="list-title"> {{ title }} </h5>
    <table class="table table-hover mb-2">
      <thead>
        <tr>
          <th>
            <div>
              <span class="colum-active">Nome</span>
              <font-awesome-icon
                v-if="sortState === sortStates[0]"
                icon="sort"
                class="sort-icon"
                @click="sort"
              />
              <font-awesome-icon
                v-if="sortState === sortStates[1]"
                icon="sort-down"
                class="sort-icon"
                @click="sort"
              />
              <font-awesome-icon
                v-if="sortState === sortStates[2]"
                icon="sort-up"
                class="sort-icon"
                @click="sort"
              />
            </div>
          </th>
          
          <th>Permissão</th>
        </tr>
      </thead>

      <tr v-for="element in list" :key="element[idField]">
        <td>
          {{ element[rowElement] }}
        </td>
        <td>
          <input class="check-box"
            type="checkbox"
            @change="checkBoxChange(element[idField])"
            :checked="checkBoxState[element[idField]]"
          />
        </td>
      </tr>
    </table>
  </div>
</template> 

<script>
import GenericRequest from "@/services/genericRequest";

export default {
  components: {
  },
  data() {
    return {
      list: [],
      checkBoxState: [],
      sortState: "unsort",
      sortStates: ["unsort", "sortInCrescentOrder", "sortInDescrentOrder"]
    };
  },
  props: {
    routeList: {
      type: String,
      required: true,
    },
    routeInList: {
      type: String,
      required: false,
    },
    idModel: {
      type: Number,
      required: false,
    },
    rowElement: {
      type: String,
      required: true,
    },
    idField: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  methods: {
    checkBoxChange(id) {
      this.checkBoxState[id] = !this.checkBoxState[id];
      if (this.checkBoxState[id]) {
        this.$emit("elementAdd", id);
      } else {
        this.$emit("elementRemove", id);
      }
    },
    sort() {
      if(this.sortState === this.sortStates[0]){
        this.sortState = this.sortStates[1]
      } else if(this.sortState === this.sortStates[1]){
        this.sortState = this.sortStates[2]
        this.list.reverse()
      } else {
        this.sortState = this.sortStates[1];
        this.list.reverse()
      }
    }
  },
  created() {
    GenericRequest.getAllWithoutPagination({}, this.routeList).then(
      (result) => {
        result.forEach((element) => {
          this.checkBoxState[element[this.idField]] = false;
        });
        if (this.idModel !== undefined) {
          GenericRequest.getAllWithoutPagination({}, this.routeInList + this.idModel 
          ).then((result2) => {
            // Essa atribuição acontece aqui para garantir que valor da lista checkBoxState
            // seja o correto na hora que o componente renderizado na tela
            this.list = result;
            result2.forEach((element) => {
              this.checkBoxState[element[this.idField]] = true;
            });
          });
        } else {
          this.list = result
        }
      }
    );
  },
};
</script>

<style lang="scss" scoped>
$primary-color-40: #21CCA9;
$neutral-color-80: #35384D;
$neutral-color-70: #5E627A;

.sort-icon{
  color: $primary-color-40;
}

table .colum-active { //adiciona-se cor ao cabeçalho da coluna ativa
  color: $primary-color-40;
  margin-right: 0.3rem;
}

thead tr th { //cabeçalho da tabela
  border: 0; // tira a borda no fim do cabeçalho

  font-weight: 500; //coloca um peso medium a fonte do cabeçalh
  font-size: 16px;
  color: $neutral-color-80;
}

tr td { // corpo da tabela
  border: 0; // tira a borda no topo da tabela
  //border-bottom: 1px solid #F0F1FC;

  font-size: 14px;
  color: $neutral-color-80;
}

thead tr th:first-child,
tr td:first-child{
  padding-left: 0; //alinha o conteúdo da tabela a margem do modal
}

thead tr th:last-child,
tr td:last-child{
  width: 20px;
  padding-right: 0; //alinha o conteúdo da tabela a margem do modal
  text-align: center; // alinha o checkbox
}

input[type=checkbox] {
  border: 1px solid $neutral-color-80;
  box-sizing: border-box;
  border-radius: 5px;

  width: 20px;
  height: 20px;
}

input[type=checkbox]:checked {
  background-color: $primary-color-40;
}

.list-title {
  font-size: 18px;
  color: $neutral-color-80;
  margin-top: 12px;
  margin-bottom: 24px;
}

</style>