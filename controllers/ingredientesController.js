const inventarioService = require('../services/inventarioService')

const ingredientesController = {
  actualizarStock: function (req, res) {
    const { ing_id, cantidad } = req.body

    if (!ing_id || cantidad === undefined) {
      return res.status(400).json({ message: 'Datos incompletos' })
    }

    inventarioService.agregarStock(ing_id, cantidad)
      .then(ingrediente => {
        res.status(200).json(ingrediente)
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  },

  obtenerIngredientesCriticos: function (req, res) {
    inventarioService.obtenerIngredientesCriticos()
      .then(ingredientes => {
        res.status(200).json(ingredientes || [])
      })
      .catch(err => res.status(500).json({ message: `Error: ${err.message}` }))
  }
}

module.exports = ingredientesController
