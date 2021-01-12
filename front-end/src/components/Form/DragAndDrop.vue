<template>
  <template-base>
    <div id="draggable-list-container">
      <TwoCards>
        <!-- TODO: Criar um componente para encapsular a tabela -->
        <template #one>
          <h2>{{ outTitle }}</h2>
          <table class="table table-hover mb-2">
            <thead>
              <tr>
                <th>Nome</th>
              </tr>
            </thead>
            <draggable
              v-model=outListLocal
              group="lists"
              @start="drag = true"
              @end="drag = false"
              @change="removeElement"
            >
              <tr
                class="draggable-element"
                v-for="element in outListLocal"
                :key="element[idField]"
              >
                {{
                  element[rowElement]
                }}
              </tr>
            </draggable>
          </table>
        </template>

        <template #two>
          <h2>{{ inTitle }}</h2>
          <table class="table table-hover mb-2">
            <thead>
              <tr>
                <th>Nome</th>
              </tr>
            </thead>
            <draggable
              v-model=inListLocal
              group="lists"
              @start="drag = true"
              @end="drag = false"
              @change="addElement"
            >
              <tr
                class="draggable-element"
                v-for="element in inListLocal"
                :key="element[idField]"
              >
                {{
                  element[rowElement]
                }}
              </tr>
            </draggable>
          </table>
        </template>
        
      </TwoCards>
    </div>
  </template-base>
</template> 

<script>
import draggable from "vuedraggable";
import TemplateBase from "@/templates/Base";
import TwoCards from "@/templates/TwoCards";

export default {
  components: {
    draggable,
    TemplateBase,
    TwoCards,
  },
  data(){
    return {
      inListLocal: this.inList,
      outListLocal: this.outList
    }
  },
  props: {
    inList: {
      type: Array,
      required: true,
    },
    outList: {
      type: Array,
      required: true,
    },
    rowElement: {
      type: String,
      required:true,
    },
    idField: {
      type: String,
      required: true,
    },
    inTitle: {
      type: String,
      required: true
    },
    outTitle: {
      type: String,
      required: true
    }
  },
  watch: {
    inList(newValue){
      this.inListLocal = newValue
    },
    outList(newValue){
      this.outListLocal = newValue
    }
  },
  methods: {

    removeElement(event) {
      if (event.added) {
        this.$emit("elementRemove", event.added.element[this.idField]);
      }
    },

    addElement(event) {
      if (event.added) {
        this.$emit("elementAdd", event.added.element[this.idField]);
      }
    }
  },
};
</script>

<style scoped>
table thead {
  background-color: #f5f6fa;
}

table thead th {
  user-select: none;
}

thead th {
  white-space: nowrap;
  text-overflow: ellipsis;
}

</style>