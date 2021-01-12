'use strict';

import api from './api';

export default {
  getAll(currentPage, recordsPerPage, filter) {
    filter.rowsPerPage = recordsPerPage;
    let newFilter = {};
    for (var key in filter) {
      if (filter.hasOwnProperty(key) && filter[key]) {
        newFilter[key] = filter[key];
      }
    }

    return api.execute('get', `/api/auditoria/list`, currentPage, newFilter);
  },
  getOne(id) {
    return api.execute('get', `/api/auditoria/retrieve/${id}`, null, null, false);
  },
  getAllAreas() {
    return api.execute('get', `/api/auditoria/areas`, null, null, false);
  }
}