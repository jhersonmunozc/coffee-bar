const ventaService = require('../services/ventaService')

const ventasController = {
  registrarVenta: function (req, res) {
    const { venta_id, productos, total } = req.body
    const baristaId = req.usuario.usuario_id

    if (!venta_id || !productos || !total || productos.length === 0) {
      return res.status(400).json({ message: 'Datos incompletos' })
    }

    ventaService.registrarVenta(venta_id, baristaId, productos, total)
      .then(resultado => {
        res.status(201).json({
          venta: resultado.venta,
          alertas_generadas: resultado.alertas
        })
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  }
}

module.exports = ventasController
