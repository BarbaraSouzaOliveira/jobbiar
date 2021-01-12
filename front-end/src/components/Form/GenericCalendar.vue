<template>
  <b-form-datepicker
    :name="name" 
    v-model="selectedOption"
    @input="valueChanged"
    size="sm" 
    locale="pt" 
    class="mb-2"
    :reset-button="reset"
    label-reset-button="Limpar data"
    :max="max"
    :min="min"
    label-prev-decade="Decada anterior"
    label-prev-year="Ano anterior"
    label-prev-month="Mes anterior"
    label-current-month="Mes atual"
    label-next-month="Proximo mes"
    label-next-year="Proximo ano"
    label-next-decade="Proxima decada"
    label-today="Hoje"
    label-no-date-selected="Nenhuma data selecionada"
    label-help=""
    :date-format-options="{ year: 'numeric', month: 'short', day: '2-digit'}"
    :disabled="disabled"
  >
  </b-form-datepicker> 
</template>

<script>
export default {  
  name: "GenericCalendar",
  props: {
    name: {
      type: String,
      required: false,
    },
    value: {
      type: Number,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    max: {
      type: Date,
      default: null,
    },
    min: {
      type: Date,
      default: null,
    },
    reset: {
      type: Boolean,
      default:true,
    },
  },    
  
    
  
  data() {
    return {
      selectedOption: this.value,
    };
  },

  methods: {
    valueChanged: function () {
        this.$emit("input", this.selectedOption);      
    },    
  },
};
</script>

