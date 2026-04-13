const usuarioService = require('./usuarioService')

const autenticacionService = {
  verificarToken: function (req, res, next) {
    const token = req.headers.authorization
    const usuarioId = req.headers['x-usuario-id']

    if (!token || !usuarioId) {
      return res.status(401).json({ message: 'Token o Usuario ID faltante' })
    }

    usuarioService.validarUsuario(usuarioId, token)
      .then(usuario => {
        if (!usuario) {
          return res.status(401).json({ message: 'Token inválido' })
        }
        req.usuario = usuario
        next()
      })
      .catch(err => res.status(500).json({ message: 'Error de autenticación' }))
  },

  verifyBarista: function (req, res, next) {
    if (!usuarioService.verificarRol(req.usuario, 'Barista')) {
      return res.status(403).json({ message: 'Solo Baristas pueden registrar ventas' })
    }
    next()
  },

  verifyAdmin: function (req, res, next) {
    if (!usuarioService.verificarRol(req.usuario, 'Administrador')) {
      return res.status(403).json({ message: 'Solo Administradores pueden actualizar stock' })
    }
    next()
  }
}

module.exports = autenticacionService
