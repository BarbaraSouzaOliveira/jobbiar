function ApiResponse(code, data) {
  return {
    code,
    result: data
  };
}

function ApiError(code, errorMessage){
  return {
    code,
    result: {
      error: {
        errorMessage
      }
    }
  };
}

module.exports = {
  ApiResponse,
  ApiError
};