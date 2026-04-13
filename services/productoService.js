const Producto = require('../models/producto')
const Receta = require('../models/receta')
const Ingrediente = require('../models/ingrediente')

const productoService = {
  obtenerProductosDisponibles: function () {
    return Producto.find({ disponible: true }).exec()
  },

  actualizarDisponibilidad: function (prodId, disponible) {
    return Producto.findOneAndUpdate(
      { prod_id: prodId },
      { disponible: disponible },
      { returnDocument: 'after' }
    ).exec()
  },

  verificarDisponibilidad: async function (prodId) {
    try {
      const receta = await Receta.findOne({ prod_id: prodId }).exec()
      if (!receta) return false

      for (let ingrediente of receta.ingredientes) {
        const ing = await Ingrediente.findOne({ ing_id: ingrediente.ing_id }).exec()
        if (!ing || ing.stock <= ing.minimo) {
          return false
        }
      }
      return true
    } catch (err) {
      return false
    }
  }
}

module.exports = productoService
