'use strict';

import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import { router } from './router';
import App from './App.vue';
import GenericTable from './components/Table/GenericTable'
import GenericTableWithSideBarFilter from './components/Table/GenericTableWithSideBarFilter'
import GenericSelect from './components/Form/GenericSelect'
import 'vue-search-select/dist/VueSearchSelect.css'

import BootstrapVue from 'bootstrap-vue';
import VeeValidate from 'vee-validate';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import {
  library
} from '@fortawesome/fontawesome-svg-core';
import {
  fas
} from '@fortawesome/free-solid-svg-icons';
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome';

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

import store from './store';
import VueHighlightJS from 'vue-highlight.js';
import json from 'highlight.js/lib/languages/json';

Vue.use(VueHighlightJS, {
	languages: {
		json
	}
});


import VueHtmlToPaper from 'vue-html-to-paper';
Vue.use(VueHtmlToPaper);

import skeleton from 'tb-skeleton'
import  'tb-skeleton/dist/skeleton.css'
Vue.use(skeleton)

library.add(fas);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('v-select', vSelect)
Vue.component('GenericTable',GenericTable)
Vue.component('GenericTableWithSideBarFilter',GenericTableWithSideBarFilter)
Vue.component('GenericSelect',GenericSelect)


import iconsPlugin from './plugins/iconsPlugin';
Vue.use(iconsPlugin)

Vue.use(VueResource);
Vue.use(VueRouter);

Vue.use(BootstrapVue);

Vue.use(VeeValidate, {
  inject: true,
  fieldsBagName: 'veeFields',
  errorBagName: 'veeErrors'
});

Vue.config.productionTip = false;


new Vue({
  router,
  render: h => h(App),
  renderError(h, error) {
    return h('ERROR', {
      style: {
        color: 'red'
      }
    }, error.stack)
  },
  store
}).$mount('#app');