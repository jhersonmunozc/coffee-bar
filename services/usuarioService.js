const Usuario = require('../models/usuario')

const usuarioService = {
  validarUsuario: function (usuarioId, token) {
    return Usuario.findOne({ usuario_id: usuarioId, token_jwt: token }).exec()
  },

  verificarRol: function (usuario, rolRequired) {
    return usuario && usuario.rol === rolRequired
  },

  crearUsuario: function (usuario_id, nombre, rol, email, token_jwt) {
    if (!usuario_id || !nombre || !rol || !email || !token_jwt) {
      const err = new Error('Datos incompletos')
      err.statusCode = 400
      throw err
    }
    if (!['Barista', 'Administrador'].includes(rol)) {
      const err = new Error('Rol inválido. Debe ser Barista o Administrador')
      err.statusCode = 400
      throw err
    }
    const usuario = new Usuario({
      usuario_id,
      nombre,
      rol,
      email,
      token_jwt
    })
    return usuario.save()
  },

  obtenerUsuarios: function () {
    return Usuario.find().exec()
  },

  obtenerUsuarioPorId: function (usuario_id) {
    return Usuario.findOne({ usuario_id }).exec()
      .then(usuario => {
        if (!usuario) {
          const err = new Error('Usuario no encontrado')
          err.statusCode = 404
          throw err
        }
        return usuario
      })
  },

  actualizarUsuario: function (usuario_id, datos) {
    if (!datos || Object.keys(datos).length === 0) {
      const err = new Error('Datos de actualización requeridos')
      err.statusCode = 400
      throw err
    }
    if (datos.rol && !['Barista', 'Administrador'].includes(datos.rol)) {
      const err = new Error('Rol inválido. Debe ser Barista o Administrador')
      err.statusCode = 400
      throw err
    }
    return Usuario.findOneAndUpdate(
      { usuario_id },
      datos,
      { returnDocument: 'after' }
    ).exec()
      .then(usuario => {
        if (!usuario) {
          const err = new Error('Usuario no encontrado')
          err.statusCode = 404
          throw err
        }
        return usuario
      })
  },

  eliminarUsuario: function (usuario_id) {
    return Usuario.findOneAndDelete({ usuario_id }).exec()
      .then(usuario => {
        if (!usuario) {
          const err = new Error('Usuario no encontrado')
          err.statusCode = 404
          throw err
        }
        return usuario
      })
  }
}

module.exports = usuarioService
