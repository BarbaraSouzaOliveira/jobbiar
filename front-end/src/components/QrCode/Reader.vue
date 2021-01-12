<template>
  <div>
    <div class="text-center">
      <div v-if="scanningForQrCode">
        <b-alert v-if="error" show variant="danger">{{ error }}</b-alert>
        <qrcode-stream v-else @decode="onDecode" @init="onInit"></qrcode-stream>
        <br />
        <b-button
          v-if="showToggleButton"
          class="text-white mr-2 align-self-center"
          variant="danger"
          @click="toggleScanning"
        >Interromper leitura de QR Code</b-button>
      </div>
      <b-button
        v-else
        class="text-white mr-2 align-self-center"
        variant="success"
        @click="toggleScanning"
      >Iniciar leitura de QR Code</b-button>
    </div>
  </div>
</template>

<script>
import { QrcodeStream } from "vue-qrcode-reader";

export default {
  components: {
    QrcodeStream,
  },

  data() {
    return {
      scanningForQrCode: false,
      error: "",
    };
  },

  props: {
    initialReadingState: {
      type: Boolean,
      default: false,
    },
    showToggleButton: {
      type: Boolean,
      default: true,
    },
    state: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  mounted() {
    this.scanningForQrCode = this.initialReadingState;
  },

  methods: {
    onDecode(decodedString) {
      if (!this.disabled) {
        this.$emit("onQrCodeDetection", decodedString);
        this.$emit("input", decodedString);
      }
    },

    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: you need to grant camera access permisson";
        } else if (error.name === "NotFoundError") {
          this.error = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
        }
      }
    },

    toggleScanning() {
      this.scanningForQrCode = !this.scanningForQrCode;

      this.$emit("onToggledScan", this.scanningForQrCode);
    },
  },
};
</script>