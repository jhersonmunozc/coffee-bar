const Ingrediente = require('../models/ingrediente')
const productoService = require('./productoService')

const inventarioService = {
  descontarStock: function (ingId, cantidad) {
    return Ingrediente.findOneAndUpdate(
      { ing_id: ingId },
      { $inc: { stock: -cantidad } },
      { returnDocument: 'after' }
    ).exec()
  },

  agregarStock: function (ingId, cantidad) {
    return Ingrediente.findOneAndUpdate(
      { ing_id: ingId },
      { $inc: { stock: cantidad } },
      { returnDocument: 'after' }
    ).exec()
  },

  obtenerIngredientesCriticos: function () {
    return Ingrediente.find({ $expr: { $lte: ['$stock', '$minimo'] } }).exec()
  }
}

module.exports = inventarioService
