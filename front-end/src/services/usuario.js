'use strict';

import api from './api';

export default {
  
  updateActive(id, ativo) {
    return api.execute('put', `/api/usuario/ativo/${id}`, null, { ativo });
  },
  verificaSeEmailJaExiste(email) {
    return api.execute('get', `/api/usuario/email/${email}`, null, null, true);
  },
  getIfUserHasPermission(data){
    return api.execute('post', `/api/usuario/hasPermission`, null, data);
  }
}
