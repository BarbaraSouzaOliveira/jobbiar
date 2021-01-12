<template>
  <div>
    <div v-show="loading" class="spinner-container">
      <b-spinner label="Carregando..."></b-spinner>
    </div>

    <div v-show="!loading">
      <div class="image-modal">
        <div>
          <div class="image-container" v-if="previewImages.length != 0">
            <div :key="index" v-for="(image, index) in previewImages">
              <b-overlay
                :show="loadImage && index == previewImages.length - 1"
                rounded="sm"
              >
                <b-img
                  class="image-card"
                  :src="image.img"
                  width="208px"
                  height="156px"
                ></b-img>
                <b-button
                  class="image-button"
                  @click="removeImg(index)"
                  v-show="previewImages.length != 1"
                  variant="danger"
                  >x</b-button
                >
              </b-overlay>
            </div>
          </div>
        </div>

        <div class="image-upload">
          <b-avatar
            v-show="previewImages.length == 0 && !videoInit"
            square
            size="10rem"
          ></b-avatar>
          <video
            v-show="videoInit"
            ref="video"
            autoplay
            :height="height"
            :width="width"
          ></video>
          <div class="text-center p-3 mt-1">
            <b-button
              :disabled="loadImage"
              v-if="!videoInit"
              variant="outline-secondary"
              @click="initWebCam"
            >
              Tirar foto usando a webcam
            </b-button>
            <b-button v-else variant="outline-secondary" @click="takePicture">
              Tirar foto
            </b-button>
          </div>
          <b-form-file
            :disabled="loadImage && videoInit"
            placeholder="Selecione um arquivo de image"
            accept=".jpg, .jpeg, .png"
            @change="uploadImage"
            browse-text="Escolher arquivo"
          ></b-form-file>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GenericRequest from "@/services/genericRequest";
const faceapi = require("face-api.js");

export default {
  name: "photo-input-form",
  props: {
    model: {
      type: Object,
      required: true,
    },
    idModel: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      default: 320,
    },
    height: {
      type: Number,
      default: 240,
    },
    title: {
      type: String,
      default: "Reconhecimento Facial",
    },
    netOptions: {
      type: Object,
      default() {
        return {
          minConfidenceFace: parseFloat(process.env.VUE_APP_MIN_CONFIDENCE),
        };
      },
    },
  },

  data() {
    return {
      loadImage: false,
      arrayEncodes: [],
      previewImages: [],
      videoInit: false,
      video: null,
      videoTracks: null,
      error: {
        unableToAcessWebCam: false,
        unableToLoadModels: false,
        message: "",
      },
      loading: true,
      netOptionsObject: new faceapi.SsdMobilenetv1Options(this.netOptions),
    };
  },

  methods: {
    initWebCam() {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          this.video.srcObject = stream;
          this.videoTracks = stream.getVideoTracks();
          this.videoInit = true;
        })
        .catch((error) => {
          this.error.unableToAcessWebCam = true;
          this.error.message = error;
        });
    },

    newImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener("load", () => {
          resolve(img);
        });
        img.addEventListener("error", (error) => {
          reject(error);
        });
        img.src = src;
      });
    },

    async takePicture() {
      const img = document.createElement("img");
      const canvas = document.createElement("canvas");
      canvas.width = this.video.videoWidth * 0.25;
      canvas.height = this.video.videoHeight * 0.25;
      canvas
        .getContext("2d")
        .drawImage(this.video, 0, 0, canvas.width, canvas.height);
      img.src = canvas.toDataURL();
      let newImage = await this.newImage(img.src)
      this.previewImages.push({img: newImage.src});
      this.loadImage = true;
      this.encodeFace(newImage);
    },

    uploadImage(event) {
      const reader = new FileReader();
      reader.addEventListener("load", async (imgLoadEvent) => {
        const img = await this.newImage(imgLoadEvent.target.result);
        this.previewImages.push({ img: img.src });
        this.loadImage = true;
        this.encodeFace(img);
      });
      reader.readAsDataURL(event.target.files[0]);
    },

    async encodeFace(img) {
      this.videoInit = false;
      let fullFaceDescription = await faceapi
        .detectSingleFace(img, this.netOptionsObject)
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (fullFaceDescription === undefined) {
        this.arrayEncodes.pop();
        this.previewImages.pop();
        // eslint-disable-next-line no-undef
        swal({
          title: "Erro!",
          text: "Não foi encontrada uma face na imagem!",
          icon: "error",
          button: "Continuar",
        });
        this.loadImage = false;
      } else {
        this.loadImage = false;
        this.arrayEncodes.push({
          descriptor: JSON.stringify(fullFaceDescription.descriptor),
          img: img.src,
          id_colaborador: this.model[this.idModel]
        });
        this.$emit("newPhoto", { arrayEncodes: this.arrayEncodes });
      }
    },

    removeImg(index) {
      if (this.previewImages[index].id_encode) {
        this.arrayEncodes.push(this.previewImages[index]);
        this.$emit("newPhoto", { arrayEncodes: this.arrayEncodes });
      }
      this.previewImages.splice(index, 1);
    },
  },

  mounted() {
    this.video = this.$refs.video;
    Promise.all([
      faceapi.loadFaceLandmarkModel("/models"),
      faceapi.loadFaceRecognitionModel("/models"),
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
    ])
      .then(() => {
        this.loading = false;
      })
      .catch((error) => {
        this.error.unableToLoadModels = true;
        this.error.message = error;
      });
  },

  beforeDestroy() {
    if (this.videoTracks !== null) {
      this.videoTracks.forEach((track) => track.stop());
    }
  },

  beforeMount() {
    if (this.model[this.idModel]) {
      GenericRequest.getAllWithoutPagination({}, "colaborador/encodes/" + this.model[this.idModel]).then(
        (encodes) => {
          this.previewImages = encodes;
        }
      );
    }
  },
};
</script>

<style lang="scss" scoped>
input[type="file"]::-webkit-file-upload-button {
  border: 1px solid grey;
  border-radius: 5px;
  height: 40px;
  display: none;
  background: #fffaaa;
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-content: center;
}

.image-add {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.image-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.image-button {
  border-radius: 50%;
  position: absolute;
  left: 80%;
}

.image-card {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
}

.image-modal {
  display: flex;
  flex-direction: column;
}

.image-upload {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.no-photo {
  align-items: center;
}
</style>