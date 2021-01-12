/* eslint-disable no-console */
'use strict';

import axios from 'axios';
import {
  router
} from '../router';

import swal from "sweetalert";
import loginService from "./login";
const apiRestHost = process.env.NODE_ENV === "development" ? 'localhost:3008' : process.env.VUE_APP_BACKEND_HOST;
const client = axios.create({
  baseURL: `//${apiRestHost}/`,
  json: true
});

let _loggingOf = false;

export default {
  serverURL: `//${apiRestHost}`,
  format(method, resource, page, data, withoutPaging = false, customFilter = {}, avoidCache = true) {
    page = page || 1;

    if (method.toUpperCase() == 'GET') {
      resource += (resource && resource.indexOf('?') > -1) ? '&' : '?';

      if (withoutPaging) {
        resource += '&withoutPaging=true';
      } else {
        resource += `&page=${page}`;
      }

      if (avoidCache) {
        let timestamp = (new Date).getTime();
        resource += `&t=${timestamp}`;
      }

      if (data) {
        if (typeof data === 'object') {
          Object.keys(data).forEach(element => {
            resource += `&${element}=${data[element]}`;
          })
        }
      }
      if (customFilter) {
        if (typeof customFilter === 'object') {
          Object.keys(customFilter).forEach(element => {
            resource += `&${element}=${customFilter[element]}`;
          })
        }
      }
    }
    return resource;
  },

  getUrl(method, resource, page, data, withoutPaging = false, customFilter = {}, avoidCache = true) {
    return `//${apiRestHost}${this.format(method, resource, page, data, withoutPaging, customFilter, avoidCache)}`
  },

  async execute(method, resource, page, data, withoutPaging = false, customFilter = {}, avoidCache = true) {
    return client({
      method,
      url: this.format(method, resource, page, data, withoutPaging, customFilter, avoidCache),
      data,
      headers: {
        Authorization: 'Bearer ' + loginService.getBearerToken(),
      }
    }).then((req) => {
      _loggingOf = false;
      return req.data
    }).catch(error => {
      if (error.response && error.response.status === 403) {
        return swal({
          title: 'Permissão insuficiente',
          text: 'Você não possui permissão suficiente para acessar este recurso (403).',
          icon: "warning",
          buttons: ['Ignorar', 'Trocar de usuário'],
        }).then(res => {
          if (res) {
            router.push({
              name: 'logout',
              params: {
                next: router.currentRoute,
              }
            });
          }
          return Promise.reject(error);
        });
      }
      if (error.response && error.response.status === 401 && !_loggingOf) {
        _loggingOf = true;
        swal({
          title: 'Sua sessão expirou',
          text: 'Por favor, faça login novamente para continuar.',
          icon: "info",
        });
        router.push({
          name: 'logout',
          params: {
            next: router.currentRoute,
          }
        });
      }
      return Promise.reject(error);
    })
  }
};
