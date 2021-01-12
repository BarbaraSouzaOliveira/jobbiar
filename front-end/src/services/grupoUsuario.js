'use strict';

import api from './api';

export default {
  getAllWithPermissionsWithoutPagination() {
    return api.execute('get', '/api/grupoUsuario/comPermissoes', null, null, true);
  },
  setPermission({ id_grupo_usuario, id_permissao, ativo }) {
    return api.execute('put', '/api/grupoUsuario/definePermissao', null, {
      id_grupo_usuario,
      id_permissao,
      ativo,
    });
  },
}
