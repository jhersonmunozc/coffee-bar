const Usuario = require('../models/usuario')

const usuarioService = {
  validarUsuario: function (usuarioId, token) {
    return Usuario.findOne({ usuario_id: usuarioId, token_jwt: token }).exec()
  },

  verificarRol: function (usuario, rolRequired) {
    return usuario && usuario.rol === rolRequired
  }
}

module.exports = usuarioService
