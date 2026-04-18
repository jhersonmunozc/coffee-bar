const alertaService = require('../services/alertaService')

const alertasController = {
  obtenerAlertas: function (req, res) {
    alertaService.obtenerAlertas()
      .then(alertas => {
        res.status(200).json(alertas || [])
      })
      .catch(err => res.status(500).json({ message: `Error: ${err.message}` }))
  },

  obtenerHistorialAlertas: function (req, res) {
    const { visto, limit = 50, offset = 0 } = req.query

    alertaService.obtenerHistorialAlertas(visto, parseInt(limit), parseInt(offset))
      .then(alertas => {
        res.status(200).json(alertas || [])
      })
      .catch(err => res.status(500).json({ message: `Error: ${err.message}` }))
  }
}

module.exports = alertasController
