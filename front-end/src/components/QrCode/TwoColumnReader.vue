<template>
  <div>
    <TwoCards>
      <template #header>
        <div class="d-flex">
          <h1 class="align-self-center">{{ title || 'Leitura de QR Code' }}</h1>
        </div>
        <br />
      </template>
      <template #one>
        <TemplateBase>
          <QrCodeReader
            :initialReadingState="listeningToQrCodeDetection"
            @onQrCodeDetection="onQrCodeDetection"
            @onToggledScan="onToggledScan"
          />
        </TemplateBase>
      </template>
      <template #two>
        <slot
          name="form"
          :readObjects="readObjects"
          :cancel="cancel"
          :created="created"
          :removeReadObject="removeReadObject"
        />
      </template>
    </TwoCards>
  </div>
</template>

<script>
import GenericApi from "@/services/genericRequest";

import QrCodeReader from "@/components/QrCode/Reader";
import TwoCards from "@/templates/TwoCards";
import TemplateBase from "@/templates/Base";

export default {
  components: {
    QrCodeReader,
    TwoCards,
    TemplateBase,
  },

  data() {
    return {
      readCodes: [],
      readObjects: [],

      listeningToQrCodeDetection: true,
    };
  },

  props: {
    title: {
      type: String,
      default: "",
    },

    idKey: {
      type: String,
      required: true,
    },
    api: {
      type: Object,
      required: false,
      default() {
        return GenericApi;
      },
    },
    apiFunction: {
      type: String,
      required: false,
      default() {
        return "getWithoutPagination";
      },
    },
    route: {
      type: String,
      required: true,
    },
    toSearch: {
      type: String,
      required: false,
      default() {
        return "code";
      },
    },
    maximumNumberOfReadObjetcs: {
      type: Number,
      default: Infinity,
    },
  },

  methods: {
    async onQrCodeDetection(code) {
      console.log("TwoColumnReader: ENTROU LEITURA QRCODE => ", { code });
      if (this.readObjects.length >= this.maximumNumberOfReadObjetcs) {
        return swal({
          title: "Número máximo de objetos",
          text: "Não é possível ler mais objetos",
          icon: "warning",
          button: "Continuar",
        });
      }

      if (this.listeningToQrCodeDetection) {
        let alreadyExistsCode = this.readCodes.some(
          (reading) => reading == code
        );
        // if (alreadyExistsCode) return;

        try {
          let route = this.route + `/${code}`;
          let detectedObject = await this.api[this.apiFunction]({}, route);
          if (detectedObject.length) {
            this.readObjects.push(detectedObject[0]);
            this.$emit("validCode", detectedObject[0]);
          } else {
            this.$emit("invalidCode");
          }

          this.readCodes.push(code);
        } catch (error) {
          console.log(error);

          let errorMessage;
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            errorMessage = error.response.data.error.errorMessage;
          }

          swal({
            title: "Oops!",
            text:
              errorMessage || "Ocorreu um problema ao recuperar o objeto lido",
            icon: "error",
            button: "Continuar",
          });
        }
      }
    },

    onToggledScan(isReading) {
      this.listeningToQrCodeDetection = isReading;
    },

    async cancel() {
      let cancelConfirmation = await swal({
        title: "Cacelar",
        text: "Tem certeza que deseja cancelar aa leituras realizadas?",
        icon: "warning",
        buttons: { cancel: "Não", confirm: "Sim" },
      });

      if (!cancelConfirmation) return;

      this.readObjects = [];
      this.readCodes = [];
    },

    removeReadObject(id) {
      this.readObjects = this.readObjects.filter(
        (object) => object[this.idKey] !== id
      );
    },

    created() {
      this.readObjects = [];
      this.readCodes = [];
    },
  },
};
</script>

<style scoped>
.text--black {
  color: black;
}
</style>