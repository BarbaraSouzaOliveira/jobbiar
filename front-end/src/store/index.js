import Vue from 'vue'
import Vuex from 'vuex'
import GenericRequest from "@/services/genericRequest";

const ATAVAR_ROUTE = "colaborador/photo";

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV === "development",
  state: {
    disableMenu: false,
    avatarImages: {},
    avatarImagesFetching: {}
  },
  mutations: {
    toggleMenu(state) {
      state.disableMenu = !state.disableMenu
    },
    addAvatarImages(state, {id, img}) {
      state.avatarImages = {
        ...state.avatarImages,
        [id]: img,
      }
    },
    setImageFetching(state, { id }) {
      state.avatarImagesFetching = {
        ...state.avatarImagesFetching,
        [id]: true,
      }
    },
    removeImageFetching(state, { id }) {
      state.avatarImagesFetching = {
        ...state.avatarImagesFetching,
        [id]: false,
      }
    },
    resetAvatarImages(state) {
      state.avatarImages = {};
      state.avatarImagesFetching = {};
    }
  },
  actions: {
    getAvatarImage({ state, commit }, {id}) {
      if (state.avatarImages[id] || state.avatarImagesFetching[id]) {
        return;
      }
      commit("setImageFetching", {id});
      GenericRequest.getOne(id, ATAVAR_ROUTE)
        .then((result) => {
          commit("addAvatarImages", {id, img: result.img});
          commit("removeImageFetching", {id});
        })
        .catch((error) => {
          console.log(error);
          commit("removeImageFetching", {id});
        });
    }
  }
});

export default store;
