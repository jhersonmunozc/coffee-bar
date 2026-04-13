const ventaService = require('../services/ventaService')

const ventasController = {
  registrarVenta: function (req, res) {
    const { venta_id, productos, total } = req.body
    const baristaId = req.usuario.usuario_id

    if (!venta_id || !productos || !total || productos.length === 0) {
      return res.status(400).json({ message: 'Datos incompletos' })
    }

    ventaService.registrarVenta(venta_id, baristaId, productos, total)
      .then(venta => res.status(200).json(venta))
      .catch(err => res.status(400).json({ message: err.message }))
  }
}

module.exports = ventasController
