function tryFn (maxAttempts, action, errorHandler, ms, resolve, reject, attemptCount) {
  if (!ms) ms = 0;
  if (!attemptCount)
    attemptCount = 1;

  action(attemptCount).then(resolve).catch(function (error) {
    if (typeof errorHandler == "function")
      errorHandler(error, attemptCount);

    if (++attemptCount <= maxAttempts) {
      setTimeout(() => {
        tryFn(maxAttempts, action, errorHandler, ms, resolve, reject, attemptCount);
      }, ms);
    } else
      reject(error);
  });
}

/**
 * Tenta executar uma promise uma certa quantidade de vezes ou até que ela seja resolvida
 * @param {number} maxAttempts Máximo de tentativas de execução da função action
 * @param {Function} action Função de execução da tarefa desejada que deve retornar uma promise
 * @param {Function} [errorHandler] Função de tratamento de erros após uma tentativa que falhou
 */
function promiseRetry (maxAttempts, action, errorHandler, ms) {
  return new Promise(function (resolve, reject) {
    tryFn(maxAttempts, action, errorHandler, ms, resolve, reject);
  });
}

module.exports = promiseRetry;

// Exemplo de uso:
/*promiseRetry(5, function (attempt) {
	console.log("Attempt:", attempt);
	return new Promise(function (resolve, reject) {
		var retorno = attempt != 3 ? "Tentativa errada!" : "Sucesso";
		setTimeout(attempt == 3 ? resolve : reject, 1000, retorno);
	});
}, function (error, failedAttempt) {
	console.log("Attempt " + failedAttempt + " failed. Error:", error);
}).then(function (result) {
	console.log("Done!", result);
}).catch(function (error) {
	console.log("All attempts failed! Final error:", error);
});*/
