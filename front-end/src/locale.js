const messages = {
    _default: function (e) {
        return "O valor do campo " + e + " não é válido."
    },
    after: function (e, n) {
        return "O campo " + e + " deve estar depois do campo " + n[0] + "."
    },
    alpha: function (e) {
        return "O campo " + e + " deve conter somente letras."
    },
    alpha_dash: function (e) {
        return "O campo " + e + " deve conter letras, números e traços."
    },
    alpha_num: function (e) {
        return "O campo " + e + " deve conter somente letras e números."
    },
    alpha_spaces: function (e) {
        return "O campo " + e + " só pode conter caracteres alfabéticos e espaços."
    },
    before: function (e, n) {
        return "O campo " + e + " deve estar antes do campo " + n[0] + "."
    },
    between: function (e, n) {
        return "O campo " + e + " deve estar entre " + n[0] + " e " + n[1] + "."
    },
    confirmed: function (e, n) {
        return "Os campos " + e + " e " + n[0] + " devem ser iguais."
    },
    credit_card: function (e) {
        return "O campo " + e + " é inválido."
    },
    date_between: function (e, n) {
        return "O campo " + e + " deve estar entre " + n[0] + " e " + n[1] + "."
    },
    date_format: function (e, n) {
        return "O campo " + e + " deve estar no formato " + n[0] + "."
    },
    decimal: function (e, n) {
        void 0 === n && (n = []);
        var o = n[0];
        return void 0 === o && (o = ""), "O campo " + e + " deve ser numérico e deve conter " + (o && "" !== o ? o : "") + " casas decimais."
    },
    digits: function (e, n) {
        return "O campo " + e + " deve ser numérico e ter exatamente " + n[0] + " dígitos."
    },
    dimensions: function (e, n) {
        return "O campo " + e + " deve ter " + n[0] + " pixels de largura por " + n[1] + " pixels de altura."
    },
    email: function (e) {
        return "O campo " + e + " deve ser um email válido."
    },
    excluded: function (e) {
        return "O campo " + e + " deve ser um valor válido."
    },
    ext: function (e) {
        return "O campo " + e + " deve ser um arquivo válido."
    },
    image: function (e) {
        return "O campo " + e + " deve ser uma imagem."
    },
    included: function (e) {
        return "O campo " + e + " deve ter um valor válido."
    },
    integer: function (e) {
        return "O campo " + e + " deve ser um número inteiro."
    },
    ip: function (e) {
        return "O campo " + e + " deve ser um endereço IP válido."
    },
    is: function (e) {
        return "O valor inserido no campo " + e + " não é válido."
    },
    length: function (e, n) {
        var o = n[0],
            r = n[1];
        return r ? "O tamanho do campo " + e + " está entre " + o + " e " + r + "." : "O tamanho do campo " + e + " deve ser " + o + "."
    },
    max: function (e, n) {
        return "O campo " + e + " não deve ter mais que " + n[0] + " caracteres."
    },
    max_value: function (e, n) {
        return "O campo " + e + " precisa ser " + n[0] + " ou menor."
    },
    mimes: function (e) {
        return "O campo " + e + " deve ser um tipo de arquivo válido."
    },
    min: function (e, n) {
        return "O campo " + e + " deve conter pelo menos " + n[0] + " caracteres."
    },
    min_value: function (e, n) {
        return "O campo " + e + " precisa ser " + n[0] + " ou maior."
    },
    numeric: function (e) {
        return "O campo " + e + " deve conter apenas números"
    },
    regex: function (e) {
        return "O campo " + e + " possui um formato inválido."
    },
    required: function (e) {
        return "O campo " + e + " é obrigatório."
    },
    size: function (e, n) {
        return "O campo " + e + " deve ser menor que " + function (e) {
            var n = 1024,
                o = 0 === (e = Number(e) * n) ? 0 : Math.floor(Math.log(e) / Math.log(n));
            return 1 * (e / Math.pow(n, o)).toFixed(2) + " " + ["Byte", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][o]
        }(n[0]) + "."
    },
    url: function (e) {
        return "O campo " + e + " não é uma URL válida."
    }
};

const locale = {
    name: 'id',
    messages,
    attributes: {}
};

export default locale;