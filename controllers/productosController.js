const productoService = require('../services/productoService')

const productosController = {
  obtenerMenu: function (req, res) {
    productoService.obtenerProductosDisponibles()
      .then(productos => {
        if (!productos || productos.length === 0) {
          return res.status(404).json({ message: 'No hay productos disponibles' })
        }
        return res.status(200).json(productos)
      })
      .catch(err => res.status(500).json({ message: `Error: ${err.message}` }))
  }
}

module.exports = productosController
