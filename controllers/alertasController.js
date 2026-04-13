const alertaService = require('../services/alertaService')

const alertasController = {
  obtenerAlertas: function (req, res) {
    alertaService.obtenerAlertas()
      .then(alertas => {
        if (!alertas || alertas.length === 0) {
          return res.status(404).json({ message: 'No hay alertas' })
        }
        return res.status(200).json(alertas)
      })
      .catch(err => res.status(500).json({ message: `Error: ${err.message}` }))
  }
}

module.exports = alertasController
