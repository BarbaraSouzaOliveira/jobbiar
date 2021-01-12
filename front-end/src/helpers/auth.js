import swal from 'sweetalert';
import { router } from '../router';

/**
 * Retorna permissões necessárias para acessar uma página. se nenhum parâmetro é passado, nenhuma
 * permissão será necessária para acessar a página
 * @param {(string|string[])[]} [perms] array de strings de permissão necessárias para acessar a página.
 * o array de permissões é tratado como um OR. Para fazer um AND, deve-se colocar um array de permissões
 * dentro deste array.
 *
 * @example
 * // para acessar a página o usuário deve possui as permissões:
 * // ('relatório' e 'operador') ou ('auditor' e 'relatorio') ou ('admin')
 * perms([['relatorio', 'operador'], ['auditor', 'relatorio'], 'admin']);
 */
export const perms = perms => perms || false;

/**
 * @param {any} next próxima rota para ir ao trocar de usuário
 * @returns {Promise<boolean>}
 */
export function show403 (next) {
  return swal({
    title: 'Permissão insuficiente',
    text: 'Você não possui permissão suficiente para realizar esta ação.',
    icon: "warning",
    buttons: ['Fechar', 'Trocar de usuário'],
  }).then(res => {
    if (res) {
      router.push({name: 'logout', params: {
        next: next || router.currentRoute,
      }});
    }
    return res;
  }, () => false);
}
