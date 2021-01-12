'use strict';

import api from './api';

export default {
  create(data, route) {
    return api.execute('post', `api/${route}`, null, data);
  },
  update(id, data, route) {
    return api.execute('put', `api/${route}/${id}`, null, data);
  },
  get(params = {}, route) {
    let data = { rowsPerPage:params.rowsPerPage || 20 }
    let filters = {...params.customFilters,...params.filters}
    return api.execute('get', `api/${route}`, params.page, data, false, filters || {});
  },
  getWithoutPagination(params = {}, route) {
    let filters = {...params.customFilters,...params.filters}
    return api.execute('get', `api/${route}`, null, null, true, filters || {});
  },
  getAll(params = {}, route) {
    let data = { rowsPerPage:params.rowsPerPage || 20 }
    return api.execute('get', `api/${route}`, params.page || 1, data);
  },
  getAllWithoutPagination(params = {}, route) {
    return api.execute('get', `api/${route}`, null, params, true);
  },
  getOne(id, route) {
    return api.execute('get', `api/${route}/${id}`);
  },
  delete(id, route) {
    return api.execute('delete', `api/${route}/${id}`);
  }
}
