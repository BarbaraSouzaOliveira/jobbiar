<template>
  <model-select
    :name="name"
    :options="options"
    :disabled="isBusy || disabled"
    v-model="selectedOption"
    @input="valueChanged"
    class="invision-input"
    :placeholder="placeholder"
  >
  </model-select>
</template>

<script>
import GenericApi from "@/services/genericRequest";
import { ModelSelect } from "vue-search-select";

export default {
  components: {
    ModelSelect,
  },
  name: "GenericSelect",
  props: {
    placeholder: {
      type: String,
      default: "Selecione uma opção",
    },

    name: {
      type: String,
      required: false,
    },
    // Default value of the input, also used for edition
    value: {
      type: Number,
      default: null,
    },
    // Indicates if the field is disabled
    disabled: {
      type: Boolean,
      default: false,
    },

    // Method used to retrieve the available oprions
    apiFunction: {
      type: String,
      required: false,
      default() {
        return "getWithoutPagination";
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

    // Filters used on the api method
    filters: {
      type: Object,
      default() {
        return {};
      },
    },
    // Filters used on the api method
    customFilters: {
      type: Object,
      default() {
        return {};
      },
    },
    // Name of the attribute that contains the displayed label
    labelKey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isBusy: false,
      options: [],
      selectedOption: this.value,
    };
  },

  mounted() {
    this.fillOptions();
  },

  methods: {
    valueChanged: function () {
      if (!this.disabled) {
        this.$emit("input", this.selectedOption);
      }
    },

    fillOptions: async function () {
      this.options = [{ value: null, text: "Selecione uma opção" }];
      this.isBusy = true;
      let customFilters = this.customFilters;
      let result = await this.api[this.apiFunction](
        { customFilters },
        this.route
      );
      if (!result.length) return;

      let idKey = this.getIdKeyFromObject(result[0]);

      result.forEach((row) => {
        this.options.push({
          value: row[idKey],
          text: row[this.labelKey],
        });
      });

      this.selectedOption = this.value;

      this.isBusy = false;
    },

    getIdKeyFromObject(object) {
      let idKey;
      for (let key in object) {
        if (key.slice(0, 2) === "id") {
          idKey = key;
          break;
        }
      }

      return idKey;
    },
  },
};
</script>

<style lang="scss" scoped>
$primary-color-40: #21CCA9;
$primary-color-10: #E5FEF8;


.size {
  width: 245px;
  height: 40px;
  font-size: 15px;
  margin-left: 10px;
}

.dashboard h1 {
  text-align: left;
  margin-bottom: 20px;
  }

.color {
  background-color: $primary-color-40;
  color:$primary-color-40;
}

.feather {
  margin-bottom: 4px;
}

.form-control {
  height: calc(1.5em + 0.75rem + 4px);
  border: none;
}

.margin {
  margin-left: 40px;
  margin-right: 40px;
  margin-top: 40px;
}
</style>
