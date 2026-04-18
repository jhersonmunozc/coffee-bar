const Ingrediente = require('../models/ingrediente')
const productoService = require('./productoService')

const inventarioService = {
  descontarStock: function (ingId, cantidad) {
    return Ingrediente.findOne({ ing_id: ingId }).exec()
      .then(ing => {
        if (!ing) throw new Error('Ingrediente no encontrado')
        const stockFinal = ing.stock - cantidad
        if (stockFinal < 0) {
          const err = new Error(`Stock insuficiente de ${ingId}`)
          err.statusCode = 422
          throw err
        }
        return Ingrediente.findOneAndUpdate(
          { ing_id: ingId },
          { $inc: { stock: -cantidad } },
          { returnDocument: 'after' }
        ).exec()
      })
  },

  agregarStock: function (ingId, cantidad) {
    return Ingrediente.findOne({ ing_id: ingId }).exec()
      .then(ing => {
        if (!ing) {
          const err = new Error('Ingrediente no encontrado')
          err.statusCode = 404
          throw err
        }
        const stockFinal = ing.stock + cantidad
        if (stockFinal < 0) {
          const err = new Error('Stock no puede ser negativo')
          err.statusCode = 422
          throw err
        }
        return Ingrediente.findOneAndUpdate(
          { ing_id: ingId },
          { $inc: { stock: cantidad } },
          { returnDocument: 'after' }
        ).exec()
      })
  },

  obtenerIngredientesCriticos: function () {
    return Ingrediente.find({ $expr: { $lte: ['$stock', '$minimo'] } }).exec()
  }
}

module.exports = inventarioService
