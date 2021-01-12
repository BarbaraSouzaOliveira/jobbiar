/**
 * Copia por referência os valores de um objeto para outro e retorna este outro
 * @param {any} source objeto de origem
 * @param {Array<String|Number>} params array de parâmetros a serem copiados. ex.: ['id', 'nome', 'idade', 0]
 *
 */
export const copyProps = source => params => params.reduce((acc, key) => { acc[key] = source[key]; return acc }, {});

/**
 * Copia por valor um objeto (através dos métodos JSON stringify e parse)
 * @param {any} o object
 */
export const copy = o => JSON.parse(JSON.stringify(o));

/**
 * @callback objectFactory
 * @param {Array<String|Number>} params array de parâmetros a serem copiados. ex.: ['id', 'nome', 'idade', 0]
 */
/**
 * Copia por valor (JSON parse and stringify) os valores de um objeto para outro e retorna este outro
 * @param {any} source objeto de origem
 * @return {objectFactory}
 */
export const hardCopyProps = source => params => params.reduce((acc, key) => { acc[key] = copy(source[key]); return acc }, {});

/**
 * Acessa propriedade profundas dentro de um objeto com checagem de null
 * @param {any[]} p vetor de path. ex.: ['user', 0, 'comments']
 * @param {any} o object
 */
export const deep = p => o => p.reduce((acc, idx) => (acc && !(acc[idx] == null)) ? acc[idx] : null, o);

/**
 * Acessa propriedade profundas dentro de um objeto com checagem de null, com _dot notation_
 * @param {String} p path separado por pontos . ex.: 'user.0.comments'
 */
export const ddeep = p => deep(p.split('.'));

/**
 * Retorna uma promessa que resolve após `ms` milissegundos. Internamente, essa função usa `setTimeout`.
 * @param {Number} ms milissegundos
 */
export const wait = ms => new Promise(res => setTimeout(res, ms));

/**
 * Função de debounce. Para utilizar o this do Vue dentro da função 'debounced', você DEVE fazer um bind para this
 * da seguinte forma: `debounce(function(){ ... }).bind(this)` ou `debounce(() => { ... }).bind(this)`.
 */
export const debounce = require('tiny-debounce')

export const TRY_TIMEOUT = 4000; // ms

export const capitalize = (s) => {
  if (typeof s !== 'string') {
    return '';
  }
  
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

export const buildPaginationFooter = (totalRows, rowsPerPage, currentPage) => {
  let str = 'Exibindo registros <strong>[initial]</strong> a <strong>[final]</strong> de um total de <strong>[total]</strong>';
  let total = new Intl.NumberFormat('pt-BR').format(totalRows);
  let initialRows = (rowsPerPage * currentPage - rowsPerPage) + 1;
  let finalRows = rowsPerPage * currentPage;
  finalRows = (finalRows > totalRows) ? totalRows : finalRows;

  return str
    .replace('[initial]', initialRows)
    .replace('[final]', finalRows)
    .replace('[total]', total);
};