'use strict'

import api from '@/services/api'

/**
 * pega um array de qualquer coisa e envolve cada elemento num array (a menos que ele já seja um)
 * @param {any[]} permissions array of any
 * @return {any[][]}
 * @example
 * arrayfy([['admin'], 'baunilha', ['laranja', 'banana'], true])
 * // => [['admin'], ['baunilha'], ['laranja', 'banana'], [true]]
 */
const arrayfy = arr => arr.map(el => Array.isArray(el) ? el : [el]);
const permMatch = userPermissions => permissions => permissions.every(p => userPermissions.includes(p));

class LoginManager {
  /**
   *
   * @param {string} apiUrl
   * @param {Storage} storage
   * @param {string} prefix
   */
  constructor (apiUrl, storage = localStorage, prefix = '_auth_') {
    if (storage && storage.getItem && storage.setItem && storage.removeItem) { // verify storage
      this._storage = storage;
    } else {
      throw new Error('Invalid Storage')
    }
    this._api = apiUrl;
    this._bearer = `${prefix}bearer`;
    this._user = `${prefix}info`;
  }

  async login (email, senha) {
    const { error, usuario, token } = await api.execute('post', this._api, null, { email, senha });
    if (error) {
      return false;
    } else {
      this._storage.setItem(this._bearer, token);
      this._storage.setItem(this._user, JSON.stringify(usuario));
      return true;
    }
  }

  logout () {
    this._storage.removeItem(this._bearer);
    this._storage.removeItem(this._user);
  }

  isLoggedIn () {
    let bearer = this._storage.getItem(this._bearer);
    return Boolean(bearer);
  }

  getUser () {
    if (!this.isLoggedIn()) return null;
    let user = this._storage.getItem(this._user);
    try {
      return JSON.parse(user);
    } catch (error) {
      this.logout();
      return null;
    }
  }

  /**
   * Retorna se a autenticação do usuário é válida
   */
  async validateToken () {
    if (!this.isLoggedIn()) return false;
    try {
      await api.execute('get', '/api/auth/gen204', null, { bearer: this.getBearerToken() });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Retorna se um usuário possui dadas permissões.
   *
   * - Se chamada com um booleano como parâmetro, retorna este booleano, independentemente de haver usuário logado.
   * - Se for chamada com um array vazio, retorna `true` caso haja um usuário logado.
   * - Se for chamada com uma string, retorna `true` caso haja um usuário logado e ele tenha tal permissão.
   * - Se for chamada com um array, retorna `true` caso o usuário possua todas as permissões de algum dos elementos deste array
   * (já que cada elemento pode ser uma string ou um array de strings)
   *
   * @param {boolean|string|(string|string[])[]} permissions
   * @returns {boolean}
   */
  verifyPermissions (permissions = true) {
    if (typeof permissions === 'boolean') return permissions;
    let pPermissions = (typeof permissions === 'string') ? [permissions] : permissions;
    let user = this.getUser();

    if (!user || !user.permissoes) return false;
    if (pPermissions.length === 0) return true;

    const permMatcher = permMatch(user.permissoes);

    return arrayfy(permissions).some(permMatcher);
  }

  getBearerToken () {
    return this._storage.getItem(this._bearer);
  }

}

export default new LoginManager('/api/auth');
