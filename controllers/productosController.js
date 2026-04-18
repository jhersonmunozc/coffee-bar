const productoService = require('../services/productoService')

const productosController = {
  obtenerMenu: function (req, res) {
    const { categoria } = req.query

    if (categoria) {
      // Filtrado por categoría - Consulta 9
      productoService.obtenerProductosDisponiblesPorCategoria(categoria)
        .then(productos => {
          res.status(200).json(productos || [])
        })
        .catch(err => res.status(500).json({ message: `Error: ${err.message}` }))
    } else {
      // Menú completo - Consulta 1
      productoService.obtenerProductosDisponibles()
        .then(productos => {
          res.status(200).json(productos || [])
        })
        .catch(err => res.status(500).json({ message: `Error: ${err.message}` }))
    }
  },

  obtenerProductoTopVendido: function (req, res) {
    productoService.obtenerProductoTopVendido()
      .then(producto => {
        if (!producto) {
          return res.status(200).json(null)
        }
        res.status(200).json(producto)
      })
      .catch(err => res.status(500).json({ message: `Error: ${err.message}` }))
  }
}

module.exports = productosController
