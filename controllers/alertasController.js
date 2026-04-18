const alertaService = require('../services/alertaService')

const alertasController = {
  obtenerAlertas: function (req, res) {
    alertaService.obtenerAlertas()
      .then(alertas => {
        res.status(200).json(alertas || [])
      })
      .catch(err => res.status(500).json({ message: `Error: ${err.message}` }))
  }
}

module.exports = alertasController
